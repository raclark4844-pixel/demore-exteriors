import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { writeAudit } from '../../shared/orchestrationCore.ts';
import { syncRecommendationsFromResult } from '../../shared/improvementPriority.ts';

const TERMINAL = new Set(['COMPLETED', 'REJECTED', 'BLOCKED', 'FAILED', 'CANCELLED']);

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  if (!body.job_id) return Response.json({ error: 'job_id required' }, { status: 400 });

  const job = await sr.entities.AgentJobs.get(body.job_id);
  if (!job?.inputData?.autonomousAudit) {
    return Response.json({ status: 'SKIPPED', reason: 'Not an autonomous audit job' });
  }
  if (!TERMINAL.has(job.status)) {
    return Response.json({ status: 'SKIPPED', reason: `Job is not terminal (${job.status})` });
  }

  const runs = await sr.entities.WebsiteAuditRun.filter({ jobId: job.jobId });
  const run = runs[0] || (await sr.entities.WebsiteAuditRun.filter({ changeId: job.changeId }))[0];
  if (!run) return Response.json({ status: 'SKIPPED', reason: 'No WebsiteAuditRun record found' });

  const results = await sr.entities.AgentResults.filter({ changeId: job.changeId });
  const latestResult = results.sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')))[0];
  const auditEvents = await sr.entities.AgentAuditLog.filter({ changeId: job.changeId });
  const latestDetail = auditEvents
    .sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')))
    .find((event) => event.details || event.action);

  const runStatus = job.status === 'CANCELLED' ? 'FAILED' : job.status;
  const resultSummary = latestResult?.summary || latestDetail?.details || latestDetail?.action || `Audit ended with ${job.status}`;
  const error = ['BLOCKED', 'FAILED', 'CANCELLED'].includes(job.status)
    ? String(latestDetail?.details || latestDetail?.action || job.status).slice(0, 1000)
    : null;

  await sr.entities.WebsiteAuditRun.update(run.id, {
    status: runStatus,
    completedAt: new Date().toISOString(),
    resultSummary: String(resultSummary).slice(0, 2000),
    error,
    isTest: Boolean(job.isTest),
  });

  let prioritySync = { created: 0, updated: 0, skipped: true };
  if (job.status === 'COMPLETED' && latestResult) {
    prioritySync = await syncRecommendationsFromResult(sr, { job, run, result: latestResult });
  }

  if (!job.isTest) {
    const configs = await sr.entities.AutonomousAuditConfig.filter({ configId: 'DEFAULT' });
    if (configs[0]) {
      await sr.entities.AutonomousAuditConfig.update(configs[0].id, {
        lastRunStatus: job.status,
      });
    }
  }

  await writeAudit(sr, {
    changeId: job.changeId,
    jobId: job.jobId,
    agentId: 'AUTONOMOUS_WEBSITE_AUDITOR',
    eventType: 'VALIDATION',
    action: `Autonomous audit run finalized: ${job.status}`,
    previousState: run.status || 'RUNNING',
    newState: runStatus,
    details: String(resultSummary).slice(0, 500),
  });

  return Response.json({
    status: runStatus,
    auditRunId: run.auditRunId,
    changeId: job.changeId,
    jobId: job.jobId,
    resultSummary: String(resultSummary).slice(0, 1000),
    prioritySync,
  });
}