import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Phone, MapPin, ExternalLink, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useNoIndex from "@/hooks/useNoIndex";

export default function SupplyHouses() {
  useNoIndex();
  const [search, setSearch] = useState("");

  const { data: supplyHouses, isLoading } = useQuery({
    queryKey: ["supplyHouses"],
    queryFn: () => base44.entities.SupplyHouse.list(),
  });

  const filtered = (supplyHouses || []).filter((s) => {
    const q = search.toLowerCase();
    return (
      s.supply_house?.toLowerCase().includes(q) ||
      s.branch_market?.toLowerCase().includes(q) ||
      s.county?.toLowerCase().includes(q) ||
      s.product_categories?.toLowerCase().includes(q) ||
      s.manufacturers_lines?.toLowerCase().includes(q)
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
          <Building2 className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold">Supply House Prospecting</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Supplier branches by county — contact info, product categories, and manufacturer lines to verify before publishing.
        </p>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, county, or manufacturer..."
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
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-foreground">{s.supply_house}</h2>
                    <p className="text-sm text-primary font-medium">{s.branch_market}</p>
                  </div>
                  {s.county && (
                    <span className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">{s.county}</span>
                  )}
                </div>

                {s.address && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{s.address}</span>
                  </div>
                )}
                {s.phone && (
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <a href={`tel:${s.phone.replace(/[^0-9]/g, "")}`} className="hover:text-primary">{s.phone}</a>
                  </div>
                )}

                {s.product_categories && (
                  <p className="text-sm text-foreground mb-2">
                    <span className="text-muted-foreground">Categories: </span>{s.product_categories}
                  </p>
                )}
                {s.manufacturers_lines && (
                  <p className="text-sm text-foreground mb-3">
                    <span className="text-muted-foreground">Manufacturers: </span>{s.manufacturers_lines}
                  </p>
                )}
                {s.source_url && (
                  <a
                    href={s.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                  >
                    Source <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="md:col-span-2 text-center text-muted-foreground py-12">No supply houses match your search.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}