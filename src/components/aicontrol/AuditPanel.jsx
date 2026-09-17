import React from "react";
import DataTable from "./DataTable";
import { useAudit } from "@/hooks/useAIControlData";

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "jobId", label: "Job" },
  { key: "eventType", label: "Event" },
  { key: "agentId", label: "Agent" },
  { key: "action", label: "Action" },
  { key: "previousState", label: "From" },
  { key: "newState", label: "To" },
  {
    key: "created_date",
    label: "Timestamp",
    render: (r) => (r.created_date ? new Date(r.created_date).toLocaleString() : "—"),
  },
];

export default function AuditPanel() {
  const { data: audit, isLoading } = useAudit();
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Append-only record of all orchestration activity.</p>
      <DataTable columns={columns} rows={audit} loading={isLoading} emptyLabel="No audit events yet." />
    </div>
  );
}