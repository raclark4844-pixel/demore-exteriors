import React from "react";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DamageCheckForm from "@/components/DamageCheckForm";
import PageFAQ from "@/components/PageFAQ";
import { Sparkles, Phone } from "lucide-react";

const faqs = [
  {
    q: "Is the photo check a substitute for an inspection?",
    a: "No. It is a first look. We still offer a free in-person inspection.",
  },
  {
    q: "What photos should I upload?",
    a: "Up to 3 photos of the roof, siding, or gutters.",
  },
  {
    q: "What happens next?",
    a: "We review the photos and you can book a free inspection.",
  },
];

export default function DamageAssessment() {
  useSEO({
    title: "Free AI Storm Damage Check | Demore",
    description:
      "Upload roof, siding, or gutter photos. Demore Exterior Solutions reviews storm damage and books a free inspection in Mentor and Northeast Ohio. (440) 920-6133.",
    keywords:
      "storm damage photo check, hail damage roof assessment, free roof inspection Mentor Ohio, storm damage inspection Northeast Ohio, roof damage photo upload, wind damage siding check, insurance claim roof damage Ohio",
    canonical: "/damage-assessment",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Free Storm Damage Photo Check | Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/damage-assessment",
      description:
        "Upload photos of storm damage for a free AI-powered preliminary assessment, then book a free professional inspection with Demore Exterior Solutions in Northeast Ohio.",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Free AI Damage Check
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-heading font-bold mb-4"
          >
            Not Sure If the Storm Damaged Your Home?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Upload photos of the damage and our AI assistant will review them instantly and
            give you a preliminary read plus next steps. Every review ends the same way —
            with a free, no-obligation professional inspection from our team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6"
          >
            <a
              href="tel:4409206133"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="w-4 h-4" /> Urgent? Call (440) 920-6133
            </a>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DamageCheckForm />
        </div>
      </section>

      {/* Claims context link */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Planning to file a claim? See our{" "}
            <a href="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              storm damage & insurance claims overview
            </a>{" "}
            for what's typically covered, what to photograph, and how we document damage for your insurer.
          </p>
        </div>
      </section>

      <PageFAQ faqs={faqs} />

      <Footer />
    </div>
  );
}