import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { nextChangeId, writeAudit } from '../../shared/orchestrationCore.ts';

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  const isTest = Boolean(body.test);
  if (!body.recommendation_id) return Response.json({ error: 'recommendation_id required' }, { status: 400 });

  const recommendation = await sr.entities.ImprovementRecommendation.get(body.recommendation_id);
  if (!recommendation || recommendation.archived) return Response.json({ error: 'Recommendation not available' }, { status: 404 });

  if (recommendation.status === 'APPROVED_FOR_PLANNING' && recommendation.decisionNotes?.includes('Planning job:')) {
    return Response.json({ status: 'ALREADY_APPROVED', recommendationId: recommendation.recommendationId });
  }

  const changeId = await nextChangeId(sr);
  const jobId = `${changeId}-J1`;
  const protectedRisk = Number(recommendation.riskScore || 0) >= 4;
  const objective = `Prepare a controlled implementation plan for approved website improvement ${recommendation.recommendationId}: ${recommendation.title}`;
  const context = `OWNER PRIORITY DECISION: FIX NOW means prepare the implementation package and validation plan; do not deploy or publish changes automatically.\n\nRecommendation: ${recommendation.description}\n\nEvidence: ${(recommendation.evidence || []).slice(0, 5).join(' | ')}\n\nSuggested next actions: ${(recommendation.nextActions || []).slice(0, 5).join(' | ')}\n\nSource audits: ${(recommendation.sourceChangeIds || []).join(', ')}\n\nPriority ${recommendation.priorityScore}; impact ${recommendation.impactScore}; effort ${recommendation.effortScore}; risk ${recommendation.riskScore}.`;

  const job = await sr.entities.AgentJobs.create({
    changeId,
    jobId,
    createdBy: 'IMPROVEMENT_PRIORITY_ENGINE',
    jobType: recommendation.category || 'UNCLASSIFIED',
    priority: Number(recommendation.priorityScore || 0) >= 80 ? 'HIGH' : 'NORMAL',
    riskLevel: protectedRisk ? 'HIGH' : 'MEDIUM',
    objective,
    context,
    status: 'NEW',
    requiresOwnerApproval: true,
    ownerApprovalStatus: 'PENDING',
    specialistApprovalStatus: 'PENDING',
    implementationStatus: 'NOT_REQUIRED',
    validationStatus: 'NOT_REQUIRED',
    isTest,
    archived: false,
    inputData: {
      improvementRecommendationId: recommendation.id,
      improvementRecommendationRef: recommendation.recommendationId,
      forceOwnerApproval: true,
      planningOnly: true,
    },
  });

  await sr.entities.ImprovementRecommendation.update(recommendation.id, {
    ownerDecision: 'FIX_NOW',
    status: 'APPROVED_FOR_PLANNING',
    decidedAt: new Date().toISOString(),
    decisionNotes: `${isTest ? 'TEST — ' : ''}Planning job: ${jobId} (${changeId}). Production deployment still requires the normal approval and validation path.`,
  });

  await writeAudit(sr, {
    changeId,
    jobId,
    agentId: 'IMPROVEMENT_PRIORITY_ENGINE',
    eventType: 'JOB_CREATED',
    action: `Owner prioritized ${recommendation.recommendationId} for controlled implementation planning`,
    previousState: 'IMPROVEMENT_QUEUE',
    newState: 'NEW',
    details: `Priority ${recommendation.priorityScore}; source audits ${(recommendation.sourceChangeIds || []).join(', ')}`,
  });

  return Response.json({
    status: 'PLANNING_JOB_CREATED',
    recommendationId: recommendation.recommendationId,
    changeId,
    jobId,
  });
}
