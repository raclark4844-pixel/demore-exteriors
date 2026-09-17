import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";
import { useApprovals } from "@/hooks/useAIControlData";

export default function ApprovalsPanel() {
  const { data: approvals, isLoading } = useApprovals();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState(null);

  const decide = async (record, status) => {
    setBusyId(record.id);
    try {
      const approver = record.approvalType === "OWNER" ? "Ryan Bomer" : "Staff";
      await base44.entities.AgentApprovals.update(record.id, {
        status,
        approver,
        approvedAt: new Date().toISOString(),
      });
      await base44.entities.AgentAuditLog.create({
        changeId: record.changeId,
        jobId: record.jobId,
        agentId: "MASTER_ORCHESTRATOR",
        eventType: status === "APPROVED" ? "APPROVAL" : "REJECTION",
        action: `${record.approvalType} approval ${status.toLowerCase()} by ${approver}`,
        previousState: "PENDING",
        newState: status,
      });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: `${record.approvalType} approval ${status.toLowerCase()}` });
    } catch (e) {
      toast({ title: "Decision failed", description: e.message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    { key: "changeId", label: "Change ID" },
    { key: "jobId", label: "Job" },
    { key: "approvalType", label: "Type" },
    { key: "requestedBy", label: "Requested By" },
    { key: "approver", label: "Approver" },
    { key: "riskLevel", label: "Risk" },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge variant={r.status === "APPROVED" ? "default" : r.status === "REJECTED" ? "destructive" : "outline"}>{r.status || "—"}</Badge>,
    },
    { key: "summary", label: "Summary" },
    {
      key: "actions",
      label: "Decision",
      className: "max-w-none",
      render: (r) => {
        if (r.status !== "PENDING") return "—";
        const secureHumanGate = r.approvalType === "OWNER" && ["HIGH", "RED"].includes(r.riskLevel);
        if (secureHumanGate) {
          return <span className="text-xs text-muted-foreground">Secure email approval required · 1 of 2 humans</span>;
        }
        return (
          <div className="flex gap-1">
            <Button size="sm" onClick={() => decide(r, "APPROVED")} disabled={busyId === r.id}>Approve</Button>
            <Button size="sm" variant="destructive" onClick={() => decide(r, "REJECTED")} disabled={busyId === r.id}>Reject</Button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} rows={approvals} loading={isLoading} emptyLabel="No approvals recorded." />;
}