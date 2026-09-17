import React, { useState } from "react";
import useSEO from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { openAssistant } from "@/lib/openAssistant";
import {
  Building2, Layers, Droplets, ArrowRight, CheckCircle, Phone,
  ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Wrench,
  Award, HardHat, FileText, Zap, Thermometer, Cloud
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

function ProcessAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-primary font-heading font-bold text-sm w-6 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading font-semibold text-sm sm:text-base">{item.title}</span>
            </div>
            {open === i
              ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            }
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

const flatRoofSystems = [
  {
    name: "TPO (Thermoplastic Polyolefin)",
    lifespan: "20–30 years",
    code: "FM 4470 / UL 790 Class A",
    best: "Flat & low-slope. Energy Star rated white membrane reflects UV — ideal for energy code compliance under IECC 2021 in Climate Zone 5.",
    desc: "Heat-welded seams create a watertight monolithic membrane. Can be fully adhered, mechanically fastened, or ballasted per ASCE 7-22 wind zone. Ohio's most popular commercial flat roofing system.",
    codeNotes: [
      "IECC 2021 CZ5 requires minimum R-25 ci insulation beneath membrane",
      "Wind uplift per ASCE 7-22 — mechanically fastened pattern must be engineered",
      "OBC 1507.12 governs TPO installation on commercial structures",
      "FM 4470 rated assembly required on qualifying occupancies"
    ]
  },
  {
    name: "EPDM (Ethylene Propylene Diene Monomer)",
    lifespan: "25–40 years",
    code: "FM 4470 / UL 790 Class A",
    best: "Flat & low-slope. Excellent freeze-thaw resistance — critical for Northeast Ohio's extreme temperature swings.",
    desc: "Single-ply rubber membrane with exceptional elongation (300%+) — handles substrate movement without cracking. Available in black (heat absorbing) or white (reflective). Fully adhered, mechanically fastened, or ballasted systems available.",
    codeNotes: [
      "OBC 1507.11 governs EPDM single-ply membrane installation",
      "Black EPDM may not satisfy IECC 2021 cool roof requirements — verify with COMcheck",
      "Seams must be lapped and bonded per NRCA guidelines",
      "Ohio Fire Code (OFC) requires Class A fire rating — use UL-listed assembly"
    ]
  },
  {
    name: "Modified Bitumen (Mod-Bit)",
    lifespan: "15–25 years",
    code: "UL 790 Class A (SBS/APP systems)",
    best: "Flat & low-slope with rooftop foot traffic. Multi-ply redundancy. Torch-applied, cold-applied, or self-adhered.",
    desc: "Asphalt-based polymer-modified membrane providing excellent puncture resistance and multi-layer waterproofing. SBS (styrene-butadiene-styrene) provides rubbery flexibility in cold temps — important for Ohio winters. APP (atactic polypropylene) adds UV resistance.",
    codeNotes: [
      "OBC 1507.9 governs built-up and modified bitumen roofing",
      "Torch application requires fire watch and AHJ notification in some Ohio municipalities",
      "Vapor retarder per OBC 1408 required beneath insulation in conditioned buildings",
      "Granule-surfaced cap sheet provides Class A UL rating"
    ]
  },
  {
    name: "Built-Up Roofing (BUR / Tar & Gravel)",
    lifespan: "20–30 years",
    code: "UL 790 Class A",
    best: "Flat roofs with high occupancy or demanding use. Multi-ply redundancy is best-in-class for waterproofing performance.",
    desc: "3–5 alternating layers of bitumen and reinforcing felts topped with a flood coat and aggregate (gravel or slag). Proven system with 100+ year track record. Excellent for rooftop HVAC-heavy applications where membrane puncture risk is elevated.",
    codeNotes: [
      "OBC 1507.9 governs BUR systems — aggregate ballast depth must meet fire rating requirements",
      "OSHA 1926.502 full fall protection required — kettle operations require additional safety plan",
      "Cold-weather application restrictions — bitumen cannot be applied below 40°F",
      "Drainage design critical — OBC 1503.4 minimum 1/4\" per foot slope required"
    ]
  },
  {
    name: "PVC (Polyvinyl Chloride) Membrane",
    lifespan: "20–30 years",
    code: "FM 4450 / UL 790 Class A",
    best: "Flat roofs with chemical exposure risk (restaurants, food processing, grease exhaust). Highly resistant to oils and chemicals.",
    desc: "Heat-welded single-ply membrane with excellent chemical, fire, and UV resistance. The go-to for restaurant and food service roofs where grease-laden exhaust can degrade TPO and EPDM. Higher upfront cost, lower long-term maintenance.",
    codeNotes: [
      "OBC 1507.13 governs PVC membrane installation",
      "Chemical resistance makes it preferred by Ohio Dept. of Health for commercial kitchen roofs",
      "IECC 2021 compliant — white PVC meets cool roof reflectance requirements",
      "FM 4450 rated system required on fire-sensitive occupancies"
    ]
  },
  {
    name: "Standing Seam Metal Roofing",
    lifespan: "40–70 years",
    code: "UL 580 / FM 4471 Class A",
    best: "Low-slope and steep commercial applications. Concealed fastener system eliminates penetration points. Ideal for durability-first owners.",
    desc: "Steel or aluminum panels with raised seams that interlock without exposed fasteners. Exceptional wind resistance (tested to 140+ mph), Class A fire rated, and recyclable at end of life. Often used on commercial buildings, churches, and institutional facilities.",
    codeNotes: [
      "OBC 1507.4 governs metal roofing on commercial structures",
      "ASCE 7-22 wind uplift calculations required — standing seam clips must be engineered",
      "Thermal movement must be accommodated — floating clip design required on runs over 30'",
      "Dissimilar metal corrosion prevention required at fastener and flashing connections"
    ]
  },
  {
    name: "Spray Polyurethane Foam (SPF)",
    lifespan: "20–50 years (with recoat)",
    code: "UL 790 Class A (with approved topcoat)",
    best: "Existing flat roofs with irregular penetrations or complex geometry. Seamless — eliminates virtually all leak points. Excellent R-value.",
    desc: "Two-component polyurethane foam sprayed directly to the substrate — self-flashing around all penetrations and curbs. Closed-cell foam provides R-6.5 per inch. Topped with silicone or acrylic elastomeric coating for UV and weather protection. Renewable — recoat every 10–15 years extends life indefinitely.",
    codeNotes: [
      "OBC 2603 governs foam plastic insulation — thermal/ignition barrier required in occupied spaces",
      "EPA Section 608 certification required for handling refrigerants near rooftop HVAC during application",
      "Ohio Fire Code requires Class A rated topcoat system — silicone coating is standard compliant option",
      "IECC 2021: SPF typically achieves R-25+ in 3–4\" thickness — often exceeds minimum energy code"
    ]
  }
];

const commercialRoofingProcess = [
  { title: "Moisture Survey & Condition Assessment", description: "Infrared or nuclear isotope moisture scan detects wet insulation beneath existing membranes. Full photographic documentation. Structural capacity review before specifying additional dead loads." },
  { title: "Roofing System Engineering & Selection", description: "System selected based on building occupancy, structural load capacity, wind zone (ASCE 7-22), drainage design, energy code requirements, and owner's lifecycle cost objectives." },
  { title: "OBC Permit Submittal", description: "Complete permit application submitted with wind uplift calculations, product data sheets, material specs, and COMcheck energy compliance documentation where required by local AHJ." },
  { title: "Existing Membrane Removal & Decking Inspection", description: "Existing system removed per local ordinance requirements (Ohio generally limits to 2 roof layers max before full tear-off is required). Structural deck inspected; deteriorated sections replaced and documented." },
  { title: "Vapor Retarder Installation", description: "Where required by OBC 1408.3 and climate zone conditions, vapor retarder installed to prevent moisture migration into the roofing assembly from conditioned interior spaces." },
  { title: "Insulation Installation to IECC 2021", description: "Polyisocyanurate or other approved insulation installed in staggered, offset layers to achieve minimum R-25 continuous (Climate Zone 5 per IECC 2021 Table C402.1.3). Tapered insulation used to create positive drainage where slope is insufficient." },
  { title: "Membrane or Surface Application", description: "Primary roofing system installed per manufacturer's FM/UL-listed assembly specifications. All seams, laps, and penetrations completed to system requirements." },
  { title: "Flashing, Curbs & Edge Metal", description: "All penetrations, equipment curbs, parapet walls, and perimeter edge metal flashed per OBC 1503 and manufacturer specifications. Counterflashing on masonry walls mechanically attached and sealed." },
  { title: "Drainage Verification & OBC 1503.4 Compliance", description: "All primary drains, overflow drains, and/or scuppers confirmed to meet OBC 1503.4 requirements. Overflow protection sized for 100-year rainfall event per local IDF curves." },
  { title: "OSHA Compliance & Safety Closeout", description: "Written OSHA 1926.502 fall protection plan maintained throughout project. All roof access points evaluated. Site cleared and all debris removed from property." },
  { title: "Special Inspections & Final Sign-Off", description: "Third-party special inspections coordinated where required per OBC Chapter 1705. Final building department inspection obtained. Manufacturer warranty documentation and as-built records provided." },
];

const commercialCodeStandards = [
  {
    icon: FileText,
    title: "Ohio Building Code (OBC 2023)",
    items: [
      "Chapter 15 governs all commercial roofing — we know it chapter and verse",
      "OBC 1503: Weather protection, drainage, and overflow requirements",
      "OBC 1504: Wind resistance — ASCE 7-22 calculations on every project",
      "OBC 1507: Material-specific installation requirements per roof type",
      "OBC 1408: Vapor retarder requirements for conditioned buildings",
    ],
  },
  {
    icon: Thermometer,
    title: "IECC 2021 Energy Code",
    items: [
      "Minimum R-25 continuous insulation — Climate Zone 5 (Northeast Ohio)",
      "COMcheck compliance documentation prepared for all qualifying projects",
      "Cool roof reflectance requirements verified for applicable assemblies",
      "Air barrier continuity at roof-wall transitions documented",
      "Tapered insulation used to achieve both drainage and R-value",
    ],
  },
  {
    icon: HardHat,
    title: "OSHA 1926 Subpart R",
    items: [
      "Written site-specific fall protection plan on every commercial project",
      "Leading edge, hole, and skylight protection maintained throughout",
      "Personal fall arrest systems, safety nets, or guardrails as appropriate",
      "Trained competent person on-site at all times per 1926.502",
      "Tool box talks and daily safety briefings documented",
    ],
  },
  {
    icon: Zap,
    title: "Wind & Structural Standards",
    items: [
      "ASCE 7-22 wind uplift calculations — engineered, not guessed",
      "FM 4470 / FM 4450 tested assemblies on qualifying occupancies",
      "Perimeter and corner zones receive increased fastener density",
      "Edge metal rated to ANSI/SPRI ES-1 wind requirements",
      "Structural capacity verified before any re-roofing adds dead load",
    ],
  },
];

const commercialSidingProcess = [
  { title: "Occupancy & Fire Rating Analysis", description: "Building occupancy type and construction classification per OBC Table 601/602 determine required exterior wall fire ratings. We verify requirements before specifying any cladding system." },
  { title: "Commercial Permit & Plan Review", description: "Full commercial permit application submitted with product specs, fire test data (UL or FM), wall assembly details, and IECC energy compliance documentation." },
  { title: "Hazardous Material Survey", description: "On pre-1980 buildings, we conduct or coordinate asbestos and lead paint surveys before any demolition. All hazardous material abatement performed per Ohio EPA regulations." },
  { title: "Existing Cladding Removal", description: "Existing siding stripped to sheathing or structure. All concealed conditions documented photographically for project records and insurance purposes." },
  { title: "WRB & Drainage Plane", description: "Commercial-grade water-resistive barrier installed per OBC 1402.2 and ASTM E2357. Drainage plane details at base, windows, and transitions allow any incidental moisture to exit." },
  { title: "Continuous Insulation (ci)", description: "Where required by IECC 2021 for the building's wall assembly type (metal framing typically requires R-7.5 ci minimum in CZ5), exterior continuous insulation is installed and attachment engineered for wind loads." },
  { title: "Cladding Installation", description: "Commercial siding installed per OBC Chapter 14 and manufacturer's published instructions. Attachment, clearances, and joint details maintained per product ESR report." },
  { title: "Sealant, Flashing & Penetrations", description: "All joints sealed per ASTM C920 Class 25 or 50 as appropriate. Head, sill, and jamb flashings at all openings. Kick-out flashings at roof-wall intersections." },
  { title: "Final Inspection & Closeout", description: "Building department final inspection coordinated. Complete project documentation provided including warranty certificates, installation records, and energy compliance forms." },
];

const commercialGutterProcess = [
  { title: "Drainage Load Calculation", description: "Roof area, pitch, and local rainfall intensity (IDF curves for Northeast Ohio) used to calculate gutter and downspout sizing per OBC 1503.4 and ASPE design standards." },
  { title: "Overflow Protection Design", description: "Overflow drains or scuppers sized per OBC 1503.4.1 to prevent structural overload if primary drainage is blocked — required on all commercial flat and low-slope roofs." },
  { title: "Commercial Permit", description: "Permit pulled where required. Drainage calculations submitted with application when required by local AHJ." },
  { title: "Existing System Removal & Fascia Inspection", description: "Old gutters and downspouts removed. Fascia, structural blocking, and attachment points inspected and replaced as needed before mounting new system." },
  { title: "Commercial Gauge Gutter Fabrication", description: "Seamless gutters fabricated on-site in 0.032\"–0.040\" aluminum or galvanized steel. Custom profiles fabricated for retrofit on non-standard fascia configurations." },
  { title: "Heavy-Duty Hanger & Attachment", description: "Commercial hidden hangers installed at 16\" OC maximum with stainless or hot-dipped galvanized fasteners into structural framing — not just fascia — for maximum snow and ice load capacity." },
  { title: "Downspout Sizing, Routing & Stormwater Compliance", description: "Downspouts sized per calculations and routed to avoid pedestrian areas. Connections to underground systems coordinated with local stormwater ordinance requirements." },
  { title: "System Test & Owner Walkthrough", description: "Full water flow test of completed system. All connections verified watertight. Owner/manager walkthrough completed with maintenance recommendations provided." },
];

export default function CommercialServices() {
  useSEO({
    title: "Commercial Roofing, Siding & Gutters | OBC/IECC/OSHA Compliant | Northeast Ohio | Demore Exterior Solutions",
    description: "Commercial roofing, siding, and gutter systems for Northeast Ohio businesses — TPO, EPDM, metal, BUR, and PVC installed to OBC, IECC, and OSHA codes.",
    keywords: "commercial roofing Ohio, TPO roofing Northeast Ohio, EPDM flat roof contractor Lake County, commercial roofing Mentor OH, standing seam metal roofing Ohio, BUR roofing Northeast Ohio, PVC membrane roofing Ohio, spray foam roofing Ohio, commercial siding Ohio, fiber cement commercial siding, commercial gutters Ohio, OBC 2023 commercial contractor, IECC 2021 energy code roofing Ohio, OSHA commercial roofing contractor, flat roof replacement Ohio, commercial roofing Cuyahoga County, commercial roofing Lake County, commercial roof repair Northeast Ohio, licensed commercial contractor Ohio, FM 4470 roofing contractor Ohio, ASCE 7-22 wind uplift roofing Ohio",
    canonical: "/services/commercial",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Commercial Roofing, Siding & Gutter Services — Northeast Ohio",
      "description": "Demore Exterior Solutions installs commercial roofing (TPO, EPDM, metal, BUR, PVC, SPF), siding, and engineered gutter drainage for Northeast Ohio businesses — fully compliant with OBC 2023, IECC 2021, ASCE 7-22, and OSHA 1926.",
      "provider": { "@type": "RoofingContractor", "name": "Demore Exterior Solutions", "telephone": "+1-440-920-6133", "url": "https://www.demoreexteriorsolutions.com" },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" }, { "@type": "AdministrativeArea", "name": "Lake County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Geauga County, Ohio" }, { "@type": "AdministrativeArea", "name": "Summit County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Medina County, Ohio" }, { "@type": "AdministrativeArea", "name": "Portage County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Ashtabula County, Ohio" }, { "@type": "AdministrativeArea", "name": "Trumbull County, Ohio" }
      ],
      "serviceType": ["TPO Roofing", "EPDM Roofing", "Standing Seam Metal Roofing", "BUR Roofing", "PVC Membrane Roofing", "Spray Polyurethane Foam Roofing", "Commercial Siding", "Commercial Gutter Installation"]
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-600/15 text-blue-400 px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6"
          >
            <Building2 className="w-4 h-4" />
            Commercial Exterior Services · Northeast Ohio
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6"
          >
            Commercial Roofing,<br />Siding & Gutters —{" "}
            <span className="text-primary">Built to Code</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Fully licensed Ohio commercial contractor. Every project is engineered to OBC 2023, IECC 2021, ASCE 7-22, and OSHA 1926 requirements — with written documentation to prove it.
          </motion.p>

          {/* Tab link to residential */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="flex justify-center gap-2 mb-8">
            <Link to="/services" className="px-4 py-2 rounded-lg border border-border text-sm font-heading font-semibold text-muted-foreground hover:text-primary transition-colors">
              ← View Residential Services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-base px-8 h-14">
                Request Commercial Estimate <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
            <a href="tel:4409206133">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold text-base px-8 h-14">
                <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Commercial Flat Roof Systems */}
      <section id="commercial-roofing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Commercial Service 01</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Commercial Roofing</h2>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-4 max-w-3xl">
            Commercial roofing is engineering, not just labor. We select the right system for your building's occupancy, structure, wind zone, and energy code requirements — then install it to the letter.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="bg-primary/10 border border-primary/25 rounded-xl px-5 py-4 mb-10 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              <span className="text-primary font-semibold">Ohio law limits re-roofing layers.</span> OBC 1510.3 and local ordinances typically prohibit more than two total roof layers. We always assess existing layers and tear off when required — no exceptions.
            </p>
          </motion.div>

          {/* All Flat Roof System Types */}
          <h3 className="font-heading font-bold text-xl mb-6">All Commercial Roofing Systems We Install</h3>
          <div className="space-y-5 mb-14">
            {flatRoofSystems.map((sys, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-heading font-bold text-base sm:text-lg">{sys.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{sys.lifespan}</span>
                      <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{sys.code}</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg text-right max-w-xs">
                    Best for: {sys.best.split(".")[0]}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sys.desc}</p>
                <div>
                  <p className="text-xs font-heading font-bold text-primary uppercase tracking-wider mb-2">Ohio Code & Compliance Notes</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {sys.codeNotes.map((note, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h3 className="font-heading font-bold text-lg mb-4">Our Commercial Roofing Process</h3>
          <ProcessAccordion items={commercialRoofingProcess} />
        </div>
      </section>

      {/* Code & Standards */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Standards</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-2">Commercial Code & Compliance</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Commercial projects carry higher stakes — stricter codes, mandatory engineering, and OSHA requirements. We deliver full documentation on every job.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialCodeStandards.map((section, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-sm mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Siding */}
      <section id="commercial-siding" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Commercial Service 02</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Commercial Siding</h2>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-8 max-w-3xl">
            Commercial cladding must satisfy fire ratings, energy codes, and moisture management requirements far beyond residential standards. We know the code and install accordingly.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { name: "Fiber Cement Panel", detail: "Class A fire rated — commercial & multi-family" },
              { name: "Metal Panel Cladding", detail: "Steel or aluminum — factory PVDF finish" },
              { name: "Engineered Wood", detail: "ESR-certified, factory primed, field painted" },
              { name: "Phenolic & Composite", detail: "High-end commercial aesthetic, low maintenance" },
            ].map((p, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-xl p-4">
                <p className="font-heading font-semibold text-sm text-primary mb-1">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.detail}</p>
              </div>
            ))}
          </div>
          <h3 className="font-heading font-bold text-lg mb-4">Commercial Siding Process</h3>
          <ProcessAccordion items={commercialSidingProcess} />
        </div>
      </section>

      {/* Commercial Gutters */}
      <section id="commercial-gutters" className="py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold text-primary tracking-widest uppercase">Commercial Service 03</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold">Commercial Gutters & Drainage</h2>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-muted-foreground text-lg mb-4 max-w-3xl">
            Commercial drainage is a code-driven engineering exercise — not just hanging gutters. OBC 1503.4 requires drainage and overflow systems sized to actual rainfall loads, not guessed.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="bg-primary/10 border border-primary/25 rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
            <Cloud className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">
              <span className="text-primary font-semibold">Northeast Ohio rainfall intensity:</span> Northeast Ohio's 100-year, 1-hour rainfall is approximately 3.3–3.8 inches. We size all commercial drainage systems to handle this load with properly engineered overflow protection per OBC 1503.4.1.
            </p>
          </motion.div>
          <h3 className="font-heading font-bold text-lg mb-4">Commercial Gutter & Drainage Process</h3>
          <ProcessAccordion items={commercialGutterProcess} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/10 border-t border-primary/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Ready for a Commercial Estimate?</h2>
            <p className="text-muted-foreground mb-8 text-lg">Detailed proposals. Code documentation. OSHA-compliant crews. No shortcuts.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8 h-14">
                  Request Commercial Estimate <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
              <a href="tel:4409206133">
                <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8 h-14">
                  <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
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