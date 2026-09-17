import React, { useState } from "react";
import { openAssistant } from "@/lib/openAssistant";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Home,
  Layers,
  Droplets,
  ArrowRight,
  CheckCircle,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Wrench,
  Award,
  Building2,
  DoorOpen,
  Square,
  Trees,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roofingProcess = [
  {
    title: "Full Tear-Off to the Decking",
    description:
      "We never roof over old shingles. Every job starts with a complete tear-off of all existing roofing material down to the bare decking. This is the only way to identify and fix hidden problems before they're sealed in.",
  },
  {
    title: "Thorough Deck Inspection & Repair",
    description:
      "Once exposed, every square foot of your roof deck is inspected for rot, soft spots, water damage, and compromised wood. Any damaged decking is replaced with new OSB or plywood before a single shingle goes down — at no surprise cost.",
  },
  {
    title: "Ice & Water Shield Installation",
    description:
      "We install ice and water shield membrane along all eaves, valleys, and penetrations — exceeding Ohio building code minimums. This self-sealing layer is your last line of defense against ice dams and wind-driven rain.",
  },
  {
    title: "Synthetic Underlayment",
    description:
      "Premium synthetic underlayment is applied across the entire roof deck, providing superior moisture protection and a safer walking surface compared to traditional felt paper.",
  },
  {
    title: "Starter Strip & Shingle Installation",
    description:
      "Factory-cut starter strips are installed at all eaves and rakes before shingles are applied. Shingles are nailed per manufacturer specifications — 6 nails per shingle in high-wind zones — ensuring full warranty coverage.",
  },
  {
    title: "Proper Ventilation System",
    description:
      "We calculate and install the correct intake (soffit) and exhaust (ridge) ventilation per code requirements. Proper ventilation extends shingle life, reduces energy costs, and prevents moisture buildup in your attic.",
  },
  {
    title: "Step Flashing & Drip Edge",
    description:
      "All flashing around chimneys, walls, skylights, and roof edges is replaced with new galvanized or aluminum flashing. Drip edge is installed at all eaves and rakes to direct water into gutters and away from the fascia.",
  },
  {
    title: "Ridge Cap & Final Inspection",
    description:
      "A full ridge cap is applied along every peak. We then do a final inspection from ridge to eave — and clean up all debris, nails, and old materials before we leave your property.",
  },
];

const sidingProcess = [
  {
    title: "Removal & Moisture Barrier",
    description:
      "Old siding is removed and all existing wrap or felt is inspected. We install a continuous house wrap or moisture barrier that meets or exceeds Ohio energy and building codes before new panels go on.",
  },
  {
    title: "Sheathing & Structural Inspection",
    description:
      "The exposed wall sheathing is checked for rot, water intrusion, and structural integrity. Any damaged sections are repaired before new siding is installed.",
  },
  {
    title: "Proper Flashing at All Openings",
    description:
      "Every window, door, and penetration is flashed correctly with self-adhesive flashing tape and Z-flashing where required — preventing the #1 cause of siding failure: water infiltration behind the panels.",
  },
  {
    title: "Panel Installation to Code & Beyond",
    description:
      "Siding panels are installed with correct nailing patterns, proper overlap, and manufacturer-specified clearances from grade and rooflines. We go beyond minimum code to ensure long-term performance.",
  },
  {
    title: "Trim, Soffit & Fascia",
    description:
      "All corner posts, J-channels, window trim, soffit, and fascia are installed or replaced as part of a complete system — no mismatched components or patchwork.",
  },
  {
    title: "Caulking & Weatherproofing",
    description:
      "All penetrations, seams, and transitions are caulked with premium exterior-grade sealant rated for Ohio's temperature extremes.",
  },
];

const gutterProcess = [
  {
    title: "Old Gutter Removal",
    description:
      "Existing gutters and downspouts are fully removed. We inspect the fascia board underneath — if it's rotted, we replace it before new gutters go up so you're not mounting new gutters to compromised wood.",
  },
  {
    title: "Seamless Gutter Fabrication",
    description:
      "Our gutters are custom-fabricated on-site using a continuous roll-forming machine, creating seamless gutters cut to the exact length of your roofline. Fewer seams means fewer leak points.",
  },
  {
    title: "Proper Pitch & Hanger Spacing",
    description:
      "Gutters are hung at the correct pitch (typically 1/4\" per 10 feet) to ensure water flows consistently toward downspouts. Hangers are spaced every 24\" or less — exceeding typical code requirements for a stronger hold through heavy snow loads.",
  },
  {
    title: "Downspout Placement & Extensions",
    description:
      "Downspouts are positioned to direct water at least 4–6 feet from your foundation. We ensure every run is properly supported and that water exits well away from your home's structure.",
  },
  {
    title: "Optional Gutter Guards",
    description:
      "We offer micro-mesh gutter guard systems that keep leaves, debris, and shingle grit out while allowing water flow — eliminating the need for seasonal cleaning.",
  },
];

const codeSection = [
  {
    icon: Award,
    title: "Ohio Residential Building Code",
    items: [
      "We follow and exceed Ohio Residential Code (ORC) Chapter 15 for roofing and Chapter 7 for siding",
      "Ice & water shield installed beyond minimum required zones",
      "Ventilation calculated and verified per IRC N1102 standards",
      "All permits pulled where required — we handle the paperwork",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Manufacturer Warranty Compliance",
    items: [
      "All installations follow manufacturer specs to preserve full system warranties",
      "6-nail fastening pattern used in high-wind zones per GAF, Owens Corning, and CertainTeed requirements",
      "Starter strips and ridge caps matched to shingle product lines",
      "Certified installers trained on the latest product systems",
    ],
  },
  {
    icon: Wrench,
    title: "Our Own Standards Go Further",
    items: [
      "We tear off to the deck on every roof — no exceptions",
      "Deck inspected and repaired before any new material goes on",
      "All flashing replaced — never reused from the old roof",
      "Final job-site cleanup including magnetic nail sweep of the yard",
    ],
  },
];

function ProcessAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-card border border-border/50 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-primary font-heading font-bold text-sm w-6 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading font-semibold text-sm sm:text-base">
                {item.title}
              </span>
            </div>
            {open === i ? (
              <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Services() {
  useSEO({
    title: "Residential Roofing, Siding, Windows, Doors & Gutters | Mentor OH | Northeast Ohio | Demore Exterior Solutions",
    description: "Compare residential roofing, siding, window, door, and gutter services from Demore Exterior Solutions, installed to manufacturer spec in Northeast Ohio.",
    keywords: "residential roofing contractor Northeast Ohio, roof replacement Mentor OH 44060, vinyl siding installation Lake County Ohio, windows replacement Mentor Ohio, replacement windows Northeast Ohio, entry doors Mentor OH, seamless gutters Cuyahoga County, storm damage roofing Ohio, CertainTeed Landmark installer Ohio, GAF Timberline HDZ contractor Ohio, Owens Corning Duration shingles Ohio, ProVia siding installer Ohio, Therma-Tru door installer Ohio, Gerkin windows Ohio, fiber cement siding Northeast Ohio, gutter guards Lake County Ohio, roof tear off Ohio, shingle replacement Lake County, roofing and siding company Mentor Ohio, residential exterior contractor Ohio",
    canonical: "/services",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Residential Roofing, Siding & Gutter Services — Northeast Ohio",
      "description": "Demore Exterior Solutions installs and repairs residential roofing, siding, and gutters throughout Northeast Ohio, exceeding Ohio Residential Code and manufacturer warranty requirements.",
      "provider": {
        "@type": "RoofingContractor",
        "name": "Demore Exterior Solutions",
        "telephone": "+1-440-920-6133",
        "url": "https://www.demoreexteriorsolutions.com"
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Lake County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Geauga County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Summit County, Ohio" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Residential Exterior Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Shingle Roof Replacement", "description": "Complete tear-off and replacement with CertainTeed, GAF, Owens Corning, or IKO shingles." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vinyl Siding Installation", "description": "ProVia, CertainTeed, Gentek vinyl siding systems installed with proper moisture barriers." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Replacement", "description": "ProVia, Gerkin, and other premium replacement windows for Northeast Ohio homes." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Entry Door Installation", "description": "ProVia, Therma-Tru, and Larson entry and storm door installation." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Seamless Gutter Installation", "description": "Custom-fabricated seamless aluminum gutters and gutter guard systems." } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Storm Damage Repair", "description": "Hail and wind damage restoration with full insurance claim management." } }
        ]
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Residential / Commercial toggle */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-2 mb-6">
            <span className="px-5 py-2 rounded-xl text-sm font-heading font-semibold bg-primary text-primary-foreground flex items-center gap-2">
              <Home className="w-4 h-4" /> Residential
            </span>
            <Link to="/services/commercial" className="px-5 py-2 rounded-xl text-sm font-heading font-semibold border border-border text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Commercial
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <ShieldCheck className="w-4 h-4" />
            Licensed & Insured — Lake County, Ohio
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Done Right —{" "}
            <span className="text-primary">Every Time</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            We don't cut corners. Every roof, siding job, and gutter system we install follows a thorough process that meets — and exceeds — Ohio building codes and manufacturer requirements.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                Get Free Estimate
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

      {/* Roofing */}
      <section id="roofing" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 01</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Roofing</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            We handle roof inspections, storm repair, and full reroofs across our 8 Northeast Ohio counties. Every project starts with what's on the roof now, so you get the right fix — not the biggest one.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/roofing">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Siding */}
      <section id="siding" className="py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 02</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Siding</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Vinyl and professional siding, storm repairs, trim, and full resides across our 8 Northeast Ohio counties. We install CertainTeed, ProVia, and Gentek siding systems built to handle Northeast Ohio weather.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/siding">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gutters */}
      <section id="gutters" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 03</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Gutters</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Gutters protect your foundation, landscaping, and siding from water damage. We install custom seamless gutters fabricated on-site, hung properly, and designed to handle Ohio's heavy rain and ice season.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/gutters">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Windows */}
      <section id="windows" className="py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Square className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 04</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Windows</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Drafty, foggy, or failing windows cost you money every month. We install premium replacement windows from ProVia, Gerkin, and other leading manufacturers — properly flashed, sealed, and finished for a lasting result.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/windows">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Doors */}
      <section id="doors" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <DoorOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 05</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Doors</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Your entry door is the first thing guests and buyers see. We install premium fiberglass, steel, and storm doors from ProVia, Therma-Tru, Larson, and Gerkin — properly weatherstripped, insulated, and finished for beauty and security.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/doors">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Decks & Outdoor Living */}
      <section id="decks" className="py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Trees className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 06</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Decks & Outdoor Living</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Extend your home into the outdoors with a custom-built deck engineered for safety, longevity, and Northeast Ohio weather. We design and build wood and composite decks, handle complete replacements and structural repairs, and frame foundations for three-season rooms and screened porches — all to Ohio Residential Code (R507).
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/decks">
              <Button variant="outline" className="font-heading font-bold text-sm border-primary/40 hover:bg-primary/10">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Storm Damage */}
      <section id="storm-damage" className="py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Service 07</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Storm Damage Repair</h2>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl"
          >
            Hail, wind, and ice storms can damage your roof and siding without obvious signs from the ground. We inspect, document, and restore — and we handle your insurance claim from start to finish.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4 mb-8"
          >
            {[
              "Hail impact damage to shingles & siding",
              "Wind-lifted or missing shingles",
              "Damaged or dented gutters & downspouts",
              "Cracked or broken siding panels",
              "Flashing separation and leaks",
              "Ice dam damage along eaves",
              "Soffit and fascia damage",
              "Hidden deck damage beneath shingles",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <p className="font-heading font-bold text-lg">Full Insurance Claim Support</p>
              <p className="text-sm text-muted-foreground mt-1">
                We inspect, document, file, and meet the adjuster. You pay only your deductible.
              </p>
            </div>
            <a href="/insurance-claims" className="flex-shrink-0">
              <Button className="bg-primary hover:bg-primary/90 font-heading font-bold whitespace-nowrap">
                See the Full Process
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Code Compliance */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Standards</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2">
              We Meet Code — Then Exceed It
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Minimum code is a floor, not a ceiling. Here's how our work goes beyond what's required.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {codeSection.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
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
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Free estimates. No pressure. Just honest work done right.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  Request Free Estimate
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