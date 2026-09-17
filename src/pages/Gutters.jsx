import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Droplets, ArrowDown, Leaf, Snowflake, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COUNTIES = [
  "Cuyahoga County, Ohio",
  "Lake County, Ohio",
  "Geauga County, Ohio",
  "Summit County, Ohio",
  "Medina County, Ohio",
  "Portage County, Ohio",
  "Ashtabula County, Ohio",
  "Trumbull County, Ohio",
];

const guttersSections = [
  {
    icon: Droplets,
    title: "Seamless gutters",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Seamless gutters are formed to the length of each run, so you get fewer joints and fewer leak points than pieced sections. We size and hang gutters to move roof water away from the house in Northeast Ohio rain and snowmelt.
      </p>
    ),
  },
  {
    icon: ArrowDown,
    title: "Downspouts",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Gutters only work if downspouts carry water clear of the foundation. We install and repair downspouts, elbows, and extensions so discharge lands where you want it — not against the wall or over a walk you use every day.
      </p>
    ),
  },
  {
    icon: Leaf,
    title: "Gutter guards",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        If trees dump leaves and seed pods into your gutters, guards can cut how often you climb a ladder to clean them. When guards make sense for your home, we’ll talk through options in plain terms. We do not invent brands or guard certifications.
      </p>
    ),
  },
  {
    icon: Snowflake,
    title: "Ice and overflow",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Clogged or undersized gutters overflow at the eaves. In winter, that water can feed ice dams and push moisture toward the roof edge and walls. We look at pitch, outlets, and discharge paths so water leaves the roof instead of sitting on it. For roof-edge storm damage, see{" "}
        <Link to="/roofing" className="text-primary font-semibold hover:text-primary/80 transition-colors">roofing</Link>{" "}
        and{" "}
        <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">insurance claims</Link>.
      </p>
    ),
  },
  {
    icon: Shield,
    title: "How gutters protect roofs and siding",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Water that spills at the eaves soaks fascia, underlayment edges, and siding. Over time that means stained walls, soft wood, and leaks that look like a roof problem. Keeping gutters clear and correctly hung protects both the{" "}
        <Link to="/roofing" className="text-primary font-semibold hover:text-primary/80 transition-colors">roof</Link>{" "}
        and{" "}
        <Link to="/siding" className="text-primary font-semibold hover:text-primary/80 transition-colors">siding</Link>. Start from the{" "}
        <Link to="/" className="text-primary font-semibold hover:text-primary/80 transition-colors">home page</Link>{" "}
        if you’re planning a full exterior check.
      </p>
    ),
  },
];

const faqs = [
  {
    q: "Are the gutters seamless and made on site?",
    a: "Yes. We fabricate seamless aluminum gutters on site and pitch them correctly.",
  },
  {
    q: "Do you install gutter guards?",
    a: "Yes. Micro-mesh guards, heavy-duty hangers, and downspout extensions.",
  },
  {
    q: "Can you help with ice dams?",
    a: "Yes. We install ice-dam prevention solutions for Northeast Ohio winters.",
  },
];

export default function Gutters() {
  useSEO({
    title: "Seamless Gutters Northeast Ohio | Demore",
    description:
      "Demore Exterior Solutions fabricates seamless gutters and guards for Lake, Cuyahoga, and nearby Ohio counties. Ice-dam prevention. Call (440) 920-6133.",
    keywords:
      "gutter installation Northeast Ohio, seamless gutters Mentor OH, gutter replacement Lake County Ohio, downspouts Cuyahoga County, gutter guards Geauga County, ice damage gutters Ohio, water damage prevention gutters Northeast Ohio",
    canonical: "/gutters",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": ["HomeAndConstructionBusiness", "FAQPage"],
      name: "Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/gutters",
      telephone: "+1-440-920-6133",
      areaServed: COUNTIES.map((county) => ({ "@type": "AdministrativeArea", name: county })),
      serviceType: ["Seamless Gutter Installation", "Downspout Installation", "Gutter Repair"],
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
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/7917868b0_generated_image.png"
            alt="Seamless aluminum gutters and downspout freshly installed on a Northeast Ohio home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/88 to-background/95" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed mb-4"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties, including Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, Warren, and surrounding communities.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Based in Mentor, Demore Exterior Solutions installs and repairs gutters across all eight counties — not Mentor alone. We focus on seamless gutters, downspouts, overflow and ice problems, and how a working system protects your roof and siding.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Residential <span className="text-primary">Gutters</span>
          </motion.h1>
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

      {/* Services */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {guttersSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.08 }}
                  className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-heading font-bold text-lg">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-secondary/20">
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
              Honest answers about your gutters — no pressure.
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