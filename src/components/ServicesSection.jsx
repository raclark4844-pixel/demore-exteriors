import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Layers, Droplets, Building2, ArrowRight, CheckCircle, MapPin, ChevronDown, DoorOpen, Square, Trees } from "lucide-react";
import { Link } from "react-router-dom";
import { SERVICE_AREAS, slugify } from "@/lib/serviceAreaData";

const ROOFING_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/fb5028cb9_generated_image.png";
const SIDING_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/a1c7676aa_generated_image.png";
const GUTTERS_IMG = "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/9accd178a_generated_image.png";

const residentialServices = [
  {
    title: "Residential Roofing",
    slug: "roofing",
    description: "Full tear-off to the deck, thorough inspection, ice & water shield, and premium architectural shingles — backed by manufacturer warranties.",
    image: ROOFING_IMG,
    icon: Home,
    serviceHref: "/services#roofing",
    features: [
      "Architectural & impact-resistant shingles",
      "Complete tear-off — never roof over",
      "Ice & water shield beyond code minimums",
      "Storm damage repair & insurance help",
      "GAF, Owens Corning, CertainTeed & IKO certified",
    ],
  },
  {
    title: "Residential Siding",
    slug: "siding",
    description: "Vinyl, fiber cement, and engineered wood siding installed with proper moisture management behind every panel — built for Ohio winters.",
    image: SIDING_IMG,
    icon: Layers,
    serviceHref: "/services#siding",
    features: [
      "Vinyl & composite siding",
      "Fiber cement (James Hardie)",
      "Engineered wood panels",
      "Full house wrap & moisture barrier",
      "Storm-damaged siding repair",
    ],
  },
  {
    title: "Residential Gutters",
    slug: "gutters",
    description: "Seamless gutters custom-fabricated on-site, pitched correctly, and sized to handle Northeast Ohio's heavy rain and ice season.",
    image: GUTTERS_IMG,
    icon: Droplets,
    serviceHref: "/services#gutters",
    features: [
      "Seamless aluminum gutters",
      "Micro-mesh gutter guards",
      "Proper pitch & heavy-duty hangers",
      "Downspout routing & extensions",
      "Ice dam prevention solutions",
    ],
  },
  {
    title: "Window Replacement",
    slug: "windows",
    description: "Premium replacement windows from ProVia, Gerkin, and leading brands — Energy Star certified, properly flashed, and finished for lasting performance.",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/64f62fc89_generated_image.png",
    icon: Square,
    serviceHref: "/services#windows",
    features: [
      "ProVia Endure™ & Aeris™ fiberglass windows",
      "Gerkin Series 900 vinyl replacement",
      "Energy Star certified glass packages",
      "Double-hung, casement, slider & more",
      "Proper flashing at all openings",
    ],
  },
  {
    title: "Door Installation",
    slug: "doors",
    description: "Fiberglass, steel, and storm door installation from ProVia, Therma-Tru, and Larson — energy efficient, secure, and beautiful.",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/b0726b9ad_generated_image.png",
    icon: DoorOpen,
    serviceHref: "/services#doors",
    features: [
      "ProVia Embarq™ fiberglass doors",
      "Therma-Tru Fiber-Classic® & Smooth-Star®",
      "Larson storm & screen doors",
      "ENERGY STAR certified systems",
      "Full frame or insert replacement",
    ],
  },
  {
    title: "Decks & Outdoor Living",
    slug: "decks",
    description:
      "Custom wood and composite decks, deck replacements, structural repairs, railings, stairs, and three-season room foundations — engineered to code and built to last.",
    image:
      "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/1a8cab97e_generated_image.png",
    icon: Trees,
    serviceHref: "/decks",
    features: [
      "New deck design & construction",
      "Wood and composite decking",
      "Complete deck replacement",
      "Structural framing & reinforcement",
      "Stairs, railings & elevated decks",
    ],
  },
];

const commercialServices = [
  {
    title: "Commercial Roofing",
    slug: "roofing",
    description: "TPO, EPDM, modified bitumen, metal, BUR, PVC, and spray foam — fully permitted, OBC/IECC compliant, and OSHA-certified for every flat or low-slope project.",
    image: ROOFING_IMG,
    icon: Building2,
    serviceHref: "/services#commercial-roofing",
    features: [
      "TPO & EPDM flat roofing systems",
      "Standing seam & metal roofing",
      "Modified bitumen & BUR",
      "PVC membrane & spray polyurethane foam",
      "OSHA compliant — written fall plans",
      "OBC Chapter 15 + IECC 2021 compliant",
    ],
  },
  {
    title: "Commercial Siding",
    slug: "siding",
    description: "Metal panel, fiber cement, and composite cladding for commercial buildings — fire-rated assemblies, continuous insulation, and OBC envelope compliance.",
    image: SIDING_IMG,
    icon: Layers,
    serviceHref: "/services#commercial-siding",
    features: [
      "Metal panel cladding systems",
      "Fiber cement commercial board",
      "Continuous insulation (ci) for IECC compliance",
      "OBC Table 602 fire-rating compliant",
      "Hazardous material protocols followed",
    ],
  },
  {
    title: "Commercial Gutters",
    slug: "gutters",
    description: "Engineered commercial drainage systems sized to OBC 1503.4 — overflow protection, heavy-gauge aluminum, and stormwater code compliance.",
    image: GUTTERS_IMG,
    icon: Droplets,
    serviceHref: "/services#commercial-gutters",
    features: [
      "OBC 1503.4 drainage sizing calculations",
      "Overflow drain & scupper design",
      "0.032\"–0.040\" heavy-gauge aluminum",
      "Commercial hidden hanger at 16\" OC",
      "Underground connection & stormwater compliance",
    ],
  },
];

// City locator dropdown inside each card
function CityLocator({ serviceSlug, isCommercial }) {
  const [open, setOpen] = useState(false);
  const [activeCounty, setActiveCounty] = useState(SERVICE_AREAS[1]); // default Lake County

  const cities = [
    ...(activeCounty.cities || []),
    ...(activeCounty.villages || []),
  ].slice(0, 12);

  return (
    <div className="mt-4 border-t border-border/40 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-heading font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Find services near you</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3">
              {/* County selector */}
              <div className="flex flex-wrap gap-1 mb-2">
                {SERVICE_AREAS.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setActiveCounty(c)}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                      activeCounty.slug === c.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {c.county}
                  </button>
                ))}
              </div>
              {/* City links */}
              <div className="flex flex-wrap gap-1">
                {cities.map((city) => (
                  <Link
                    key={city}
                    to={
                      isCommercial
                        ? `/service-area/${activeCounty.slug}/${slugify(city)}/commercial#${serviceSlug}`
                        : `/service-area/${activeCounty.slug}/${slugify(city)}#${serviceSlug}`
                    }
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {city}
                  </Link>
                ))}
                <Link
                  to={`/service-area/${activeCounty.slug}`}
                  className="text-xs text-muted-foreground underline px-1 py-0.5 hover:text-primary transition-colors"
                >
                  All {activeCounty.county} County →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceCard({ service, index, isCommercial }) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 flex flex-col"
    >
      <Link to={service.serviceHref} className="block">
        <div className="relative h-52 overflow-hidden">
          <img
            src={service.image}
            alt={`${service.title} by Demore Exterior Solutions`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-primary/90 backdrop-blur-sm">
            <Icon className="w-5 h-5 text-primary-foreground" />
          </div>
          {isCommercial && (
            <div className="absolute top-4 right-4 bg-blue-600/90 text-white text-xs font-heading font-bold px-2 py-1 rounded-lg">
              Commercial
            </div>
          )}
        </div>

        <div className="p-5 pb-2">
          <h3 className="text-lg font-heading font-bold mb-2">{service.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">{service.description}</p>
          <ul className="space-y-1.5 mb-3">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            View Full Details <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <CityLocator serviceSlug={service.slug} isCommercial={isCommercial} />
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [tab, setTab] = useState("residential");

  const services = tab === "residential" ? residentialServices : commercialServices;

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mt-3 mb-4">
            Precision-Engineered Exteriors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
            Residential and commercial exterior work done right — premium materials, code compliance, and backed by manufacturer warranties.
          </p>

          {/* Residential / Commercial Toggle */}
          <div className="inline-flex bg-secondary/60 rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab("residential")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all ${
                tab === "residential"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-4 h-4" /> Residential
            </button>
            <button
              onClick={() => setTab("commercial")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-heading font-semibold transition-all ${
                tab === "commercial"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="w-4 h-4" /> Commercial
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} isCommercial={tab === "commercial"} />
            ))}
          </motion.div>
        </AnimatePresence>

        {tab === "commercial" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-card border border-primary/20 rounded-2xl p-5 text-center"
          >
            <p className="text-sm font-heading font-semibold mb-1">Need a detailed commercial proposal?</p>
            <p className="text-xs text-muted-foreground mb-3">We provide full commercial bids with specs, timelines, and code compliance documentation.</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <a href="#contact">
                <button className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-heading font-bold hover:bg-primary/90 transition-colors">
                  Request a Commercial Bid
                </button>
              </a>
              <a href="tel:4409206133" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5">
                (440) 920-6133
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}