import React from "react";
import DataTable from "./DataTable";
import { useHandoffs } from "@/hooks/useAIControlData";

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "jobId", label: "Job" },
  { key: "fromAgent", label: "From" },
  { key: "toAgent", label: "To" },
  { key: "reason", label: "Reason" },
  { key: "riskLevel", label: "Risk" },
  { key: "status", label: "Status" },
  { key: "decision", label: "Decision" },
];

export default function HandoffsPanel() {
  const { data: handoffs, isLoading } = useHandoffs();
  return <DataTable columns={columns} rows={handoffs} loading={isLoading} emptyLabel="No handoffs recorded." />;
}