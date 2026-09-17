import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { findCounty, findCommunity } from "@/lib/serviceAreaData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone, ChevronRight, CheckCircle, Shield, Award, Hammer, Home, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import useSEO from "@/hooks/useSEO";
import CityLocalDetail from "@/components/CityLocalDetail";
import { CITY_DEEP_DIVE } from "@/lib/cityDeepDive";
import { isCitySeoIndexable } from "@/lib/citySeoIndex";

const CITY_CODE_INFO = {
  // Cuyahoga
  "cleveland": { permit: "Yes — City of Cleveland Division of Building & Housing", note: "Cleveland requires permits for all re-roofing projects, siding replacement over 25%, and gutter work on commercial structures. Ice & water shield required in first 24\" from eave." },
  "parma": { permit: "Yes — City of Parma Building Department", note: "Permits required for roofing and siding. Two layers of shingles max before full tear-off required. Sealed valleys mandatory." },
  "mayfield heights": { permit: "Yes — City of Mayfield Heights Building Department", note: "Permits required for roofing and siding, with final inspection before closeout. Two-layer maximum before tear-off. Hail-rated shingles are a smart upgrade on this hail track." },
  "lakewood": { permit: "Yes — City of Lakewood Building Department", note: "Historic preservation district overlays apply in some neighborhoods. Architectural review may be required. All permits pulled before work begins." },
  "strongsville": { permit: "Yes — Strongsville Building Department", note: "Full tear-off required when decking is compromised. Ice & water shield required in all valleys and 36\" past exterior wall line." },
  "westlake": { permit: "Yes — Westlake Building Department", note: "Property must pass final inspection. Permits required for roofing, siding, and gutter replacements." },
  "solon": { permit: "Yes — Solon Building Department", note: "HOA coordination often required. All materials must meet manufacturer and ORC specifications." },
  "highland heights": { permit: "Yes — City of Highland Heights Building Department", note: "Permits required for roofing and siding. Ice & water shield required per Ohio Residential Code. Standard Northeast Ohio building practices apply." },
  "north ridgeville": { permit: "Yes — City of North Ridgeville Building Department", note: "Permits required for all exterior work. Ice & water shield mandatory. Drip edge required at all eaves and rakes." },
  "avon": { permit: "Yes — City of Avon Building Department", note: "Full tear-off permits required. Two-layer maximum shingle rule enforced. All work must meet manufacturer specifications." },
  "avon lake": { permit: "Yes — City of Avon Lake Building Department", note: "Permits required for roofing and siding. Lake Erie weather considerations — enhanced wind resistance recommended." },
  "vermilion": { permit: "Yes — City of Vermilion Building Department", note: "Coastal weather considerations. Permits required. Ice & water shield beyond code minimums recommended." },
  "madison": { permit: "Yes — Village of Madison Building Department", note: "Lake-effect snow zone. Permits required for roofing. Proper ventilation critical for ice dam prevention." },
  "perry": { permit: "Yes — Village of Perry Building Department", note: "Township and village permits vary. Ice & water shield required per Ohio code. Standard residential roofing protocols apply." },
  "rittman": { permit: "Yes — City of Rittman Building Department", note: "Permits required for exterior work. Summit/Wayne county line location — local codes apply." },
  "doylestown": { permit: "Yes — Village of Doylestown Building Department", note: "Rural community with standard Ohio Residential Code enforcement. Permits required for roofing and siding." },
  "tallmadge": { permit: "Yes — City of Tallmadge Building Department", note: "Historic community with modern code enforcement. Permits required. Architectural review may apply in historic districts." },
  // Lake
  "mentor": { permit: "Yes — City of Mentor Building Department", note: "Permits required for roofing and siding. Ice & water shield mandatory in first 24\" from eave. Demore is based here — local knowledge is our advantage." },
  "willoughby": { permit: "Yes — Willoughby Building Department", note: "Tear-off and permits required for full replacement. Shingle Class A fire rating required." },
  "painesville": { permit: "Yes — City of Painesville Building Department", note: "Permits required. Historic district sections require material pre-approval." },
  "kirtland": { permit: "Yes — Kirtland Building Department", note: "Rural setback and impervious surface rules may apply. All work must meet ORC 3781." },
  "eastlake": { permit: "Yes — Eastlake Building Department", note: "Permit required for roofing over 25 sq ft. Ice & water shield and drip edge required." },
  "wickliffe": { permit: "Yes — City of Wickliffe Building Department", note: "Permits required for roofing and siding. Ice & water shield and drip edge per Ohio Residential Code. Mature tree cover makes gutter sizing and leaf guards a common upgrade here." },
  // Summit
  "akron": { permit: "Yes — City of Akron Building Inspection", note: "Permits required for roofing, siding, and gutters. Energy code compliance (OEC 2021) required. Historic preservation overlays exist in some zones." },
  "cuyahoga falls": { permit: "Yes — Cuyahoga Falls Building Department", note: "Full code compliance required. Inspections at rough-in and final stages." },
  "hudson": { permit: "Yes — Hudson Building Department", note: "Strict HOA and historic district rules. Architectural review often required for exterior changes." },
  "stow": { permit: "Yes — Stow Building Department", note: "Permits required for all exterior work. Two-layer max shingle rule enforced." },
  // Default fallback
  "default": { permit: "Yes — Local Building Department (county jurisdiction)", note: "Ohio Residential Code (ORC Chapter 3781) applies. Permits pulled for all applicable work. Ice & water shield required per OBC." }
};

function getCodeInfo(cityName) {
  const key = cityName.toLowerCase();
  return CITY_CODE_INFO[key] || CITY_CODE_INFO["default"];
}

const ROOFING_STEPS = [
  { step: "1", title: "Free Inspection & Documentation", desc: "We conduct a thorough roof inspection documenting all damage, wear, and code deficiencies. Photos and measurements are provided for your records and insurance carrier." },
  { step: "2", title: "Permit Procurement", desc: "We pull all required permits from your local building department before any work begins. No shortcuts — ever." },
  { step: "3", title: "Full Tear-Off (When Required)", desc: "Old roofing is removed down to decking when required by code or condition. We never layer over compromised roofs." },
  { step: "4", title: "Deck Inspection & Repair", desc: "Every board is inspected. Rotted or damaged decking is replaced with OSB or plywood per IRC Table R803.2." },
  { step: "5", title: "Ice & Water Shield Installation", desc: "Applied a minimum of 24\" past the interior wall line at eaves and in all valleys — exceeding most local minimums." },
  { step: "6", title: "Synthetic Underlayment", desc: "Premium synthetic felt (minimum 15# equivalent) installed over entire deck for secondary moisture protection." },
  { step: "7", title: "Drip Edge Installation", desc: "Galvanized or aluminum drip edge installed at eaves and rakes per IRC R905.2.8.5." },
  { step: "8", title: "Shingle Installation", desc: "Class A fire-rated, manufacturer-certified shingles installed per manufacturer specs for full warranty validity. Nail pattern and exposure verified." },
  { step: "9", title: "Flashing & Penetrations", desc: "All pipe boots, chimneys, skylights, and wall flashings are sealed with compatible flashing materials and caulked with elastomeric sealant." },
  { step: "10", title: "Final Inspection & Cleanup", desc: "Magnetic sweep of entire property. Final walkthrough with homeowner. Building department inspection arranged and passed." }
];

const SIDING_STEPS = [
  { step: "1", title: "Inspection & Code Review", desc: "Full exterior inspection identifying moisture damage, failed flashing, and code deficiencies specific to your municipality." },
  { step: "2", title: "Permit Procurement", desc: "We pull all required permits — siding replacement over certain thresholds requires permits in most Northeast Ohio jurisdictions." },
  { step: "3", title: "Removal & Disposal", desc: "Existing siding removed and disposed of properly. All lead paint protocols followed for pre-1978 homes." },
  { step: "4", title: "Water-Resistive Barrier (WRB)", desc: "House wrap or felt paper installed per IRC R703.2. All seams taped and flashed at all openings." },
  { step: "5", title: "Flashing Installation", desc: "Pan flashing, window head flashing, and kick-out flashing installed at all critical junctions." },
  { step: "6", title: "Siding Installation", desc: "Vinyl, fiber cement, or engineered wood installed per manufacturer specs — nail hem, overlap, and expansion gaps all verified." },
  { step: "7", title: "Trim & Finishing", desc: "J-channel, corner posts, utility trim, and starter strips installed plumb and level. No gaps, no shortcuts." },
  { step: "8", title: "Caulking & Sealing", desc: "All penetrations, corners, and trim intersections sealed with premium paintable caulk rated for exterior use." },
  { step: "9", title: "Final Inspection & Cleanup", desc: "Property cleaned, debris removed. Homeowner walkthrough and building inspection coordinated." }
];

const GUTTER_STEPS = [
  { step: "1", title: "Property Assessment", desc: "We measure roof area, calculate drainage needs, and identify optimal downspout placement to meet or exceed local stormwater runoff requirements." },
  { step: "2", title: "Old Gutter Removal", desc: "Existing gutters and downspouts removed and recycled. Fascia board inspected for rot and repaired as needed." },
  { step: "3", title: "Fascia Preparation", desc: "All fascia and soffit areas cleaned, primed if needed, and confirmed structurally sound before attachment." },
  { step: "4", title: "Seamless Gutter Fabrication", desc: "Gutters fabricated on-site to exact measurements. No seams in run lengths — eliminates the #1 source of gutter leaks." },
  { step: "5", title: "Hanger Installation", desc: "Heavy-duty hidden hangers installed every 24\" (we install every 18\" — exceeding standards) ensuring long-term slope integrity." },
  { step: "6", title: "Gutter Installation & Slope", desc: "Gutters hung with proper 1/16\" per foot slope toward downspouts for complete drainage. Verified with level." },
  { step: "7", title: "Downspout Installation", desc: "Downspouts sized and positioned to handle peak flow. Extensions placed to direct water away from foundation per local grading requirements." },
  { step: "8", title: "Gutter Guard Installation (Optional)", desc: "Micro-mesh or solid cover gutter guards installed when requested — reducing maintenance and preventing clogging." },
  { step: "9", title: "Water Test & Inspection", desc: "System flushed with water to verify slope, flow, and leak-free connections. Homeowner walkthrough completed." }
];

export default function CityPage() {
  const { county, city } = useParams();
  const countyData = findCounty(county);
  const communityData = countyData ? findCommunity(county, city) : null;
  const codeInfo = communityData ? getCodeInfo(communityData.name) : CITY_CODE_INFO["default"];

  const cityName = communityData?.name || "";
  const countyName = countyData?.county || "";

  useSEO({
    title: communityData
    ? `Roofing, Siding, Windows, Doors & Gutters in ${cityName}, ${countyName} County, OH | Demore Exterior Solutions`
    : "Service Area | Demore Exterior Solutions",
    description: communityData
    ? `Expert roofing, siding, window replacement, door installation, and gutter services in ${cityName}, ${countyName} County, Ohio. Demore Exterior Solutions is fully licensed, insured, and meets ${cityName} building codes. Storm damage specialists. Free estimates. Call (440) 920-6133.`
    : "",
    keywords: communityData
    ? `roofing ${cityName} Ohio, roof replacement ${cityName} OH, siding contractor ${cityName} Ohio, window replacement ${cityName} OH, door installation ${cityName} Ohio, gutter installation ${cityName}, storm damage repair ${cityName}, hail damage ${cityName} Ohio, ${countyName} County roofing contractor, free roof estimate ${cityName}, licensed roofer ${cityName} OH, Demore Exterior Solutions ${cityName}, CertainTeed GAF Owens Corning IKO installer ${cityName}, ProVia siding windows doors ${cityName}, ${cityName} roof tear off, ${cityName} vinyl siding installation, ${cityName} seamless gutters, ${countyName} County storm damage roofing`
    : "",
    canonical: `/service-area/${county}/${city}`,
    noIndexFollow: !isCitySeoIndexable(city),
    geoCity: communityData ? `${cityName}, ${countyName} County, Ohio` : undefined,
    schema: communityData ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          "name": `Roofing, Siding & Gutter Services in ${cityName}, Ohio`,
          "description": `Demore Exterior Solutions provides roofing, siding, and gutter installation in ${cityName}, ${countyName} County, Ohio. Licensed, insured, code-compliant with storm damage and insurance claim expertise.`,
          "provider": {
            "@type": "RoofingContractor",
            "name": "Demore Exterior Solutions",
            "telephone": "+1-440-920-6133",
            "url": "https://www.demoreexteriorsolutions.com"
          },
          "areaServed": {
            "@type": "City",
            "name": `${cityName}, Ohio`,
            "containedIn": { "@type": "AdministrativeArea", "name": `${countyName} County, Ohio` }
          },
          "serviceType": ["Roofing", "Siding", "Gutter Installation", "Storm Damage Repair", "Insurance Claim Roofing"]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.demoreexteriorsolutions.com" },
            { "@type": "ListItem", "position": 2, "name": `${countyName} County`, "item": `https://www.demoreexteriorsolutions.com/service-area/${countyData.slug}` },
            { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://www.demoreexteriorsolutions.com/service-area/${countyData.slug}/${city}` }
          ]
        }
      ]
    } : undefined
  });

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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={`/service-area/${countyData.slug}`} className="hover:text-primary transition-colors">{cty} County</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{name}</span>
          </nav>

          {/* Residential / Commercial toggle */}
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1.5 rounded-full text-sm font-heading font-semibold bg-primary text-primary-foreground">
              Residential
            </span>
            <Link
              to={`/service-area/${countyData.slug}/${city}/commercial`}
              className="px-4 py-1.5 rounded-full text-sm font-heading font-semibold border border-border text-muted-foreground hover:text-primary transition-colors"
            >
              Commercial
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              {communityData.type} · {cty} County, Ohio
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">
              Roofing, Siding, Windows, Doors & Gutters<br />in {name}, OH
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Demore Exterior Solutions serves {name} homeowners with professional exterior contracting services — 
              roofing, siding, windows, doors, and gutters. We are fully licensed, insured, and intimately familiar 
              with {name}'s local building department requirements, delivering work that meets and consistently exceeds 
              every applicable code and standard.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                  <Phone className="w-4 h-4 mr-2" /> Free Estimate: (440) 920-6133
                </Button>
              </a>
              <a href="/#contact">
                <Button size="lg" variant="outline" className="font-heading font-bold">
                  Request Online
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
              { icon: Shield, label: "Licensed & Insured", sub: "Ohio Contractor" },
              { icon: Award, label: "Code Compliant", sub: "Exceeds ORC Standards" },
              { icon: CheckCircle, label: "Permitted Work", sub: "Every Project" },
              { icon: Phone, label: "Free Inspections", sub: "No-Obligation Estimates" }
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

      {/* Building Code Section */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 mb-10">
            <h2 className="text-2xl font-heading font-bold mb-2">
              {name} Building Codes & Requirements
            </h2>
            <p className="text-muted-foreground text-sm mb-5">
              We know what {name}'s building department requires — and we go further.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Permit Required?</p>
                <p className="text-sm text-foreground mb-4">{codeInfo.permit}</p>
                <p className="text-sm font-semibold text-primary mb-1">Local Code Notes</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{codeInfo.note}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary mb-2">Ohio State Code Compliance (ORC 3781 / OBC)</p>
                {[
                  "Ice & water shield minimum 24\" past interior wall line at eaves",
                  "Drip edge required at eaves and rakes (IRC R905.2.8.5)",
                  "Maximum 2 layers of shingles before full tear-off required",
                  "Class A fire-rated shingles required in all Ohio jurisdictions",
                  "Closed valley or open valley flashing per manufacturer spec",
                  "All penetrations flashed and sealed per OBC Section R903"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-border/50">
              <p className="text-sm font-heading font-semibold text-primary mb-1">How We Exceed These Standards</p>
              <p className="text-sm text-muted-foreground">
                Demore Exterior Solutions doesn't stop at minimum compliance. We extend ice & water shield to 36" past wall lines,
                install hidden hangers every 18" on gutters (vs the 24" standard), and conduct a final QC inspection before scheduling
                the building department sign-off. Your home gets contractor-grade protection, not the bare minimum.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Unique local deep-dive (priority cities only) */}
      {CITY_DEEP_DIVE[city] && (
        <CityLocalDetail cityName={name} data={CITY_DEEP_DIVE[city]} />
      )}

      {/* Roofing Services */}
      <ServiceSection
        id="roofing"
        icon={Home}
        title={`Roofing in ${name}, Ohio`}
        subtitle="Expert shingle and storm-damage roofing — fully permitted and code-compliant."
        intro={`${name} homeowners trust Demore Exterior Solutions for roof replacements, storm damage repairs, and new construction roofing. Every project is permitted through the local building department and installed to manufacturer specifications that maintain your full warranty.`}
        steps={ROOFING_STEPS}
        facts={[
          `${name} averages 50+ inches of snowfall annually — proper ice & water shield is critical`,
          "A properly installed roof can last 25–50 years in Northeast Ohio's climate",
          "Incorrect nail placement voids most shingle manufacturer warranties",
          "We carry full liability and workers' comp — protecting you from liability"
        ]}
        color="from-red-900/20"
      />

      {/* Siding Services */}
      <ServiceSection
        id="siding"
        icon={Hammer}
        title={`Siding Installation in ${name}, Ohio`}
        subtitle="Vinyl, fiber cement, and engineered wood siding — installed to last."
        intro={`Whether you're upgrading aging siding, repairing storm damage, or improving your ${name} home's curb appeal and energy efficiency, Demore Exterior Solutions delivers a watertight, code-compliant installation with every product we offer.`}
        steps={SIDING_STEPS}
        facts={[
          "New siding can improve home energy efficiency by up to 20%",
          "Fiber cement siding carries a Class A fire rating and is impact-resistant",
          "Proper water-resistive barriers prevent costly moisture damage behind siding",
          `${name} HOA or historic district requirements are always reviewed before work begins`
        ]}
        color="from-blue-900/20"
        alt
      />

      {/* Gutter Services */}
      <ServiceSection
        id="gutters"
        icon={Droplets}
        title={`Gutter Installation in ${name}, Ohio`}
        subtitle="Seamless aluminum gutters sized and sloped for Northeast Ohio rainfall."
        intro={`Properly functioning gutters protect your ${name} home's foundation, landscaping, and siding from water intrusion. Our seamless gutters are fabricated on-site for a perfect fit with no leak-prone seams.`}
        steps={GUTTER_STEPS}
        facts={[
          "Northeast Ohio receives 38+ inches of precipitation annually — gutters are critical",
          "Seamless gutters reduce leak points by 90% vs sectional systems",
          "Clogged or failing gutters are a leading cause of foundation damage",
          "We install hangers every 18\" — 25% more support than industry standard"
        ]}
        color="from-teal-900/20"
      />

      {/* Local Area Info */}
      <section className="py-14 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-6">About {name}, {cty} County</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                {name} is located in {cty} County, Northeast Ohio — a region characterized by variable weather patterns
                including heavy lake-effect snowfall, spring hail storms, and humid summers that place significant demands
                on residential roofing and exterior systems.
              </p>
              <p>
                Our team is experienced working with the local contractors, building inspectors, and material suppliers
                throughout {cty} County, ensuring smooth permitting and inspections on every project.
              </p>
              <p>
                Demore Exterior Solutions has served Northeast Ohio homeowners for years and understands the unique
                construction styles, HOA considerations, and neighborhood characteristics found throughout {name}.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Response Time", value: "Same Day" },
                { label: "Estimate Cost", value: "Free" },
                { label: "Service Area", value: cty + " County" },
                { label: "Experience", value: "10+ Years" }
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 text-center">
                  <p className="text-2xl font-heading font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Serving {name} — Call for Your Free Estimate Today
          </h2>
          <p className="text-muted-foreground mb-6">
            Licensed, insured, and ready to serve. We pull permits, pass inspections, and exceed codes — every time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:4409206133">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> (440) 920-6133
              </Button>
            </a>
            <a href="/#contact">
              <Button size="lg" variant="outline" className="font-heading font-bold">
                Request Online
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function ServiceSection({ id, icon: Icon, title, subtitle, intro, steps, facts, color, alt }) {
  return (
    <section id={id} className={`py-16 ${alt ? "bg-secondary/10" : ""}`}>
      <div className={`absolute inset-x-0 h-1 bg-gradient-to-r ${color} to-transparent opacity-30`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-heading font-semibold text-primary tracking-widest uppercase">Our Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">{title}</h2>
          <p className="text-primary font-medium mb-4">{subtitle}</p>
          <p className="text-muted-foreground max-w-3xl leading-relaxed">{intro}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-lg mb-5">Our Process</h3>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
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
            <h3 className="font-heading font-bold text-lg mb-5">Did You Know?</h3>
            <div className="space-y-3">
              {facts.map((fact, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{fact}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center">
              <p className="font-heading font-bold text-sm mb-1">Ready to get started?</p>
              <p className="text-xs text-muted-foreground mb-3">Free estimate, no obligation.</p>
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