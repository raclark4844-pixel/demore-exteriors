import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useLocks } from "@/hooks/useAIControlData";

const columns = [
  { key: "scope", label: "Scope" },
  { key: "reason", label: "Reason" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={r.status === "ACTIVE" ? "destructive" : "outline"}>{r.status || "—"}</Badge>,
  },
  { key: "createdBy", label: "Created By" },
  {
    key: "protectedItems",
    label: "Protected Items",
    render: (r) => (r.protectedItems || []).join(", ") || "—",
  },
  {
    key: "expiresAt",
    label: "Expires",
    render: (r) => (r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "Until released"),
  },
];

export default function LocksPanel() {
  const { data: locks, isLoading } = useLocks();
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Active locks block agents from touching the protected areas.</p>
      <DataTable columns={columns} rows={locks} loading={isLoading} emptyLabel="No locks in place." />
    </div>
  );
}