import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText } from "lucide-react";

const terms = [
  {
    title: "Payment Terms",
    content: "Balance is due in full on the day of project completion. All permits and licenses required will be obtained and maintained by Demore Exterior Solutions.",
  },
  {
    title: "Additional Wood Replacement",
    content: "Rotten or deteriorated roof decking found during tear-off must be replaced per manufacturer specifications and local building codes. Cost: $60 per sheet of plywood decking and $9.50 per lineal foot for 1\" solid decking.",
  },
  {
    title: "Unforeseen Site Conditions",
    content: "Demore Exterior Solutions is not responsible for hidden site conditions including additional roofing layers, damaged trusses, or structural abnormalities. Corrective work is billed at $85/hour plus materials with a 10% markup.",
  },
  {
    title: "Insurance Claim Process",
    content: "Customer agrees Demore is entitled to the full RCV (Replacement Cost Value) amount including GC Overhead & Profit, materials sales tax, and base service charges. Supplements approved by the insurance carrier will be remitted to Demore at full RCV.",
  },
  {
    title: "Right to Cancel",
    content: "You may cancel this transaction prior to midnight of the third business day after signing. Payments and deposits will be returned within 10 business days. If an insurance claim is denied, the agreement can be cancelled without penalty.",
  },
  {
    title: "Post-Cancellation Period",
    content: "After the 3-day cancellation period, cancellation requires payment for all materials ordered, permit fees, engineering costs, special-order items, and labor performed. Special-order materials are nonrefundable once ordered.",
  },
];

export default function TermsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="terms" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              Transparency First
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Terms & Conditions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We believe in complete transparency. Here's a clear summary of our working agreement.
          </p>
        </motion.div>

        <div className="space-y-3">
          {terms.map((term, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-card border border-border/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-heading font-semibold text-sm sm:text-base">{term.title}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {term.content}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          For the complete terms document, please{" "}
          <a
            href="https://media.base44.com/files/public/user_6a22dc88783b484dd6ef2b08/17c435028_DemoreTermsandconditions.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            download our full Terms & Conditions (PDF)
          </a>.
        </motion.p>
      </div>
    </section>
  );
}