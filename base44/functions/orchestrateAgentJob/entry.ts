import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  REQUEST_TYPE_CATEGORIES, approvalTypeForCategory, nextChangeId,
  writeAudit, evaluateAndBuildPackage, sanitizeWork, strList
} from "../../shared/orchestrationCore.ts";
import { callAI, MAX_REVIEW_ROUNDS, MAX_HANDOFFS } from "../../shared/aiProviders.ts";

const WORK_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    recommendations: { type: "array", items: { type: "string" } },
    evidence: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
    confidence: { type: "number" },
    proposedImplementation: {
      type: "object",
      properties: {
        filesAffected: { type: "array", items: { type: "string" } },
        requirements: { type: "array", items: { type: "string" } },
        acceptanceTests: { type: "array", items: { type: "string" } },
        rollbackPlan: { type: "string" }
      }
    }
  },
  required: ["summary", "recommendations", "evidence", "risks", "nextActions", "confidence"]
};

const REVIEW_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", enum: ["APPROVED", "CHANGES_REQUIRED", "REJECTED"] },
    comments: { type: "string" },
    concerns: { type: "array", items: { type: "string" } }
  },
  required: ["verdict"]
};

async function reviewCall(sr, reviewerRole, reviewerAgent, changeId, jobIdRef, requestType, objective, work) {
  const result = await callAI(sr, {
    roleId: reviewerRole, purpose: "REVIEW", changeId, jobId: jobIdRef, agentId: reviewerAgent,
    userPrompt: `You are reviewing a colleague's proposed work for Demore Exterior Solutions BEFORE it reaches the implementation gate.

Request type: ${requestType}
Objective: ${objective}
Proposed summary: ${work.summary}
Recommendations: ${(work.recommendations || []).join("; ")}
Evidence: ${(work.evidence || []).join("; ")}
Risks acknowledged: ${(work.risks || []).join("; ")}
Next actions: ${(work.nextActions || []).join("; ")}
Confidence: ${work.confidence ?? "(not provided)"}
Proposed implementation work: ${work.proposedImplementation && ((work.proposedImplementation.filesAffected || []).length || (work.proposedImplementation.requirements || []).length || (work.proposedImplementation.acceptanceTests || []).length || work.proposedImplementation.rollbackPlan) ? JSON.stringify(work.proposedImplementation) : "none"}

Rules: Judge the fields shown above as the complete submitted work product. APPROVED only if the work is sound, specific to this business, satisfies the stated objective, and respects prohibited actions. CHANGES_REQUIRED if fixable — list exactly what must change. REJECTED if fundamentally flawed or unsafe. Do not claim a field is missing when it is visibly populated above.

Return JSON with verdict (APPROVED, CHANGES_REQUIRED, or REJECTED), comments, and concerns.`,
    schema: REVIEW_SCHEMA
  });
  if (result.ok && result.json) {
    result.json = {
      verdict: typeof result.json.verdict === "string" ? result.json.verdict : String(result.json.verdict || ""),
      comments: typeof result.json.comments === "string" ? result.json.comments : JSON.stringify(result.json.comments || ""),
      concerns: strList(result.json.concerns)
    };
  }
  return result;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch (e) { user = null; }
    if (user && user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    if (!body.job_id) return Response.json({ error: "job_id required" }, { status: 400 });
    const job = await sr.entities.AgentJobs.get(body.job_id);

    // 1. SHARED CHANGE ID
    let changeId = job.changeId;
    if (!changeId) {
      changeId = await nextChangeId(sr);
      await sr.entities.AgentJobs.update(job.id, { changeId });
    }
    const jobIdRef = job.jobId || `${changeId}-J1`;
    const advisoryOnly = Boolean(job.inputData && job.inputData.advisoryOnly);
    const forceOwnerApproval = Boolean(job.inputData && job.inputData.forceOwnerApproval);
    const planningOnly = Boolean(job.inputData && job.inputData.planningOnly);
    const requestedSpecialistRole = job.inputData && job.inputData.specialistRole;
    const requestedReviewerRole = job.inputData && job.inputData.reviewerRole;

    const blockJob = async (currentStatus, error) => {
      await sr.entities.AgentJobs.update(job.id, { status: "BLOCKED" });
      await writeAudit(sr, {
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "STATUS_CHANGE",
        action: "BLOCKED — AI PROVIDER UNAVAILABLE",
        previousState: currentStatus, newState: "BLOCKED",
        details: String(error).slice(0, 400)
      });
      return Response.json({ changeId, status: "BLOCKED", error: String(error).slice(0, 300) });
    };

    // 2. CLASSIFY via the ORCHESTRATOR role (live provider + configured fallback)
    let requestType = job.jobType;
    let riskLevel = job.riskLevel || "LOW";
    let specialistRole = null;
    let reviewerRole = "QUALITY_ASSURANCE_AGENT";
    let reasoning = "";
    let classified = false;

    if (!job.assignedAgent || !job.jobType || job.jobType === "UNCLASSIFIED") {
      const roles = await sr.entities.AISpecialistRole.filter({ enabled: true });
      const specialistRoles = roles.filter((r) => r.roleId !== "ORCHESTRATOR");
      const roleIds = specialistRoles.map((r) => r.roleId);
      const roster = specialistRoles
        .map((r) => `${r.roleId} — ${r.roleTitle} (${(r.capabilities || []).slice(0, 2).join(", ")})`)
        .join("\n");
      const clsCall = await callAI(sr, {
        roleId: "ORCHESTRATOR", purpose: "CLASSIFICATION",
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR",
        userPrompt: `Classify this internal work request for Demore Exterior Solutions (Northeast Ohio exterior contractor: roofing, siding, gutters, windows, doors, decks, storm & insurance restoration; HQ Mentor OH; owner Ryan Bomer).

Request: ${job.objective}
Context: ${job.context || "(none)"}

Enabled specialist roles:
${roster}

Risk guidance: RED = touches production SEO, domains, redirects, sitemap, customer-facing content, or security. HIGH = significant site or content changes. MEDIUM = notable internal changes. LOW = analysis/advisory only.

Assign the best specialistRole and a DIFFERENT reviewerRole. Return JSON.`,
        schema: {
          type: "object",
          properties: {
            requestType: { type: "string", enum: REQUEST_TYPE_CATEGORIES },
            riskLevel: { type: "string", enum: ["LOW", "MEDIUM", "HIGH", "RED"] },
            specialistRole: { type: "string", enum: roleIds },
            reviewerRole: { type: "string", enum: roleIds },
            reasoning: { type: "string" }
          },
          required: ["requestType", "riskLevel", "specialistRole", "reviewerRole"]
        }
      });
      if (!clsCall.ok) return await blockJob(job.status, clsCall.error);
      const cls = clsCall.json;
      requestType = cls.requestType || requestType;
      if (["LOW", "MEDIUM", "HIGH", "RED"].includes(cls.riskLevel)) riskLevel = cls.riskLevel;
      if (roleIds.includes(cls.specialistRole)) specialistRole = cls.specialistRole;
      if (roleIds.includes(cls.reviewerRole) && cls.reviewerRole !== specialistRole) reviewerRole = cls.reviewerRole;
      if (requestedSpecialistRole && roleIds.includes(requestedSpecialistRole)) {
        specialistRole = requestedSpecialistRole;
      }
      if (requestedReviewerRole && roleIds.includes(requestedReviewerRole) && requestedReviewerRole !== specialistRole) {
        reviewerRole = requestedReviewerRole;
      }
      reasoning = cls.reasoning || "";
      if (requestedSpecialistRole && specialistRole === requestedSpecialistRole) {
        reasoning += `${reasoning ? " " : ""}Deterministic specialist routing honored from the approved job input.`;
      }
      if (advisoryOnly) riskLevel = "LOW";
      if (forceOwnerApproval && !["HIGH", "RED"].includes(riskLevel)) riskLevel = "MEDIUM";
      classified = true;
    }
    // Fallback mapping when staff pre-assigned an agent and classification was skipped
    if (!specialistRole) {
      const at = approvalTypeForCategory(requestType);
      specialistRole = at === "SEO" ? "SEO_SPECIALIST"
        : at === "WEB" ? "WEB_DEVELOPMENT_SPECIALIST"
        : at === "CONTENT" ? "CONTENT_SPECIALIST"
        : at === "REPUTATION" ? "REPUTATION_SPECIALIST"
        : "QUALITY_ASSURANCE_AGENT";
    }

    const specialistCfg = (await sr.entities.AISpecialistRole.filter({ roleId: specialistRole }))[0] || {};
    const reviewerCfg = (await sr.entities.AISpecialistRole.filter({ roleId: reviewerRole }))[0] || {};
    let specialistAgent = classified ? (specialistCfg.agentId || "MASTER_ORCHESTRATOR") : (job.assignedAgent || specialistCfg.agentId || "MASTER_ORCHESTRATOR");
    let reviewerAgent = reviewerCfg.agentId || "SEO_DEMORE";
    if (reviewerAgent === specialistAgent) reviewerAgent = specialistAgent === "SEO_DEMORE" ? "WEB_OPTIMIZATION" : "SEO_DEMORE";

    // 3. Update job with classification
    const needsOwner = forceOwnerApproval || ["HIGH", "RED"].includes(riskLevel);
    await sr.entities.AgentJobs.update(job.id, {
      changeId, jobId: jobIdRef, jobType: requestType, riskLevel,
      assignedAgent: specialistAgent, status: "ASSIGNED",
      requiresOwnerApproval: needsOwner,
      ownerApprovalStatus: needsOwner ? "PENDING" : "NOT_REQUIRED",
      inputData: { ...(job.inputData || {}), specialistRole, reviewerRole }
    });
    await writeAudit(sr, {
      changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "STATUS_CHANGE",
      action: `Classified as ${requestType} (${riskLevel} risk) — routed to ${specialistRole}`,
      previousState: job.status, newState: "ASSIGNED",
      details: reasoning
    });

    // 4. BOT-TO-BOT HANDOFF (loop-limited)
    const handoffsSoFar = (await sr.entities.AgentHandoffs.filter({ changeId })).length;
    if (handoffsSoFar < MAX_HANDOFFS) {
      await sr.entities.AgentHandoffs.create({
        changeId, jobId: jobIdRef,
        fromAgent: "MASTER_ORCHESTRATOR", toAgent: specialistAgent,
        reason: `Automated routing: ${requestType}`,
        request: job.objective,
        riskLevel, status: "ACCEPTED", decision: "ACCEPTED",
        response: "Phase 4 automated handoff accepted",
        isTest: Boolean(job.isTest), archived: false
      });
      await writeAudit(sr, {
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "HANDOFF",
        action: `Handoff to ${specialistAgent} (${specialistRole})`, newState: "ASSIGNED"
      });
    }

    // 5. SPECIALIST WORK (live provider)
    await sr.entities.AgentJobs.update(job.id, { status: "IN_PROGRESS" });
    await writeAudit(sr, {
      changeId, jobId: jobIdRef, agentId: specialistAgent, eventType: "STATUS_CHANGE",
      action: `Specialist work started (${specialistRole})`, previousState: "ASSIGNED", newState: "IN_PROGRESS"
    });

    const workPrompt = (extra) => `Request type: ${requestType}
Objective: ${job.objective}
Context: ${job.context || "(none)"}
${extra || ""}

Return JSON with summary, recommendations, evidence, risks, nextActions, confidence (0-100), and — when an implementation is appropriate — proposedImplementation { filesAffected, requirements, acceptanceTests, rollbackPlan }. Honor the forbidden actions in your role. Production SEO, domains, redirects, robots.txt, and the sitemap are lock-protected.${advisoryOnly ? " This is an ADVISORY-ONLY job: do not provide an implementation package, do not claim changes were executed, and clearly distinguish observed evidence from hypotheses." : ""}${planningOnly ? " This job was owner-prioritized for PLANNING ONLY: create a precise implementation and validation package, but do not claim any code, content, deployment, DNS, SEO infrastructure, or production change has been executed. The owner gate must remain in place before implementation." : ""}`;

    const workCall = await callAI(sr, {
      roleId: specialistRole, purpose: "SPECIALIST_WORK",
      changeId, jobId: jobIdRef, agentId: specialistAgent,
      userPrompt: workPrompt(), schema: WORK_SCHEMA
    });
    if (!workCall.ok) return await blockJob("ASSIGNED", workCall.error);
    let work = sanitizeWork(workCall.json);

    // 6. CROSS-AGENT REVIEW with bounded revision rounds + structured questions
    await sr.entities.AgentJobs.update(job.id, { status: "AWAITING_SPECIALIST" });
    await writeAudit(sr, {
      changeId, jobId: jobIdRef, agentId: reviewerAgent, eventType: "STATUS_CHANGE",
      action: `Specialist work complete — reviewer started (${reviewerRole})`, previousState: "IN_PROGRESS", newState: "AWAITING_SPECIALIST"
    });

    let review = null;
    let rounds = 0;
    for (;;) {
      const rc = await reviewCall(sr, reviewerRole, reviewerAgent, changeId, jobIdRef, requestType, job.objective, work);
      if (!rc.ok) return await blockJob("IN_PROGRESS", rc.error);
      review = rc.json;
      if (review.verdict === "APPROVED") break;
      if (review.verdict === "CHANGES_REQUIRED" && rounds < MAX_REVIEW_ROUNDS) {
        rounds++;
        let questionHandoff = null;
        if ((await sr.entities.AgentHandoffs.filter({ changeId })).length < MAX_HANDOFFS) {
          questionHandoff = await sr.entities.AgentHandoffs.create({
            changeId, jobId: jobIdRef,
            fromAgent: reviewerAgent, toAgent: specialistAgent,
            reason: "Cross-agent question — same Change ID",
            request: review.comments || "",
            riskLevel, status: "ACCEPTED", decision: "ACCEPTED",
            isTest: Boolean(job.isTest), archived: false
          });
          await writeAudit(sr, {
            changeId, jobId: jobIdRef, agentId: reviewerAgent, eventType: "HANDOFF",
            action: `Cross-agent question sent to ${specialistAgent} (${specialistRole})`,
            details: review.comments
          });
        }
        const revCall = await callAI(sr, {
          roleId: specialistRole, purpose: "REVISION",
          changeId, jobId: jobIdRef, agentId: specialistAgent,
          userPrompt: workPrompt(`A reviewer (${reviewerRole}) requested changes to your work.
Reviewer comments: ${review.comments}
Concerns: ${(review.concerns || []).join("; ")}

Revise your work and return the full updated JSON result.`),
          schema: WORK_SCHEMA
        });
        if (!revCall.ok) return await blockJob("IN_PROGRESS", revCall.error);
        work = sanitizeWork(revCall.json);
        if (questionHandoff) {
          await sr.entities.AgentHandoffs.update(questionHandoff.id, {
            response: (work.summary || "").slice(0, 500)
          });
        }
        continue;
      }
      break; // REJECTED or revision rounds exhausted
    }
    const verdictApproved = review && review.verdict === "APPROVED";
    await sr.entities.AgentJobs.update(job.id, {
      status: verdictApproved ? "APPROVED" : "REJECTED",
      specialistApprovalStatus: verdictApproved ? "APPROVED" : "REJECTED"
    });

    // 7. RESULT under the same Change ID
    await sr.entities.AgentResults.create({
      changeId, jobId: jobIdRef, agentId: specialistAgent, resultType: "ANALYSIS",
      summary: work.summary || "",
      recommendations: work.recommendations || [],
      evidence: work.evidence || [],
      confidence: typeof work.confidence === "number" ? work.confidence : null,
      risks: work.risks || [],
      nextActions: work.nextActions || [],
      isTest: Boolean(job.isTest),
      archived: false
    });
    await writeAudit(sr, {
      changeId, jobId: jobIdRef, agentId: specialistAgent, eventType: "STATUS_CHANGE",
      action: `Specialist result produced (${specialistRole})`, newState: "IN_PROGRESS"
    });

    // 8. REVIEWER APPROVAL RECORD
    const approvalType = approvalTypeForCategory(requestType);
    await sr.entities.AgentApprovals.create({
      changeId, jobId: jobIdRef,
      requestedBy: "MASTER_ORCHESTRATOR",
      approvalType, approver: reviewerAgent, riskLevel,
      summary: `Automated ${approvalType} review of ${specialistRole}'s work`,
      proposedAction: work.summary || "",
      status: verdictApproved ? "APPROVED" : "REJECTED",
      comments: review.comments || "",
      approvedAt: new Date().toISOString(),
      isTest: Boolean(job.isTest),
      archived: false
    });
    await writeAudit(sr, {
      changeId, jobId: jobIdRef, agentId: reviewerAgent,
      eventType: verdictApproved ? "APPROVAL" : "REJECTION",
      action: verdictApproved ? `Automated review APPROVED by ${reviewerRole}` : `Automated review REJECTED by ${reviewerRole}`,
      previousState: "IN_PROGRESS", newState: verdictApproved ? "APPROVED" : "REJECTED",
      details: review.comments || ""
    });

    // Advisory-only audits should not spam the owner approval queue when QA rejects a weak finding.
    if (!verdictApproved && advisoryOnly) {
      await writeAudit(sr, {
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "REJECTION",
        action: "Advisory-only result rejected by QA — no owner escalation created",
        previousState: "IN_PROGRESS", newState: "REJECTED",
        details: review.comments || ""
      });
      return Response.json({ changeId, status: "REJECTED", advisoryOnly: true, review: review.comments || "" });
    }

    // 9. CONFLICT DETECTED — never silently pick a side; escalate to owner
    if (!verdictApproved) {
      await sr.entities.AgentConflicts.create({
        changeId, jobId: jobIdRef,
        agentA: specialistAgent, agentB: reviewerAgent,
        issue: `CONFLICT DETECTED: ${reviewerRole} rejected ${specialistRole}'s proposal for ${requestType}`,
        agentAPosition: (work.summary || "").slice(0, 1000),
        agentBPosition: (review.comments || "").slice(0, 1000),
        riskLevel, status: "AWAITING_OWNER",
        isTest: Boolean(job.isTest),
        archived: false
      });
      await sr.entities.AgentApprovals.create({
        changeId, jobId: jobIdRef,
        requestedBy: "MASTER_ORCHESTRATOR",
        approvalType: "OWNER", approver: "Ryan Bomer", riskLevel,
        summary: `OWNER DECISION REQUIRED — specialists disagree on ${requestType}`,
        proposedAction: (work.summary || "").slice(0, 500),
        status: "PENDING",
        isTest: Boolean(job.isTest),
        archived: false
      });
      await sr.entities.AgentJobs.update(job.id, { status: "AWAITING_OWNER", specialistApprovalStatus: "REJECTED" });
      await writeAudit(sr, {
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "CONFLICT",
        action: "CONFLICT DETECTED — escalated to owner",
        previousState: "IN_PROGRESS", newState: "AWAITING_OWNER",
        details: review.comments || ""
      });
      return Response.json({ changeId, status: "AWAITING_OWNER", conflict: true, review: review.comments || "" });
    }

    // 10. OWNER GATE (HIGH/RED) — human approval still rules production changes
    const proposal = advisoryOnly ? {} : (work.proposedImplementation || {});
    if (needsOwner) {
      const jobFresh = await sr.entities.AgentJobs.get(job.id);
      await sr.entities.AgentJobs.update(job.id, {
        status: "AWAITING_OWNER", specialistApprovalStatus: "APPROVED",
        inputData: { ...(jobFresh.inputData || {}), proposedImplementation: proposal }
      });
      await sr.entities.AgentApprovals.create({
        changeId, jobId: jobIdRef,
        requestedBy: "MASTER_ORCHESTRATOR",
        approvalType: "OWNER", approver: "Ryan Bomer", riskLevel,
        summary: `Owner approval required (${riskLevel} risk): ${requestType}`,
        proposedAction: work.summary || "",
        status: "PENDING",
        isTest: Boolean(job.isTest),
        archived: false
      });
      await writeAudit(sr, {
        changeId, jobId: jobIdRef, agentId: "MASTER_ORCHESTRATOR", eventType: "APPROVAL",
        action: `${riskLevel} risk — awaiting owner approval from Ryan Bomer`, newState: "AWAITING_OWNER"
      });
      return Response.json({ changeId, status: "AWAITING_OWNER", reason: "Owner approval required" });
    }

    // 11. EVALUATE GATE → BUILD PACKAGE (LOW/MEDIUM auto path)
    const jobNow = await sr.entities.AgentJobs.get(job.id);
    const gate = await evaluateAndBuildPackage(sr, jobNow, proposal);
    return Response.json({
      changeId,
      status: gate.status || (gate.ready ? "READY_TO_IMPLEMENT" : jobNow.status),
      gate
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}