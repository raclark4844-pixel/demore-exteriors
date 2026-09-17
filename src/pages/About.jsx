import React from "react";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function About() {
  useSEO({
    title: "About Us | Demore Exterior Solutions",
    description:
      "Meet Demore Exterior Solutions: a Mentor, OH general contractor with 20+ years of experience serving homeowners across 8 Northeast Ohio counties.",
    canonical: "/about",
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/about",
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-heading font-bold mb-6"
          >
            About <span className="text-primary">Demore Exterior Solutions</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-muted-foreground text-base leading-relaxed"
          >
            <p>
              This website is the online home of Demore Exterior Solutions, a full-service exterior
              restoration contractor. It is built for homeowners and property owners across Northeast
              Ohio who need roofing, siding, window, door, gutter, and deck work — especially after
              storm damage. Visitors can explore detailed service pages, browse the products we
              install, view our project gallery, read customer reviews, and request a free estimate
              or a professional damage inspection.
            </p>
            <p>
              The site is built and maintained by Demore Exterior Solutions — a licensed and insured
              general contractor based in Mentor, Ohio, founded by Ryan Bomer. With over 20 years of
              experience in the exterior trades, we've seen firsthand what Lake Erie weather does to
              a home — and how to build exteriors that stand up to it. From our home base in Lake
              County, we serve Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and
              Trumbull Counties, guiding customers through everything from the first inspection to
              insurance claims and final installation.
            </p>
          </motion.div>
        </div>
      </section>

      <AboutSection />
      <Footer />
    </div>
  );
}