import React from "react";
import { useParams, Link } from "react-router-dom";
import { findCounty, getAllCommunities, slugify } from "@/lib/serviceAreaData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, ChevronRight, Home, Building2, TreePine, HardHat, Layers, AppWindow, DoorOpen, Droplets, Trees, ShieldCheck, ScanSearch } from "lucide-react";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import PageFAQ from "@/components/PageFAQ";
import { openAssistant } from "@/lib/openAssistant";

const COUNTY_SEO = {
  lake: {
    title: "Roofing & Siding Lake County OH | Demore",
    description:
      "Demore Exterior Solutions serves Lake County, Ohio including Mentor, Willoughby, and Painesville. Roofing, siding, gutters, and storm claims. (440) 920-6133.",
  },
  cuyahoga: {
    title: "Roofing & Siding Cuyahoga County | Demore",
    description:
      "Demore Exterior Solutions serves Cuyahoga County, Ohio with roofing, siding, windows, and storm insurance help. Free inspection. (440) 920-6133.",
  },
  geauga: {
    title: "Roofing & Siding Geauga County | Demore",
    description:
      "Demore Exterior Solutions serves Geauga County, Ohio including Chardon and Kirtland. Roofing, siding, gutters, and storm claims. Free estimate. (440) 920-6133.",
  },
  summit: {
    title: "Roofing & Siding Summit County | Demore",
    description:
      "Demore Exterior Solutions serves Summit County, Ohio including Stow. Roofing, siding, windows, and storm damage repairs. Call (440) 920-6133.",
  },
  medina: {
    title: "Roofing & Siding Medina County | Demore",
    description:
      "Demore Exterior Solutions serves Medina County, Ohio including Brunswick. Roofing, siding, gutters, and insurance claims. Free inspection. (440) 920-6133.",
  },
  portage: {
    title: "Roofing & Siding Portage County | Demore",
    description:
      "Demore Exterior Solutions serves Portage County, Ohio including Kent and Ravenna. Roofing, siding, and storm claims. Call (440) 920-6133.",
  },
  ashtabula: {
    title: "Roofing & Siding Ashtabula County | Demore",
    description:
      "Demore Exterior Solutions serves Ashtabula County, Ohio. Roofing, siding, gutters, and storm insurance claims. Free inspection. (440) 920-6133.",
  },
  trumbull: {
    title: "Roofing & Siding Trumbull County | Demore",
    description:
      "Demore Exterior Solutions serves Trumbull County, Ohio including Warren. Roofing, siding, windows, and storm claims. Call (440) 920-6133.",
  },
};

const COUNTY_FAQ = {
  lake: [
    { q: "Which Lake County cities do you serve?", a: "Mentor, Willoughby, Painesville, and surrounding Lake County communities." },
    { q: "What services are available in Lake County?", a: "Roofing, siding, windows, doors, gutters, decks, and storm insurance claims." },
    { q: "How do I book?", a: "Call (440) 920-6133 or request a free estimate." },
  ],
  cuyahoga: [
    { q: "Do you work in Cuyahoga County?", a: "Yes. Roofing, siding, windows, gutters, and storm claims." },
    { q: "Is the free inspection available here?", a: "Yes. Call (440) 920-6133." },
    { q: "Do you handle insurance claims in Cuyahoga County?", a: "Yes." },
  ],
  geauga: [
    { q: "Which Geauga communities do you serve?", a: "Chardon, Kirtland, and surrounding Geauga County." },
    { q: "What work do you do there?", a: "Roofing, siding, windows, gutters, decks, and storm claims." },
    { q: "How do I get an estimate?", a: "Call (440) 920-6133." },
  ],
  summit: [
    { q: "Do you serve Stow and Summit County?", a: "Yes." },
    { q: "What services?", a: "Roofing, siding, windows, gutters, and storm repairs." },
    { q: "How do I book?", a: "Call (440) 920-6133 or use the estimate form." },
  ],
  medina: [
    { q: "Do you work in Brunswick and Medina County?", a: "Yes." },
    { q: "What services?", a: "Roofing, siding, gutters, windows, and insurance claims." },
    { q: "How do I start?", a: "Call (440) 920-6133." },
  ],
  portage: [
    { q: "Do you serve Kent and Ravenna?", a: "Yes, and the rest of Portage County." },
    { q: "What services?", a: "Roofing, siding, windows, gutters, and storm claims." },
    { q: "How do I book?", a: "Call (440) 920-6133." },
  ],
  ashtabula: [
    { q: "Do you work in Ashtabula County?", a: "Yes." },
    { q: "What services?", a: "Roofing, siding, gutters, windows, and storm insurance claims." },
    { q: "How do I get a free inspection?", a: "Call (440) 920-6133." },
  ],
  trumbull: [
    { q: "Do you serve Warren and Trumbull County?", a: "Yes." },
    { q: "What services?", a: "Roofing, siding, windows, gutters, and storm claims." },
    { q: "How do I book?", a: "Call (440) 920-6133." },
  ],
};

const LAKE_SERVICES = [
  { label: "Roofing", to: "/roofing", icon: HardHat },
  { label: "Siding", to: "/siding", icon: Layers },
  { label: "Windows", to: "/windows", icon: AppWindow },
  { label: "Doors", to: "/doors", icon: DoorOpen },
  { label: "Gutters", to: "/gutters", icon: Droplets },
  { label: "Decks & Outdoor Living", to: "/decks", icon: Trees },
  { label: "Storm Damage & Insurance Claims", to: "/insurance-claims", icon: ShieldCheck },
  { label: "Free AI Damage Check", to: "/damage-assessment", icon: ScanSearch },
];

export default function CountyPage() {
  const { county } = useParams();
  const countyData = findCounty(county);

  useSEO({
    title: countyData
      ? (COUNTY_SEO[countyData.slug]?.title ?? `${countyData.county} County Roofing, Siding & Gutters | Demore Exterior Solutions`)
      : "County Service Area | Demore Exterior Solutions",
    description: countyData
      ? (COUNTY_SEO[countyData.slug]?.description ?? `Demore Exterior Solutions provides expert roofing, siding, and gutter installation throughout all of ${countyData.county} County, Ohio. Licensed & insured storm damage specialists. Free estimates. Call (440) 920-6133.`)
      : "",
    keywords: countyData
      ? `roofing ${countyData.county} County Ohio, siding contractor ${countyData.county} County OH, gutter installation ${countyData.county} County, storm damage repair ${countyData.county} County, roof replacement ${countyData.county} Ohio, hail damage ${countyData.county} County, licensed roofing contractor ${countyData.county} Ohio, free roof estimate ${countyData.county} County, CertainTeed GAF Owens Corning IKO installer ${countyData.county} County, ProVia siding windows doors ${countyData.county} County, ${countyData.county} County roof tear off, ${countyData.county} County vinyl siding installation`
      : "",
    canonical: `/service-area/${county}`,
    geoCity: countyData ? `${countyData.county} County, Ohio` : undefined,
    schema: countyData ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": `Roofing, Siding & Gutter Services — ${countyData.county} County, Ohio`,
          "description": `Demore Exterior Solutions provides roofing replacement, siding installation, and seamless gutter systems throughout ${countyData.county} County, Ohio with storm damage and insurance claim expertise.`,
          "provider": {
            "@type": "RoofingContractor",
            "name": "Demore Exterior Solutions",
            "telephone": "+1-440-920-6133",
            "url": "https://www.demoreexteriorsolutions.com"
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": `${countyData.county} County, Ohio`
          },
          "serviceType": ["Roofing", "Siding", "Gutter Installation", "Storm Damage Repair"]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.demoreexteriorsolutions.com" },
            { "@type": "ListItem", "position": 2, "name": `${countyData.county} County`, "item": `https://www.demoreexteriorsolutions.com/service-area/${countyData.slug}` }
          ]
        }
      ]
    } : undefined
  });

  if (!countyData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">County Not Found</h1>
            <Link to="/"><Button>Return Home</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const all = getAllCommunities(countyData);
  const cities = all.filter(c => c.type === "City");
  const villages = all.filter(c => c.type === "Village");
  const communities = all.filter(c => c.type === "Community");

  const sections = [
    { label: "Cities", icon: Building2, items: cities },
    { label: "Villages", icon: Home, items: villages },
    { label: "Communities & Townships", icon: TreePine, items: communities }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/#contact" className="hover:text-primary transition-colors">Service Areas</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{countyData.county} County</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              Service Area
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">
              {countyData.county} County <span className="text-primary">Exterior Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Demore Exterior Solutions proudly serves every city, village, and community throughout {countyData.county} County, Ohio.
              Our licensed, insured team delivers expert roofing, siding, and gutter services — meeting and exceeding all local and Ohio state building codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                  <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
                </Button>
              </a>
              <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
                <Button size="lg" variant="outline" className="font-heading font-bold">
                  Free Estimate
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why We Cover This County */}
      <section className="py-12 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Licensed & Insured", body: "Fully licensed Ohio contractor. Every job in " + countyData.county + " County is backed by liability insurance and workmanship warranties." },
              { title: "Code Compliant & Beyond", body: "We know " + countyData.county + " County's local building codes and Ohio Residential Code inside-out — and we consistently exceed them." },
              { title: "Storm Damage Experts", body: "From hail to high winds, we specialize in insurance claim work throughout " + countyData.county + " County with zero out-of-pocket risk." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lake County Services & NAP */}
      {countyData.slug === "lake" && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
              Our Services in Lake County
            </h2>
            <p className="text-muted-foreground mb-10">
              Serving Mentor, Willoughby, Painesville, and other Lake County communities.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
              {LAKE_SERVICES.map((service) => (
                <Link
                  key={service.to}
                  to={service.to}
                  className="flex items-center justify-between bg-card border border-border/50 rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <service.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{service.label}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-heading font-bold text-lg">Demore Exterior Solutions</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  6348 Meldon Dr, Mentor, OH 44060
                </p>
              </div>
              <a href="tel:4409206133" className="flex items-center gap-2 text-primary font-heading font-bold">
                <Phone className="w-4 h-4" />
                (440) 920-6133
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Community Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
            Select Your Community
          </h2>
          <p className="text-muted-foreground mb-10">
            Click your city, village, or community to see specific services and local code requirements.
          </p>

          {sections.filter(s => s.items.length > 0).map((section, si) => (
            <div key={si} className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <section.icon className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-xl">{section.label}</h3>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {section.items.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }}>
                    <Link
                      to={`/service-area/${countyData.slug}/${slugify(item.name)}`}
                      className="flex items-center justify-between bg-card border border-border/50 rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <PageFAQ faqs={COUNTY_FAQ[countyData.slug] || []} />

      {/* CTA */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Ready for Your Free Estimate in {countyData.county} County?
          </h2>
          <p className="text-muted-foreground mb-6">
            Call or submit a request — we respond within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:4409206133">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
              </Button>
            </a>
            <a href="/#contact">
              <Button size="lg" variant="outline" className="font-heading font-bold">
                Request Online
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}