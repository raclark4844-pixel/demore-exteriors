/**
 * Shared orchestration core for the Demore multi-agent system.
 * Used by orchestrateAgentJob, finalizeApprovedJob, and validateImplementation.
 * All helpers receive a service-role client (sr) and write under ONE shared Change ID.
 * AI provider execution lives in aiProviders.ts (provider-neutral adapters).
 */

export const REQUEST_TYPE_CATEGORIES = [
  "SEO", "GEO", "AEO", "CRO", "Website UX", "Website Development", "Content", "Schema",
  "Analytics", "Performance", "Lead Generation", "AI Chatbot", "Voice AI", "Social Media",
  "Reviews / Reputation", "Email / SMS", "CRM / Lead Routing", "Insurance / Restoration Content",
  "Security", "Infrastructure", "Other"
];

export function approvalTypeForCategory(requestType) {
  const t = (requestType || "").toLowerCase();
  if (["seo", "geo", "aeo", "schema", "analytics"].some((k) => t.includes(k))) return "SEO";
  if (["ux", "development", "performance", "security", "infrastructure", "cro", "website"].some((k) => t.includes(k))) return "WEB";
  if (["content", "social", "email", "sms", "chatbot", "voice", "lead", "crm"].some((k) => t.includes(k))) return "CONTENT";
  if (["review", "reputation"].some((k) => t.includes(k))) return "REPUTATION";
  if (["insurance", "restoration", "storm"].some((k) => t.includes(k))) return "STORM";
  return "WEB";
}

/** Sequential shared Change ID: DES-YYYY-###### */
export async function nextChangeId(sr) {
  const year = new Date().getFullYear();
  const prefix = `DES-${year}-`;
  const jobs = await sr.entities.AgentJobs.list("-created_date", 500);
  let max = 0;
  for (const job of jobs) {
    const id = job.changeId || "";
    if (id.startsWith(prefix)) {
      const n = parseInt(id.slice(prefix.length), 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return `${prefix}${String(max + 1).padStart(6, "0")}`;
}

export async function writeAudit(sr, data) {
  return sr.entities.AgentAuditLog.create(data);
}

/** Convert any model scalar/object/list into a safe string array. */
export function strList(value) {
  if (value === null || value === undefined || value === "") return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .filter((x) => x !== null && x !== undefined && x !== "")
    .map((x) => (typeof x === "string" ? x : JSON.stringify(x)));
}

function textValue(value) {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : JSON.stringify(value);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function confidenceValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.min(100, value));
  if (typeof value === "string") {
    const n = Number(value.replace("%", "").trim());
    if (Number.isFinite(n)) return Math.max(0, Math.min(100, n));
  }
  return null;
}

/**
 * Normalize specialist output from any provider into ONE canonical work contract.
 * Providers sometimes return a scalar instead of an array or use harmless aliases
 * such as risksAcknowledged / next_steps. Normalize those here before review,
 * persistence, handoff, or implementation packaging.
 */
export function sanitizeWork(w) {
  if (!w || typeof w !== "object") {
    return {
      summary: "",
      recommendations: [],
      evidence: [],
      risks: [],
      nextActions: [],
      confidence: null,
      proposedImplementation: { filesAffected: [], requirements: [], acceptanceTests: [], rollbackPlan: "" }
    };
  }

  const pCandidate = firstDefined(w.proposedImplementation, w.proposed_implementation, w.implementation);
  const p = pCandidate && typeof pCandidate === "object" && !Array.isArray(pCandidate) ? pCandidate : {};

  return {
    summary: textValue(firstDefined(w.summary, w.overview, w.analysis)),
    recommendations: strList(firstDefined(w.recommendations, w.recommendation, w.suggestions, w.actions)),
    evidence: strList(firstDefined(w.evidence, w.supportingEvidence, w.supporting_evidence)),
    risks: strList(firstDefined(w.risks, w.risksAcknowledged, w.risks_acknowledged, w.risk)),
    nextActions: strList(firstDefined(w.nextActions, w.next_actions, w.nextSteps, w.next_steps)),
    confidence: confidenceValue(firstDefined(w.confidence, w.confidenceScore, w.confidence_score)),
    proposedImplementation: {
      filesAffected: strList(firstDefined(p.filesAffected, p.files_affected, p.files)),
      requirements: strList(firstDefined(p.requirements, p.requirement)),
      acceptanceTests: strList(firstDefined(p.acceptanceTests, p.acceptance_tests, p.tests)),
      rollbackPlan: textValue(firstDefined(p.rollbackPlan, p.rollback_plan))
    }
  };
}

export async function activeProtectedItems(sr) {
  const locks = await sr.entities.SystemLocks.filter({ status: "ACTIVE" });
  return [...new Set(locks.flatMap((l) => l.protectedItems || []))];
}

/**
 * The Evaluate Gate. If all required approvals are satisfied, builds the
 * Base44 Implementation Package (once per Change ID) and marks the job READY_TO_IMPLEMENT.
 * proposal = { filesAffected, requirements, acceptanceTests, rollbackPlan } or null
 * (falls back to job.inputData.proposedImplementation for owner-gated jobs).
 */
export async function evaluateAndBuildPackage(sr, job, proposal) {
  const changeId = job.changeId;
  const approvals = await sr.entities.AgentApprovals.filter({ changeId });
  const needsOwner = job.requiresOwnerApproval || job.riskLevel === "RED";
  const ownerApproved = approvals.some((a) => a.approvalType === "OWNER" && a.status === "APPROVED");
  const specialistApproved =
    ["APPROVED", "NOT_REQUIRED"].includes(job.specialistApprovalStatus) ||
    approvals.some((a) => a.approvalType !== "OWNER" && a.status === "APPROVED");

  if (!specialistApproved) {
    await sr.entities.AgentJobs.update(job.id, { status: "AWAITING_SPECIALIST" });
    await writeAudit(sr, {
      changeId, jobId: job.jobId, agentId: "MASTER_ORCHESTRATOR", eventType: "APPROVAL",
      action: "Gate evaluation: specialist approval pending",
      previousState: job.status, newState: "AWAITING_SPECIALIST"
    });
    return { ready: false, reason: "Specialist approval pending" };
  }
  if (needsOwner && !ownerApproved) {
    await sr.entities.AgentJobs.update(job.id, { status: "AWAITING_OWNER", specialistApprovalStatus: "APPROVED" });
    await writeAudit(sr, {
      changeId, jobId: job.jobId, agentId: "MASTER_ORCHESTRATOR", eventType: "APPROVAL",
      action: "Gate evaluation: waiting on owner approval",
      previousState: job.status, newState: "AWAITING_OWNER"
    });
    return { ready: false, reason: "Owner approval pending" };
  }

  const p = proposal || (job.inputData && job.inputData.proposedImplementation) || {};
  const hasImplementationWork =
    (Array.isArray(p.filesAffected) && p.filesAffected.length > 0) ||
    (Array.isArray(p.requirements) && p.requirements.length > 0) ||
    (Array.isArray(p.acceptanceTests) && p.acceptanceTests.length > 0) ||
    Boolean(p.rollbackPlan && String(p.rollbackPlan).trim());

  // Pure analysis/advisory jobs should finish cleanly instead of creating an empty implementation package.
  if (!hasImplementationWork) {
    await sr.entities.AgentJobs.update(job.id, {
      status: "COMPLETED",
      specialistApprovalStatus: "APPROVED",
      implementationStatus: "NOT_REQUIRED",
      validationStatus: "NOT_REQUIRED"
    });
    await writeAudit(sr, {
      changeId, jobId: job.jobId, agentId: "MASTER_ORCHESTRATOR", eventType: "STATUS_CHANGE",
      action: "Advisory-only job completed — no implementation package required",
      previousState: job.status, newState: "COMPLETED"
    });
    return { ready: false, completed: true, status: "COMPLETED", reason: "No implementation required" };
  }

  const existing = await sr.entities.ImplementationQueue.filter({ changeId });
  if (existing.length === 0) {
    const protectedItems = await activeProtectedItems(sr);
    const approvedBy = approvals.filter((a) => a.status === "APPROVED").map((a) => a.approvalType).join(" + ") || "specialist";
    await sr.entities.ImplementationQueue.create({
      changeId,
      jobId: job.jobId,
      objective: job.objective,
      approvedBy,
      filesAffected: p.filesAffected || [],
      requirements: p.requirements || [],
      protectedItems,
      acceptanceTests: p.acceptanceTests || [],
      rollbackPlan: p.rollbackPlan || "",
      status: "QUEUED",
      isTest: Boolean(job.isTest),
      archived: false
    });
  }
  await sr.entities.AgentJobs.update(job.id, {
    status: "READY_TO_IMPLEMENT",
    specialistApprovalStatus: "APPROVED",
    implementationStatus: "PENDING"
  });
  await writeAudit(sr, {
    changeId, jobId: job.jobId, agentId: "MASTER_ORCHESTRATOR", eventType: "IMPLEMENTATION",
    action: "All approvals satisfied — implementation package built for Base44",
    previousState: job.status, newState: "READY_TO_IMPLEMENT"
  });
  return { ready: true, reason: "Implementation package built" };
}