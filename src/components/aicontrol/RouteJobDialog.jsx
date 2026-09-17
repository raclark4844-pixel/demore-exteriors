import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { routeJob } from "@/lib/orchestration";
import { useAgents } from "@/hooks/useAIControlData";

export default function RouteJobDialog({ job }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ toAgent: "", reason: "", request: "" });
  const { data: agents } = useAgents();
  const queryClient = useQueryClient();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    try {
      await routeJob(job, form);
      setOpen(false);
      setForm({ toAgent: "", reason: "", request: "" });
      queryClient.invalidateQueries({ queryKey: ["ai-control"] });
      toast({ title: `Job routed to ${form.toAgent}` });
    } catch (e) {
      toast({ title: "Routing failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Route</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route Job to Specialist</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Specialist</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={form.toAgent}
              onChange={set("toAgent")}
            >
              <option value="">— select agent —</option>
              {(agents || []).map((a) => <option key={a.agentId} value={a.agentId}>{a.agentId}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" value={form.reason} onChange={set("reason")} placeholder="Why this agent" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="request">Request</Label>
            <Input id="request" value={form.request} onChange={set("request")} placeholder="What you're asking them to do" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy || !form.toAgent}>{busy ? "Routing…" : "Route Job"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}