import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BarChart3, Users, Building2, Search, MapPin, ArrowRight, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import useNoIndex from "@/hooks/useNoIndex";

export default function MarketResearch() {
  useNoIndex();
  const { data: competitors } = useQuery({
    queryKey: ["competitors"],
    queryFn: () => base44.entities.Competitor.list(),
  });
  const { data: supplyHouses } = useQuery({
    queryKey: ["supplyHouses"],
    queryFn: () => base44.entities.SupplyHouse.list(),
  });
  const { data: seoTargets } = useQuery({
    queryKey: ["seoTargets"],
    queryFn: () => base44.entities.SEOTarget.list(),
  });
  const { data: counties } = useQuery({
    queryKey: ["serviceCounties"],
    queryFn: () => base44.entities.ServiceCounty.list(),
  });

  const cards = [
    {
      title: "Competitor Research",
      description: "Track NE Ohio roofing, siding & gutter competitors — their base markets, service counties, and product lines.",
      href: "/market-research/competitors",
      icon: Users,
      count: competitors?.length,
      color: "text-red-400",
    },
    {
      title: "Supply House Prospecting",
      description: "Supplier branches by county — addresses, phone numbers, product categories, and manufacturer lines to verify.",
      href: "/market-research/supply-houses",
      icon: Building2,
      count: supplyHouses?.length,
      color: "text-blue-400",
    },
    {
      title: "SEO Target Pages",
      description: "Prioritized page/post ideas with keyword clusters and recommended actions for organic search growth.",
      href: "/market-research/seo-targets",
      icon: Search,
      count: seoTargets?.length,
      color: "text-emerald-400",
    },
    {
      title: "SEO Growth Summary",
      description: "A clear summary report of your SEO targets — priority breakdown, area focus, and what to act on first.",
      href: "/market-research/seo-summary",
      icon: TrendingUp,
      count: seoTargets?.length,
      color: "text-emerald-400",
    },
    {
      title: "Service Counties",
      description: "Primary, target, and expansion counties with important cities and communities across NE Ohio.",
      href: "/market-research/counties",
      icon: MapPin,
      count: counties?.length,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Internal Market Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">Market Research Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Competitor tracking, supply house prospecting, and SEO targeting data for Northeast Ohio exterior contracting.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-secondary/50 ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                {card.count !== undefined && (
                  <span className="text-2xl font-heading font-bold text-muted-foreground">{card.count}</span>
                )}
              </div>
              <h2 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                View data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-secondary/30 border border-border rounded-2xl p-6">
          <h3 className="font-heading font-bold mb-2">Database Notes</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is a researched starter database, not a legally complete list of every contractor or supplier in every county.
            Contractor directories change constantly. Verify exact manufacturer lines with each supply house branch before publishing,
            as inventory varies by location. Use the Competitors sheet for SEO comparison pages, ad targeting, and keyword research.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}