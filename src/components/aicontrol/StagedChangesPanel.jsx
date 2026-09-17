import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useStagedWebsiteChanges } from "@/hooks/useAIControlData";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";

const STATUS_VARIANTS = {
  READY_TO_STAGE: "default",
  STAGING: "outline",
  PR_OPEN: "default",
  PREVIEW_READY: "default",
  QA_PASSED: "default",
  AWAITING_OWNER_PRODUCTION: "outline",
  APPROVED_FOR_PRODUCTION: "default",
  NEEDS_GITHUB_CONNECTION: "outline",
  NEEDS_REPO_SYNC: "outline",
  BLOCKED: "destructive",
  FAILED: "destructive",
};

export default function StagedChangesPanel() {
  const queryClient = useQueryClient();
  const { data: stages, isLoading } = useStagedWebsiteChanges();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["ai-control"] });

  const recheck = useMutation({
    mutationFn: (row) => base44.functions.invoke("prepareStagedWebsiteChange", { change_id: row.changeId }),
    onSuccess: (response) => {
      refresh();
      const data = response?.data || response;
      toast({
        title: "Staging preflight checked",
        description: data?.status === "READY_TO_STAGE"
          ? "GitHub and the repository baseline are ready. Automatic branch/PR staging will start."
          : data?.status === "NEEDS_REPO_SYNC"
            ? "GitHub is connected, but the repository still needs a complete Base44 source sync."
            : data?.status === "NEEDS_GITHUB_CONNECTION"
              ? "Authorize the GitHub connector before staging can continue."
              : `Status: ${data?.status || "checked"}`,
      });
    },
    onError: (error) => toast({ title: "Staging preflight failed", description: error.message, variant: "destructive" }),
  });

  const stageNow = useMutation({
    mutationFn: (row) => base44.functions.invoke("stageApprovedWebsiteChange", { staged_change_id: row.id }),
    onSuccess: (response) => {
      refresh();
      const data = response?.data || response;
      toast({
        title: data?.status === "PR_OPEN" ? "Staging pull request created" : "Staging checked",
        description: data?.pullRequestNumber
          ? `PR #${data.pullRequestNumber} is open. Vercel preview and automated QA are next.`
          : `Status: ${data?.status || "checked"}`,
      });
    },
    onError: (error) => toast({ title: "Could not create staging PR", description: error.message, variant: "destructive" }),
  });

  const monitor = useMutation({
    mutationFn: (row) => base44.functions.invoke("monitorStagedWebsiteChanges", { staged_change_id: row.id }),
    onSuccess: (response) => {
      refresh();
      const data = response?.data || response;
      const result = data?.results?.[0];
      toast({
        title: result?.status === "AWAITING_OWNER_PRODUCTION" ? "Preview QA passed" : "Preview/QA checked",
        description: result?.status === "AWAITING_OWNER_PRODUCTION"
          ? "The Vercel build and code/diff QA passed. A separate owner production approval is now required."
          : `Status: ${result?.status || data?.status || "checked"}`,
      });
    },
    onError: (error) => toast({ title: "Preview/QA check failed", description: error.message, variant: "destructive" }),
  });

  const approveProduction = useMutation({
    mutationFn: async (row) => {
      const confirmed = window.confirm(
        "Approve this QA-passed staging preview for controlled Base44 production implementation? This does NOT publish the site or merge the GitHub PR."
      );
      if (!confirmed) return { cancelled: true };
      return base44.functions.invoke("approveStagedWebsiteChange", { staged_change_id: row.id, confirm: true });
    },
    onSuccess: (response) => {
      const data = response?.data || response;
      if (data?.cancelled) return;
      refresh();
      toast({
        title: "Approved for controlled production implementation",
        description: "Approval is recorded. Nothing was published or merged automatically.",
      });
    },
    onError: (error) => toast({ title: "Production approval failed", description: error.message, variant: "destructive" }),
  });

  const anyBusy = recheck.isPending || stageNow.isPending || monitor.isPending || approveProduction.isPending;

  const columns = [
    { key: "stageId", label: "Stage" },
    { key: "changeId", label: "Change ID" },
    {
      key: "status",
      label: "Status",
      render: (r) => <Badge variant={STATUS_VARIANTS[r.status] || "outline"}>{r.status || "—"}</Badge>,
    },
    { key: "repository", label: "Repository" },
    { key: "stageBranch", label: "Branch" },
    {
      key: "pullRequestUrl",
      label: "PR",
      render: (r) => r.pullRequestUrl ? <a className="underline" href={r.pullRequestUrl} target="_blank" rel="noreferrer">PR #{r.pullRequestNumber || ""}</a> : "—",
    },
    {
      key: "previewUrl",
      label: "Preview",
      render: (r) => r.previewUrl ? <a className="underline" href={r.previewUrl} target="_blank" rel="noreferrer">Open preview</a> : (r.previewStatus || "—"),
    },
    {
      key: "qaVerdict",
      label: "QA",
      render: (r) => <Badge variant={r.qaVerdict === "APPROVED" ? "default" : r.qaVerdict === "BLOCKED" ? "destructive" : "outline"}>{r.qaVerdict || "—"}</Badge>,
    },
    {
      key: "stagingReport",
      label: "Report",
      className: "min-w-[360px] max-w-[560px]",
      render: (r) => <span className="text-xs whitespace-normal">{r.stagingReport || r.error || "—"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "max-w-none",
      render: (r) => (
        <div className="flex gap-1">
          {["NEEDS_GITHUB_CONNECTION", "NEEDS_REPO_SYNC", "CREATED"].includes(r.status) && (
            <Button size="sm" variant="outline" onClick={() => recheck.mutate(r)} disabled={anyBusy}>Recheck</Button>
          )}
          {r.status === "READY_TO_STAGE" && (
            <Button size="sm" onClick={() => stageNow.mutate(r)} disabled={anyBusy}>Stage Now</Button>
          )}
          {["PR_OPEN", "PREVIEW_READY"].includes(r.status) && (
            <Button size="sm" variant="outline" onClick={() => monitor.mutate(r)} disabled={anyBusy}>Check Preview & QA</Button>
          )}
          {r.status === "AWAITING_OWNER_PRODUCTION" && (
            <Button size="sm" onClick={() => approveProduction.mutate(r)} disabled={anyBusy}>Approve Production</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-heading font-semibold">Controlled Staging</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Fix Now packages can automatically become a bounded GitHub branch and pull request after the first owner gate.
          Vercel build status and code/diff QA are checked before a separate owner production approval. GitHub PRs are not auto-merged,
          and Base44 production is never auto-published from this screen.
        </p>
      </div>
      <DataTable columns={columns} rows={stages} loading={isLoading} emptyLabel="No staged website changes yet. Approve a Fix Now planning package to create one." />
    </div>
  );
}
