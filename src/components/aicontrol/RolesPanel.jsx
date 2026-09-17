import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import DataTable from "./DataTable";
import { useRoles } from "@/hooks/useAIControlData";

const selectCls = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";
const PROVIDERS = ["XAI", "OPENAI", "ANTHROPIC", "BASE44"];

function EditRoleDialog({ role }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    provider: role.provider || "XAI",
    model: role.model || "",
    fallbackProvider: role.fallbackProvider || "BASE44",
    enabled: role.enabled !== false ? "true" : "false",
    riskCeiling: role.riskCeiling || "HIGH",
    systemPrompt: role.systemPrompt || "",
  });
  const queryClient = useQueryClient();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = useMutation({
    mutationFn: async () =>
      base44.entities.AISpecialistRole.update(role.id, {
        provider: form.provider,
        model: form.model,
        fallbackProvider: form.fallbackProvider,
        enabled: form.enabled === "true",
        riskCeiling: form.riskCeiling,
        systemPrompt: form.systemPrompt,
      }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: `Updated ${role.roleId}` });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Configure</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure — {role.roleTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Provider</Label>
            <select className={selectCls} value={form.provider} onChange={set("provider")}>
              {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" value={form.model} onChange={set("model")} placeholder="e.g. grok-4.6" />
          </div>
          <div className="grid gap-2">
            <Label>Fallback provider</Label>
            <select className={selectCls} value={form.fallbackProvider} onChange={set("fallbackProvider")}>
              {["", ...PROVIDERS].map((p) => <option key={p || "none"} value={p}>{p || "None"}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Enabled</Label>
              <select className={selectCls} value={form.enabled} onChange={set("enabled")}>
                <option value="true">On</option>
                <option value="false">Off</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Risk ceiling</Label>
              <select className={selectCls} value={form.riskCeiling} onChange={set("riskCeiling")}>
                {["LOW", "MEDIUM", "HIGH"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="systemPrompt">System prompt</Label>
            <Textarea id="systemPrompt" value={form.systemPrompt} onChange={set("systemPrompt")} rows={6} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save.mutate} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns = [
  { key: "roleId", label: "Role" },
  { key: "roleTitle", label: "Title" },
  { key: "provider", label: "Provider" },
  { key: "model", label: "Model" },
  {
    key: "enabled",
    label: "Enabled",
    render: (r) => <Badge variant={r.enabled !== false ? "default" : "outline"}>{r.enabled !== false ? "ON" : "OFF"}</Badge>,
  },
  { key: "riskCeiling", label: "Risk Ceiling" },
  {
    key: "stats",
    label: "Success / Errors",
    render: (r) => `${r.successCount || 0} / ${r.errorCount || 0}`,
  },
  {
    key: "avg",
    label: "Avg Response",
    render: (r) =>
      r.totalResponseMs ? `${Math.round((r.totalResponseMs || 0) / Math.max(r.successCount || 0, 1))} ms` : "—",
  },
  { key: "actions", label: "Configure", className: "max-w-none", render: (r) => <EditRoleDialog role={r} /> },
];

export default function RolesPanel() {
  const { data: roles, isLoading } = useRoles();
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Each specialist role runs on its configured live provider and model, with automatic fallback and per-role
        review requirements. Change providers, models, prompts, and limits here — no code changes needed.
      </p>
      <DataTable columns={columns} rows={roles} loading={isLoading} emptyLabel="No roles configured." />
    </div>
  );
}