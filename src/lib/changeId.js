import { base44 } from "@/api/base44Client";

/**
 * Generates the next sequential Change ID for a new top-level workflow.
 * Format: DES-YYYY-###### (never created during a handoff — one workflow, one Change ID).
 */
export async function generateChangeId() {
  const year = new Date().getFullYear();
  const prefix = `DES-${year}-`;
  const jobs = await base44.entities.AgentJobs.list("-created_date", 500);
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