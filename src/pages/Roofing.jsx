import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Phone,
  ArrowRight,
  Wrench,
  CloudSnow,
  CloudHail,
  Wind,
  ClipboardCheck,
  BadgeCheck,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROOF_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/a39731061_generated_image.png";

const repairVsReplace = {
  repair: {
    icon: Wrench,
    title: "When repair makes sense",
    points: [
      "A few lifted or missing shingles",
      "A small leak around a vent, chimney, or flashing",
      "One patched section on an otherwise sound roof",
      "Damage limited to a single slope or area",
    ],
  },
  replace: {
    icon: Layers,
    title: "When replacement makes sense",
    points: [
      "Shingles curling or losing granules across whole slopes",
      "Soft decking underfoot when we walk the roof",
      "Multiple patches — repairs start costing more than they save",
      "A roof that's simply lived out its years",
    ],
  },
};

const weather = [
  {
    icon: CloudSnow,
    title: "Lake-effect snow & ice dams",
    text: "Lake-effect snow piles up and refreezes at the roof's edges, forcing ice dams that push water back up under the shingles — a leak source that has nothing to do with how old the roof is.",
  },
  {
    icon: CloudHail,
    title: "Hail",
    text: "Spring and summer hail knocks the protective granules off shingles, aging them years in minutes. From the ground it can look fine; up close, it isn't.",
  },
  {
    icon: Wind,
    title: "Wind",
    text: "Windstorms lift and tear shingles loose one gust at a time — damage that's easy to miss until water starts showing up on a ceiling.",
  },
];

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Free inspection",
    text: "We get on the roof, check the attic if needed, and photograph what we find.",
  },
  {
    icon: Wrench,
    title: "Straight options",
    text: "Repair vs. replacement, with costs and tradeoffs explained in plain English.",
  },
  {
    icon: Layers,
    title: "The work",
    text: "Tear-off to the deck if we're replacing, proper underlayment and flashing, cleanup like we were never there.",
  },
  {
    icon: BadgeCheck,
    title: "Walkthrough",
    text: "We go over everything with you before we call it done.",
  },
];

const faqs = [
  {
    q: "How do I know if my roof needs repair or full replacement?",
    a: "We inspect it first and show you photos of what we find. Isolated damage usually means a repair; widespread wear, soft decking, or multiple patches usually means replacement is the smarter spend.",
  },
  {
    q: "My roof was hit by hail or wind — should I call you or my insurance company first?",
    a: "Call us and we can inspect and document the roof first. You decide whether to file. If you hire us on a denied claim under our contingency agreement, you owe nothing.",
  },
  {
    q: "How long does a roof replacement take?",
    a: "Most residential replacements are done in a day or two, weather permitting. Larger or steeper roofs take a little longer, and we tell you the timeline up front.",
  },
];

export default function Roofing() {
  useSEO({
    title: "Professional Roofing Contractor in Mentor, OH | Demore Exterior Solutions",
    description:
      "Roof repair and replacement from our Mentor shop. Hail, wind, and lake-effect wear across Northeast Ohio. Free inspection. Call (440) 920-6133.",
    keywords:
      "roofing contractor Mentor OH, roofing contractor Northeast Ohio, roof replacement Mentor OH, roof repair Lake County, roof inspection Cuyahoga County, shingle roof installation Geauga County, reroof Summit County, storm damage roof repair Ohio",
    canonical: "/roofing",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Roofing — Repair, Replacement & Storm Damage",
          description:
            "Roof repair and replacement from our Mentor shop. Hail, wind, and lake-effect wear across Northeast Ohio. Free inspection.",
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Mentor",
              addressRegion: "OH",
            },
          },
          areaServed: [
            { "@type": "AdministrativeArea", name: "Cuyahoga County" },
            { "@type": "AdministrativeArea", name: "Lake County" },
            { "@type": "AdministrativeArea", name: "Geauga County" },
            { "@type": "AdministrativeArea", name: "Summit County" },
            { "@type": "AdministrativeArea", name: "Medina County" },
            { "@type": "AdministrativeArea", name: "Portage County" },
            { "@type": "AdministrativeArea", name: "Ashtabula County" },
            { "@type": "AdministrativeArea", name: "Trumbull County" },
          ],
          serviceType: ["Roof Inspection", "Roof Repair", "Roof Replacement", "Storm Damage Roof Repair"],
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ROOF_IMG}
            alt="Architectural asphalt shingle roof installed by Demore Exterior Solutions in Northeast Ohio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/88 to-background/95" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Layers className="w-4 h-4" />
            Roofing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Expert <span className="text-primary">Roofing Contractor</span> Serving Mentor, OH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-foreground font-heading font-semibold max-w-2xl mx-auto mb-8"
          >
            As a roofing contractor in Mentor, OH, we handle roof repair and replacement for homeowners across Lake County and Northeast Ohio.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                <Phone className="w-5 h-5 mr-2" />
                Call (440) 920-6133
              </Button>
            </a>
            <Link to="/#contact">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold text-base px-8 h-14">
                Request a Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Repair vs Replacement */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Repair or Replacement — What Your Roof Actually Needs</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Not every worn roof needs to come off. We get on the roof, show you what we find, and tell you honestly which side of that line you're on.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[repairVsReplace.repair, repairVsReplace.replace].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{card.title}</h3>
                <ul className="space-y-2">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-primary mt-1 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Northeast Ohio weather */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">What Northeast Ohio Weather Does to a Roof</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Living next to Lake Erie means your roof takes a beating most of the country never sees. All three of these are normal here, and all three are things we inspect for on every visit.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {weather.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
            Storm damage questions and insurance claims have their own page — see{" "}
            <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              storm damage and insurance claims
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Our Process</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-bold text-primary text-lg">{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warranty & Financing */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">Warranty &amp; Financing</h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed mb-8">
              <p>
                Every roofing project is backed by our <strong className="text-foreground">10-year workmanship warranty</strong> on top of the manufacturer's material warranty. If a leak shows up because of how the roof was installed, that's on us — not on you.
              </p>
              <p>
                Need to spread out the cost? <strong className="text-foreground">Financing is available</strong>, and the estimate is always free.
              </p>
              <p>
                Hail or wind hit the siding as hard as the roof? We handle{" "}
                <Link to="/siding" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  siding
                </Link>{" "}
                too — one crew, one walkthrough. We work across{" "}
                <Link to="/service-area/lake" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Lake County
                </Link>{" "}
                and the surrounding counties, from our home base in{" "}
                <Link to="/service-area/lake/mentor" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                  Mentor
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (440) 920-6133
                </Button>
              </a>
              <Link to="/">
                <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8 h-14">
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Roofing FAQs</h2>
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

      {/* CTA */}
      <section className="py-20 bg-primary/10 border-t border-primary/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Free Inspection. Straight Answers.</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We get on the roof, show you what we find, and tell you honestly whether it's a repair or a replacement.
            </p>
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14 text-base">
                <Phone className="w-5 h-5 mr-2" />
                Call (440) 920-6133
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}