import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MapPin, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COUNTIES = [
  "Cuyahoga County",
  "Lake County",
  "Geauga County",
  "Summit County",
  "Medina County",
  "Portage County",
  "Ashtabula County",
  "Trumbull County",
];

const CITY_PAGES = [
  { name: "Willoughby", county: "Lake County", path: "/service-area/lake/willoughby" },
  { name: "Painesville", county: "Lake County", path: "/service-area/lake/painesville" },
  { name: "Eastlake", county: "Lake County", path: "/service-area/lake/eastlake" },
  { name: "Kirtland", county: "Lake County", path: "/service-area/lake/kirtland" },
  { name: "Concord Township", county: "Lake County", path: "/service-area/lake/concord-township" },
  { name: "Mentor-on-the-Lake", county: "Lake County", path: "/service-area/lake/mentor-on-the-lake" },
  { name: "Madison", county: "Lake County", path: "/service-area/lake/madison" },
  { name: "Chardon", county: "Geauga County", path: "/service-area/geauga/chardon" },
];

const faqs = [
  {
    q: "Do you only serve Mentor?",
    a: "No. We’re based in Mentor and serve all of Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties — every city in those counties, plus surrounding communities.",
  },
  {
    q: "Do you come to Stow / Kent / Warren?",
    a: "Yes. Stow, Kent, and Warren are in our service area, along with the other example cities listed above and the communities around them in those counties.",
  },
  {
    q: "Is my city covered if it isn’t listed here?",
    a: "If it’s in one of the eight counties, yes. The city list is examples, not a limit.",
  },
  {
    q: "Can I get a free inspection outside Lake County?",
    a: "Yes. Free inspections are available across all eight counties we serve.",
  },
];

export default function ServiceAreas() {
  useSEO({
    title: "Service Areas in Northeast Ohio | Demore Exterior Solutions",
    description:
      "Demore Exterior Solutions serves Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull Counties from Mentor, OH. Free inspection: (440) 920-6133.",
    keywords:
      "service areas Northeast Ohio, exterior contractor Cuyahoga County, roofing Lake County Ohio, siding Geauga County, gutters Summit County, doors Medina County, windows Portage County, Ashtabula County contractor, Trumbull County exterior contractor",
    canonical: "/service-areas",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": ["HomeAndConstructionBusiness", "FAQPage"],
      name: "Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/service-areas",
      telephone: "+1-440-920-6133",
      address: {
        "@type": "PostalAddress",
        streetAddress: "6348 Meldon Dr",
        addressLocality: "Mentor",
        addressRegion: "OH",
        postalCode: "44060",
      },
      areaServed: COUNTIES.map((county) => ({
        "@type": "AdministrativeArea",
        name: `${county}, Ohio`,
      })),
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Service Areas in <span className="text-primary">Northeast Ohio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed mb-4"
          >
            Based in Mentor at <span className="text-foreground font-semibold">6348 Meldon Dr, Mentor, OH 44060</span>, Demore Exterior Solutions works across Northeast Ohio. This page is about where we work — not a full service write-up.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties, including Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, Warren, and surrounding communities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/#contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                Get a Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="tel:4409206133">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold text-base px-8 h-14">
                <Phone className="w-4 h-4 mr-2" />
                (440) 920-6133
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Counties */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Counties we serve</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-base mb-8 max-w-3xl"
          >
            We serve <span className="text-foreground font-semibold">all</span> of these counties — every city in each one:
          </motion.p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COUNTIES.map((county, i) => (
              <motion.div
                key={county}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-heading font-semibold text-sm">{county}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example cities + services */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <h2 className="font-heading font-bold text-lg mb-3">Example cities</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Homes we often hear from include{" "}
              <span className="text-foreground font-semibold">
                Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, and Warren
              </span>
              . Those are examples only. We also serve surrounding communities throughout the eight counties above — not only the cities named.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <h2 className="font-heading font-bold text-lg mb-3">What we do in these areas</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Across this territory, services include{" "}
              <Link to="/roofing" className="text-primary font-semibold hover:text-primary/80 transition-colors">roofing</Link>,{" "}
              <Link to="/siding" className="text-primary font-semibold hover:text-primary/80 transition-colors">siding</Link>,{" "}
              <Link to="/windows" className="text-primary font-semibold hover:text-primary/80 transition-colors">windows</Link>,{" "}
              <Link to="/doors" className="text-primary font-semibold hover:text-primary/80 transition-colors">doors</Link>,{" "}
              <Link to="/gutters" className="text-primary font-semibold hover:text-primary/80 transition-colors">gutters</Link>, decks, and{" "}
              <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">storm damage</Link>{" "}
              help. For the company overview, visit the{" "}
              <Link to="/" className="text-primary font-semibold hover:text-primary/80 transition-colors">home page</Link>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dedicated city pages */}
      <section className="py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Our local city pages</h2>
            </div>
          </motion.div>
          <p className="text-muted-foreground text-base mb-8 max-w-3xl">
            We cover these communities in depth, with local weather, permitting, and project notes for each:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CITY_PAGES.map((c, i) => (
              <motion.div
                key={c.path}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={c.path}
                  className="block bg-card border border-border/50 rounded-xl px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-heading font-semibold text-sm block">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.county}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">FAQs</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border/50 rounded-xl p-6"
              >
                <h3 className="font-heading font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/10 border-t border-primary/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Get a Free Inspection
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Available across all eight counties we serve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  Get a Free Inspection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="tel:4409206133">
                <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8 h-14">
                  <Phone className="w-4 h-4 mr-2" />
                  (440) 920-6133
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}