import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { findCounty, findCommunity, slugify } from "@/lib/serviceAreaData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, ChevronRight, CheckCircle, Shield, Award, Hammer, Building2, Droplets, FileText, HardHat } from "lucide-react";
import { motion } from "framer-motion";

// Commercial-specific code info per city
const COMMERCIAL_CODE_INFO = {
  "cleveland": {
    permit: "City of Cleveland Division of Building & Housing — Commercial Permits Required",
    ohbc: "Ohio Building Code (OBC) Chapter 15 governs commercial roofing. IECC 2021 energy compliance required on new or replacement roofing over 50% of roof area.",
    notes: [
      "Cleveland requires licensed commercial contractor registration with the city",
      "Special inspection may be required per OBC 1705 for wind-uplift-critical assemblies",
      "FM Global or UL-listed roofing assemblies required on certain occupancies",
      "OSHA 1926.502 fall protection plans required for all commercial roofing projects",
      "Prevailing wage rules apply on public/institutional projects"
    ]
  },
  "akron": {
    permit: "City of Akron Building Inspection — Commercial Plan Review Required",
    ohbc: "OBC Chapter 15 + IECC 2021 commercial energy code. Summit County enforces Ohio Fire Code (OFC) on assembly and institutional occupancies.",
    notes: [
      "Commercial roofing requires licensed contractor with Ohio Commercial Contractor license",
      "Wind uplift calculations (ASCE 7-22) required for roofing system submittals",
      "Vapor retarder requirements per OBC 1408 apply on insulated assemblies",
      "Third-party special inspections required per OBC 1705.10 on large projects",
      "ADA compliance required for any rooftop equipment access modifications"
    ]
  },
  "mentor": {
    permit: "City of Mentor Building Department — Commercial permits required for all exterior work",
    ohbc: "OBC 2023 edition + IECC 2021 commercial energy provisions. Lake County enforces Ohio Fire Code for sprinkler and egress requirements.",
    notes: [
      "Commercial projects require contractor license verification before permit issuance",
      "Energy compliance documentation (COMcheck) required for re-roofing over 50%",
      "Rooftop HVAC equipment replacement may trigger structural review",
      "OSHA 1926 Subpart R compliance mandatory — written fall protection plan required",
      "Special flood hazard area (SFHA) review may be required near Lake Erie shoreline"
    ]
  },
  "default": {
    permit: "Local Building Department — Commercial Plan Review & Permit Required",
    ohbc: "Ohio Building Code (OBC) 2023 edition governs all commercial construction. IECC 2021 energy code applies to commercial envelope work. Ohio Fire Code (OFC) enforced on applicable occupancies.",
    notes: [
      "Ohio commercial contractor license required — we are fully licensed",
      "Wind uplift design per ASCE 7-22 required for roofing system approval",
      "OSHA 1926 Subpart R fall protection plan mandatory on all commercial roofing",
      "Special inspections per OBC Chapter 1705 on qualifying projects",
      "Energy code compliance documentation (COMcheck) required for envelope work over 50%",
      "ADA and Ohio accessibility code compliance maintained on all accessible areas"
    ]
  }
};

function getCommercialCodeInfo(cityName) {
  const key = cityName.toLowerCase();
  return COMMERCIAL_CODE_INFO[key] || COMMERCIAL_CODE_INFO["default"];
}

const COMMERCIAL_ROOFING_STEPS = [
  { step: "1", title: "Commercial Site Assessment & Moisture Survey", desc: "We conduct a thorough commercial roof assessment including infrared or nuclear moisture surveys to detect trapped moisture in existing insulation — critical before any re-roofing decision." },
  { step: "2", title: "Engineering Review & System Selection", desc: "We evaluate building occupancy, structural capacity, wind zone, drainage, and energy code requirements to specify the correct roofing system — TPO, EPDM, modified bitumen, metal, or built-up." },
  { step: "3", title: "Commercial Plan Submittal & Permitting", desc: "Full commercial permit application submitted with wind uplift calculations, material data sheets, and energy compliance documentation (COMcheck) where required." },
  { step: "4", title: "Existing System Removal & Decking Inspection", desc: "Existing roofing removed per local ordinance (one-layer maximum often required). Structural decking inspected; deteriorated sections replaced and documented." },
  { step: "5", title: "Vapor Retarder Installation", desc: "Where required by OBC 1408 and climate zone, vapor retarder installed before insulation to control moisture migration in the roofing assembly." },
  { step: "6", title: "Insulation Installation (R-Value Compliance)", desc: "Polyisocyanurate or other code-approved insulation installed to achieve required R-value per IECC 2021 commercial energy code — minimum R-25 continuous in Climate Zone 5 (Northeast Ohio)." },
  { step: "7", title: "Membrane or Surface Installation", desc: "Primary roofing membrane (TPO, EPDM, mod-bit) or surface (standing seam metal, built-up) installed per manufacturer's FM/UL-listed assembly specifications." },
  { step: "8", title: "Flashing, Penetrations & Edge Metal", desc: "All penetrations, curbs, HVAC equipment, drains, and perimeter edge metal flashed and secured per OBC 1503 and manufacturer specifications." },
  { step: "9", title: "Drainage Verification", desc: "All drains, scuppers, and overflow drains confirmed to meet OBC 1503.4 requirements. Drainage calculations verified for code compliance." },
  { step: "10", title: "Fall Protection Compliance & OSHA Closeout", desc: "Written OSHA 1926.502 fall protection plan maintained throughout. Site cleared, all penetrations sealed, inspections coordinated with AHJ (Authority Having Jurisdiction)." },
  { step: "11", title: "Special Inspections & Final Signoff", desc: "Third-party special inspections coordinated where required per OBC Chapter 1705. Final building department inspection obtained. Warranty documentation provided." }
];

const COMMERCIAL_SIDING_STEPS = [
  { step: "1", title: "Commercial Exterior Assessment", desc: "Full building envelope assessment identifying moisture intrusion, failed cladding, code deficiencies, and energy performance gaps. Occupancy type and fire rating requirements determined." },
  { step: "2", title: "Fire Rating & Occupancy Review", desc: "Exterior wall assembly fire rating requirements per OBC Table 602 verified. IBC Section 1403 weather protection provisions reviewed for the specific occupancy and construction type." },
  { step: "3", title: "Commercial Permit Submittal", desc: "Permit application submitted with product specifications, fire test data, wall assembly details, and energy compliance documentation as required by the local AHJ." },
  { step: "4", title: "Existing Cladding Removal", desc: "Existing siding removed; sheathing and structure inspected for moisture damage, decay, and code deficiencies. All hazardous material protocols followed (asbestos, lead paint surveys performed where applicable)." },
  { step: "5", title: "Water-Resistive Barrier & Drainage Plane", desc: "Commercial-grade WRB installed per OBC 1403.2. Drainage plane and weep details installed to direct any incidental moisture to the exterior — critical for long-term performance." },
  { step: "6", title: "Continuous Insulation (ci) Installation", desc: "Exterior continuous insulation installed where required by IECC 2021 commercial energy code for Climate Zone 5 — typically minimum R-7.5 ci for metal framing." },
  { step: "7", title: "Cladding Installation", desc: "Commercial siding product (fiber cement, metal panel, composite, or engineered wood) installed per manufacturer specs and applicable OBC requirements for attachment, spacing, and clearances." },
  { step: "8", title: "Sealant & Flashing Details", desc: "All penetrations, transitions, and terminations sealed with commercial-grade sealant per ASTM C920 standards. Kick-out, head, and window flashings installed and inspected." },
  { step: "9", title: "Final Inspection & Closeout", desc: "Building department final inspection coordinated. Site cleaned, all documentation provided including product warranties, installation records, and energy compliance forms." }
];

const COMMERCIAL_GUTTER_STEPS = [
  { step: "1", title: "Drainage Load Calculation", desc: "Roof area, pitch, and local rainfall intensity data used to calculate required gutter and downspout sizing per OBC 1503.4 and ASPE Plumbing Engineering Design Handbook." },
  { step: "2", title: "Overflow Protection Design", desc: "Overflow drains or scuppers sized and positioned per OBC 1503.4.1 to prevent structural overload in the event of primary drain blockage — critical for flat and low-slope commercial roofs." },
  { step: "3", title: "Commercial Permitting", desc: "Permit pulled where required for commercial gutter and drainage systems. Drainage calculations submitted with application where required by local AHJ." },
  { step: "4", title: "Existing System Removal", desc: "Old gutters, downspouts, and failed drainage components removed. Fascia and structural attachment points inspected and repaired as needed." },
  { step: "5", title: "Commercial Gutter Fabrication", desc: "Seamless gutters fabricated on-site in commercial gauge aluminum (0.032\" or heavier) or galvanized steel for high-load applications. Custom profiles available for retrofit applications." },
  { step: "6", title: "Heavy-Duty Hanger Installation", desc: "Commercial-grade hidden hangers installed at 16\" OC (exceeding the 24\" residential standard) with stainless or galvanized fasteners to handle Northeast Ohio ice and snow loads." },
  { step: "7", title: "Downspout Sizing & Routing", desc: "Downspouts sized per rainfall intensity calculations. Routing planned to avoid pedestrian areas and comply with local stormwater ordinances. Splash blocks or underground connections installed." },
  { step: "8", title: "Heat Tape Provisions (Where Specified)", desc: "Conduit and attachment provisions for heat tape/de-icing cable installed where specified — common in Northeast Ohio commercial applications to prevent ice dam damage on low-slope edges." },
  { step: "9", title: "Load Test & Final Inspection", desc: "System tested with full water flow. All connections verified watertight. Final walkthrough with building owner/manager completed." }
];

export default function CommercialCityPage() {
  const { county, city } = useParams();

  useEffect(() => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', `https://www.demoreexteriorsolutions.com/service-area/${county}/${city}/commercial`);

    // All city-commercial routes are noindex,follow (approved SEO batch A/C).
    // No commercial city route is approved for indexation — this is independent
    // of the city seoIndexable flag.
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, follow');

    return () => {
      robots.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    };
  }, [county, city]);
  const countyData = findCounty(county);
  const communityData = countyData ? findCommunity(county, city) : null;
  const codeInfo = communityData ? getCommercialCodeInfo(communityData.name) : COMMERCIAL_CODE_INFO["default"];

  useEffect(() => {
    if (communityData && countyData) {
      const name = communityData.name;
      const cty = countyData.county;
      document.title = `Commercial Roofing, Siding & Gutters in ${name}, OH | Demore Exterior Solutions`;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", `Commercial roofing, siding, and gutter services in ${name}, Ohio. OBC & IECC compliant. OSHA-certified crews. Demore Exterior Solutions — free commercial estimates. (440) 920-6133.`);
    }
  }, [communityData, countyData]);

  if (!countyData || !communityData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Location Not Found</h1>
            <Link to="/"><Button>Return Home</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const name = communityData.name;
  const cty = countyData.county;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/service-area/${countyData.slug}`} className="hover:text-primary transition-colors">{cty} County</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/service-area/${countyData.slug}/${city}`} className="hover:text-primary transition-colors">{name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Commercial</span>
          </nav>

          {/* Residential / Commercial toggle */}
          <div className="flex gap-2 mb-6">
            <Link
              to={`/service-area/${countyData.slug}/${city}`}
              className="px-4 py-1.5 rounded-full text-sm font-heading font-semibold border border-border text-muted-foreground hover:text-primary transition-colors"
            >
              Residential
            </Link>
            <span className="px-4 py-1.5 rounded-full text-sm font-heading font-semibold bg-primary text-primary-foreground">
              Commercial
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              Commercial Services · {cty} County, Ohio
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">
              Commercial Roofing,<br />Siding & Gutters<br />in {name}, OH
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Demore Exterior Solutions delivers commercial-grade exterior contracting in {name} for property managers,
              business owners, and developers. We are fully licensed under Ohio's commercial contractor statutes,
              OSHA-compliant, and intimately familiar with {name}'s local building department requirements and the Ohio Building Code.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                  <Phone className="w-4 h-4 mr-2" /> Free Commercial Estimate: (440) 920-6133
                </Button>
              </a>
              <a href="/#contact">
                <Button size="lg" variant="outline" className="font-heading font-bold">
                  Request a Bid
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-secondary/20 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: HardHat, label: "OSHA Compliant", sub: "Written Fall Protection Plans" },
              { icon: FileText, label: "OBC / IECC Certified", sub: "Ohio Building Code Expert" },
              { icon: Shield, label: "Licensed & Insured", sub: "Commercial Contractor" },
              { icon: Award, label: "Code + Energy", sub: "COMcheck Compliant" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Code Section */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 mb-10">
            <h2 className="text-2xl font-heading font-bold mb-2">
              {name} Commercial Building Codes & Regulations
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              We don't just meet commercial code — we engineer to exceed it.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Permitting Authority</p>
                <p className="text-sm text-foreground mb-4">{codeInfo.permit}</p>
                <p className="text-sm font-semibold text-primary mb-1">Ohio Building Code (OBC) & Energy Code</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{codeInfo.ohbc}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary mb-2">Key Commercial Requirements We Meet & Exceed</p>
                {codeInfo.notes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-border/50">
              <p className="text-sm font-heading font-semibold text-primary mb-1">Our Standard of Excellence</p>
              <p className="text-sm text-muted-foreground">
                Demore Exterior Solutions maintains written OSHA safety plans on every commercial site, submits complete
                permit packages with wind uplift calculations and energy compliance documentation, and coordinates all
                required third-party special inspections. We don't cut corners — we exceed the code, protect your
                investment, and deliver a warranty-backed commercial installation every time.
              </p>
            </div>
          </motion.div>

          {/* OBC vs Residential Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-secondary/20 border border-border/50 rounded-2xl p-6 sm:p-8">
            <h3 className="font-heading font-bold text-lg mb-4">Commercial vs. Residential: Key Code Differences</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Governing Code", residential: "Ohio Residential Code (ORC)", commercial: "Ohio Building Code (OBC) + IBC" },
                { label: "Energy Code", residential: "IECC 2021 Residential", commercial: "IECC 2021 Commercial (stricter R-values)" },
                { label: "Wind Design", residential: "IRC prescriptive tables", commercial: "ASCE 7-22 engineered calculations" },
                { label: "Fire Rating", residential: "Class A shingles", commercial: "FM/UL listed assemblies required" },
                { label: "OSHA Standard", residential: "1926.501(b)(13) residential", commercial: "1926.502 full commercial standard" },
                { label: "Inspections", residential: "Standard building inspection", commercial: "Special inspections per OBC Ch. 1705" }
              ].map((row, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-4">
                  <p className="text-xs font-heading font-bold text-primary mb-2 uppercase tracking-wider">{row.label}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Residential:</span> {row.residential}</p>
                    <p className="text-xs text-muted-foreground"><span className="font-medium text-primary">Commercial:</span> {row.commercial}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commercial Roofing */}
      <CommercialServiceSection
        id="roofing"
        icon={Building2}
        title={`Commercial Roofing in ${name}, Ohio`}
        subtitle="TPO, EPDM, Modified Bitumen, Metal & Built-Up — fully permitted and OBC compliant."
        intro={`From small retail strip centers to multi-unit apartment complexes, Demore Exterior Solutions handles commercial roofing in ${name} with the expertise, licensing, and code knowledge that commercial projects demand. Every installation is engineered for Northeast Ohio's demanding climate — heavy snow loads, lake-effect ice, and high-wind events.`}
        steps={COMMERCIAL_ROOFING_STEPS}
        systems={[
          { name: "TPO (Thermoplastic Polyolefin)", desc: "Energy Star rated white membrane — excellent for flat roofs. Fully adhered, mechanically fastened, or ballasted per wind zone." },
          { name: "EPDM (Rubber Membrane)", desc: "Industry-proven 40+ year lifespan. Excellent temperature flexibility for Ohio freeze-thaw cycles." },
          { name: "Modified Bitumen", desc: "Asphalt-based with polymer modification. Ideal for low-slope applications with rooftop traffic." },
          { name: "Standing Seam Metal", desc: "50+ year lifespan. Concealed fastener system eliminates penetration points. Class A fire rated." },
          { name: "Built-Up Roofing (BUR)", desc: "Multi-ply redundancy for maximum protection on demanding occupancies." }
        ]}
      />

      {/* Commercial Siding */}
      <CommercialServiceSection
        id="siding"
        icon={Hammer}
        title={`Commercial Siding in ${name}, Ohio`}
        subtitle="Metal panel, fiber cement, and composite cladding — fire-rated, energy-code compliant."
        intro={`Commercial siding in ${name} must meet fire rating, energy code, and moisture management requirements far more stringent than residential standards. Demore Exterior Solutions brings full OBC knowledge and commercial installation experience to every project.`}
        steps={COMMERCIAL_SIDING_STEPS}
        systems={[
          { name: "Fiber Cement Panel", desc: "Class A fire rated, impact resistant, low maintenance. Accepts field painting. Ideal for commercial and multi-family." },
          { name: "Metal Panel Cladding", desc: "Aluminum or steel panel systems with factory finishes. Fire rated, extremely durable, modern aesthetic." },
          { name: "Engineered Wood Siding", desc: "ESR-certified engineered wood with factory primer. Excellent R-value with continuous insulation." },
          { name: "Composite & Phenolic Panel", desc: "High-end commercial appearance with superior weather resistance and minimal maintenance." }
        ]}
        alt
      />

      {/* Commercial Gutters */}
      <CommercialServiceSection
        id="gutters"
        icon={Droplets}
        title={`Commercial Gutters in ${name}, Ohio`}
        subtitle="Engineered drainage systems sized to OBC 1503.4 — protecting your building envelope and foundation."
        intro={`Commercial drainage systems in ${name} must handle significantly higher water volumes than residential, with overflow protection and stormwater compliance requirements that residential gutters don't face. Our commercial gutter installations are engineered, not guessed.`}
        steps={COMMERCIAL_GUTTER_STEPS}
        systems={[
          { name: "Seamless Aluminum (0.032\"–0.040\")", desc: "Heavy commercial gauge aluminum — resists deformation under ice and snow loads common in Northeast Ohio." },
          { name: "Galvanized Steel", desc: "Maximum strength for high-volume or high-traffic commercial applications." },
          { name: "Copper Gutters", desc: "Architectural-grade for historic or high-end commercial properties. 100+ year lifespan." },
          { name: "Box Gutters", desc: "Built-in box gutter systems for commercial and historic structures with enclosed drainage." }
        ]}
      />

      {/* Who We Serve */}
      <section className="py-14 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-2">Commercial Clients We Serve in {name}</h2>
          <p className="text-muted-foreground mb-8 text-sm">We work with a wide range of commercial property types throughout {cty} County.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Retail & Strip Centers","Office Buildings & Corporate Campuses","Industrial & Warehouse Facilities",
              "Multi-Family Apartment & Condo Complexes","HOA Common Areas & Clubhouses","Restaurants & Hospitality",
              "Churches & Religious Institutions","Schools & Educational Facilities","Medical & Healthcare Facilities",
              "Municipal & Government Buildings","Self-Storage Facilities","Mixed-Use Developments"
            ].map((type, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 bg-card border border-border/50 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">{type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Request a Commercial Estimate in {name}
          </h2>
          <p className="text-muted-foreground mb-6">
            We provide detailed commercial proposals with system specifications, code compliance documentation, and timelines.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:4409206133">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
              </Button>
            </a>
            <a href="/#contact">
              <Button size="lg" variant="outline" className="font-heading font-bold">
                Request a Bid Online
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CommercialServiceSection({ id, icon: Icon, title, subtitle, intro, steps, systems, alt }) {
  return (
    <section id={id} className={`py-16 ${alt ? "bg-secondary/10" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">Commercial Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">{title}</h2>
          <p className="text-primary font-medium mb-4">{subtitle}</p>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">{intro}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-lg mb-5">Our Commercial Process</h3>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="flex gap-4 bg-card border border-border/50 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold font-heading flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-5">Systems We Install</h3>
            <div className="space-y-3">
              {systems.map((sys, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border/50 rounded-xl p-4">
                  <p className="text-sm font-heading font-semibold text-primary mb-1">{sys.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{sys.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center">
              <p className="font-heading font-bold text-sm mb-1">Commercial estimates available</p>
              <p className="text-xs text-muted-foreground mb-3">Detailed proposals with specs & timelines.</p>
              <a href="tel:4409206133">
                <Button className="w-full bg-primary hover:bg-primary/90 font-heading font-bold text-sm">
                  <Phone className="w-3.5 h-3.5 mr-1" /> (440) 920-6133
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}