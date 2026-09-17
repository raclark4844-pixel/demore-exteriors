import React from "react";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

export default function Contact() {
  useSEO({
    title: "Contact Us | Free Estimates | Demore Exterior Solutions",
    description:
      "Get in touch with Demore Exterior Solutions for a free estimate. Call (440) 920-6133, stop by our Mentor, OH office, or send us a message online.",
    canonical: "/contact",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/contact",
      telephone: "+1-440-920-6133",
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
            className="text-4xl sm:text-5xl font-heading font-bold"
          >
            Contact <span className="text-primary">Us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base leading-relaxed mt-4"
          >
            Call us at <a href="tel:4409206133" className="text-primary font-semibold">(440) 920-6133</a>,
            email <a href="mailto:ryan@demoreexteriorsolutions.com" className="text-primary font-semibold">ryan@demoreexteriorsolutions.com</a>,
            or use the form below to request your free estimate.
          </motion.p>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
}