import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Phone,
  ArrowRight,
  Wrench,
  Shield,
  TreePine,
  Snowflake,
  CloudHail,
  Wind,
  Search,
  ClipboardList,
  Paintbrush,
  BadgeCheck,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SIDING_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/bceda61d9_generated_image.png";

const repairVsReside = {
  repair: {
    icon: Wrench,
    title: "When repair makes sense",
    text: "A few cracked or loose panels can often be repaired — matched in, sealed up, and back to protecting the wall.",
  },
  reside: {
    icon: Layers,
    title: "When a full reside makes sense",
    text: "If the color is faded, the profile is discontinued, or hail and wind have marked more than one wall, a full reside is usually the cleaner job.",
  },
};

const weather = [
  {
    icon: Wind,
    title: "Lake wind",
    text: "Wind off the lake works panels loose one season at a time — seams open, and the next storm pushes water toward the gap.",
  },
  {
    icon: Snowflake,
    title: "Freeze–thaw",
    text: "Northeast Ohio's freeze–thaw cycles flex and crack siding while opening seams, letting water get behind the wall.",
  },
  {
    icon: CloudHail,
    title: "Hail",
    text: "Hail dents, cracks, and marks siding the same way it marks shingles — often across more than one wall at a time.",
  },
];

const materials = [
  {
    icon: Layers,
    title: "Vinyl",
    text: "Low maintenance, wide color and profile selection, and solid performance when it's installed with the right balance of fastening and expansion room.",
  },
  {
    icon: Shield,
    title: "Fiber cement",
    text: "Dense, hail-resistant, and paintable — including James Hardie when specified. Built for freeze–thaw climates.",
  },
  {
    icon: TreePine,
    title: "Engineered wood",
    text: "The look of real wood with better dimensional stability. We'll compare what's available for your house.",
  },
];

const processSteps = [
  {
    icon: Search,
    title: "Free look at the walls",
    text: "We walk the whole exterior, photograph what we find, and check what's behind the failing areas.",
  },
  {
    icon: ClipboardList,
    title: "Repair vs reside options",
    text: "Honest options with costs and tradeoffs — no pushing you toward the bigger job if a repair will do.",
  },
  {
    icon: Paintbrush,
    title: "Install and cleanup",
    text: "House wrap, flashing, and siding installed for this climate. The site is cleaned like we were never there.",
  },
  {
    icon: BadgeCheck,
    title: "Walkthrough",
    text: "We go over the work with you before we call it done.",
  },
];

const faqs = [
  {
    q: "What siding do you install?",
    a: "Vinyl, fiber cement (including James Hardie when specified), and engineered wood, with house wrap and flashing.",
  },
  {
    q: "Can you repair storm-damaged siding?",
    a: "Yes. We repair and replace storm-damaged siding in Northeast Ohio.",
  },
  {
    q: "Is siding built for Ohio winters?",
    a: "Yes. We install with house wrap and flashing that belong in this climate — proper moisture management for freeze-thaw weather.",
  },
];

export default function Siding() {
  useSEO({
    title: "Siding Contractor Northeast Ohio | Demore Exterior Solutions",
    description:
      "Siding repair and replacement from our Mentor shop. Vinyl, fiber cement, and storm-damaged siding across Northeast Ohio. Call (440) 920-6133.",
    keywords:
      "siding contractor Northeast Ohio, vinyl siding installation Mentor OH, siding replacement Lake County Ohio, resides Cuyahoga County, fiber cement siding Ohio, storm damage siding repair Ohio, siding trim and wrap Mentor Ohio",
    canonical: "/siding",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Siding — Repair, Replacement & Full Resides",
          description:
            "Siding repair and replacement from our Mentor shop. Vinyl, fiber cement, and storm-damaged siding across Northeast Ohio.",
          provider: {
            "@type": "HomeAndConstructionBusiness",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com",
          },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Cuyahoga County" },
            { "@type": "AdministrativeArea", name: "Lake County" },
            { "@type": "AdministrativeArea", name: "Geauga County" },
            { "@type": "AdministrativeArea", name: "Summit County" },
            { "@type": "AdministrativeArea", name: "Medina County" },
            { "@type": "AdministrativeArea", name: "Portage County" },
            { "@type": "AdministrativeArea", name: "Ashtabula County" },
            { "@type": "AdministrativeArea", name: "Trumbull County" },
          ],
          serviceType: ["Siding Installation", "Siding Repair", "Full Reside", "Storm Damage Siding Repair"],
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={SIDING_IMG}
            alt="Newly installed siding on a Northeast Ohio home by Demore Exterior Solutions"
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
            <Layers className="w-4 h-4" />
            Siding
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            <span className="text-primary">Northeast Ohio</span> Siding Contractor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-foreground font-heading font-semibold max-w-2xl mx-auto mb-8"
          >
            Mentor-based siding repair and replacement for homeowners in Lake County and across Northeast Ohio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                <Phone className="w-5 h-5 mr-2" />
                Call (440) 920-6133
              </Button>
            </a>
            <Link to="/#contact">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold text-base px-8 h-14">
                Request a Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Repair vs Reside */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Repair or Replacement</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We'll show you the walls and say which side you're on.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[repairVsReside.repair, repairVsReside.reside].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Northeast Ohio weather */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">What Northeast Ohio Weather Does to Siding</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Lake wind, freeze–thaw, and hail beat on siding as hard as they beat on roofs. Panels loosen, seams open, and water gets behind the wall. We install with house wrap and flashing that belong in this climate.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {weather.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
            Storm damage questions and insurance claims have their own page — see{" "}
            <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              storm damage and insurance claims
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Materials</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              We'll compare what's available for your house. We don't invent dealer certifications.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {materials.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Our Process</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-bold text-primary text-lg">{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">Warranty &amp; Financing</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed mb-8">
              <p className="flex items-center justify-center gap-2">
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Every siding project is backed by our <strong className="text-foreground">10-year workmanship warranty</strong>.</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span><strong className="text-foreground">Financing is available</strong>, and the estimate is always free.</span>
              </p>
              <p>
                Storm hit the roof as hard as the walls? We handle{" "}
                <Link to="/roofing" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  roofing
                </Link>{" "}
                too. We work across{" "}
                <Link to="/service-area/lake" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Lake County
                </Link>{" "}
                and the surrounding counties, from our home base in{" "}
                <Link to="/service-area/lake/mentor" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Mentor
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (440) 920-6133
                </Button>
              </a>
              <Link to="/">
                <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8 h-14">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Siding FAQs</h2>
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
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Free Look at the Walls. Straight Answers.</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We walk the walls with you and tell you honestly whether it's a repair or a reside.
            </p>
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14 text-base">
                <Phone className="w-5 h-5 mr-2" />
                Call (440) 920-6133
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}