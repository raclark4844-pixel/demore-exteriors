import React from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, DoorOpen, CloudSun, Layers, BadgeCheck } from "lucide-react";
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

const doorsSections = [
  {
    icon: DoorOpen,
    title: "Entry doors",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        A worn entry door drafts, sticks, or no longer seals. We help you choose a replacement that fits the opening and the look of the home, then install it so the frame, threshold, and weatherseal work as a system. See related options on our{" "}
        <Link to="/products" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          products
        </Link>{" "}
        page.
      </p>
    ),
  },
  {
    icon: CloudSun,
    title: "Storm and screen doors",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Storm and screen doors add a layer of weather protection and airflow without replacing the main entry. We install units that fit the existing opening and operate smoothly with your primary door — useful in Northeast Ohio seasons when you want ventilation without leaving the house open.
      </p>
    ),
  },
  {
    icon: Layers,
    title: "Related window and siding work",
    content: (
      <p className="text-sm text-muted-foreground leading-relaxed">
        Door projects often sit next to windows, trim, or siding that also need attention. When that work belongs in the same scope, we include it so the elevation stays consistent. For glass openings, see our{" "}
        <Link to="/windows" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          windows
        </Link>{" "}
        page. For storm-related damage and claims context, see{" "}
        <Link to="/insurance-claims" className="text-primary font-semibold hover:text-primary/80 transition-colors">
          insurance claims
        </Link>
        . Or start from the{" "}
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
        We install ProVia and Gerkin doors, Larson storm and screen doors, and Therma-Tru entry doors. We'll help you compare what's available for your openings. We do not invent certifications or dealer-program claims.
      </p>
    ),
  },
];

const faqs = [
  {
    q: "What doors do you install?",
    a: "ProVia Embarq fiberglass, Therma-Tru Fiber-Classic and Smooth-Star, and Larson storm doors.",
  },
  {
    q: "Can you replace just the slab or the full frame?",
    a: "We offer full-frame or insert replacement.",
  },
  {
    q: "Are the door systems Energy Star certified?",
    a: "Yes, where the system qualifies.",
  },
];

export default function Doors() {
  useSEO({
    title: "Exterior Door Installation | Demore Mentor",
    description:
      "Demore Exterior Solutions installs ProVia and Therma-Tru entry doors in Mentor and Northeast Ohio. Energy-efficient fiberglass and steel. Free estimate. (440) 920-6133.",
    keywords:
      "door installation Northeast Ohio, entry doors Mentor OH, storm doors Lake County Ohio, screen doors Cuyahoga County, ProVia doors Ohio, Gerkin doors Northeast Ohio, Larson storm doors Ohio, Therma-Tru entry doors Ohio",
    canonical: "/doors",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": ["HomeAndConstructionBusiness", "FAQPage"],
      name: "Demore Exterior Solutions",
      url: "https://www.demoreexteriorsolutions.com/doors",
      telephone: "+1-440-920-6133",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
      areaServed: COUNTIES.map((county) => ({ "@type": "AdministrativeArea", name: county })),
      serviceType: ["Entry Door Installation", "Storm Door Installation", "Screen Door Installation"],
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/7128de8e1_generated_image.png"
            alt="Entry door with a matching storm door installed on a Northeast Ohio home"
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
            Based in Mentor, Demore Exterior Solutions installs and replaces exterior doors across all eight counties — not Mentor alone. We handle entry doors, storm and screen doors, and related window or siding work when it belongs with the job.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Door <span className="text-primary">Installation</span>
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
            {doorsSections.map((section, i) => {
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
              Honest answers about your doors — no pressure.
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