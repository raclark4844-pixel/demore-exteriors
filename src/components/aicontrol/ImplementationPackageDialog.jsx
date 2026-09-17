import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";

const fromRecord = (impl) => ({
  filesAffected: (impl.filesAffected || []).join("\n"),
  requirements: (impl.requirements || []).join("\n"),
  protectedItems: (impl.protectedItems || []).join("\n"),
  acceptanceTests: (impl.acceptanceTests || []).join("\n"),
  rollbackPlan: impl.rollbackPlan || "",
});
const toLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

function PackageField({ label, id, value, onChange }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={onChange} rows={3} placeholder="One item per line" />
    </div>
  );
}

export default function ImplementationPackageDialog({ impl }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(() => fromRecord(impl));
  const queryClient = useQueryClient();

  useEffect(() => {
    setForm(fromRecord(impl));
  }, [impl.updated_date]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    setBusy(true);
    try {
      await base44.entities.ImplementationQueue.update(impl.id, {
        filesAffected: toLines(form.filesAffected),
        requirements: toLines(form.requirements),
        protectedItems: toLines(form.protectedItems),
        acceptanceTests: toLines(form.acceptanceTests),
        rollbackPlan: form.rollbackPlan,
      });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: "Package saved" });
      setOpen(false);
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const packageText = [
    "DEMORE IMPLEMENTATION PACKAGE — FOR BASE44",
    `Change ID: ${impl.changeId}`,
    `Job: ${impl.jobId || "—"}`,
    `Objective: ${impl.objective}`,
    `Approved By: ${impl.approvedBy || "—"}`,
    `Status: ${impl.status}`,
    "",
    "Files expected to change:",
    form.filesAffected || "(none listed)",
    "",
    "Requirements:",
    form.requirements || "(none listed)",
    "",
    "Protected items (must not touch):",
    form.protectedItems || "(none)",
    "",
    "Acceptance tests:",
    form.acceptanceTests || "(none)",
    "",
    `Rollback plan: ${form.rollbackPlan || "(none)"}`,
  ].join("\n");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Package</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Implementation Package</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <PackageField label="Files expected to change" id="filesAffected" value={form.filesAffected} onChange={set("filesAffected")} />
          <PackageField label="Requirements" id="requirements" value={form.requirements} onChange={set("requirements")} />
          <PackageField label="Protected items (must not touch)" id="protectedItems" value={form.protectedItems} onChange={set("protectedItems")} />
          <PackageField label="Acceptance tests" id="acceptanceTests" value={form.acceptanceTests} onChange={set("acceptanceTests")} />
          <div className="grid gap-2">
            <Label htmlFor="rollbackPlan">Rollback plan</Label>
            <Textarea id="rollbackPlan" value={form.rollbackPlan} onChange={set("rollbackPlan")} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard?.writeText(packageText);
              toast({ title: "Package copied for Base44" });
            }}
          >
            Copy for Base44
          </Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}