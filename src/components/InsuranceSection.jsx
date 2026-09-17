import React from "react";
import { motion } from "framer-motion";
import { FileText, DollarSign, ClipboardCheck, Wrench } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "File Your Claim",
    description: "We represent you and assist in obtaining your insurance company's approval for restoration funds. If denied, you owe nothing.",
  },
  {
    icon: DollarSign,
    title: "Initial ACV Payment",
    description: "Receive the initial check with the detailed work scope. We help you select available options, order materials, and schedule the work.",
  },
  {
    icon: Wrench,
    title: "Professional Installation",
    description: "Our crew completes all repairs per the insurance work scope. We order inspections during and after the restoration process.",
  },
  {
    icon: ClipboardCheck,
    title: "Final Settlement",
    description: "After final inspection, your insurance releases the depreciation check. Any supplements for unforeseen costs are negotiated by us.",
  },
];

export default function InsuranceSection() {
  return (
    <section id="insurance" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
            Insurance Claims Made Simple
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3 mb-4">
            How Our Process Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We handle the complexity of insurance claims so you can focus on your life.
            Our contingency agreement means{" "}
            <strong className="text-foreground">if your claim is denied, you owe nothing</strong>.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-primary/40 to-transparent z-0" />
              )}
              <div className="relative bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-heading font-bold text-muted-foreground tracking-widest">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-card border border-primary/20 rounded-2xl p-6 sm:p-8 text-center"
        >
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            <strong className="text-foreground">Zero-Risk Contingency Agreement:</strong>{" "}
            If your insurance company does not agree to pay for needed repairs, this agreement is automatically terminated. 
            You will not owe anything to Demore Exterior Solutions, and we will not be required to perform any work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}