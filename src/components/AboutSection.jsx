import React from "react";
import { motion } from "framer-motion";
import { Award, Users, ShieldCheck, Clock } from "lucide-react";

const stats = [
  { icon: Award, label: "Licensed & Insured", value: "General Contractor" },
  { icon: Users, label: "Insurance Claims", value: "Expert Negotiators" },
  { icon: ShieldCheck, label: "Warranties", value: "Manufacturer Backed" },
  { icon: Clock, label: "Response Time", value: "Same-Day Available" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              About Demore
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3 mb-6">
              Built on Integrity,{" "}
              <span className="text-primary">Driven by Excellence</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded by Ryan Bomer, Demore Exterior Solutions has established itself as a leading exterior 
                restoration contractor in Northeast Ohio. Our team brings extensive experience in 
                residential and commercial roofing, siding, and gutter systems.
              </p>
              <p>
                We specialize in navigating the insurance claims process, ensuring homeowners 
                receive the full coverage they deserve. As a licensed and insured general contractor, 
                we handle every aspect of the project — from initial inspection and documentation 
                through final installation and warranty registration.
              </p>
              <p>
                Our commitment to quality craftsmanship, transparent communication, and customer 
                satisfaction has made us the trusted choice for homeowners across Mentor, Painesville, 
                Willoughby, Kirtland, Chardon, and the greater Lake County area.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                className="bg-card border border-border/50 rounded-2xl p-5 text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="font-heading font-bold text-sm mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}