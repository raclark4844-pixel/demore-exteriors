import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

const PRIORITY_STYLES = {
  urgent_leak: "bg-red-500/15 text-red-400 border-red-500/40",
  adjuster_on_site: "bg-orange-500/15 text-orange-400 border-orange-500/40",
  hot_insurance: "bg-amber-500/15 text-amber-400 border-amber-500/40",
  standard: "bg-sky-500/15 text-sky-400 border-sky-500/40",
  after_hours_faq: "bg-slate-500/15 text-slate-400 border-slate-500/40",
  existing_message: "bg-violet-500/15 text-violet-400 border-violet-500/40"
};
const STATUSES = ["new", "contacted", "scheduled", "closed"];

export default function Ops() {
  const { user, isLoadingAuth } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const items = await base44.entities.Lead.list("-created_date", 200);
      setLeads(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const updateStatus = async (id, status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await base44.entities.Lead.update(id, { status });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-xl font-heading font-bold mb-2">Staff access only</h1>
          <p className="text-sm text-muted-foreground mb-4">
            This page is restricted to Demore staff accounts.
          </p>
          <Link to="/">
            <Button variant="outline">Back to the site</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">Lead Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Virtual Receptionist leads — chats and calls.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadLeads} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" /> Site
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm font-heading font-bold text-muted-foreground">Internal tools:</span>
          <Link to="/market-research">
            <Button variant="outline" size="sm">Market Research</Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="sm">Products Index</Button>
          </Link>
          <Link to="/daily-facts">
            <Button variant="outline" size="sm">Daily Facts Archive</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading leads...</p>
        ) : leads.length === 0 ? (
          <p className="text-muted-foreground text-sm">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/40 text-left">
                  <th className="p-3 font-heading font-bold">Received</th>
                  <th className="p-3 font-heading font-bold">Name</th>
                  <th className="p-3 font-heading font-bold">Phone</th>
                  <th className="p-3 font-heading font-bold">City / County</th>
                  <th className="p-3 font-heading font-bold">Intent</th>
                  <th className="p-3 font-heading font-bold">Priority</th>
                  <th className="p-3 font-heading font-bold">Notes</th>
                  <th className="p-3 font-heading font-bold">Channels</th>
                  <th className="p-3 font-heading font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border/50 align-top">
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {new Date(lead.created_date).toLocaleString("en-US", {
                        timeZone: "America/New_York"
                      })}
                    </td>
                    <td className="p-3 font-medium">{lead.fullName || "—"}</td>
                    <td className="p-3 whitespace-nowrap">
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                          data-allow-tel
                          className="text-primary hover:underline"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3">
                      {[lead.city, lead.county].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="p-3">{lead.intent || "—"}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium ${
                          PRIORITY_STYLES[lead.priority] || PRIORITY_STYLES.standard
                        }`}
                      >
                        {(lead.priority || "standard").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs">{lead.notes || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">
                      {(lead.channelTrail || [])
                        .map((c) => (c.endsWith("call") ? "Call" : "Chat"))
                        .join(" → ") || "—"}
                    </td>
                    <td className="p-3">
                      <select
                        value={lead.status || "new"}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="bg-secondary/50 border border-border rounded-md px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}