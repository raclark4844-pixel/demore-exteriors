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
  PR_OPEN: "default",
  PREVIEW_READY: "default",
  QA_PASSED: "default",
  AWAITING_OWNER_PRODUCTION: "outline",
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
          ? "GitHub connection and repo baseline are ready for branch/PR staging."
          : data?.status === "NEEDS_REPO_SYNC"
            ? "GitHub is connected, but the repo still needs a complete Base44 source sync."
            : data?.status === "NEEDS_GITHUB_CONNECTION"
              ? "Authorize the GitHub connector before staging can continue."
              : `Status: ${data?.status || "checked"}`,
      });
    },
    onError: (error) => toast({ title: "Staging preflight failed", description: error.message, variant: "destructive" }),
  });

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
      key: "previewUrl",
      label: "Preview",
      render: (r) => r.previewUrl ? <a className="underline" href={r.previewUrl} target="_blank" rel="noreferrer">Open preview</a> : "—",
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
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => recheck.mutate(r)} disabled={recheck.isPending}>
          {recheck.isPending ? "Checking…" : "Recheck"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-heading font-semibold">Controlled Staging</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Approved Fix Now items stop here before production. Staging verifies the GitHub connection and repo baseline first,
          then the next phase creates a branch, pull request, Vercel preview, QA result, and a separate owner production gate.
        </p>
      </div>
      <DataTable columns={columns} rows={stages} loading={isLoading} emptyLabel="No staged website changes yet. Approve a Fix Now planning package to create one." />
    </div>
  );
}
