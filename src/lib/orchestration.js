import { base44 } from "@/api/base44Client";

const writeAudit = ({ changeId, jobId, agentId = "MASTER_ORCHESTRATOR", eventType, action, previousState, newState, details }) =>
  base44.entities.AgentAuditLog.create({ changeId, jobId, agentId, eventType, action, previousState, newState, details });

const splitLines = (text) =>
  (text || "").split("\n").map((s) => s.trim()).filter(Boolean);

/** Orchestrator routes a job to a specialist agent. */
export async function routeJob(job, { toAgent, reason, request }) {
  await base44.entities.AgentHandoffs.create({
    changeId: job.changeId,
    jobId: job.jobId,
    fromAgent: "MASTER_ORCHESTRATOR",
    toAgent,
    reason,
    request,
    riskLevel: job.riskLevel || "LOW",
    status: "PENDING",
    decision: "PENDING",
  });
  await base44.entities.AgentJobs.update(job.id, { assignedAgent: toAgent, status: "ASSIGNED" });
  await writeAudit({
    changeId: job.changeId,
    jobId: job.jobId,
    eventType: "HANDOFF",
    action: `Routed job to ${toAgent}`,
    previousState: job.status,
    newState: "ASSIGNED",
    details: reason,
  });
}

/** Specialist submits a result for a job. */
export async function submitResult(job, { resultType, summary, confidence, recommendations, evidence, risks, nextActions }) {
  const agentId = job.assignedAgent || "SPECIALIST";
  const result = await base44.entities.AgentResults.create({
    changeId: job.changeId,
    jobId: job.jobId,
    agentId,
    resultType,
    summary,
    confidence: confidence ? Number(confidence) : null,
    recommendations: splitLines(recommendations),
    evidence: splitLines(evidence),
    risks: splitLines(risks),
    nextActions: splitLines(nextActions),
  });
  const stillActive = ["NEW", "ROUTING", "ASSIGNED", "IN_PROGRESS"].includes(job.status);
  if (stillActive) {
    await base44.entities.AgentJobs.update(job.id, { status: "IN_PROGRESS" });
  }
  await writeAudit({
    changeId: job.changeId,
    jobId: job.jobId,
    agentId,
    eventType: "STATUS_CHANGE",
    action: "Specialist result submitted",
    previousState: job.status,
    newState: stillActive ? "IN_PROGRESS" : job.status,
    details: summary,
  });
  return result;
}

/**
 * Orchestrator evaluates all approvals for a job's Change ID.
 * If satisfied, the job becomes READY_TO_IMPLEMENT and (once) gets an
 * ImplementationQueue entry seeded with protected items from active locks.
 */
export async function evaluateApprovals(job) {
  const approvals = await base44.entities.AgentApprovals.filter({ changeId: job.changeId });
  const needsOwner = job.requiresOwnerApproval || job.riskLevel === "RED";
  const ownerApproved = approvals.some((a) => a.approvalType === "OWNER" && a.status === "APPROVED");
  const specialistApproved =
    ["APPROVED", "NOT_REQUIRED"].includes(job.specialistApprovalStatus) ||
    approvals.some((a) => a.approvalType !== "OWNER" && a.status === "APPROVED");

  if (!specialistApproved) {
    await base44.entities.AgentJobs.update(job.id, { status: "AWAITING_SPECIALIST", specialistApprovalStatus: "PENDING" });
    await writeAudit({
      changeId: job.changeId, jobId: job.jobId, eventType: "APPROVAL",
      action: "Approval evaluation: specialist approval pending",
      previousState: job.status, newState: "AWAITING_SPECIALIST",
    });
    return { ready: false, reason: "Specialist approval is still pending." };
  }
  if (needsOwner && !ownerApproved) {
    await base44.entities.AgentJobs.update(job.id, { status: "AWAITING_OWNER", specialistApprovalStatus: "APPROVED" });
    await writeAudit({
      changeId: job.changeId, jobId: job.jobId, eventType: "APPROVAL",
      action: "Approval evaluation: RED risk — waiting on owner approval",
      previousState: job.status, newState: "AWAITING_OWNER",
    });
    return { ready: false, reason: "Owner approval is required for RED-risk jobs and is still pending." };
  }

  const existing = await base44.entities.ImplementationQueue.filter({ changeId: job.changeId });
  if (existing.length === 0) {
    const locks = await base44.entities.SystemLocks.filter({ status: "ACTIVE" });
    const protectedItems = [...new Set(locks.flatMap((l) => l.protectedItems || []))];
    const approvedBy = approvals.filter((a) => a.status === "APPROVED").map((a) => a.approvalType).join(" + ") || "specialist";
    await base44.entities.ImplementationQueue.create({
      changeId: job.changeId,
      jobId: job.jobId,
      objective: job.objective,
      approvedBy,
      filesAffected: [],
      requirements: [],
      protectedItems,
      acceptanceTests: [],
      rollbackPlan: "",
      status: "QUEUED",
    });
  }
  await base44.entities.AgentJobs.update(job.id, {
    status: "READY_TO_IMPLEMENT",
    specialistApprovalStatus: "APPROVED",
    implementationStatus: "PENDING",
  });
  await writeAudit({
    changeId: job.changeId, jobId: job.jobId, eventType: "IMPLEMENTATION",
    action: "All approvals satisfied — added to Implementation Queue for Base44",
    previousState: job.status, newState: "READY_TO_IMPLEMENT",
  });
  return { ready: true, reason: "Approvals satisfied — packaged for Base44 implementation." };
}