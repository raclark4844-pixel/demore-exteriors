import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import DamageCheckForm from "@/components/DamageCheckForm";

export default function DamageCheckSection() {
  return (
    <section id="damage-check" className="py-20 bg-secondary/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Free AI Damage Check
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-heading font-bold mb-4"
          >
            Not Sure If the Storm Damaged Your Home?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Snap a few photos of your roof, siding, or gutters and our AI assistant will
            review them instantly — then book your free in-person inspection right here.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <DamageCheckForm />
        </motion.div>
      </div>
    </section>
  );
}