import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ApprovalResponse() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const initialDecision = (params.get("decision") || "APPROVED").toUpperCase() === "REJECTED" ? "REJECTED" : "APPROVED";
  const [decision, setDecision] = useState(initialDecision);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const actionLabel = useMemo(() => decision === "APPROVED" ? "Approve" : "Reject", [decision]);

  const submit = async () => {
    if (!token || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await base44.functions.invoke("decideApprovalFromEmail", { token, decision, comment });
      setResult(response?.data || response);
    } catch (e) {
      const message = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Unable to record this decision.";
      setError(String(message));
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    const waiting = result.status === "AWAITING_ADDITIONAL_APPROVAL";
    const rejected = result.status === "REJECTED";
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl">
          <CardHeader className="text-center">
            {rejected ? <XCircle className="w-12 h-12 text-red-600 mx-auto mb-2" /> : <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />}
            <CardTitle>{rejected ? "Change rejected" : waiting ? "Approval recorded" : "Approval complete"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">Change ID: <strong>{result.changeId || "—"}</strong></p>
            {waiting && <p className="text-sm">Your approval was recorded. Check AI Control for the current workflow status.</p>}
            {!waiting && !rejected && <p className="text-sm">The human approval gate is satisfied. This does not itself publish or merge a production website change.</p>}
            {rejected && <p className="text-sm">The workflow has been stopped at the human approval gate.</p>}
            <p className="text-xs text-muted-foreground">You can close this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-600 mb-2"><ShieldCheck className="w-5 h-5" /><span className="text-xs font-semibold uppercase tracking-wider">Demore AI Control</span></div>
          <CardTitle>Confirm human approval decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {!token ? (
            <p className="text-sm text-red-600">This approval link is missing its secure token.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant={decision === "APPROVED" ? "default" : "outline"} onClick={() => setDecision("APPROVED")}>Approve</Button>
                <Button type="button" variant={decision === "REJECTED" ? "destructive" : "outline"} onClick={() => setDecision("REJECTED")}>Reject</Button>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Optional comment</label>
                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} placeholder="Example: Approved after reviewing the preview, or rejected because canonical URLs must not change." />
              </div>
              <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                Opening this page does not approve anything. The decision is recorded only after you press the confirmation button below.
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={submit} disabled={busy} variant={decision === "REJECTED" ? "destructive" : "default"} className="w-full">
                {busy ? "Recording decision…" : `Confirm ${actionLabel}`}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}