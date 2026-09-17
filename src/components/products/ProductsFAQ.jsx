import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Do you only sell products in Mentor?",
    a: "No. We’re based in Mentor and install across Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties, including the communities listed above and surrounding areas.",
  },
  {
    q: "Where do your materials come from?",
    a: "Materials are sourced through Apollo Supply Co. in Willoughby, OH.",
  },
  {
    q: "Do you install every product each brand makes?",
    a: "No. We install the roofing, siding, window, and door lines listed here for the jobs we do. We’ll say what’s available for your project without inventing certifications or warranty numbers.",
  },
  {
    q: "Can I see products before we start?",
    a: "Yes. On an inspection we can review options that fit your roof, walls, or openings and point you to the matching service page for how install works.",
  },
];

export default function ProductsFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-heading font-bold mb-8 text-center"
      >
        FAQs
      </motion.h2>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
            >
              <span className="font-heading font-semibold text-sm sm:text-base">{faq.q}</span>
              {open === i ? (
                <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                {faq.a}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}