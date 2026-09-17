import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";

/** Human GO / NO-GO gate over a queued implementation package. */
export default function MarkImplementedDialog({ impl }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState("");
  const queryClient = useQueryClient();

  const run = async (status) => {
    setBusy(true);
    try {
      const update =
        status === "COMPLETED"
          ? { status, implementationReport: report, implementedAt: new Date().toISOString() }
          : { status };
      await base44.entities.ImplementationQueue.update(impl.id, update);
      await base44.entities.AgentAuditLog.create({
        changeId: impl.changeId,
        jobId: impl.jobId,
        agentId: "STAFF",
        eventType: "IMPLEMENTATION",
        action:
          status === "COMPLETED"
            ? "Human GO confirmed — implementation marked complete"
            : "Human NO-GO — implementation rolled back",
        previousState: impl.status,
        newState: status,
        details: status === "COMPLETED" ? report.slice(0, 500) : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      setOpen(false);
      toast({
        title: status === "COMPLETED" ? "Marked implemented" : "Marked as rolled back (NO-GO)",
        description:
          status === "COMPLETED"
            ? "Automated validation and specialist review will run under the same Change ID."
            : undefined,
      });
    } catch (e) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">GO / NO-GO</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Human Gate — {impl.changeId}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          GO means Base44 has implemented this package after your go-ahead. Describe what was done —
          automated validation runs as soon as you confirm.
        </p>
        <div className="grid gap-2">
          <Label htmlFor="implReport">Implementation report</Label>
          <Textarea
            id="implReport"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            rows={4}
            placeholder="What Base44 implemented, files touched, anything the validator should check"
          />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => run("ROLLED_BACK")} disabled={busy}>
            NO-GO (Roll Back)
          </Button>
          <Button onClick={() => run("COMPLETED")} disabled={busy}>
            {busy ? "Saving…" : "GO — Implemented"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}