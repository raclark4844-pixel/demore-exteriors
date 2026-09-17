import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CloudHail,
  Wind,
  Snowflake,
  Camera,
  ShieldCheck,
  Phone,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServingCitiesRow from "@/components/ServingCitiesRow";

const STORM_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/b968d3226_generated_image.png";

const damageTypes = [
  {
    icon: CloudHail,
    title: "Hail damage",
    paragraphs: [
      "Hail can bruise or crack shingles, dent metal, and scar siding. Look for missing granules, cracked tabs, dented gutters or downspouts, and pitted window screens. Some damage is easy to miss from the ground.",
      "An on-site damage assessment shows what's cosmetic and what needs repair.",
    ],
    link: { to: "/damage-assessment", label: "See how we assess damage on-site" },
  },
  {
    icon: Wind,
    title: "Wind damage",
    paragraphs: [
      "Wind can lift shingles, peel underlayment, loosen flashing, and blow debris into siding or windows. Check for missing or curled shingles, exposed nail heads, damaged ridge caps, and loose trim. Even a few missing shingles can lead to leaks if left open.",
    ],
  },
  {
    icon: Snowflake,
    title: "Ice dams",
    paragraphs: [
      "Ice dams form when meltwater refreezes at the eaves. Water can back up under shingles and into the attic or walls. Signs include ice at the gutters, water stains on ceilings, and wet insulation.",
      "Addressing the roof surface, ventilation, and gutters helps stop repeat problems.",
    ],
  },
];

const photoChecklist = [
  "Full elevations of the house (all sides)",
  "Close-ups of damaged shingles, siding, windows, gutters, and decks",
  "Interior stains, drips, or wet spots",
  "Debris that came from the roof or siding",
  "Date-stamped shots if your phone supports them",
];

const whatWeCanDo = [
  "Inspect and document storm-related exterior damage",
  "Share clear findings you can use with your insurer",
  "Answer practical questions about repair scope",
  "Complete approved repairs once you and your insurer are aligned",
];

const faqs = [
  {
    q: "What if insurance denies the claim?",
    a: "If your insurance company does not agree to pay for needed repairs, you owe Demore Exterior Solutions nothing.",
  },
  {
    q: "What storm damage do you handle?",
    a: "Missing or damaged shingles, dented roofs, gutters, siding, and related leaks.",
  },
  {
    q: "How do I start?",
    a: "Schedule a free inspection or call (440) 920-6133.",
  },
];

export default function InsuranceClaims() {
  useSEO({
    title: "Storm Damage & Insurance Claims Northeast Ohio | Demore Exterior Solutions",
    description:
      "Hail and wind damage inspections in Northeast Ohio. Demore documents the claim and works with your insurer. Call (440) 920-6133.",
    keywords:
      "storm damage repair Northeast Ohio, hail damage roof Cuyahoga County, wind damage siding Lake County, ice dam removal Geauga County, storm damage insurance claim Ohio, roof damage inspection Mentor OH, storm damage repair Painesville Willoughby, insurance claim roofing contractor Ohio",
    canonical: "/insurance-claims",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Storm Damage Repair & Insurance Claims Guidance",
          description:
            "Hail, wind, and ice dam damage repair across Northeast Ohio. Demore Exterior Solutions inspects storm damage, documents findings, and helps homeowners understand next steps for repair and insurance.",
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com",
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
          serviceType: ["Storm Damage Repair", "Hail Damage Repair", "Wind Damage Repair", "Ice Dam Repair"],
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
            src={STORM_IMG}
            alt="Storm-damaged asphalt shingle roof with lifted and bruised shingles in Northeast Ohio"
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
            <AlertTriangle className="w-4 h-4" />
            Storm Damage Specialists
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Storm Damage &amp; Insurance Claims in <span className="text-primary">Northeast Ohio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-foreground font-heading font-semibold max-w-2xl mx-auto mb-8"
          >
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-sm sm:text-base text-foreground/80 leading-relaxed space-y-4 mb-10"
          >
            <p>
              Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties, including Mentor, Willoughby, Painesville, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, Warren, and surrounding communities.
            </p>
            <p>
              Northeast Ohio weather hits hard — hail, high wind, and ice dams can damage roofs, siding, windows, gutters, and decks. Based in Mentor, Demore Exterior Solutions inspects storm damage, documents what we find, and helps you understand next steps for repair and insurance.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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

      {/* Serving row */}
      <ServingCitiesRow />

      {/* Damage Types */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {damageTypes.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-heading font-bold text-xl mb-3">{type.title}</h2>
                {type.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {type.link && (
                  <Link to={type.link.to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    {type.link.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Photograph */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">What to Photograph After a Storm</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Before you clean up, take clear photos from the ground:
            </p>
          </motion.div>
          <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8">
            <ul className="space-y-3 mb-6">
              {photoChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-foreground/80">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/50 pt-6">
              Keep a simple list of when you first noticed the damage and any prior leaks. Bring those photos to your inspection and your insurer.
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Overview */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">Insurance Overview</h2>
            <p className="text-xs font-heading font-semibold text-muted-foreground tracking-widest uppercase mt-3">
              Not legal advice
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8"
          >
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
              Many homeowners policies cover sudden storm damage to the exterior. Coverage depends on your policy, deductibles, and what the adjuster documents. We are not your attorney or insurance agent — we do not give legal advice.
            </p>
            <h3 className="font-heading font-bold text-lg mb-4">What we can do:</h3>
            <ul className="space-y-3 mb-6">
              {whatWeCanDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-foreground/80">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Start with a{" "}
              <a href="/#contact" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                free inspection
              </a>
              . If you need materials and system options after the claim path is clear, see our{" "}
              <Link to="/products" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                products
              </Link>
              . For the full company overview, visit our{" "}
              <Link to="/" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                home page
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
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
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-8">
              Get a Free Inspection
            </h2>
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