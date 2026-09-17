import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { syncRecommendationsFromResult } from '../../shared/improvementPriority.ts';

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  const onlyChangeId = typeof body.changeId === 'string' ? body.changeId : null;
  const runs = onlyChangeId
    ? await sr.entities.WebsiteAuditRun.filter({ changeId: onlyChangeId })
    : await sr.entities.WebsiteAuditRun.filter({ status: 'COMPLETED', isTest: false });

  let created = 0;
  let updated = 0;
  let processedRuns = 0;
  let skippedRuns = 0;

  for (const run of runs.slice(0, 100)) {
    if (run.isTest || run.status !== 'COMPLETED') {
      skippedRuns++;
      continue;
    }
    const jobs = await sr.entities.AgentJobs.filter({ jobId: run.jobId });
    const job = jobs[0] || (await sr.entities.AgentJobs.filter({ changeId: run.changeId }))[0];
    if (!job || job.isTest || !job?.inputData?.autonomousAudit) {
      skippedRuns++;
      continue;
    }
    const results = await sr.entities.AgentResults.filter({ changeId: run.changeId });
    const result = results
      .filter((r) => !r.isTest && !r.archived)
      .sort((a, b) => String(b.created_date || '').localeCompare(String(a.created_date || '')))[0];
    if (!result) {
      skippedRuns++;
      continue;
    }

    const sync = await syncRecommendationsFromResult(sr, { job, run, result });
    created += Number(sync.created || 0);
    updated += Number(sync.updated || 0);
    processedRuns++;
  }

  return Response.json({
    status: 'COMPLETED',
    processedRuns,
    skippedRuns,
    created,
    updated,
  });
}
