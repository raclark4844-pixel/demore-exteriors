import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgents, useJobs, useApprovals, useImplementations, useConflicts, useLocks } from "@/hooks/useAIControlData";

const Stat = ({ title, value, hint }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-heading font-bold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </CardContent>
  </Card>
);

export default function StatusOverview() {
  const { data: agents } = useAgents();
  const { data: jobs } = useJobs();
  const { data: approvals } = useApprovals();
  const { data: impls } = useImplementations();
  const { data: conflicts } = useConflicts();
  const { data: locks } = useLocks();
  const count = (list, pred) => (list || []).filter(pred).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Stat title="Active Agents" value={count(agents, (a) => a.status === "ACTIVE")} hint={`${(agents || []).length} registered`} />
        <Stat title="Open Jobs" value={count(jobs, (j) => !["COMPLETED", "CANCELLED", "FAILED", "ARCHIVED"].includes(j.status))} hint={`${(jobs || []).length} total`} />
        <Stat title="Pending Approvals" value={count(approvals, (a) => a.status === "PENDING")} />
        <Stat title="Queued Implementations" value={count(impls, (i) => i.status === "QUEUED")} />
        <Stat title="Open Conflicts" value={count(conflicts, (c) => !["RESOLVED", "CLOSED"].includes(c.status))} />
        <Stat title="Active Locks" value={count(locks, (l) => l.status === "ACTIVE")} />
      </div>

      <div>
        <h3 className="text-sm font-heading font-semibold mb-3 uppercase tracking-wider text-muted-foreground">
          Latest Change IDs
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(jobs || []).slice(0, 5).map((j) => (
            <Card key={j.id}>
              <CardContent className="pt-4">
                <p className="font-mono text-sm font-semibold">{j.changeId || "—"}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {j.status || "—"} · {j.jobType || "—"}
                </p>
              </CardContent>
            </Card>
          ))}
          {(!jobs || jobs.length === 0) && (
            <p className="text-sm text-muted-foreground">No requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}