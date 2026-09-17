import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAutonomousAuditConfig, useWebsiteAuditRuns } from "@/hooks/useAIControlData";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";

const STATUS_VARIANTS = {
  COMPLETED: "default",
  RUNNING: "outline",
  CREATED: "outline",
  REJECTED: "destructive",
  BLOCKED: "destructive",
  FAILED: "destructive",
  SKIPPED: "outline",
};

const columns = [
  { key: "auditRunId", label: "Audit Run" },
  { key: "profileTitle", label: "Specialist Audit" },
  {
    key: "status",
    label: "Status",
    render: (r) => <Badge variant={STATUS_VARIANTS[r.status] || "outline"}>{r.status || "—"}</Badge>,
  },
  { key: "changeId", label: "Change ID" },
  {
    key: "startedAt",
    label: "Started",
    render: (r) => (r.startedAt ? new Date(r.startedAt).toLocaleString() : "—"),
  },
  {
    key: "completedAt",
    label: "Completed",
    render: (r) => (r.completedAt ? new Date(r.completedAt).toLocaleString() : "—"),
  },
  {
    key: "resultSummary",
    label: "Summary",
    className: "min-w-[320px] max-w-[520px]",
    render: (r) => <span className="text-xs">{r.resultSummary || "Audit is still processing."}</span>,
  },
];

export default function AutonomousAuditsPanel() {
  const queryClient = useQueryClient();
  const { data: configs, isLoading: configLoading } = useAutonomousAuditConfig();
  const { data: runs, isLoading: runsLoading } = useWebsiteAuditRuns();
  const config = configs?.find((c) => c.configId === "DEFAULT") || configs?.[0];

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["ai-control"] });

  const toggle = useMutation({
    mutationFn: async () => {
      if (!config) throw new Error("Autonomous audit configuration is not available.");
      return base44.entities.AutonomousAuditConfig.update(config.id, { enabled: !config.enabled });
    },
    onSuccess: () => {
      refresh();
      toast({
        title: config?.enabled ? "Autonomous audits paused" : "Autonomous audits resumed",
        description: config?.enabled
          ? "Scheduled audits will not create new jobs until resumed."
          : "Weekday audit rotation is active again.",
      });
    },
    onError: (error) => toast({ title: "Could not update audit schedule", description: error.message, variant: "destructive" }),
  });

  const runNow = useMutation({
    mutationFn: () => base44.functions.invoke("runAutonomousWebsiteAudit", {}),
    onSuccess: (response) => {
      refresh();
      const data = response?.data || response;
      toast({
        title: "Autonomous audit queued",
        description: data?.profileTitle ? `${data.profileTitle} is running under ${data.changeId}.` : "The next audit profile is running.",
      });
    },
    onError: (error) => toast({ title: "Audit could not start", description: error.message, variant: "destructive" }),
  });

  if (configLoading) return <div className="text-sm text-muted-foreground">Loading autonomous audit controls…</div>;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-semibold">Autonomous Website Audits</h3>
              <Badge variant={config?.enabled ? "default" : "outline"}>{config?.enabled ? "ACTIVE" : "PAUSED"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Advisory-only specialist audits. Findings go through QA and cannot directly modify the production website.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toggle.mutate()} disabled={toggle.isPending || !config}>
              {toggle.isPending ? "Updating…" : config?.enabled ? "Pause Audits" : "Resume Audits"}
            </Button>
            <Button size="sm" onClick={() => runNow.mutate()} disabled={runNow.isPending || config?.enabled === false}>
              {runNow.isPending ? "Queuing…" : "Run Next Audit Now"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div><span className="text-muted-foreground">Schedule</span><div className="font-medium mt-1">{config?.scheduleDescription || "Weekdays at 6:30 AM Eastern"}</div></div>
          <div><span className="text-muted-foreground">Rotation</span><div className="font-medium mt-1">11 website specialist profiles</div></div>
          <div><span className="text-muted-foreground">Last profile</span><div className="font-medium mt-1">{config?.lastProfileId || "Not run yet"}</div></div>
          <div><span className="text-muted-foreground">Last status</span><div className="font-medium mt-1">{config?.lastRunStatus || "Not run yet"}</div></div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="font-heading font-semibold">Recent Audit Runs</h3>
          <p className="text-xs text-muted-foreground">
            Rotation: SEO, GEO, AEO, CRO, UX, performance, schema, lead generation, chatbot, content, and analytics.
          </p>
        </div>
        <DataTable columns={columns} rows={runs} loading={runsLoading} emptyLabel="No autonomous audit runs yet." />
      </div>
    </div>
  );
}