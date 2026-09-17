import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useAgents } from "@/hooks/useAIControlData";

const columns = [
  { key: "agentId", label: "ID" },
  { key: "agentName", label: "Name" },
  { key: "agentType", label: "Type" },
  { key: "authority", label: "Authority" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={r.status === "ACTIVE" ? "default" : "outline"}>{r.status || "—"}</Badge>,
  },
  { key: "endpointType", label: "Endpoint" },
];

export default function AgentsPanel() {
  const { data: agents, isLoading } = useAgents();
  return <DataTable columns={columns} rows={agents} loading={isLoading} emptyLabel="No agents registered." />;
}