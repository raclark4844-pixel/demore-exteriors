import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { evaluateAndBuildPackage } from "../../shared/orchestrationCore.ts";

/**
 * Fired when an OWNER approval transitions to APPROVED.
 * Runs the Evaluate Gate for that Change ID and builds the Base44
 * Implementation Package once every required approval is satisfied.
 */
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let user = null;
    try { user = await base44.auth.me(); } catch (e) { user = null; }
    if (user && user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    if (!body.approval_id) return Response.json({ error: "approval_id required" }, { status: 400 });

    const approval = await sr.entities.AgentApprovals.get(body.approval_id);
    const jobs = await sr.entities.AgentJobs.filter({ changeId: approval.changeId });
    const job = jobs[0];
    if (!job) return Response.json({ error: "Job not found for Change ID " + approval.changeId }, { status: 404 });
    if (job.status === "READY_TO_IMPLEMENT") {
      return Response.json({ changeId: job.changeId, status: "READY_TO_IMPLEMENT", alreadyDone: true });
    }

    const gate = await evaluateAndBuildPackage(sr, job, null);
    return Response.json({ changeId: job.changeId, status: gate.ready ? "READY_TO_IMPLEMENT" : job.status, gate });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}