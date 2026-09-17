import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { writeAudit, strList } from "../../shared/orchestrationCore.ts";
import { callAI } from "../../shared/aiProviders.ts";

/**
 * Fired when an ImplementationQueue entry is marked COMPLETED (human GO confirmed
 * after Base44 implemented the package). Runs the automated validation and the
 * specialist post-implementation review via the configured live AI provider,
 * ending in COMPLETE or ROLLBACK REQUIRED.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch (e) { user = null; }
    if (user && user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    if (!body.implementation_id) return Response.json({ error: "implementation_id required" }, { status: 400 });

    const impl = await sr.entities.ImplementationQueue.get(body.implementation_id);
    if (impl.status !== "COMPLETED") {
      return Response.json({ skipped: true, reason: "Entry is not COMPLETED" });
    }

    const jobs = await sr.entities.AgentJobs.filter({ changeId: impl.changeId });
    const job = jobs[0];
    const roleId = (job && job.inputData && job.inputData.specialistRole) || "QUALITY_ASSURANCE_AGENT";
    const agentId = (job && job.assignedAgent) || "SEO_DEMORE";
    const protectedItems = impl.protectedItems || [];

    const call = await callAI(sr, {
      roleId, purpose: "VALIDATION",
      changeId: impl.changeId, jobId: impl.jobId, agentId,
      userPrompt: `POST-IMPLEMENTATION VALIDATION for Demore Exterior Solutions. A change was implemented by Base44 after a human GO decision. Compare what was implemented against the objective and acceptance tests.

Objective: ${impl.objective}
Implementation report: ${impl.implementationReport || "(none provided)"}
Acceptance tests: ${(impl.acceptanceTests || []).join("; ") || "(none)"}
Protected items that must NOT have been touched: ${protectedItems.join("; ") || "(none)"}

Return verdict COMPLETE only if the report satisfies the objective and acceptance tests and no protected item was touched. Otherwise return ROLLBACK_REQUIRED with the specific failures.`,
      schema: {
        type: "object",
        properties: {
          verdict: { type: "string", enum: ["COMPLETE", "ROLLBACK_REQUIRED"] },
          comments: { type: "string" },
          failures: { type: "array", items: { type: "string" } }
        },
        required: ["verdict"]
      }
    });

    if (!call.ok) {
      // Provider unavailable — an API failure is never an approval OR a rejection.
      if (job) await sr.entities.AgentJobs.update(job.id, { validationStatus: "PENDING" });
      await writeAudit(sr, {
        changeId: impl.changeId, jobId: impl.jobId, agentId, eventType: "VALIDATION",
        action: "Validation could not run — AI PROVIDER UNAVAILABLE",
        previousState: "COMPLETED", newState: "COMPLETED",
        details: String(call.error).slice(0, 400)
      });
      return Response.json({ error: "AI provider unavailable", details: call.error }, { status: 503 });
    }

    const raw = call.json;
    const review = {
      verdict: typeof raw.verdict === "string" ? raw.verdict : String(raw.verdict || ""),
      comments: typeof raw.comments === "string" ? raw.comments : JSON.stringify(raw.comments || ""),
      failures: strList(raw.failures)
    };
    const ok = review.verdict === "COMPLETE";
    if (job) {
      await sr.entities.AgentJobs.update(job.id, {
        status: ok ? "COMPLETED" : "FAILED",
        validationStatus: ok ? "PASSED" : "FAILED",
        implementationStatus: ok ? "DONE" : "FAILED"
      });
    }
    if (!ok) {
      await sr.entities.ImplementationQueue.update(impl.id, {
        status: "ROLLED_BACK",
        implementationReport: `${impl.implementationReport || ""}\n\n[AUTOMATED VALIDATION — ROLLBACK REQUIRED] ${review.comments || ""}`
      });
    }
    await sr.entities.AgentResults.create({
      changeId: impl.changeId, jobId: impl.jobId, agentId, resultType: "VALIDATION",
      summary: ok
        ? `Post-implementation validation PASSED. ${review.comments || "No issues found."}`
        : `Post-implementation validation FAILED — ROLLBACK REQUIRED. ${review.comments || ""}`,
      confidence: null,
      recommendations: review.failures || [],
      evidence: [],
      risks: ok ? [] : (review.failures || []),
      nextActions: ok ? [] : ["Roll back and re-implement"]
    });
    await writeAudit(sr, {
      changeId: impl.changeId, jobId: impl.jobId, agentId, eventType: "VALIDATION",
      action: ok ? "Automated validation PASSED — workflow COMPLETE" : "Automated validation FAILED — ROLLBACK REQUIRED",
      previousState: "COMPLETED", newState: ok ? "COMPLETED" : "ROLLED_BACK",
      details: review.comments || ""
    });

    return Response.json({ changeId: impl.changeId, verdict: ok ? "COMPLETE" : "ROLLBACK_REQUIRED", comments: review.comments || "" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}