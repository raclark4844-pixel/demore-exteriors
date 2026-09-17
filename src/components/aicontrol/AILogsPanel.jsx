import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useAILogs } from "@/hooks/useAIControlData";

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "roleId", label: "Role" },
  { key: "provider", label: "Provider" },
  { key: "model", label: "Model" },
  { key: "purpose", label: "Purpose" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={r.status === "SUCCESS" ? "default" : "destructive"}>{r.status}</Badge>,
  },
  { key: "latencyMs", label: "Latency", render: (r) => (r.latencyMs != null ? `${r.latencyMs} ms` : "—") },
  { key: "tokens", label: "Tokens", render: (r) => (r.tokens != null ? r.tokens : "—") },
  {
    key: "error",
    label: "Error",
    render: (r) => <span className="text-xs text-destructive">{r.error || "—"}</span>,
  },
];

export default function AILogsPanel() {
  const { data: logs, isLoading } = useAILogs();
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Every AI request — provider, model, latency, token usage, errors, and fallbacks — logged under its Change ID.
      </p>
      <DataTable columns={columns} rows={logs} loading={isLoading} emptyLabel="No AI requests logged yet." />
    </div>
  );
}