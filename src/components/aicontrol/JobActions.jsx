import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { base44 } from "@/api/base44Client";
import { evaluateApprovals } from "@/lib/orchestration";
import RouteJobDialog from "./RouteJobDialog";
import SubmitResultDialog from "./SubmitResultDialog";

export default function JobActions({ job }) {
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const evaluate = async () => {
    setBusy(true);
    try {
      const outcome = await evaluateApprovals(job);
      toast({
        title: outcome.ready ? "Queued for Base44" : "Not ready yet",
        description: outcome.reason,
        variant: outcome.ready ? undefined : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
    } catch (e) {
      toast({ title: "Evaluation failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const retry = async () => {
    setBusy(true);
    try {
      const res = await base44.functions.invoke("orchestrateAgentJob", { job_id: job.id });
      const out = res?.data || res;
      toast({
        title: "Retry completed",
        description: out?.status ? `Status: ${out.status}` : (out?.error || "Done"),
        variant: out?.status === "BLOCKED" ? "destructive" : undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
    } catch (e) {
      toast({ title: "Retry failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex gap-1">
      <RouteJobDialog job={job} />
      <SubmitResultDialog job={job} />
      {["BLOCKED", "FAILED", "AWAITING_SPECIALIST"].includes(job.status) && (
        <Button size="sm" variant="outline" onClick={retry} disabled={busy}>
          {busy ? "Retrying…" : "Retry"}
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={evaluate} disabled={busy}>
        {busy ? "Evaluating…" : "Evaluate"}
      </Button>
    </div>
  );
}