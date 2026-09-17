import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable from "./DataTable";
import { useProviders } from "@/hooks/useAIControlData";

const AUTH_VARIANTS = { CONNECTED: "default", MISSING_KEY: "outline", ERROR: "destructive" };

const columns = [
  { key: "providerId", label: "Provider" },
  { key: "providerName", label: "Name" },
  { key: "status", label: "Status" },
  {
    key: "authStatus",
    label: "Auth",
    render: (r) => <Badge variant={AUTH_VARIANTS[r.authStatus] || "outline"}>{r.authStatus || "—"}</Badge>,
  },
  { key: "defaultModel", label: "Default Model" },
  { key: "fallbackProvider", label: "Fallback" },
  {
    key: "lastSuccessAt",
    label: "Last Success",
    render: (r) => (r.lastSuccessAt ? new Date(r.lastSuccessAt).toLocaleString() : "—"),
  },
  {
    key: "lastError",
    label: "Last Error",
    render: (r) => <span className="text-xs text-destructive">{r.lastError || "—"}</span>,
  },
];

export default function ProvidersPanel() {
  const { data: providers, isLoading } = useProviders();
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        API keys live server-side only and never reach the browser. Grok is live; add OpenAI/Anthropic keys in
        Secrets to activate those providers. When a provider fails, roles fall back automatically — a provider
        failure is never treated as an approval.
      </p>
      <DataTable columns={columns} rows={providers} loading={isLoading} emptyLabel="No providers registered." />
    </div>
  );
}