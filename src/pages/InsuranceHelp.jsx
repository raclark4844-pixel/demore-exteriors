import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, FileText, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";

const topics = [
  { slug: "supplements", title: "What Is an Insurance Supplement?", summary: "How contractors document omitted or under-scoped repair items after the carrier's first estimate." },
  { slug: "ohio-matching", title: "Ohio Matching: Siding, Roofing & Exterior Materials", summary: "What Ohio Administrative Code 3901-1-54 says about a reasonably comparable appearance when replacement items do not match." },
  { slug: "acv-vs-rcv", title: "ACV vs. RCV", summary: "A plain-English explanation of actual cash value, replacement cost value and why the first payment may not equal the full replacement cost." },
  { slug: "depreciation", title: "Depreciation & Depreciation Release", summary: "What depreciation is, when it may be recoverable under a policy and what documentation homeowners commonly need after repairs." },
  { slug: "odi-complaint", title: "How to File an Ohio Department of Insurance Complaint", summary: "Where Ohio consumers can submit a complaint and what supporting documentation to organize first." },
];

export default function InsuranceHelp() {
  useSEO({
    title: "Ohio Home Insurance Claim Help | Matching, Supplements, ACV & RCV | Demore",
    description: "Plain-English Ohio property claim education from Demore Exterior Solutions: supplements, matching, ACV vs RCV, depreciation and ODI complaints.",
    keywords: "Ohio insurance claim supplement, Ohio siding matching law, Ohio roofing matching rule, ACV vs RCV Ohio, depreciation release insurance claim, Ohio Department of Insurance complaint property claim",
    canonical: "/insurance-claims/help",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: "Ohio Property Insurance Claim Help",
          description: "Plain-English educational resources for Ohio homeowners navigating exterior property claims.",
          url: "https://www.demoreexteriorsolutions.com/insurance-claims/help",
          about: topics.map((topic) => topic.title),
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133"
          }
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.demoreexteriorsolutions.com/" },
            { "@type": "ListItem", position: 2, name: "Insurance Claims", item: "https://www.demoreexteriorsolutions.com/insurance-claims" },
            { "@type": "ListItem", position: 3, name: "Claim Help", item: "https://www.demoreexteriorsolutions.com/insurance-claims/help" }
          ]
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"><BookOpen className="w-4 h-4" /> Ohio Claim Education</div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">Ohio Property Claim Questions, <span className="text-primary">Answered Directly</span></h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-6">Short, source-based explanations for homeowners dealing with storm damage, repair estimates and insurance paperwork. Demore provides contractor documentation and construction expertise — not legal advice or public-adjusting services.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <Link key={topic.slug} to={`/insurance-claims/help/${topic.slug}`} className="group bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    {index === 1 ? <Scale className="w-5 h-5 text-primary" /> : index === 4 ? <ShieldCheck className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-xl group-hover:text-primary transition-colors">{topic.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{topic.summary}</p>
                    <span className="inline-flex items-center text-sm font-heading font-bold text-primary mt-4">Read answer <ArrowRight className="w-4 h-4 ml-1" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <h2 className="text-2xl font-heading font-bold">Need the property inspected first?</h2>
            <p className="text-muted-foreground mt-2">We can document roof, siding, gutter and exterior conditions and prepare a contractor repair scope.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-5">
              <Link to="/storm-damage"><Button className="font-heading font-bold">Storm Damage Help <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
              <Link to="/#contact"><Button variant="outline" className="font-heading font-bold">Request Free Inspection</Button></Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
