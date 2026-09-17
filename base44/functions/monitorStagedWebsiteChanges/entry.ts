import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { callAI } from '../../shared/aiProviders.ts';
import { writeAudit } from '../../shared/orchestrationCore.ts';

const REPOSITORY = 'raclark4844-pixel/demore-exteriors';
const MAX_DIFF_CHARS = 90_000;

const QA_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['APPROVED', 'CHANGES_REQUIRED', 'BLOCKED'] },
    comments: { type: 'string' },
    concerns: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'array', items: { type: 'string' } },
    confidence: { type: 'number' },
  },
  required: ['verdict', 'comments', 'concerns', 'evidence', 'confidence'],
};

function nowIso() { return new Date().toISOString(); }

async function githubRequest(accessToken, path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Demore-AI-Control',
    },
  });
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = { message: text.slice(0, 500) }; }
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${json?.message || 'request failed'}`);
  return json;
}

function previewFromChecks(checks) {
  for (const check of checks?.check_runs || []) {
    const summary = String(check?.output?.summary || '');
    const match = summary.match(/https:\/\/vercel\.live\/open-feedback\/([^?\s)]+)/i);
    if (match?.[1]) return `https://${match[1]}`;
  }
  return null;
}

async function monitorOne(sr, accessToken, stage) {
  if (!stage.commitSha || !stage.pullRequestNumber) {
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', error: 'Stage is missing commit SHA or pull request number.', updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'BLOCKED', reason: 'Missing PR metadata' };
  }

  const [combinedStatus, checks, pr] = await Promise.all([
    githubRequest(accessToken, `/repos/${REPOSITORY}/commits/${stage.commitSha}/status`),
    githubRequest(accessToken, `/repos/${REPOSITORY}/commits/${stage.commitSha}/check-runs`),
    githubRequest(accessToken, `/repos/${REPOSITORY}/pulls/${stage.pullRequestNumber}`),
  ]);

  if (pr.state !== 'open') {
    const status = pr.merged ? 'BLOCKED' : 'BLOCKED';
    const reason = pr.merged
      ? 'The staging PR was merged outside the controlled production gate. Manual review is required.'
      : 'The staging PR is no longer open. Re-stage or review it manually.';
    await sr.entities.StagedWebsiteChange.update(stage.id, { status, previewStatus: 'STOPPED', error: reason, updatedAt: nowIso() });
    return { stageId: stage.stageId, status, reason };
  }

  const vercelStatuses = (combinedStatus?.statuses || []).filter((s) => String(s.context || '').toLowerCase().includes('vercel'));
  const failed = vercelStatuses.find((s) => ['failure', 'error'].includes(s.state));
  if (failed) {
    const reason = `Vercel preview failed: ${failed.description || failed.state}`;
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', previewStatus: String(failed.state).toUpperCase(), error: reason,
      stagingReport: reason, updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'BLOCKED', reason };
  }

  const success = vercelStatuses.find((s) => s.state === 'success');
  if (!success) {
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'PR_OPEN', previewStatus: combinedStatus?.state ? String(combinedStatus.state).toUpperCase() : 'PENDING',
      stagingReport: 'Pull request is open. Waiting for the Vercel preview deployment to report success before QA.',
      updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'PR_OPEN', previewStatus: 'PENDING' };
  }

  const previewUrl = previewFromChecks(checks) || stage.previewUrl || null;
  await sr.entities.StagedWebsiteChange.update(stage.id, {
    status: 'PREVIEW_READY', previewStatus: 'SUCCESS', previewUrl,
    stagingReport: previewUrl
      ? 'Vercel preview build succeeded. Running automated code/diff QA; visual interaction remains an owner preview check.'
      : 'Vercel preview build succeeded. Running automated code/diff QA. Preview URL was not exposed by GitHub checks.',
    error: null, updatedAt: nowIso(),
  });

  const implementations = await sr.entities.ImplementationQueue.filter({ changeId: stage.changeId });
  const implementation = implementations[0];
  const jobs = await sr.entities.AgentJobs.filter({ changeId: stage.changeId });
  const job = jobs[0];
  if (!implementation || !job) throw new Error(`Missing implementation/job for ${stage.changeId}`);

  const prFiles = await githubRequest(accessToken, `/repos/${REPOSITORY}/pulls/${stage.pullRequestNumber}/files?per_page=100`);
  const diffText = (prFiles || []).map((file) => [
    `FILE: ${file.filename}`,
    `STATUS: ${file.status}; additions=${file.additions}; deletions=${file.deletions}`,
    `PATCH:\n${file.patch || '(patch unavailable)'}`,
  ].join('\n')).join('\n\n');
  if (!diffText || diffText.length > MAX_DIFF_CHARS || (prFiles || []).some((f) => !f.patch)) {
    const reason = !diffText ? 'PR diff is empty.' : diffText.length > MAX_DIFF_CHARS ? 'PR diff exceeds bounded QA size.' : 'One or more PR patches are unavailable for deterministic QA.';
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', qaVerdict: 'BLOCKED', qaComments: reason, qaReviewedAt: nowIso(), error: reason, updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'BLOCKED', reason };
  }

  const approvedFiles = new Set((implementation.filesAffected || []).map(String));
  const unexpected = (prFiles || []).map((f) => f.filename).filter((path) => !approvedFiles.has(path));
  if (unexpected.length) {
    const reason = `PR changes files outside the owner-approved package: ${unexpected.join(', ')}`;
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', qaVerdict: 'BLOCKED', qaComments: reason, qaReviewedAt: nowIso(), error: reason, updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'BLOCKED', reason };
  }

  const qaPrompt = `Review this STAGING pull request for Demore Exterior Solutions. This is code/diff QA only; do not claim rendered-browser behavior or production deployment.\n\nChange ID: ${stage.changeId}\nObjective: ${implementation.objective}\nRequirements:\n${(implementation.requirements || []).map((x) => `- ${x}`).join('\n')}\nAcceptance tests:\n${(implementation.acceptanceTests || []).map((x) => `- ${x}`).join('\n')}\nProtected items:\n${(implementation.protectedItems || []).map((x) => `- ${x}`).join('\n')}\n\nVercel GitHub deployment status: SUCCESS\nPreview URL: ${previewUrl || '(not exposed by GitHub checks)'}\n\nPULL REQUEST DIFF:\n${diffText}\n\nApprove only if the diff is narrowly scoped to the approved files, satisfies the requirements as far as source-code evidence can prove, and does not touch protected production infrastructure. If an acceptance test needs visual/browser interaction, note it as a remaining owner preview check rather than inventing a result.`;

  const qa = await callAI(sr, {
    roleId: 'QUALITY_ASSURANCE_AGENT', purpose: 'STAGING_QA',
    changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_QA',
    userPrompt: qaPrompt, schema: QA_SCHEMA,
  });
  if (!qa.ok) {
    const reason = `QA provider unavailable: ${qa.error}`;
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', qaVerdict: 'BLOCKED', qaComments: reason, qaReviewedAt: nowIso(), error: reason, updatedAt: nowIso(),
    });
    return { stageId: stage.stageId, status: 'BLOCKED', reason };
  }

  const verdict = qa.json.verdict;
  const comments = String(qa.json.comments || '').slice(0, 4000);
  if (verdict !== 'APPROVED') {
    const status = verdict === 'BLOCKED' ? 'BLOCKED' : 'PR_OPEN';
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status, qaVerdict: verdict, qaComments: comments, qaReviewedAt: nowIso(),
      stagingReport: `Automated QA: ${verdict}. ${comments}`.slice(0, 4000),
      error: verdict === 'BLOCKED' ? comments : null, updatedAt: nowIso(),
    });
    await writeAudit(sr, {
      changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_QA', eventType: 'VALIDATION',
      action: `Staging QA verdict: ${verdict}`, previousState: 'PREVIEW_READY', newState: status,
      details: comments.slice(0, 500),
    });
    return { stageId: stage.stageId, status, qaVerdict: verdict, comments };
  }

  await sr.entities.StagedWebsiteChange.update(stage.id, {
    status: 'AWAITING_OWNER_PRODUCTION', qaVerdict: 'APPROVED', qaComments: comments,
    qaReviewedAt: nowIso(), error: null,
    stagingReport: `Vercel build succeeded and automated code/diff QA passed. ${comments} A separate owner production approval is required; no Base44 production change has been made.`.slice(0, 4000),
    updatedAt: nowIso(),
  });
  await writeAudit(sr, {
    changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_QA', eventType: 'VALIDATION',
    action: 'Staging preview/code QA passed — waiting for owner production approval',
    previousState: 'PREVIEW_READY', newState: 'AWAITING_OWNER_PRODUCTION',
    details: `PR #${stage.pullRequestNumber}; Vercel success; QA ${qa.provider}/${qa.model}. Rendered interaction remains an owner preview check.`,
  });

  return {
    stageId: stage.stageId, status: 'AWAITING_OWNER_PRODUCTION', qaVerdict: 'APPROVED',
    previewUrl, pullRequestUrl: stage.pullRequestUrl, provider: qa.provider, model: qa.model, fallbackUsed: qa.fallbackUsed,
  };
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));

  let connection;
  try { connection = await sr.connectors.getConnection('github'); }
  catch (error) { return Response.json({ error: `GitHub connector unavailable: ${String(error)}` }, { status: 409 }); }
  const accessToken = connection?.accessToken;
  if (!accessToken) return Response.json({ error: 'GitHub OAuth token unavailable' }, { status: 409 });

  let stages = [];
  if (body.staged_change_id) {
    const stage = await sr.entities.StagedWebsiteChange.get(body.staged_change_id);
    if (stage) stages = [stage];
  } else if (body.change_id) {
    stages = await sr.entities.StagedWebsiteChange.filter({ changeId: body.change_id });
  } else {
    const open = await sr.entities.StagedWebsiteChange.list('-created_date', 50);
    stages = open.filter((s) => !s.archived && ['PR_OPEN', 'PREVIEW_READY'].includes(s.status)).slice(0, 5);
  }

  const results = [];
  for (const stage of stages) {
    try { results.push(await monitorOne(sr, accessToken, stage)); }
    catch (error) {
      const message = String(error?.message || error).slice(0, 2000);
      await sr.entities.StagedWebsiteChange.update(stage.id, {
        status: 'BLOCKED', qaVerdict: 'BLOCKED', error: message,
        stagingReport: `Preview/QA monitor stopped safely: ${message}`, updatedAt: nowIso(),
      });
      results.push({ stageId: stage.stageId, status: 'BLOCKED', error: message });
    }
  }
  return Response.json({ status: 'COMPLETED', processed: results.length, results });
}
