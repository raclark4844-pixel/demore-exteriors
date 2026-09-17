import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";

const STORM_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/cb2ea5c71_generated_image.png";
const SHINGLE_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/fd09958b1_generated_image.png";

const signs = [
  "Missing, cracked, or curling shingles",
  "Dents or bruising on roof surfaces",
  "Damaged or dislodged gutters",
  "Cracked or warped siding panels",
  "Leaks or water stains on ceilings",
  "Granule loss in downspouts or gutters",
];

export default function StormDamageSection() {
  return (
    <section id="storm-damage" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
              <img
                src={STORM_IMG}
                alt="Storm-damaged residential roof requiring repair in Northeast Ohio"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:right-8 w-48 sm:w-56 rounded-xl overflow-hidden border-4 border-background shadow-xl">
              <img
                src={SHINGLE_IMG}
                alt="Completed asphalt shingle roof installation by Demore Exterior Solutions"
                className="w-full h-36 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-3">
                <span className="text-xs font-heading font-bold text-primary">After Restoration →</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <span className="text-sm font-heading font-semibold text-accent tracking-widest uppercase">
                Storm Damage Specialists
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              From Devastation to{" "}
              <span className="text-primary">Restoration</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Northeast Ohio's severe weather can wreak havoc on your home's exterior.
              Our team specializes in identifying, documenting, and repairing storm damage — 
              working directly with your insurance company to ensure full coverage of needed repairs.
            </p>

            <h3 className="text-sm font-heading font-semibold text-foreground/80 uppercase tracking-wider mb-4">
              Signs of Storm Damage
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {signs.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {sign}
                </li>
              ))}
            </ul>

            <a href="#contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                Schedule Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}