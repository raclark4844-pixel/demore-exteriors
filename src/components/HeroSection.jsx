import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MapPin } from "lucide-react";

const HERO_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/32cd86151_generated_image.png";

const trust = [
  "Mentor-Based",
  "26 Years Experience",
  "Licensed & Insured",
  "Storm & Insurance Restoration",
  "500+ Projects",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Demore Exterior Solutions roofing and siding contractor working on a Northeast Ohio home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-1/3 left-0 right-0 h-px bg-primary/20 origin-left"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute top-0 bottom-0 left-1/4 w-px bg-primary/10 origin-top"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary tracking-widest uppercase font-heading">
              Mentor, Ohio · Serving Northeast Ohio
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.05] mb-5"
          >
            <span className="text-primary">Mentor, Ohio</span> Roofing &amp; Siding Contractor
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl sm:text-2xl text-foreground font-heading font-semibold mb-6"
          >
            Roofing, siding, gutters, storm restoration and exterior work for homeowners in Mentor and throughout Northeast Ohio.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mb-8 max-w-2xl text-sm sm:text-base text-foreground/80 leading-relaxed space-y-3"
          >
            <p>
              Based in Mentor · Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull Counties
            </p>
            <p>
              We handle roofing, siding, windows, doors, gutters, decks, and storm damage — from repairs to full replacements.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <a href="tel:+14409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14 min-w-[220px]">
                <Phone className="w-5 h-5 mr-2" />
                Call (440) 920-6133
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="border-primary/40 text-foreground hover:bg-primary/10 font-heading font-bold text-base px-8 h-14 min-w-[180px]">
                Request a Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="-mt-5 mb-6 text-sm sm:text-base text-foreground/80 font-medium"
          >
            Free, no-obligation inspection for Northeast Ohio homeowners · Written estimate included.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-heading font-semibold text-foreground/90 border-t border-border/50 pt-6 max-w-2xl"
          >
            {trust.map((t, i) => (
              <span key={t} className="flex items-center gap-x-5">
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary/70 flex-shrink-0" />}
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 max-w-md text-sm text-muted-foreground"
          >
            <h2 className="font-heading font-bold text-base text-foreground mb-1">Demore's Daily Fact</h2>
            <p className="leading-relaxed mb-3">
              Today's 30-second rabbit hole. We work on houses all day. That doesn't mean everything we talk about has to be shingles. Check out today's weird, interesting or completely useless fact.
            </p>
            <a href="/daily-fact/today">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-heading font-bold text-sm hover:bg-primary/90 transition-colors">
                See Today's Fact →
              </button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}