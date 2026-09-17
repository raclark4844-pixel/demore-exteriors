import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { callAI } from '../../shared/aiProviders.ts';
import { writeAudit } from '../../shared/orchestrationCore.ts';

const REPOSITORY = 'raclark4844-pixel/demore-exteriors';
const BASE_BRANCH = 'main';
const MAX_FILES = 8;
const MAX_SOURCE_BYTES = 180_000;
const ALLOWED_FILE = /^(?:src\/.+\.(?:js|jsx|ts|tsx|css|json)|index\.html)$/i;
const HARD_BLOCKED = new Set([
  'public/robots.txt',
  'public/sitemap.xml',
  'vercel.json',
  '.vercel/project.json',
  '.env',
]);

const PATCH_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          path: { type: 'string' },
          replacements: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                oldText: { type: 'string' },
                newText: { type: 'string' },
              },
              required: ['oldText', 'newText'],
            },
          },
        },
        required: ['path', 'replacements'],
      },
    },
    validationNotes: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'changes', 'validationNotes'],
};

function nowIso() { return new Date().toISOString(); }

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  let count = 0;
  let offset = 0;
  while (true) {
    const index = haystack.indexOf(needle, offset);
    if (index === -1) return count;
    count += 1;
    offset = index + needle.length;
  }
}

function decodeBase64Utf8(value = '') {
  const bytes = Uint8Array.from(atob(String(value).replace(/\s/g, '')), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function githubRequest(accessToken, path, init = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Demore-AI-Control',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = { message: text.slice(0, 500) }; }
  if (!response.ok) {
    const error = new Error(`GitHub ${response.status}: ${json?.message || 'request failed'}`);
    error.status = response.status;
    throw error;
  }
  return json;
}

function normalizeAllowedPaths(filesAffected = []) {
  const exact = [];
  const rejected = [];
  for (const raw of filesAffected || []) {
    const path = String(raw || '').trim().replace(/^`|`$/g, '');
    if (!path) continue;
    if (HARD_BLOCKED.has(path.toLowerCase()) || !ALLOWED_FILE.test(path)) rejected.push(path);
    else exact.push(path);
  }
  return { exact: [...new Set(exact)], rejected };
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  let stage = null;
  if (body.staged_change_id) stage = await sr.entities.StagedWebsiteChange.get(body.staged_change_id);
  if (!stage && body.change_id) stage = (await sr.entities.StagedWebsiteChange.filter({ changeId: body.change_id }))[0];
  if (!stage) return Response.json({ error: 'StagedWebsiteChange not found' }, { status: 404 });

  if (['PR_OPEN', 'PREVIEW_READY', 'QA_PASSED', 'AWAITING_OWNER_PRODUCTION', 'APPROVED_FOR_PRODUCTION'].includes(stage.status)) {
    return Response.json({ status: stage.status, alreadyStaged: true, stageId: stage.stageId, pullRequestUrl: stage.pullRequestUrl });
  }
  const retryableStage = ['READY_TO_STAGE', 'STAGING', 'BLOCKED'].includes(stage.status);
  if (!retryableStage) {
    return Response.json({ status: 'SKIPPED', reason: `Stage is not retryable from ${stage.status}` }, { status: 409 });
  }

  const implementations = await sr.entities.ImplementationQueue.filter({ changeId: stage.changeId });
  const implementation = implementations[0];
  const jobs = await sr.entities.AgentJobs.filter({ changeId: stage.changeId });
  const job = jobs[0];
  if (!implementation || !job) return Response.json({ error: 'Implementation package or job not found' }, { status: 404 });

  const approvals = await sr.entities.AgentApprovals.filter({ changeId: stage.changeId });
  const ownerApproved = approvals.some((a) => a.approvalType === 'OWNER' && a.status === 'APPROVED' && !a.archived);
  if (!ownerApproved || job.status !== 'READY_TO_IMPLEMENT' || implementation.status !== 'QUEUED') {
    return Response.json({
      status: 'BLOCKED',
      reason: 'Owner approval and a queued READY_TO_IMPLEMENT package are required before staging.',
    }, { status: 409 });
  }

  const { exact: allowedPaths, rejected } = normalizeAllowedPaths(implementation.filesAffected || []);
  if (rejected.length || !allowedPaths.length || allowedPaths.length > MAX_FILES) {
    const reason = rejected.length
      ? `Implementation plan contains non-stageable or protected file descriptions: ${rejected.join(', ')}`
      : !allowedPaths.length
        ? 'Implementation plan must name exact stageable files (for example src/components/HeroSection.jsx).'
        : `Implementation plan exceeds the ${MAX_FILES}-file staging limit.`;
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', error: reason, stagingReport: reason, updatedAt: nowIso(),
    });
    return Response.json({ status: 'BLOCKED', reason, rejected }, { status: 409 });
  }

  let connection;
  try { connection = await sr.connectors.getConnection('github'); }
  catch (error) {
    await sr.entities.StagedWebsiteChange.update(stage.id, { status: 'NEEDS_GITHUB_CONNECTION', error: String(error), updatedAt: nowIso() });
    return Response.json({ status: 'NEEDS_GITHUB_CONNECTION' }, { status: 409 });
  }
  const accessToken = connection?.accessToken;
  if (!accessToken) return Response.json({ status: 'NEEDS_GITHUB_CONNECTION' }, { status: 409 });

  await sr.entities.StagedWebsiteChange.update(stage.id, {
    status: 'STAGING', qaVerdict: 'PENDING', error: null,
    stagingReport: 'Generating a bounded code patch from the owner-approved implementation package. Production is untouched.',
    updatedAt: nowIso(),
  });

  try {
    const mainRef = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/ref/heads/${BASE_BRANCH}`);
    const parentSha = mainRef.object.sha;
    const parentCommit = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/commits/${parentSha}`);
    const baseTreeSha = parentCommit.tree.sha;

    const buildPrPayload = (files = allowedPaths) => ({
      title: `${stage.changeId}: staged website improvement`,
      head: stage.stageBranch,
      base: BASE_BRANCH,
      body: `## Controlled staging — not production\n\n**Change ID:** ${stage.changeId}\n\n**Objective:** ${implementation.objective}\n\nThis PR was generated only after the owner-approved planning gate. It is intended for Vercel preview and QA. It must not be merged as a substitute for the separate Base44 production approval/publish process.\n\n### Files\n${files.map((x) => `- \`${x}\``).join('\n')}\n\n### Acceptance tests\n${(implementation.acceptanceTests || []).map((x) => `- ${x}`).join('\n')}`,
      draft: false,
    });

    const findOpenPr = async () => {
      const head = encodeURIComponent(`raclark4844-pixel:${stage.stageBranch}`);
      const prs = await githubRequest(accessToken, `/repos/${REPOSITORY}/pulls?state=open&head=${head}&base=${encodeURIComponent(BASE_BRANCH)}`);
      return Array.isArray(prs) ? prs[0] : null;
    };

    // Idempotent recovery: if a prior/concurrent invocation already created this unique
    // Change-ID branch, reuse it instead of treating the retry as a failure.
    let existingRef = null;
    try {
      existingRef = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/ref/heads/${encodeURIComponent(stage.stageBranch)}`);
    } catch (error) {
      if (error?.status !== 404) throw error;
    }
    if (existingRef) {
      let existingPr = await findOpenPr();
      if (!existingPr) {
        try {
          existingPr = await githubRequest(accessToken, `/repos/${REPOSITORY}/pulls`, {
            method: 'POST', body: JSON.stringify(buildPrPayload(allowedPaths)),
          });
        } catch (error) {
          if (error?.status !== 422) throw error;
          existingPr = await findOpenPr();
        }
      }
      if (!existingPr) throw new Error(`Stage branch exists but no recoverable pull request was found: ${stage.stageBranch}`);

      await sr.entities.StagedWebsiteChange.update(stage.id, {
        status: 'PR_OPEN',
        commitSha: existingRef.object.sha,
        pullRequestNumber: existingPr.number,
        pullRequestUrl: existingPr.html_url,
        previewStatus: stage.previewStatus || 'PENDING',
        qaVerdict: stage.qaVerdict || 'PENDING',
        stagingReport: `Existing staging branch/PR recovered idempotently. GitHub PR #${existingPr.number} is open; production remains untouched.`,
        error: null,
        updatedAt: nowIso(),
      });
      await writeAudit(sr, {
        changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_ORCHESTRATOR', eventType: 'VALIDATION',
        action: `Existing staging PR recovered idempotently: #${existingPr.number}`,
        previousState: stage.status, newState: 'PR_OPEN',
        details: `Branch ${stage.stageBranch}; commit ${existingRef.object.sha}. Duplicate/retry invocation did not create another branch or production change.`,
      });
      return Response.json({
        status: 'PR_OPEN', alreadyStaged: true, stageId: stage.stageId, changeId: stage.changeId,
        branch: stage.stageBranch, commitSha: existingRef.object.sha,
        pullRequestNumber: existingPr.number, pullRequestUrl: existingPr.html_url,
      });
    }

    const sources = [];
    let sourceBytes = 0;
    for (const path of allowedPaths) {
      const file = await githubRequest(accessToken, `/repos/${REPOSITORY}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(BASE_BRANCH)}`);
      if (file.type !== 'file' || !file.content) throw new Error(`Stageable source file is unavailable: ${path}`);
      const content = decodeBase64Utf8(file.content);
      sourceBytes += new TextEncoder().encode(content).length;
      sources.push({ path, content });
    }
    if (sourceBytes > MAX_SOURCE_BYTES) throw new Error(`Approved source scope exceeds ${MAX_SOURCE_BYTES} bytes; narrow the implementation plan.`);

    const prompt = `Create a STAGING-ONLY patch for an owner-approved Demore Exterior Solutions website improvement.\n\nChange ID: ${stage.changeId}\nObjective: ${implementation.objective}\nRequirements:\n${(implementation.requirements || []).map((x) => `- ${x}`).join('\n')}\nAcceptance tests:\n${(implementation.acceptanceTests || []).map((x) => `- ${x}`).join('\n')}\nProtected items:\n${(implementation.protectedItems || []).map((x) => `- ${x}`).join('\n')}\n\nALLOWED FILES — you may modify ONLY these exact paths:\n${allowedPaths.join('\n')}\n\nCURRENT MAIN-BRANCH FILE CONTENTS:\n${sources.map((f) => `\n===== ${f.path} =====\n${f.content}`).join('\n')}\n\nReturn exact text replacements only. Every oldText must be copied verbatim from the supplied file and uniquely identify the intended location. Keep the patch minimal. Do not touch any file not listed. Do not alter production domains, redirects, robots.txt, sitemap.xml, credentials, tracking IDs, or unrelated content. Do not claim the change is deployed; this is only a GitHub staging branch for preview and QA.`;

    const ai = await callAI(sr, {
      roleId: 'WEB_DEVELOPMENT_SPECIALIST', purpose: 'STAGING_CODE',
      changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_ORCHESTRATOR',
      userPrompt: prompt, schema: PATCH_SCHEMA,
    });
    if (!ai.ok) throw new Error(`Staging AI unavailable: ${ai.error}`);

    const changes = Array.isArray(ai.json?.changes) ? ai.json.changes : [];
    if (!changes.length) throw new Error('Staging AI returned no file changes.');
    const sourceMap = new Map(sources.map((f) => [f.path, f.content]));
    const modified = new Map();

    for (const change of changes) {
      const path = String(change.path || '').trim();
      if (!allowedPaths.includes(path)) throw new Error(`AI attempted a non-approved file: ${path}`);
      if (modified.has(path)) throw new Error(`AI returned duplicate change blocks for ${path}`);
      let content = sourceMap.get(path);
      const replacements = Array.isArray(change.replacements) ? change.replacements : [];
      if (!replacements.length) throw new Error(`AI returned no replacements for ${path}`);
      for (const replacement of replacements) {
        const oldText = String(replacement.oldText ?? '');
        const newText = String(replacement.newText ?? '');
        if (!oldText) throw new Error(`Empty oldText is not allowed for ${path}`);
        const occurrences = countOccurrences(content, oldText);
        if (occurrences !== 1) throw new Error(`Replacement guard failed for ${path}: oldText matched ${occurrences} times (must be exactly 1).`);
        content = content.replace(oldText, newText);
      }
      if (content === sourceMap.get(path)) throw new Error(`Patch produced no actual change for ${path}`);
      modified.set(path, content);
    }

    const treeEntries = [];
    for (const [path, content] of modified.entries()) {
      const blob = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/blobs`, {
        method: 'POST', body: JSON.stringify({ content, encoding: 'utf-8' }),
      });
      treeEntries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const tree = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/trees`, {
      method: 'POST', body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    });
    const commit = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message: `${stage.changeId}: staged website improvement`,
        tree: tree.sha,
        parents: [parentSha],
      }),
    });
    let branchCommitSha = commit.sha;
    try {
      await githubRequest(accessToken, `/repos/${REPOSITORY}/git/refs`, {
        method: 'POST', body: JSON.stringify({ ref: `refs/heads/${stage.stageBranch}`, sha: commit.sha }),
      });
    } catch (error) {
      // A concurrent invocation may have won the branch-creation race. Reuse that
      // Change-ID branch rather than overwriting the stage with a false BLOCKED state.
      if (error?.status !== 422) throw error;
      const winnerRef = await githubRequest(accessToken, `/repos/${REPOSITORY}/git/ref/heads/${encodeURIComponent(stage.stageBranch)}`);
      branchCommitSha = winnerRef.object.sha;
    }

    let pr = await findOpenPr();
    if (!pr) {
      try {
        pr = await githubRequest(accessToken, `/repos/${REPOSITORY}/pulls`, {
          method: 'POST', body: JSON.stringify(buildPrPayload([...modified.keys()])),
        });
      } catch (error) {
        // Same idempotency rule for a concurrent PR-creation race.
        if (error?.status !== 422) throw error;
        pr = await findOpenPr();
      }
    }
    if (!pr) throw new Error(`Stage branch exists but pull request creation could not be recovered: ${stage.stageBranch}`);

    const report = `${ai.json.summary || 'Staged patch generated.'} Changed ${modified.size} approved file(s). GitHub PR #${pr.number} is open; Vercel preview deployment is expected automatically. Production remains untouched.`;
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'PR_OPEN',
      commitSha: branchCommitSha,
      pullRequestNumber: pr.number,
      pullRequestUrl: pr.html_url,
      previewStatus: 'PENDING',
      qaVerdict: 'PENDING',
      stagingReport: report.slice(0, 4000),
      error: null,
      updatedAt: nowIso(),
    });
    await writeAudit(sr, {
      changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_ORCHESTRATOR', eventType: 'IMPLEMENTATION',
      action: `Staging PR created: #${pr.number}`,
      previousState: 'READY_TO_STAGE', newState: 'PR_OPEN',
      details: `Branch ${stage.stageBranch}; commit ${branchCommitSha}; ${modified.size} approved file(s). No Base44 production change made.`,
    });

    return Response.json({
      status: 'PR_OPEN', stageId: stage.stageId, changeId: stage.changeId,
      branch: stage.stageBranch, commitSha: branchCommitSha, pullRequestNumber: pr.number, pullRequestUrl: pr.html_url,
      filesChanged: [...modified.keys()], provider: ai.provider, model: ai.model, fallbackUsed: ai.fallbackUsed,
    });
  } catch (error) {
    const message = String(error?.message || error).slice(0, 2000);
    await sr.entities.StagedWebsiteChange.update(stage.id, {
      status: 'BLOCKED', error: message, stagingReport: `Staging stopped safely: ${message}`, updatedAt: nowIso(),
    });
    await writeAudit(sr, {
      changeId: stage.changeId, jobId: job.jobId, agentId: 'STAGING_ORCHESTRATOR', eventType: 'VALIDATION',
      action: 'Staging stopped safely', previousState: 'STAGING', newState: 'BLOCKED', details: message.slice(0, 500),
    });
    return Response.json({ status: 'BLOCKED', error: message }, { status: 409 });
  }
}