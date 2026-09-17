import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { writeAudit } from '../../shared/orchestrationCore.ts';

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (!user || user.role !== 'admin') return Response.json({ error: 'Admin owner approval required' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  if (!body.staged_change_id || body.confirm !== true) {
    return Response.json({ error: 'staged_change_id and confirm=true are required' }, { status: 400 });
  }

  const stage = await sr.entities.StagedWebsiteChange.get(body.staged_change_id);
  if (!stage) return Response.json({ error: 'Staged change not found' }, { status: 404 });
  if (stage.status !== 'AWAITING_OWNER_PRODUCTION' || stage.qaVerdict !== 'APPROVED') {
    return Response.json({
      status: 'BLOCKED',
      reason: `Production approval requires AWAITING_OWNER_PRODUCTION with QA APPROVED (current ${stage.status}/${stage.qaVerdict || 'none'}).`,
    }, { status: 409 });
  }

  const jobs = await sr.entities.AgentJobs.filter({ changeId: stage.changeId });
  const job = jobs[0];
  if (!job) return Response.json({ error: 'Job not found' }, { status: 404 });

  const now = new Date().toISOString();
  await sr.entities.StagedWebsiteChange.update(stage.id, {
    status: 'APPROVED_FOR_PRODUCTION',
    productionApprovedAt: now,
    updatedAt: now,
    stagingReport: `${stage.stagingReport || ''} Owner approved this staged preview for controlled Base44 production implementation. Approval does not itself merge GitHub or publish Base44.`.trim().slice(0, 4000),
  });
  await writeAudit(sr, {
    changeId: stage.changeId,
    jobId: job.jobId,
    agentId: 'OWNER',
    eventType: 'APPROVAL',
    action: 'Owner approved staged preview for controlled Base44 production implementation',
    previousState: 'AWAITING_OWNER_PRODUCTION',
    newState: 'APPROVED_FOR_PRODUCTION',
    details: `PR #${stage.pullRequestNumber || 'n/a'} reviewed after staging QA. This approval does not merge the PR or publish Base44.`,
  });

  return Response.json({
    status: 'APPROVED_FOR_PRODUCTION',
    stageId: stage.stageId,
    changeId: stage.changeId,
    pullRequestUrl: stage.pullRequestUrl,
    previewUrl: stage.previewUrl,
    productionPublished: false,
  });
}
