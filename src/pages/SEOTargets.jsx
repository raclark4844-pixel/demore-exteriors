import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Loader2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRIORITY_STYLES = {
  High: "bg-red-500/15 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Low: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

import useNoIndex from "@/hooks/useNoIndex";

export default function SEOTargets() {
  useNoIndex();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const { data: targets, isLoading } = useQuery({
    queryKey: ["seoTargets"],
    queryFn: () => base44.entities.SEOTarget.list(),
  });

  const filtered = (targets || []).filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      t.suggested_page_post?.toLowerCase().includes(q) ||
      t.target_type?.toLowerCase().includes(q) ||
      t.county_area?.toLowerCase().includes(q) ||
      t.keyword_cluster?.toLowerCase().includes(q);
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

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
          <Target className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">SEO Target Pages</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Prioritized page and post ideas with keyword clusters and recommended actions for organic search growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, keyword, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["All", "High", "Medium", "Low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priorityFilter === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((t) => (
              <div key={t.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <h2 className="text-lg font-heading font-bold text-foreground">{t.suggested_page_post}</h2>
                  {t.priority && (
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border flex-shrink-0 ${PRIORITY_STYLES[t.priority] || ""}`}>
                      {t.priority}
                    </span>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Target Type: </span>
                    <span className="text-foreground">{t.target_type || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Area: </span>
                    <span className="text-foreground">{t.county_area || "—"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Keywords: </span>
                    <span className="text-foreground">{t.keyword_cluster || "—"}</span>
                  </div>
                  {t.action && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Action: </span>
                      <span className="text-primary font-medium">{t.action}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No SEO targets match your filters.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}