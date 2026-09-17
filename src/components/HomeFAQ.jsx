import React from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What areas does Demore Exterior Solutions serve?",
    a: "We are based in Mentor, Ohio and serve Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties.",
  },
  {
    q: "Do you help with storm damage and insurance claims?",
    a: "Yes. We inspect hail and wind damage and work with your insurance company. If the claim is denied, you owe nothing.",
  },
  {
    q: "How do I get a free estimate?",
    a: "Call (440) 920-6133 or use the estimate form on this page.",
  },
];

export default function HomeFAQ() {
  return (
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
  );
}