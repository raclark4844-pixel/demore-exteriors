import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useConflicts } from "@/hooks/useAIControlData";

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "agentA", label: "Agent A" },
  { key: "agentB", label: "Agent B" },
  { key: "issue", label: "Issue" },
  {
    key: "riskLevel",
    label: "Risk",
    render: (r) => <Badge variant={r.riskLevel === "RED" ? "destructive" : "outline"}>{r.riskLevel || "—"}</Badge>,
  },
  { key: "status", label: "Status" },
  { key: "resolvedBy", label: "Resolved By" },
];

export default function ConflictsPanel() {
  const { data: conflicts, isLoading } = useConflicts();
  return <DataTable columns={columns} rows={conflicts} loading={isLoading} emptyLabel="No conflicts recorded." />;
}