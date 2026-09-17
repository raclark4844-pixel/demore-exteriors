import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Camera, CheckCircle2, CloudHail, FileText, MessageCircle, Phone, ShieldCheck, Wallet, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import useSEO from "@/hooks/useSEO";
import { openAssistant } from "@/lib/openAssistant";

const faqs = [
  {
    q: "What should I do after a hail or wind storm in Northeast Ohio?",
    a: "Start with safety. Photograph visible damage from the ground, protect active interior leaks if you can do so safely, and schedule a professional exterior inspection. Demore can inspect the roof, siding, gutters and related exterior components and provide contractor documentation before you decide what to do next."
  },
  {
    q: "Can hail damage a roof even if it is not leaking yet?",
    a: "Yes. Hail can bruise shingles, loosen granules, damage vents and soft metals, or compromise siding without causing an immediate interior leak. A close inspection is often needed because storm damage can be difficult to see from the ground."
  },
  {
    q: "Should I call Demore or my insurance company first?",
    a: "You may contact either first. Many homeowners choose to have the property inspected and documented before deciding whether to open a claim. Coverage decisions are made by the insurance carrier under the policy; Demore provides contractor inspection, repair scope and restoration documentation."
  },
  {
    q: "What is an insurance supplement?",
    a: "A supplement is a request for the carrier to review additional documented repair costs or scope items that were not included in the original estimate. Demore can provide contractor measurements, photos, material information and repair pricing to support the work that is actually required."
  },
  {
    q: "Does Demore offer financing for storm repairs or non-insurance work?",
    a: "Yes. Financing options are available through Acorn and Synchrony for qualified customers. Availability and terms depend on the financing provider and the applicant."
  }
];

const damageSigns = [
  { icon: CloudHail, title: "Hail impacts", text: "Bruised or missing shingle granules, dents in vents and gutters, cracked siding, damaged trim and soft-metal impacts." },
  { icon: Wind, title: "Wind damage", text: "Lifted, creased or missing shingles, loosened siding, displaced flashing, fascia damage and wind-driven water entry." },
  { icon: AlertTriangle, title: "Active leaks", text: "Ceiling stains, attic moisture, wet insulation or dripping after a storm should be treated as a priority inspection." }
];

const process = [
  ["1", "Inspect", "We inspect the roof, siding, gutters, windows, doors and exterior components that may have been affected."],
  ["2", "Document", "We photograph conditions, record measurements and identify repair or replacement needs from a contractor's perspective."],
  ["3", "Plan", "You receive clear repair options. If an insurance claim is involved, we can provide contractor documentation and scope information for the work."],
  ["4", "Restore", "Approved work is completed to applicable code and manufacturer installation requirements, followed by cleanup and a final walkthrough."]
];

export default function StormDamage() {
  useSEO({
    title: "Storm Damage Roof & Siding Repair | Mentor, OH & Northeast Ohio | Demore",
    description: "Hail, wind and storm damage inspections for roofs, siding and gutters in Mentor and Northeast Ohio. Phone intake, photo damage check and free inspection. Call (440) 920-6133.",
    keywords: "storm damage contractor Mentor Ohio, hail damage roof Mentor OH, wind damage roof Northeast Ohio, storm damage siding Lake County, hail damage roofing Cuyahoga County, insurance restoration contractor Mentor, emergency roof leak Northeast Ohio, storm damage inspection Ohio, roof hail inspection Mentor 44060",
    canonical: "/storm-damage",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "@id": "https://www.demoreexteriorsolutions.com/storm-damage#service",
          name: "Storm Damage Inspection & Exterior Restoration",
          serviceType: ["Hail Damage Inspection", "Wind Damage Inspection", "Storm Damage Roof Repair", "Storm Damage Siding Repair", "Emergency Exterior Inspection"],
          description: "Hail and wind damage inspection, contractor documentation and exterior restoration for Northeast Ohio properties.",
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com"
          },
          areaServed: [
            "Lake County, Ohio", "Cuyahoga County, Ohio", "Geauga County, Ohio", "Summit County, Ohio",
            "Medina County, Ohio", "Portage County, Ohio", "Ashtabula County, Ohio", "Trumbull County, Ohio"
          ],
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free exterior storm damage inspection. Insurance coverage decisions remain with the carrier under the policy."
          }
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a }
          }))
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.demoreexteriorsolutions.com/" },
            { "@type": "ListItem", position: 2, name: "Storm Damage", item: "https://www.demoreexteriorsolutions.com/storm-damage" }
          ]
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-base sm:text-lg">Storm damage? Call now.</p>
              <p className="text-sm text-muted-foreground mt-1">We can collect your storm details and help start an inspection request.</p>
            </div>
            <a href="tel:+14409206133" className="shrink-0">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
              </Button>
            </a>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-5">
              <ShieldCheck className="w-4 h-4" /> Northeast Ohio Storm Restoration
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              Hail & Wind Damage Help for <span className="text-primary">Mentor and Northeast Ohio</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
              We inspect roofs, siding, gutters and exterior components after severe weather, document what we find, explain repair options and restore damaged exteriors. You get contractor facts first — not pressure to file a claim.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:+14409206133">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold h-14 px-7"><Phone className="w-5 h-5 mr-2" /> Call Now</Button>
              </a>
              <Button onClick={() => openAssistant("I need help after a storm and want to schedule an inspection")} size="lg" variant="outline" className="h-14 px-7 font-heading font-bold"><MessageCircle className="w-5 h-5 mr-2" /> Ask Demore</Button>
              <Link to="/damage-assessment">
                <Button size="lg" variant="outline" className="h-14 px-7 font-heading font-bold"><Camera className="w-5 h-5 mr-2" /> Free AI Damage Check</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">What to do right after a storm</h2>
            <p className="text-muted-foreground mt-4 text-lg">If a storm just moved through, focus on safety and evidence. You do not need to diagnose the roof yourself.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Stay off a wet, steep or damaged roof. Photograph visible exterior and interior damage from safe locations.",
              "If water is actively entering, contain it inside when safe and call for a priority inspection.",
              "Do not discard damaged materials or make permanent repairs before documenting conditions unless needed to prevent additional damage.",
              "Have a qualified contractor inspect the exterior and explain what is repairable, what may require replacement, and what documentation exists."
            ].map((text) => (
              <div key={text} className="bg-card border border-border/50 rounded-2xl p-5 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Storm damage we look for</h2>
            <p className="text-muted-foreground mt-4">Small impacts can matter. The goal is to document conditions accurately, not to assume every mark is storm damage.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {damageSigns.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-primary" /></div>
                <h3 className="font-heading font-bold text-xl mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-primary font-heading font-semibold text-sm uppercase tracking-widest">Inspection to restoration</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3">A clear process when the weather is not clear</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {process.map(([number, title, text]) => (
              <div key={number} className="bg-card border border-border/50 rounded-2xl p-5">
                <div className="text-primary font-heading font-bold text-sm mb-3">STEP {number}</div>
                <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 flex gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Insurance note:</strong> Demore is your contractor, not your insurer or public adjuster. We can inspect, estimate, photograph and document the construction work. Your carrier makes coverage decisions under your policy.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl border border-border/50 bg-card p-7">
            <Wallet className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">Financing for retail or uncovered work</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">Demore offers financing options through <strong className="text-foreground">Acorn</strong> and <strong className="text-foreground">Synchrony</strong> for qualified customers. This can help with deductibles where permitted, upgrades, non-covered work, or retail exterior projects. Provider approval and terms apply.</p>
            <Link to="/financing" className="inline-flex mt-6"><Button variant="outline" className="font-heading font-bold">Explore Financing <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-7">
            <Camera className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-2xl sm:text-3xl font-heading font-bold">Not sure whether the storm caused damage?</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">Upload a few exterior photos for a quick AI-assisted first look, then schedule a free in-person inspection if anything needs a closer review.</p>
            <Link to="/damage-assessment" className="inline-flex mt-6"><Button className="font-heading font-bold">Start Free Damage Check <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Storm damage questions, answered directly</h2>
            <p className="text-muted-foreground mt-3">Clear answers to common questions about storm inspections and repairs.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <article key={item.q} className="bg-card border border-border/50 rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg">{item.q}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/insurance-claims"><Button variant="outline" className="font-heading font-bold">See the Insurance Claim Process <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>

      <ContactSection mode="inspection" />
      <Footer />
    </div>
  );
}