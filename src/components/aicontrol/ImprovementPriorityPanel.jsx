import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import { useImprovementRecommendations } from "@/hooks/useAIControlData";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";

const FILTERS = ["ACTIVE", "FIX_NOW", "REVIEW", "IGNORED", "ALL"];

function scoreVariant(score) {
  if (Number(score) >= 80) return "default";
  if (Number(score) >= 65) return "secondary";
  return "outline";
}

function decisionVariant(decision) {
  if (decision === "FIX_NOW") return "default";
  if (decision === "IGNORE") return "destructive";
  return "outline";
}

function decisionPayload(decision) {
  const now = new Date().toISOString();
  if (decision === "FIX_NOW") return { ownerDecision: "FIX_NOW", status: "APPROVED_FOR_PLANNING", decidedAt: now };
  if (decision === "REVIEW") return { ownerDecision: "REVIEW", status: "UNDER_REVIEW", decidedAt: now };
  if (decision === "IGNORE") return { ownerDecision: "IGNORE", status: "IGNORED", decidedAt: now };
  return { ownerDecision: "NEW", status: "OPEN", decidedAt: now };
}

export default function ImprovementPriorityPanel() {
  const queryClient = useQueryClient();
  const { data: recommendations, isLoading } = useImprovementRecommendations();
  const [filter, setFilter] = useState("ACTIVE");
  const [selected, setSelected] = useState(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["ai-control"] });

  const decide = useMutation({
    mutationFn: async ({ row, decision }) => {
      if (decision === "FIX_NOW") {
        return base44.functions.invoke("promoteImprovementRecommendation", { recommendation_id: row.id });
      }
      return base44.entities.ImprovementRecommendation.update(row.id, decisionPayload(decision));
    },
    onSuccess: (response, variables) => {
      refresh();
      const data = response?.data || response;
      toast({
        title: variables.decision === "FIX_NOW" ? "Controlled planning started" : variables.decision === "IGNORE" ? "Recommendation ignored" : "Recommendation marked for review",
        description: variables.decision === "FIX_NOW"
          ? `${data?.jobId || "A planning job"} was created. The bots will prepare and QA the implementation package, then stop at the owner gate before any production change.`
          : "The priority queue has been updated.",
      });
      if (selected?.id === variables.row.id) setSelected((current) => current ? { ...current, ...decisionPayload(variables.decision) } : current);
    },
    onError: (error) => toast({ title: "Could not update priority", description: error.message, variant: "destructive" }),
  });

  const rebuild = useMutation({
    mutationFn: () => base44.functions.invoke("rebuildImprovementPriorities", {}),
    onSuccess: (response) => {
      refresh();
      const data = response?.data || response;
      toast({
        title: "Priority queue refreshed",
        description: `${data?.processedRuns || 0} completed audit run(s) processed; ${data?.created || 0} new and ${data?.updated || 0} existing priorities synchronized.`,
      });
    },
    onError: (error) => toast({ title: "Priority refresh failed", description: error.message, variant: "destructive" }),
  });

  const rows = useMemo(() => {
    const all = recommendations || [];
    if (filter === "ALL") return all;
    if (filter === "FIX_NOW") return all.filter((r) => r.ownerDecision === "FIX_NOW");
    if (filter === "REVIEW") return all.filter((r) => r.ownerDecision === "REVIEW");
    if (filter === "IGNORED") return all.filter((r) => r.ownerDecision === "IGNORE" || r.status === "IGNORED");
    return all.filter((r) => !["IGNORED", "RESOLVED"].includes(r.status));
  }, [recommendations, filter]);

  const metrics = useMemo(() => {
    const all = recommendations || [];
    return {
      open: all.filter((r) => !["IGNORED", "RESOLVED"].includes(r.status)).length,
      high: all.filter((r) => Number(r.priorityScore || 0) >= 80 && !["IGNORED", "RESOLVED"].includes(r.status)).length,
      fixNow: all.filter((r) => r.ownerDecision === "FIX_NOW").length,
      review: all.filter((r) => r.ownerDecision === "REVIEW").length,
    };
  }, [recommendations]);

  const columns = [
    { key: "priorityScore", label: "Priority", render: (r) => <Badge variant={scoreVariant(r.priorityScore)}>{Math.round(Number(r.priorityScore || 0))}</Badge> },
    { key: "category", label: "Area", render: (r) => <Badge variant="outline">{r.category || "—"}</Badge> },
    {
      key: "title",
      label: "Recommendation",
      className: "min-w-[360px] max-w-[520px]",
      render: (r) => (
        <button type="button" className="text-left whitespace-normal hover:underline" onClick={() => setSelected(r)}>
          <span className="font-medium">{r.title}</span>
          <span className="block text-[11px] text-muted-foreground mt-1">{r.theme || "GENERAL"}</span>
        </button>
      ),
    },
    {
      key: "scores",
      label: "Impact / Effort / Risk",
      render: (r) => <span className="text-xs">{r.impactScore || "—"} / {r.effortScore || "—"} / {r.riskScore || "—"}</span>,
    },
    { key: "occurrenceCount", label: "Seen", render: (r) => <span className="text-xs">{r.occurrenceCount || 1}×</span> },
    {
      key: "ownerDecision",
      label: "Decision",
      render: (r) => <Badge variant={decisionVariant(r.ownerDecision)}>{r.ownerDecision || "NEW"}</Badge>,
    },
    {
      key: "lastSeenAt",
      label: "Last Seen",
      render: (r) => (r.lastSeenAt ? new Date(r.lastSeenAt).toLocaleString() : "—"),
    },
    {
      key: "actions",
      label: "Owner Action",
      className: "max-w-none",
      render: (r) => (
        <div className="flex gap-1">
          <Button size="sm" onClick={() => decide.mutate({ row: r, decision: "FIX_NOW" })} disabled={decide.isPending}>Fix Now</Button>
          <Button size="sm" variant="outline" onClick={() => decide.mutate({ row: r, decision: "REVIEW" })} disabled={decide.isPending}>Review</Button>
          <Button size="sm" variant="ghost" onClick={() => decide.mutate({ row: r, decision: "IGNORE" })} disabled={decide.isPending}>Ignore</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-heading font-semibold">Improvement Priority Engine</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
              Autonomous audit findings are deduplicated and scored by impact, confidence, recurrence, effort, and risk. “Fix Now” approves an item for controlled planning only; it never deploys a production change by itself.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => rebuild.mutate()} disabled={rebuild.isPending}>
            {rebuild.isPending ? "Refreshing…" : "Refresh From Audits"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-md border p-3"><span className="text-muted-foreground">Open priorities</span><div className="text-xl font-semibold mt-1">{metrics.open}</div></div>
          <div className="rounded-md border p-3"><span className="text-muted-foreground">High priority (80+)</span><div className="text-xl font-semibold mt-1">{metrics.high}</div></div>
          <div className="rounded-md border p-3"><span className="text-muted-foreground">Fix Now</span><div className="text-xl font-semibold mt-1">{metrics.fixNow}</div></div>
          <div className="rounded-md border p-3"><span className="text-muted-foreground">Under Review</span><div className="text-xl font-semibold mt-1">{metrics.review}</div></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <Button key={value} size="sm" variant={filter === value ? "default" : "outline"} onClick={() => setFilter(value)}>
            {value === "ACTIVE" ? "Active" : value === "FIX_NOW" ? "Fix Now" : value === "REVIEW" ? "Review" : value === "IGNORED" ? "Ignored" : "All"}
          </Button>
        ))}
      </div>

      <DataTable columns={columns} rows={rows} loading={isLoading} emptyLabel="No prioritized recommendations yet. Completed autonomous audits will populate this queue." />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title || "Improvement recommendation"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm max-h-[65vh] overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                <Badge>{Math.round(Number(selected.priorityScore || 0))} priority</Badge>
                <Badge variant="outline">{selected.category}</Badge>
                <Badge variant="outline">Impact {selected.impactScore}</Badge>
                <Badge variant="outline">Effort {selected.effortScore}</Badge>
                <Badge variant={Number(selected.riskScore) >= 4 ? "destructive" : "outline"}>Risk {selected.riskScore}</Badge>
                <Badge variant="outline">Confidence {Math.round(Number(selected.confidence || 0))}%</Badge>
              </div>
              <div><h4 className="font-semibold mb-1">Recommendation</h4><p className="text-muted-foreground whitespace-pre-wrap">{selected.description}</p></div>
              <div><h4 className="font-semibold mb-1">Evidence</h4><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{(selected.evidence || []).map((item, i) => <li key={i}>{item}</li>)}</ul></div>
              <div><h4 className="font-semibold mb-1">Suggested next actions</h4><ul className="list-disc pl-5 space-y-1 text-muted-foreground">{(selected.nextActions || []).map((item, i) => <li key={i}>{item}</li>)}</ul></div>
              <div className="text-xs text-muted-foreground">Seen {selected.occurrenceCount || 1} time(s) · Sources: {(selected.sourceChangeIds || []).join(", ") || "—"}</div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => selected && decide.mutate({ row: selected, decision: "IGNORE" })}>Ignore</Button>
            <Button variant="outline" onClick={() => selected && decide.mutate({ row: selected, decision: "REVIEW" })}>Review</Button>
            <Button onClick={() => selected && decide.mutate({ row: selected, decision: "FIX_NOW" })}>Fix Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
