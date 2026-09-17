import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import ImplementationPackageDialog from "./ImplementationPackageDialog";
import MarkImplementedDialog from "./MarkImplementedDialog";
import { useImplementations } from "@/hooks/useAIControlData";

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "jobId", label: "Job" },
  { key: "objective", label: "Objective" },
  { key: "approvedBy", label: "Approved By" },
  {
    key: "filesAffected",
    label: "Files",
    render: (r) => (r.filesAffected || []).length || "—",
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={r.status === "FAILED" ? "destructive" : "outline"}>{r.status || "—"}</Badge>,
  },
  {
    key: "implementedAt",
    label: "Implemented",
    render: (r) => (r.implementedAt ? new Date(r.implementedAt).toLocaleString() : "—"),
  },
  {
    key: "actions",
    label: "Package",
    className: "max-w-none",
    render: (r) => <ImplementationPackageDialog impl={r} />,
  },
  {
    key: "gonogo",
    label: "Human Gate",
    className: "max-w-none",
    render: (r) =>
      ["QUEUED", "IN_PROGRESS"].includes(r.status) ? <MarkImplementedDialog impl={r} /> : "—",
  },
];

export default function ImplementationsPanel() {
  const { data: impls, isLoading } = useImplementations();
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Approved work is packaged here for Base44 to execute after the owner's go-ahead.
      </p>
      <DataTable columns={columns} rows={impls} loading={isLoading} emptyLabel="Nothing queued for implementation." />
    </div>
  );
}