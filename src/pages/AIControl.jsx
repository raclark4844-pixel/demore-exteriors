import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import useSEO from "@/hooks/useSEO";
import StatusOverview from "@/components/aicontrol/StatusOverview";
import AgentsPanel from "@/components/aicontrol/AgentsPanel";
import JobsPanel from "@/components/aicontrol/JobsPanel";
import HandoffsPanel from "@/components/aicontrol/HandoffsPanel";
import ApprovalsPanel from "@/components/aicontrol/ApprovalsPanel";
import ImplementationsPanel from "@/components/aicontrol/ImplementationsPanel";
import ConflictsPanel from "@/components/aicontrol/ConflictsPanel";
import AuditPanel from "@/components/aicontrol/AuditPanel";
import KnowledgePanel from "@/components/aicontrol/KnowledgePanel";
import LocksPanel from "@/components/aicontrol/LocksPanel";
import ProvidersPanel from "@/components/aicontrol/ProvidersPanel";
import RolesPanel from "@/components/aicontrol/RolesPanel";
import AILogsPanel from "@/components/aicontrol/AILogsPanel";
import AutonomousAuditsPanel from "@/components/aicontrol/AutonomousAuditsPanel";
import ImprovementPriorityPanel from "@/components/aicontrol/ImprovementPriorityPanel";
import StagedChangesPanel from "@/components/aicontrol/StagedChangesPanel";

const SECTIONS = [
  ["status", "System Status"],
  ["autonomous-audits", "Autonomous Audits"],
  ["improvements", "Improvement Queue"],
  ["staged-changes", "Staged Changes"],
  ["providers", "AI Providers"],
  ["roles", "Specialist Roles"],
  ["jobs", "Job Queue"],
  ["handoffs", "Handoffs"],
  ["approvals", "Approvals"],
  ["implementations", "Implementation Queue"],
  ["conflicts", "Conflicts"],
  ["logs", "AI Request Log"],
  ["audit", "Audit History"],
  ["knowledge", "Shared Knowledge"],
  ["locks", "System Locks"],
];

export default function AIControl() {
  useSEO({
    title: "AI Control — Demore Internal",
    description: "Internal multi-agent orchestration control panel.",
    canonical: "/ops/ai-control",
    noIndexFollow: true,
  });
  const [me, setMe] = useState("loading");
  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setMe(u?.role || "none"))
      .catch(() => setMe("none"));
  }, []);

  if (me === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Checking access…</div>
    );
  }
  if (me !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <ShieldAlert className="w-10 h-10 text-destructive" />
        <h1 className="text-2xl font-heading font-bold">Staff access only</h1>
        <p className="text-muted-foreground text-sm">This control panel is restricted to Demore administrators.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-widest text-primary font-heading font-semibold mb-1">Internal · Staff Only</p>
          <h1 className="text-3xl font-heading font-bold">AI Orchestration Control</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Central operating system for the Demore multi-agent network. Phase 4: live multi-AI providers, cross-agent review, conflict detection, and controlled implementation.
          </p>
        </header>
        <Tabs defaultValue="status">
          <TabsList className="flex flex-wrap h-auto gap-1">
            {SECTIONS.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="status" className="mt-4"><StatusOverview /></TabsContent>
          <TabsContent value="autonomous-audits" className="mt-4"><AutonomousAuditsPanel /></TabsContent>
          <TabsContent value="improvements" className="mt-4"><ImprovementPriorityPanel /></TabsContent>
          <TabsContent value="staged-changes" className="mt-4"><StagedChangesPanel /></TabsContent>
          <TabsContent value="providers" className="mt-4"><ProvidersPanel /></TabsContent>
          <TabsContent value="roles" className="mt-4"><RolesPanel /></TabsContent>
          <TabsContent value="agents" className="mt-4"><AgentsPanel /></TabsContent>
          <TabsContent value="jobs" className="mt-4"><JobsPanel /></TabsContent>
          <TabsContent value="handoffs" className="mt-4"><HandoffsPanel /></TabsContent>
          <TabsContent value="approvals" className="mt-4"><ApprovalsPanel /></TabsContent>
          <TabsContent value="implementations" className="mt-4"><ImplementationsPanel /></TabsContent>
          <TabsContent value="conflicts" className="mt-4"><ConflictsPanel /></TabsContent>
          <TabsContent value="logs" className="mt-4"><AILogsPanel /></TabsContent>
          <TabsContent value="audit" className="mt-4"><AuditPanel /></TabsContent>
          <TabsContent value="knowledge" className="mt-4"><KnowledgePanel /></TabsContent>
          <TabsContent value="locks" className="mt-4"><LocksPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}