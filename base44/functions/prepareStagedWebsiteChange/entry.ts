import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { writeAudit } from '../../shared/orchestrationCore.ts';

const REPOSITORY = 'raclark4844-pixel/demore-exteriors';
const BASE_BRANCH = 'main';

async function githubFetch(accessToken, path) {
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
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = null; }
  return { ok: response.ok, status: response.status, json, text };
}

function stageIdFor(changeId) {
  return `STAGE-${changeId}`;
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  if (!body.implementation_id && !body.change_id) {
    return Response.json({ error: 'implementation_id or change_id required' }, { status: 400 });
  }

  let implementation = null;
  if (body.implementation_id) implementation = await sr.entities.ImplementationQueue.get(body.implementation_id);
  if (!implementation && body.change_id) {
    implementation = (await sr.entities.ImplementationQueue.filter({ changeId: body.change_id }))[0];
  }
  if (!implementation) return Response.json({ error: 'Implementation package not found' }, { status: 404 });

  const jobs = await sr.entities.AgentJobs.filter({ changeId: implementation.changeId });
  const job = jobs[0];
  if (!job) return Response.json({ error: 'Agent job not found' }, { status: 404 });
  if (!job?.inputData?.planningOnly || !job?.inputData?.improvementRecommendationId) {
    return Response.json({ status: 'SKIPPED', reason: 'Not an Improvement Priority Engine planning job' });
  }

  const approvals = await sr.entities.AgentApprovals.filter({ changeId: implementation.changeId });
  const ownerApproved = approvals.some((a) => a.approvalType === 'OWNER' && a.status === 'APPROVED');
  if (!ownerApproved) {
    return Response.json({ status: 'SKIPPED', reason: 'Owner approval has not been granted' });
  }

  const now = new Date().toISOString();
  const stageId = stageIdFor(implementation.changeId);
  let stages = await sr.entities.StagedWebsiteChange.filter({ changeId: implementation.changeId });
  let stage = stages[0];
  if (!stage) {
    stage = await sr.entities.StagedWebsiteChange.create({
      stageId,
      changeId: implementation.changeId,
      jobId: job.jobId,
      recommendationId: job.inputData.improvementRecommendationId,
      repository: REPOSITORY,
      baseBranch: BASE_BRANCH,
      stageBranch: `ai/${implementation.changeId.toLowerCase()}`,
      status: 'CREATED',
      filesAffected: implementation.filesAffected || [],
      requirements: implementation.requirements || [],
      acceptanceTests: implementation.acceptanceTests || [],
      protectedItems: implementation.protectedItems || [],
      stagingReport: 'Implementation package approved. GitHub/Vercel staging preflight is being checked.',
      createdAt: now,
      updatedAt: now,
      isTest: Boolean(job.isTest),
      archived: false,
    });
  }

  let connection = null;
  try {
    connection = await sr.connectors.getConnection('github');
  } catch (error) {
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'NEEDS_GITHUB_CONNECTION',
      stagingReport: 'GitHub OAuth is required before an approved Fix Now item can be turned into a branch/PR preview.',
      error: String(error?.message || error).slice(0, 1000),
      updatedAt: now,
    });
    return Response.json({
      status: 'NEEDS_GITHUB_CONNECTION',
      stageId,
      changeId: implementation.changeId,
      repository: REPOSITORY,
    });
  }

  const accessToken = connection?.accessToken;
  if (!accessToken) {
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'NEEDS_GITHUB_CONNECTION',
      stagingReport: 'GitHub connector is present but no shared OAuth access token is available.',
      updatedAt: now,
    });
    return Response.json({ status: 'NEEDS_GITHUB_CONNECTION', stageId, changeId: implementation.changeId });
  }

  const repo = await githubFetch(accessToken, `/repos/${REPOSITORY}`);
  if (!repo.ok) {
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED',
      error: `GitHub repository check failed (${repo.status}).`,
      stagingReport: 'The connected GitHub account cannot access the configured staging repository.',
      updatedAt: now,
    });
    return Response.json({ status: 'BLOCKED', reason: 'Repository access failed', httpStatus: repo.status });
  }

  const [packageFile, appFile] = await Promise.all([
    githubFetch(accessToken, `/repos/${REPOSITORY}/contents/package.json?ref=${encodeURIComponent(BASE_BRANCH)}`),
    githubFetch(accessToken, `/repos/${REPOSITORY}/contents/src/App.jsx?ref=${encodeURIComponent(BASE_BRANCH)}`),
  ]);

  if (!packageFile.ok || !appFile.ok) {
    const missing = [];
    if (!packageFile.ok) missing.push('package.json');
    if (!appFile.ok) missing.push('src/App.jsx');
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'NEEDS_REPO_SYNC',
      stagingReport: `GitHub OAuth is working, but the repository is not yet a complete mirror of the Base44 app. Missing baseline files: ${missing.join(', ')}. No branch or PR was created.`,
      error: null,
      updatedAt: now,
    });
    await writeAudit(sr, {
      changeId: implementation.changeId,
      jobId: job.jobId,
      agentId: 'STAGING_ORCHESTRATOR',
      eventType: 'VALIDATION',
      action: 'Staging preflight blocked — GitHub repository needs Base44 source sync',
      previousState: stage.status || 'CREATED',
      newState: 'NEEDS_REPO_SYNC',
      details: `Repository ${REPOSITORY}; missing baseline: ${missing.join(', ')}`,
    });
    return Response.json({
      status: 'NEEDS_REPO_SYNC',
      stageId,
      changeId: implementation.changeId,
      repository: REPOSITORY,
      missing,
    });
  }

  await sr.entities.StagedWebsiteChange.update(stage.id, {
    status: 'READY_TO_STAGE',
    stagingReport: 'GitHub connection and repository baseline verified. This change is ready for controlled branch/PR generation; production remains untouched.',
    error: null,
    updatedAt: now,
  });
  await writeAudit(sr, {
    changeId: implementation.changeId,
    jobId: job.jobId,
    agentId: 'STAGING_ORCHESTRATOR',
    eventType: 'VALIDATION',
    action: 'Staging preflight passed',
    previousState: stage.status || 'CREATED',
    newState: 'READY_TO_STAGE',
    details: `GitHub repo ${REPOSITORY} baseline verified. No production change made.`,
  });

  return Response.json({
    status: 'READY_TO_STAGE',
    stageId,
    changeId: implementation.changeId,
    repository: REPOSITORY,
    branch: stage.stageBranch,
  });
}
