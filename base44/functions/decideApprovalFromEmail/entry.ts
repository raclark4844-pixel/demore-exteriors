import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { evaluateAndBuildPackage, writeAudit } from '../../shared/orchestrationCore.ts';
import { hashApprovalToken } from '../../shared/humanApprovals.ts';

function nowIso() { return new Date().toISOString(); }

async function revokePendingPeers(sr: any, token: any) {
  const query = token.gateType === 'STAGED_PRODUCTION'
    ? { stageId: token.stageId, gateType: token.gateType }
    : { approvalRecordId: token.approvalRecordId, gateType: token.gateType };
  const peers = await sr.entities.ApprovalActionToken.filter(query);
  for (const peer of peers) {
    if (peer.id !== token.id && peer.status === 'PENDING') {
      await sr.entities.ApprovalActionToken.update(peer.id, { status: 'REVOKED', archived: true });
    }
  }
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const rawToken = String(body.token || '').trim();
    const decision = String(body.decision || '').toUpperCase();
    const comment = String(body.comment || '').trim().slice(0, 1000);
    if (!rawToken || !['APPROVED', 'REJECTED'].includes(decision)) {
      return Response.json({ error: 'A valid approval token and APPROVED/REJECTED decision are required.' }, { status: 400 });
    }

    const tokenHash = await hashApprovalToken(rawToken);
    const matches = await sr.entities.ApprovalActionToken.filter({ tokenHash });
    const token = matches[0];
    if (!token) return Response.json({ error: 'This approval link is invalid.' }, { status: 404 });
    if (token.status !== 'PENDING') {
      return Response.json({ status: token.status, decision: token.decision || null, message: 'This approval link has already been used or revoked.' }, { status: 409 });
    }
    if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
      await sr.entities.ApprovalActionToken.update(token.id, { status: 'EXPIRED', archived: true });
      return Response.json({ status: 'EXPIRED', message: 'This approval link has expired. Open AI Control to issue a new approval request.' }, { status: 410 });
    }

    const decidedAt = nowIso();
    await sr.entities.ApprovalActionToken.update(token.id, { status: 'USED', decision, comment, decidedAt });

    const groupQuery = token.gateType === 'STAGED_PRODUCTION'
      ? { stageId: token.stageId, gateType: token.gateType }
      : { approvalRecordId: token.approvalRecordId, gateType: token.gateType };
    const decisions = await sr.entities.ApprovalActionToken.filter(groupQuery);
    const used = decisions.filter((x: any) => x.status === 'USED');
    const rejected = used.find((x: any) => x.decision === 'REJECTED');
    const approvedByEmail = new Map<string, any>();
    for (const x of used.filter((y: any) => y.decision === 'APPROVED')) approvedByEmail.set(String(x.recipientEmail || '').toLowerCase(), x);
    const required = 1;
    const approvers = [...approvedByEmail.values()];

    if (rejected) {
      await revokePendingPeers(sr, token);
      if (token.gateType === 'INITIAL_OWNER') {
        const approval = await sr.entities.AgentApprovals.get(token.approvalRecordId);
        const jobs = await sr.entities.AgentJobs.filter({ changeId: token.changeId });
        const job = jobs[0];
        if (approval) await sr.entities.AgentApprovals.update(approval.id, {
          status: 'REJECTED', approver: rejected.recipientName || rejected.recipientEmail, approvedAt: decidedAt,
          comments: comment || `Rejected from secure email approval by ${rejected.recipientName || rejected.recipientEmail}.`,
        });
        if (job) await sr.entities.AgentJobs.update(job.id, { status: 'REJECTED', ownerApprovalStatus: 'REJECTED' });
        await writeAudit(sr, {
          changeId: token.changeId, jobId: token.jobId, agentId: 'HUMAN_EMAIL_APPROVER', eventType: 'REJECTION',
          action: `Owner approval rejected by ${rejected.recipientName || rejected.recipientEmail}`,
          previousState: 'AWAITING_OWNER', newState: 'REJECTED', details: comment,
        });
      } else {
        const stageRows = await sr.entities.StagedWebsiteChange.filter({ stageId: token.stageId });
        const stage = stageRows[0];
        if (stage) await sr.entities.StagedWebsiteChange.update(stage.id, {
          status: 'BLOCKED', error: `Final production approval rejected by ${rejected.recipientName || rejected.recipientEmail}.`, updatedAt: decidedAt,
          stagingReport: `${stage.stagingReport || ''} Human production approval was rejected by ${rejected.recipientName || rejected.recipientEmail}. ${comment}`.trim().slice(0, 4000),
        });
        await writeAudit(sr, {
          changeId: token.changeId, jobId: token.jobId, agentId: 'HUMAN_EMAIL_APPROVER', eventType: 'REJECTION',
          action: `Staged production approval rejected by ${rejected.recipientName || rejected.recipientEmail}`,
          previousState: 'AWAITING_OWNER_PRODUCTION', newState: 'BLOCKED', details: comment,
        });
      }
      return Response.json({ status: 'REJECTED', changeId: token.changeId, required, approvedCount: approvers.length });
    }

    if (approvers.length < required) {
      await writeAudit(sr, {
        changeId: token.changeId, jobId: token.jobId, agentId: 'HUMAN_EMAIL_APPROVER', eventType: 'APPROVAL',
        action: `Human approval recorded (${approvers.length} of ${required} required)`,
        previousState: token.gateType === 'STAGED_PRODUCTION' ? 'AWAITING_OWNER_PRODUCTION' : 'AWAITING_OWNER',
        newState: token.gateType === 'STAGED_PRODUCTION' ? 'AWAITING_OWNER_PRODUCTION' : 'AWAITING_OWNER',
        details: `${token.recipientName || token.recipientEmail} approved. ${comment}`.trim(),
      });
      return Response.json({ status: 'AWAITING_ADDITIONAL_APPROVAL', changeId: token.changeId, required, approvedCount: approvers.length });
    }

    await revokePendingPeers(sr, token);
    const approverNames = approvers.map((x: any) => x.recipientName || x.recipientEmail).join(' + ');
    const combinedComments = approvers.map((x: any) => x.comment).filter(Boolean).join(' | ').slice(0, 1000);

    if (token.gateType === 'INITIAL_OWNER') {
      const approval = await sr.entities.AgentApprovals.get(token.approvalRecordId);
      const jobs = await sr.entities.AgentJobs.filter({ changeId: token.changeId });
      const job = jobs[0];
      if (!approval || !job) return Response.json({ error: 'Approval workflow records are missing.' }, { status: 404 });
      if (approval.status !== 'APPROVED') await sr.entities.AgentApprovals.update(approval.id, {
        status: 'APPROVED', approver: approverNames, approvedAt: decidedAt,
        comments: combinedComments || `Approved from secure email approval by ${approverNames}.`,
      });
      await sr.entities.AgentJobs.update(job.id, { ownerApprovalStatus: 'APPROVED' });
      const freshJob = await sr.entities.AgentJobs.get(job.id);
      const gate = await evaluateAndBuildPackage(sr, freshJob, null);
      await writeAudit(sr, {
        changeId: token.changeId, jobId: job.jobId, agentId: 'HUMAN_EMAIL_APPROVER', eventType: 'APPROVAL',
        action: `Owner approval completed by ${approverNames}`,
        previousState: 'AWAITING_OWNER', newState: gate.status || (gate.ready ? 'READY_TO_IMPLEMENT' : freshJob.status), details: combinedComments,
      });
      return Response.json({
        status: gate.status || (gate.ready ? 'READY_TO_IMPLEMENT' : 'APPROVED'), changeId: token.changeId,
        required, approvedCount: approvers.length, approvers: approverNames,
      });
    }

    const stageRows = await sr.entities.StagedWebsiteChange.filter({ stageId: token.stageId });
    const stage = stageRows[0];
    if (!stage) return Response.json({ error: 'Staged change not found.' }, { status: 404 });
    if (stage.status !== 'AWAITING_OWNER_PRODUCTION' || stage.qaVerdict !== 'APPROVED') {
      return Response.json({ error: `This staged change is no longer awaiting production approval (${stage.status}/${stage.qaVerdict || 'none'}).` }, { status: 409 });
    }
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'APPROVED_FOR_PRODUCTION', productionApprovedAt: decidedAt, updatedAt: decidedAt,
      stagingReport: `${stage.stagingReport || ''} Human approval completed by ${approverNames}. Approval does not merge GitHub or publish Base44.`.trim().slice(0, 4000),
    });
    await writeAudit(sr, {
      changeId: token.changeId, jobId: token.jobId, agentId: 'HUMAN_EMAIL_APPROVER', eventType: 'APPROVAL',
      action: `Staged preview approved for controlled production implementation by ${approverNames}`,
      previousState: 'AWAITING_OWNER_PRODUCTION', newState: 'APPROVED_FOR_PRODUCTION',
      details: `${combinedComments} Approval does not merge GitHub or publish Base44.`.trim(),
    });
    return Response.json({ status: 'APPROVED_FOR_PRODUCTION', changeId: token.changeId, required, approvedCount: approvers.length, approvers: approverNames, productionPublished: false });
  } catch (error) {
    return Response.json({ error: String(error?.message || error) }, { status: 500 });
  }
}