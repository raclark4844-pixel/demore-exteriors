import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIORITY_STYLES = {
  Primary: "bg-primary/15 text-primary border-primary/30",
  "Target/nearby": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Expansion/nearby": "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

import useNoIndex from "@/hooks/useNoIndex";

export default function ServiceCounties() {
  useNoIndex();
  const { data: counties, isLoading } = useQuery({
    queryKey: ["serviceCounties"],
    queryFn: () => base44.entities.ServiceCounty.list(),
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
          <MapPin className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Service Counties</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Primary, target, and expansion counties with important cities and communities across Northeast Ohio.
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(counties || []).map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-heading font-bold text-foreground">{c.county}</h2>
                  {c.priority && (
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${PRIORITY_STYLES[c.priority] || ""}`}>
                      {c.priority}
                    </span>
                  )}
                </div>
                {c.important_cities && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{c.important_cities}</p>
                )}
                {c.source_note && (
                  <a
                    href={c.source_note}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    {c.source_note}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}