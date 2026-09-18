import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {base44} from "@/api/base44Client";
import {Button} from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useKnowledge } from "@/hooks/useAIControlData";

const columns = [
  { key: "category", label: "Category" },
  { key: "subject", label: "Subject" },
  {
    key: "verificationStatus",
    label: "Verification",
    render: (r) => (
      <Badge variant={r.verificationStatus === "VERIFIED" ? "default" : r.verificationStatus === "DISPUTED" ? "destructive" : "outline"}>
        {r.verificationStatus || "UNVERIFIED"}
      </Badge>
    ),
  },
  { key: "verifiedBy", label: "Verified By" },
  { key: "source", label: "Source" },
  {
    key: "validUntil",
    label: "Valid Until",
    render: (r) => (r.validUntil ? new Date(r.validUntil).toLocaleDateString() : "—"),
  },
];

export default function KnowledgePanel() {
  const { data: knowledge, isLoading } = useKnowledge();
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const {data:refreshes=[],refetch}=useQuery({queryKey:["knowledge-refresh"],queryFn:()=>base44.entities.KnowledgeRefresh.list("-created_date",20)});
  const {data:deliveries=[]}=useQuery({queryKey:["owner-notification-status"],queryFn:()=>base44.entities.EmailDeliveryLog.list("-created_date",5),refetchInterval:10000});
  const latest=refreshes[0];
  const lastSuccess=refreshes.find(r=>r.status==="success");
  async function run(name) {
    setBusy(true);setNotice("");
    try {
      const {data}=await base44.functions.invoke(name,{});
      setNotice(name==="refreshPublicKnowledge"
        ? (data.success?"Public page refresh completed.":"Some public page content could not be read. Previous knowledge was retained.")
        : name==="sendOwnerNotificationTest" ? (data.duplicate?"The labeled test was already sent.":"Labeled test accepted by the email provider; delivery still needs verification.") : "Pending notifications processed. Check delivery records for results.");
      await refetch();
    } catch {setNotice("The operation failed. Existing knowledge and saved intakes are retained.");}
    finally {setBusy(false);}
  }
  return (
    <div className="space-y-2">
      <div className="rounded border p-3 space-y-2">
        <p className="text-sm">Website feature catalog: September 17, 2026. Separate Grok phone/chat synchronization is not yet verified.</p>
        <p className="text-sm">Public page refresh: {latest ? latest.status+" · "+latest.version : "Not run"}. Last complete refresh: {lastSuccess?.last_success_at ? new Date(lastSuccess.last_success_at).toLocaleString() : "Not yet completed"}.</p>
        {latest?.pages_failed>0 && <p className="text-xs text-muted-foreground">{latest.pages_failed} public pages could not be read. Existing page knowledge was preserved.</p>}
        {deliveries[0] && <p className="text-sm">Latest owner notification: {deliveries[0].provider_status} · {deliveries[0].subject}</p>}
        <div className="flex gap-2 flex-wrap">
          <Button disabled={busy} variant="outline" onClick={()=>run("refreshPublicKnowledge")}>Refresh public pages</Button>
          <Button disabled={busy} variant="outline" onClick={()=>run("retryOwnerNotifications")}>Retry pending owner emails</Button>
          <Button disabled={busy} variant="outline" onClick={()=>run("sendOwnerNotificationTest")}>Send owner notification test</Button>
        </div>
        {notice && <p role="status" className="text-sm">{notice}</p>}
      </div>
      <p className="text-xs text-muted-foreground">Agents may never mark an unverified fact as VERIFIED — only staff can.</p>
      <DataTable columns={columns} rows={knowledge} loading={isLoading} emptyLabel="No shared knowledge recorded yet." />
    </div>
  );
}