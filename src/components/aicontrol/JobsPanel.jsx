import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { generateChangeId } from "@/lib/changeId";
import { useJobs } from "@/hooks/useAIControlData";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";
import JobActions from "./JobActions";

const selectCls = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";
const emptyForm = { objective: "", context: "", priority: "NORMAL" };

const columns = [
  { key: "changeId", label: "Change ID" },
  { key: "jobId", label: "Job" },
  { key: "objective", label: "Objective" },
  { key: "assignedAgent", label: "Agent" },
  { key: "priority", label: "Priority" },
  {
    key: "riskLevel",
    label: "Risk",
    render: (r) => <Badge variant={r.riskLevel === "RED" ? "destructive" : "outline"}>{r.riskLevel || "—"}</Badge>,
  },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "max-w-none", render: (r) => <JobActions job={r} /> },
];

export default function JobsPanel() {
  const { data: jobs, isLoading } = useJobs();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const createJob = useMutation({
    mutationFn: async () => {
      const changeId = await generateChangeId();
      const jobId = `${changeId}-J1`;
      const job = await base44.entities.AgentJobs.create({
        changeId,
        jobId,
        createdBy: "MASTER_ORCHESTRATOR",
        objective: form.objective,
        context: form.context,
        jobType: "UNCLASSIFIED",
        priority: form.priority,
        status: "NEW",
        requiresOwnerApproval: false,
        ownerApprovalStatus: "NOT_REQUIRED",
        specialistApprovalStatus: "PENDING",
        implementationStatus: "NOT_REQUIRED",
        validationStatus: "NOT_REQUIRED",
        inputData: {},
      });
      await base44.entities.AgentAuditLog.create({
        changeId,
        jobId,
        agentId: "MASTER_ORCHESTRATOR",
        eventType: "JOB_CREATED",
        action: `New request: ${form.objective}`,
        newState: "NEW",
      });
      return job;
    },
    onSuccess: () => {
      setOpen(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: "Request created", description: "The orchestrator is classifying and processing it automatically." });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          New requests are auto-classified, routed, processed by a specialist AI, and bot-reviewed under one shared Change ID.
          HIGH/RED risk always stops for owner approval.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">New Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Request</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="objective">Request</Label>
                <Textarea
                  id="objective"
                  value={form.objective}
                  onChange={set("objective")}
                  rows={3}
                  placeholder="What needs to be done — the orchestrator classifies it automatically"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="context">Context (optional)</Label>
                <Textarea
                  id="context"
                  value={form.context}
                  onChange={set("context")}
                  rows={2}
                  placeholder="Background the specialist should know"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <select id="priority" className={selectCls} value={form.priority} onChange={set("priority")}>
                  {["NORMAL", "LOW", "HIGH", "URGENT"].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => createJob.mutate()} disabled={createJob.isPending || !form.objective}>
                {createJob.isPending ? "Creating…" : "Create Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} rows={jobs} loading={isLoading} emptyLabel="No requests yet. Create the first one." />
    </div>
  );
}