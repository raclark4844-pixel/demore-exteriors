import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Wrench, Hammer, Sun, CloudLightning, House } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COUNTIES = [
  "Cuyahoga County, Ohio",
  "Lake County, Ohio",
  "Geauga County, Ohio",
  "Summit County, Ohio",
  "Medina County, Ohio",
  "Portage County, Ohio",
  "Ashtabula County, Ohio",
  "Trumbull County, Ohio",
];

const decksSections = [
  {
    icon: Wrench,
    title: "Deck inspections and repairs",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Soft boards, loose railings, wobbly stairs, and post issues are safety problems, not just cosmetic ones. We inspect the framing, ledger, footings (where visible), decking, and rail system, then repair what’s failing or outline a rebuild when the structure is past a patch.
      </p>
    ),
  },
  {
    icon: Hammer,
    title: "New decks and rebuilds",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        When a deck is too far gone — or you want a new layout — we build to fit how you use the yard: size, stairs, and railing lines that match the house. We’ll talk through board and railing options in plain terms without inventing product lines or certifications. Related materials live on our{" "}
        <Link to="/products" className="text-primary font-semibold hover:text-primary/80 transition-colors">products</Link>{" "}
        page.
      </p>
    ),
  },
  {
    icon: Sun,
    title: "Outdoor living: 3- and 4-season rooms",
    content: (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Outdoor living here means decks plus enclosed rooms that extend how you use the house.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          3-season rooms are screened or enclosed spaces built for spring through fall. They add usable square footage without the full build-out of a year-round room.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          4-season rooms are insulated, conditioned spaces meant for year-round use. Scope depends on the structure, glass, and how the room ties into heating and cooling — we’ll spell out what’s in the job without inventing system brands, glass packages, or comfort numbers.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Both room types attach to the house. That means careful flashing, siding transitions, and door or window openings so water stays out where the new space meets the existing wall.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Storms can hit rooms and decks the same way they hit the rest of the exterior — broken screens or glass, damaged frames, lifted deck boards, or failed railings. We inspect, document, and repair or rebuild what’s needed.
        </p>
      </div>
    ),
  },
  {
    icon: CloudLightning,
    title: "Storm-damaged decks",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Wind, fallen limbs, and heavy ice can break railings, lift boards, or stress the frame. We document the damage, make the area safe, and repair or rebuild as needed. For claims context, see{" "}
        <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">storm damage and insurance claims</Link>.
      </p>
    ),
  },
  {
    icon: House,
    title: "How decks tie into the rest of the exterior",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        A deck ledger meets the house wall. Flashing, siding, and door thresholds matter so water doesn’t sit against the structure. When wall or entry work belongs with the deck job, we include it so the elevation stays consistent. See{" "}
        <Link to="/siding" className="text-primary font-semibold hover:text-primary/80 transition-colors">siding</Link>{" "}
        when the wall is part of the scope, or start from the{" "}
        <Link to="/" className="text-primary font-semibold hover:text-primary/80 transition-colors">home page</Link>.
      </p>
    ),
  },
];

const faqs = [
  {
    q: "Do you build new decks and replace old ones?",
    a: "Yes. New design and construction, full replacement, and structural repairs.",
  },
  {
    q: "Wood or composite?",
    a: "Both. We also build stairs, railings, and elevated decks to code.",
  },
  {
    q: "Do you handle permits and code?",
    a: "Decks are engineered to code. We handle the build from framing to finish.",
  },
];

export default function Decks() {
  useSEO({
    title: "Decks & Outdoor Living | Demore Ohio",
    description:
      "Demore Exterior Solutions builds wood and composite decks, stairs, and railings in Mentor and Northeast Ohio. Code-built from design to install. (440) 920-6133.",
    keywords:
      "deck builder Northeast Ohio, deck repair Mentor OH, deck rebuild Lake County Ohio, new deck construction Cuyahoga County, composite decks Geauga County, deck railing replacement Summit County, deck framing repair Medina County",
    canonical: "/decks",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": ["HomeAndConstructionBusiness", "FAQPage"],
      name: "Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/decks",
      telephone: "+1-440-920-6133",
      areaServed: COUNTIES.map((county) => ({ "@type": "AdministrativeArea", name: county })),
      serviceType: ["Deck Construction", "Deck Repair", "Deck Replacement", "Deck Railings"],
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/752549e9f_generated_image.png"
            alt="Newly built backyard deck with an adjoining three-season room in Northeast Ohio"
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
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed mb-4"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties, including Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, Warren, and surrounding communities.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Based in Mentor, Demore Exterior Solutions builds, repairs, and replaces decks across all eight counties — not Mentor alone. We focus on sound structure, boards and railings that hold up to Northeast Ohio weather, and storm-damaged outdoor living spaces.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Decks & <span className="text-primary">Outdoor Living</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/#contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                Get a Free Inspection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="tel:4409206133">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold text-base px-8 h-14">
                <Phone className="w-4 h-4 mr-2" />
                (440) 920-6133
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {decksSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.08 }}
                  className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-heading font-bold text-lg">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
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

      {/* CTA */}
      <section className="py-20 bg-primary/10 border-t border-primary/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Get a Free Inspection
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Honest answers about your deck — no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  Get a Free Inspection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="tel:4409206133">
                <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8 h-14">
                  <Phone className="w-4 h-4 mr-2" />
                  (440) 920-6133
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}