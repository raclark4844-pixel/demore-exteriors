import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { submitResult } from "@/lib/orchestration";

const selectCls = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";
const emptyForm = { resultType: "FINDING", summary: "", confidence: "", recommendations: "", evidence: "", risks: "", nextActions: "" };

function ResultField({ label, id, value, onChange }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={onChange} rows={2} placeholder="One item per line" />
    </div>
  );
}

export default function SubmitResultDialog({ job }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const queryClient = useQueryClient();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    try {
      await submitResult(job, form);
      setOpen(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: "Result saved to database" });
    } catch (e) {
      toast({ title: "Could not save result", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Result</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Submit Specialist Result</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="resultType">Type</Label>
              <select id="resultType" className={selectCls} value={form.resultType} onChange={set("resultType")}>
                {["FINDING", "ANALYSIS", "RECOMMENDATION", "VALIDATION"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confidence">Confidence (0–100)</Label>
              <Input id="confidence" type="number" min="0" max="100" value={form.confidence} onChange={set("confidence")} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" value={form.summary} onChange={set("summary")} rows={3} />
          </div>
          <ResultField label="Recommendations" id="recommendations" value={form.recommendations} onChange={set("recommendations")} />
          <ResultField label="Evidence" id="evidence" value={form.evidence} onChange={set("evidence")} />
          <ResultField label="Risks" id="risks" value={form.risks} onChange={set("risks")} />
          <ResultField label="Next actions" id="nextActions" value={form.nextActions} onChange={set("nextActions")} />
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !form.summary}>{busy ? "Saving…" : "Submit Result"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}