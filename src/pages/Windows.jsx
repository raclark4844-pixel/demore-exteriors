import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, AppWindow, Thermometer, CloudHail, DoorOpen, BadgeCheck } from "lucide-react";
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

const windowsSections = [
  {
    icon: AppWindow,
    title: "Replacement windows",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Failed seals, drafts, hard-to-open sashes, and worn frames are common reasons to replace. We measure, recommend a fit for each opening, and install replacement windows that match the home's look and how you use the rooms. See related options on our{" "}
        <Link to="/products" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          products
        </Link>{" "}
        page.
      </p>
    ),
  },
  {
    icon: Thermometer,
    title: "Energy and comfort",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Newer windows can cut drafts, reduce condensation on glass, and make rooms easier to heat and cool. We'll talk through glass packages and frame options in plain terms — what changes day-to-day comfort in Northeast Ohio winters and summers, without overselling.
      </p>
    ),
  },
  {
    icon: CloudHail,
    title: "Storm-damaged windows",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Hail, wind, and debris can crack glass, bend frames, or break screens and locks. We inspect the opening, repair or replace what's damaged, and document scope when you're working with an insurer. More on that process is on{" "}
        <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          storm damage and insurance claims
        </Link>
        .
      </p>
    ),
  },
  {
    icon: DoorOpen,
    title: "Related entry work",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Window projects sometimes sit next to doors, trim, or siding that also need attention. When entry or cladding work belongs with the window scope, we include it so the exterior stays consistent. For wall systems, see our{" "}
        <Link to="/siding" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          siding
        </Link>{" "}
        page, or start from the{" "}
        <Link to="/" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          home page
        </Link>
        .
      </p>
    ),
  },
  {
    icon: BadgeCheck,
    title: "Manufacturers we install",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        We install windows from ProVia and Gerkin. We'll help you compare what's available for your openings. We do not invent certifications or dealer-program claims.
      </p>
    ),
  },
];

const faqs = [
  {
    q: "Which window brands do you install?",
    a: "ProVia Endure and Aeris fiberglass and Gerkin Series 900 vinyl replacement windows.",
  },
  {
    q: "Are the windows Energy Star certified?",
    a: "Yes. We install Energy Star certified glass packages.",
  },
  {
    q: "Do you flash replacement windows correctly?",
    a: "Yes. Every opening is flashed and finished for lasting performance.",
  },
];

export default function Windows() {
  useSEO({
    title: "Window Replacement Mentor OH | Demore",
    description:
      "Demore Exterior Solutions replaces windows in Mentor and Northeast Ohio. Energy Star ProVia and Gerkin units with proper flashing. Free in-home estimate. (440) 920-6133.",
    keywords:
      "window replacement Northeast Ohio, replacement windows Mentor OH, window installation Lake County Ohio, ProVia windows Ohio, Gerkin windows Northeast Ohio, energy efficient windows Cuyahoga County, storm damage window replacement Ohio",
    canonical: "/windows",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": ["HomeAndConstructionBusiness", "FAQPage"],
      name: "Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/windows",
      telephone: "+1-440-920-6133",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
      areaServed: COUNTIES.map((county) => ({ "@type": "AdministrativeArea", name: county })),
      serviceType: ["Window Replacement", "Storm Damage Window Repair"],
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/6f88ef730_generated_image.png"
            alt="Newly installed white double-hung replacement windows on a Northeast Ohio home"
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
            Based in Mentor, Demore Exterior Solutions replaces and repairs windows across all eight counties — not Mentor alone. We focus on replacement windows, better energy and comfort, storm-damaged units, and related entry work when it belongs with the job.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Window <span className="text-primary">Replacement</span>
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
            {windowsSections.map((section, i) => {
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
              Honest answers about your windows — no pressure.
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