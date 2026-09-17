import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ChevronRight, MapPin, Home, Hammer, Droplets, CloudLightning, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { isCitySeoIndexable } from "@/lib/citySeoIndex";

const NEARBY_CITIES = [
  { name: "Willoughby", slug: "willoughby" },
  { name: "Painesville", slug: "painesville" },
  { name: "Eastlake", slug: "eastlake" },
  { name: "Wickliffe", slug: "wickliffe" },
  { name: "Willoughby Hills", slug: "willoughby-hills" }
];

export default function MentorCityPage() {
  useSEO({
    title: "Roofing Contractor Mentor OH | Demore Exterior Solutions",
    description: "Mentor, OH roofing, siding & storm damage from Demore Exterior Solutions. Lake County headquarters at 6348 Meldon Dr. Call (440) 920-6133.",
    keywords: "roofing contractor Mentor OH, roof replacement Mentor Ohio, roof repair Mentor OH, siding contractor Mentor Ohio, gutter installation Mentor OH, storm damage repair Mentor, hail damage roof Mentor, wind damage Mentor, Lake County roofing contractor, Demore Exterior Solutions Mentor",
    canonical: "/service-area/lake/mentor",
    noIndexFollow: !isCitySeoIndexable("mentor"),
    geoCity: "Mentor, Lake County, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": "Roofing, Siding & Storm Damage Services in Mentor, Ohio",
          "description": "Demore Exterior Solutions provides roofing repairs and replacement, siding, gutters, and storm damage work for Mentor, Ohio homeowners. Licensed and insured, with financing available for qualifying projects.",
          "provider": {
            "@type": "RoofingContractor",
            "name": "Demore Exterior Solutions",
            "telephone": "+1-440-920-6133",
            "url": "https://www.demoreexteriorsolutions.com"
          },
          "areaServed": {
            "@type": "City",
            "name": "Mentor, Ohio",
            "containedIn": { "@type": "AdministrativeArea", "name": "Lake County, Ohio" }
          },
          "serviceType": ["Roofing", "Siding", "Gutter Installation", "Storm Damage Repair", "Hail Damage Repair", "Wind Damage Repair", "Insurance Claim Roofing"]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.demoreexteriorsolutions.com" },
            { "@type": "ListItem", "position": 2, "name": "Lake County", "item": "https://www.demoreexteriorsolutions.com/service-area/lake" },
            { "@type": "ListItem", "position": 3, "name": "Mentor", "item": "https://www.demoreexteriorsolutions.com/service-area/lake/mentor" }
          ]
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/service-area/lake" className="hover:text-primary transition-colors">Lake County</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Mentor</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="flex items-center gap-2 text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              <MapPin className="w-4 h-4" /> Lake County Headquarters · Mentor, Ohio
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">
              Roofing, Siding &amp; Storm Damage in Mentor, Ohio
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
              Demore Exterior Solutions is a Mentor-based exterior contractor serving Lake County homeowners with
              roofing, siding, gutters, and storm damage work. Our headquarters is at 6348 Meldon Dr, Mentor, OH
              44060 — close enough to respond when lake-effect weather or a summer storm hits.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                  <Phone className="w-4 h-4 mr-2" /> Call (440) 920-6133
                </Button>
              </a>
              <a href="#contact">
                <Button size="lg" variant="outline" className="border-primary/40 font-heading font-bold">
                  Request a Free Inspection <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lake County weather and Mentor homes */}
      <section className="py-14 bg-secondary/20 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-4">Lake County weather and Mentor homes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Mentor sits on the Lake Erie snowbelt. Freeze–thaw cycles, lake wind, and heavy wet snow wear on
            shingles, flashing, siding, and gutters. Older ranch and split-level homes across Mentor need roofs
            and exteriors that shed water and stay fastened through winter.
          </p>
        </div>
      </section>

      {/* Roofing in Mentor */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold">Roofing in Mentor</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We handle roof repairs and roof replacement for Mentor homeowners — from storm-damaged shingles to
            full tear-offs. If you’re comparing a repair against a replacement after wind or hail, we’ll walk
            the roof and explain what we find in plain language.
          </p>
        </div>
      </section>

      {/* Siding */}
      <section className="py-14 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Hammer className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold">Siding</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Warped, loose, or hail-bruised siding lets moisture in and drives up energy use. We replace and
            repair siding so your Mentor home stays sealed against lake wind and driving rain.
          </p>
        </div>
      </section>

      {/* Gutters */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold">Gutters</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Clogged or undersized gutters dump water at the foundation — a common issue after snowmelt and
            spring storms in Lake County. We install and repair gutter systems sized for local rainfall.
          </p>
        </div>
      </section>

      {/* Storm, hail and wind damage */}
      <section className="py-14 bg-secondary/10 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <CloudLightning className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold">Storm, hail and wind damage</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            After a storm, we inspect for missing shingles, bruised mats, lifted flashing, and damaged siding.
            We’ll outline repair vs. replacement options. Financing is available for qualifying projects.
            Licensed and insured, with a 10-year workmanship warranty on our labor.
          </p>
        </div>
      </section>

      {/* Nearby Lake County */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-4">Nearby Lake County</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            From our Mentor HQ we also serve Willoughby, Painesville, Eastlake, Wickliffe, Willoughby Hills, and
            communities throughout <Link to="/service-area/lake" className="text-primary hover:text-primary/80 transition-colors">Lake County</Link>.
          </p>
          <div className="flex flex-wrap gap-3">
            {NEARBY_CITIES.map((c) => (
              <Link
                key={c.slug}
                to={`/service-area/lake/${c.slug}`}
                className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Free inspection in Mentor — call today
          </h2>
          <p className="text-muted-foreground mb-6">
            Licensed, insured, and headquartered at 6348 Meldon Dr. We pull permits and stand behind our labor
            with a 10-year workmanship warranty.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> Call (440) 920-6133
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="border-primary/40 font-heading font-bold">
                Request a Free Inspection <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}