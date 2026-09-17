import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import {
  ArrowLeft, Target, TrendingUp, MapPin, Layers, Loader2,
  ArrowRight, AlertCircle, CheckCircle2, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const PRIORITY_COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#64748b",
};

const PRIORITY_STYLES = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

import useNoIndex from "@/hooks/useNoIndex";

export default function SEOSummary() {
  useNoIndex();
  const { data: targets, isLoading } = useQuery({
    queryKey: ["seoTargets"],
    queryFn: () => base44.entities.SEOTarget.list(),
  });

  const list = targets || [];

  // Aggregate data
  const byPriority = ["High", "Medium", "Low"].map((p) => ({
    name: p,
    value: list.filter((t) => t.priority === p).length,
    color: PRIORITY_COLORS[p],
  }));

  const byAreaMap = {};
  list.forEach((t) => {
    const area = t.county_area || "Unspecified";
    byAreaMap[area] = (byAreaMap[area] || 0) + 1;
  });
  const byArea = Object.entries(byAreaMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const byTypeMap = {};
  list.forEach((t) => {
    const type = t.target_type || "Unspecified";
    byTypeMap[type] = (byTypeMap[type] || 0) + 1;
  });
  const byType = Object.entries(byTypeMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const highPriority = list
    .filter((t) => t.priority === "High")
    .sort((a, b) => (a.county_area || "").localeCompare(b.county_area || ""));

  const total = list.length;
  const highCount = byPriority[0].value;
  const mediumCount = byPriority[1].value;
  const lowCount = byPriority[2].value;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link to="/market-research">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">SEO Growth Summary</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          A prioritized overview of your SEO target pages — where to focus first for the biggest organic search impact.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No SEO target data available.</p>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Targets" value={total} icon={Target} color="text-emerald-400" />
              <StatCard label="High Priority" value={highCount} icon={Flame} color="text-red-400" />
              <StatCard label="Medium Priority" value={mediumCount} icon={AlertCircle} color="text-amber-400" />
              <StatCard label="Low Priority" value={lowCount} icon={CheckCircle2} color="text-slate-400" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Priority breakdown pie */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-heading font-bold mb-4">Priority Breakdown</h2>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie data={byPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                        {byPriority.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(220 22% 18%)", border: "1px solid hsl(220 15% 28%)", borderRadius: "8px", color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {byPriority.map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                          <span className="text-sm font-medium">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{p.value}</span>
                          <span className="text-xs text-muted-foreground">({total ? Math.round((p.value / total) * 100) : 0}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area breakdown bar */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  Targets by Area
                </h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={byArea} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 28%)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "hsl(215 15% 60%)", fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "hsl(215 15% 60%)", fontSize: 12 }} width={100} />
                    <Tooltip
                      contentStyle={{ background: "hsl(220 22% 18%)", border: "1px solid hsl(220 15% 28%)", borderRadius: "8px", color: "#fff" }}
                      cursor={{ fill: "hsl(220 18% 25%)" }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Target type breakdown */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Target Types
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {byType.map((t) => (
                  <div key={t.name} className="flex items-center justify-between bg-secondary/30 rounded-lg px-4 py-3 border border-border">
                    <span className="text-sm font-medium truncate">{t.name}</span>
                    <span className="text-sm font-heading font-bold text-emerald-400 ml-3">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High priority targets — actionable list */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-bold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  High Priority Targets — Act First
                </h2>
                <Link to="/market-research/seo-targets">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                    View all <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
              {highPriority.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No high-priority targets currently flagged.</p>
              ) : (
                <div className="space-y-3">
                  {highPriority.map((t) => (
                    <div key={t.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <h3 className="font-heading font-semibold text-foreground">{t.suggested_page_post}</h3>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex-shrink-0 ${PRIORITY_STYLES[t.priority]}`}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {t.target_type && <span>Type: <span className="text-foreground">{t.target_type}</span></span>}
                        {t.county_area && <span>Area: <span className="text-foreground">{t.county_area}</span></span>}
                      </div>
                      {t.keyword_cluster && (
                        <p className="text-sm text-muted-foreground mt-1">Keywords: <span className="text-foreground">{t.keyword_cluster}</span></p>
                      )}
                      {t.action && (
                        <p className="text-sm text-primary font-medium mt-2">→ {t.action}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended next steps */}
            <div className="bg-secondary/30 border border-border rounded-2xl p-6">
              <h2 className="text-lg font-heading font-bold mb-3">Recommended Next Steps</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Tackle the <strong className="text-red-400">{highCount} high-priority</strong> pages first — these have the strongest growth potential.</li>
                <li>Focus on areas with the most target pages (e.g. <strong className="text-foreground">{byArea[0]?.name}</strong> with {byArea[0]?.value} targets) to build topical authority faster.</li>
                <li>Use the keyword clusters in each target to guide on-page content and meta tags.</li>
                <li>Review the full list for medium and low priority items once high-priority pages are published.</li>
              </ol>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-3xl font-heading font-bold">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}