import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, Phone, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { openAssistant } from "@/lib/openAssistant";

const faqs = [
  {
    q: "Does Demore Exterior Solutions offer financing?",
    a: "Yes. Demore offers financing options through Acorn and Synchrony for qualified customers. Available products, approval, rates and terms are determined by the financing provider."
  },
  {
    q: "What projects can be financed?",
    a: "Financing may be available for eligible roofing, siding, gutters, windows, doors, decks and other exterior projects. The exact options depend on the project and the financing provider."
  },
  {
    q: "Can financing be used when insurance is involved?",
    a: "Some homeowners use financing for eligible upgrades or other project costs that are not paid by the insurance carrier. Financing does not change your insurance policy or the carrier's coverage decision."
  },
  {
    q: "How do I start?",
    a: "Ask Demore or call (440) 920-6133. We can identify the project scope first and then direct you to the appropriate Acorn or Synchrony financing option."
  }
];

export default function Financing() {
  useSEO({
    title: "Roofing & Exterior Financing | Acorn & Synchrony | Demore Exterior Solutions",
    description: "Financing options for roofing, siding, gutters, windows, doors and exterior projects in Northeast Ohio through Acorn and Synchrony. Ask Demore for options.",
    keywords: "roof financing Mentor Ohio, roofing financing Northeast Ohio, siding financing Lake County, home improvement financing Mentor OH, Acorn financing roofing, Synchrony roofing financing, exterior remodeling financing Ohio",
    canonical: "/financing",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Exterior Project Financing Assistance",
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com"
          },
          areaServed: "Northeast Ohio",
          description: "Demore helps qualified customers access financing options through Acorn and Synchrony for eligible exterior improvement projects."
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6">
            <WalletCards className="w-4 h-4" /> Exterior Project Financing
          </motion.div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">Flexible ways to move your <span className="text-primary">exterior project forward</span></h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mt-6">Demore Exterior Solutions offers financing options through Acorn and Synchrony for qualified customers working on roofing, siding, gutters, windows, doors, decks and other exterior improvements.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button onClick={() => openAssistant("I want to learn about financing options for my exterior project")} size="lg" className="h-14 px-7 font-heading font-bold"><MessageCircle className="w-5 h-5 mr-2" /> Ask About Financing</Button>
            <a href="tel:+14409206133"><Button size="lg" variant="outline" className="h-14 px-7 font-heading font-bold"><Phone className="w-5 h-5 mr-2" /> (440) 920-6133</Button></a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {[{
              name: "Acorn",
              text: "A financing marketplace that may provide qualified homeowners with multiple loan options for eligible home-improvement projects."
            }, {
              name: "Synchrony",
              text: "Consumer financing options that may be available for qualified exterior-remodeling customers, subject to provider approval and program terms."
            }].map((partner) => (
              <div key={partner.name} className="bg-card border border-border/50 rounded-2xl p-7">
                <div className="text-sm text-primary font-heading font-semibold uppercase tracking-widest">Financing Partner</div>
                <h2 className="text-3xl font-heading font-bold mt-2">{partner.name}</h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">{partner.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-border/50 bg-card p-7">
            <h2 className="text-2xl font-heading font-bold">How it works</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-6">
              {["Define the project scope and estimated cost with Demore.", "Review available financing options from the applicable provider.", "Choose whether financing fits your budget and project timeline."].map((text) => (
                <div key={text} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground leading-relaxed">{text}</p></div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-6">Financing is offered by third-party providers. Approval, rates, fees, loan amounts and repayment terms are determined by the provider and may change. Demore Exterior Solutions is not a lender.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center">Financing FAQs</h2>
          <div className="space-y-4 mt-10">
            {faqs.map((item) => (
              <article key={item.q} className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg">{item.q}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={() => openAssistant("I'd like to discuss financing and schedule a free estimate")} className="font-heading font-bold">Start with a Free Estimate <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
