import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useKnowledge } from "@/hooks/useAIControlData";

const columns = [
  { key: "category", label: "Category" },
  { key: "subject", label: "Subject" },
  {
    key: "verificationStatus",
    label: "Verification",
    render: (r) => (
      <Badge variant={r.verificationStatus === "VERIFIED" ? "default" : r.verificationStatus === "DISPUTED" ? "destructive" : "outline"}>
        {r.verificationStatus || "UNVERIFIED"}
      </Badge>
    ),
  },
  { key: "verifiedBy", label: "Verified By" },
  { key: "source", label: "Source" },
  {
    key: "validUntil",
    label: "Valid Until",
    render: (r) => (r.validUntil ? new Date(r.validUntil).toLocaleDateString() : "—"),
  },
];

export default function KnowledgePanel() {
  const { data: knowledge, isLoading } = useKnowledge();
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Agents may never mark an unverified fact as VERIFIED — only staff can.</p>
      <DataTable columns={columns} rows={knowledge} loading={isLoading} emptyLabel="No shared knowledge recorded yet." />
    </div>
  );
}