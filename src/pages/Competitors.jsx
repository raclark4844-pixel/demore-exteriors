import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, ExternalLink, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNoIndex from "@/hooks/useNoIndex";

export default function Competitors() {
  useNoIndex();
  const [search, setSearch] = useState("");

  const { data: competitors, isLoading } = useQuery({
    queryKey: ["competitors"],
    queryFn: () => base44.entities.Competitor.list(),
  });

  const filtered = (competitors || []).filter((c) => {
    const q = search.toLowerCase();
    return (
      c.company?.toLowerCase().includes(q) ||
      c.base_market?.toLowerCase().includes(q) ||
      c.likely_service_counties?.toLowerCase().includes(q) ||
      c.trades_products?.toLowerCase().includes(q)
    );
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
          <Users className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Competitor Research</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          NE Ohio roofing, siding, and gutter competitors — their base markets, service counties, and product offerings.
        </p>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, county, or trade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-foreground">{c.company}</h2>
                    <p className="text-sm text-muted-foreground">{c.base_market}</p>
                  </div>
                  {c.source_url && (
                    <a
                      href={c.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    >
                      Source <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Service Counties: </span>
                    <span className="text-foreground">{c.likely_service_counties || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Market Type: </span>
                    <span className="text-foreground">{c.market_type || "—"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground">Trades/Products: </span>
                    <span className="text-foreground">{c.trades_products || "—"}</span>
                  </div>
                  {c.notes && (
                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Notes: </span>
                      <span className="text-foreground">{c.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No competitors match your search.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}