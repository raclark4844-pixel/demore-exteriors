import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    slug: "certainteed",
    name: "CertainTeed",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/88ede9655_generated_image.png",
    imageAlt: "Weathered-wood architectural asphalt shingles installed on a residential roof",
    body: (
      <>
        <p>
          CertainTeed covers both roofing and siding for us. On roofs, we install CertainTeed
          asphalt shingles when that line fits the house, slope, and look you want. On walls,
          CertainTeed siding is one of the cladding options we put up in Northeast Ohio weather.
          We’ll help you compare color and profile on-site. See{" "}
          <Link to="/roofing" className="text-primary hover:underline">roofing</Link> and{" "}
          <Link to="/siding" className="text-primary hover:underline">siding</Link> for how those
          jobs run.
        </p>
      </>
    ),
  },
  {
    slug: "gaf",
    name: "GAF",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/ad67bb36a_generated_image.png",
    imageAlt: "Charcoal architectural asphalt roofing shingles on a residential roof",
    body: (
      <>
        <p>
          GAF is a roofing manufacturer we install. We use GAF shingles on repairs and full
          reroofs when that product is the right match for the roof. We do not invent dealer
          certifications or program titles. Scope and install details live on our{" "}
          <Link to="/roofing" className="text-primary hover:underline">roofing</Link> page.
        </p>
      </>
    ),
  },
  {
    slug: "owens-corning",
    name: "Owens Corning",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/ff6829780_generated_image.png",
    imageAlt: "Slate-gray architectural asphalt roofing shingles on a home roof",
    body: (
      <>
        <p>
          Owens Corning is another roofing line we install. Shingle choice depends on the roof,
          warranty path from the manufacturer, and what you want the house to look like. We’ll
          walk through options in plain terms. More on inspections, storm repair, and reroofs is
          on <Link to="/roofing" className="text-primary hover:underline">roofing</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "iko",
    name: "IKO",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/97b9f376f_generated_image.png",
    imageAlt: "Dual-brown architectural asphalt roofing shingles on a residential roof slope",
    body: (
      <>
        <p>
          IKO shingles are part of our roofing install list. We use them when they fit the
          project — repair, storm work, or full reroof. We won’t invent product lines or
          certification claims beyond what we’re installing. See{" "}
          <Link to="/roofing" className="text-primary hover:underline">roofing</Link> for service
          details.
        </p>
      </>
    ),
  },
  {
    slug: "provia",
    name: "ProVia",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/fed9f46e2_generated_image.png",
    imageAlt: "Cedar-shake look insulated vinyl siding installed on a home wall",
    body: (
      <>
        <p>
          ProVia is a core brand for siding, windows, and entry doors. We install ProVia
          cladding, replacement windows, and entry units when those products fit the openings
          and elevations. One manufacturer across wall and openings can keep finishes more
          consistent. See{" "}
          <Link to="/siding" className="text-primary hover:underline">siding</Link>,{" "}
          <Link to="/windows" className="text-primary hover:underline">windows</Link>, and{" "}
          <Link to="/doors" className="text-primary hover:underline">doors</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "gerkin",
    name: "Gerkin",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/175492af4_generated_image.png",
    imageAlt: "Newly installed white double-hung replacement window in a home wall",
    body: (
      <>
        <p>
          Gerkin covers windows and doors we install. We use Gerkin for replacement windows and
          exterior door work when that line matches the opening and budget. We’ll measure,
          recommend a fit, and install without inventing certifications. Details on{" "}
          <Link to="/windows" className="text-primary hover:underline">windows</Link> and{" "}
          <Link to="/doors" className="text-primary hover:underline">doors</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "larson",
    name: "Larson",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/2fc20655c_generated_image.png",
    imageAlt: "Full-view glass storm door installed over a home's main entry",
    body: (
      <>
        <p>
          Larson is what we install for storm and screen doors. These add a weather and airflow
          layer in front of the main entry. We match the unit to the existing opening so it works
          with your primary door. See{" "}
          <Link to="/doors" className="text-primary hover:underline">doors</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "therma-tru",
    name: "Therma-Tru",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/459fdb042_generated_image.png",
    imageAlt: "Oak-grain fiberglass entry door with glass sidelites installed on a porch",
    body: (
      <>
        <p>
          Therma-Tru is an entry-door line we install. We use Therma-Tru when you need a new
          main entry that seals and fits the opening. We’ll talk through style and operation in
          plain terms — no invented certifications. See{" "}
          <Link to="/doors" className="text-primary hover:underline">doors</Link>.
        </p>
      </>
    ),
  },
  {
    slug: "gentek",
    name: "Gentek / Associated Materials",
    image: "https://media.base44.com/images/public/6a22e139a45d8195801a1ea3/a92e2064d_generated_image.png",
    imageAlt: "Deep slate-blue vinyl siding with white trim on a home elevation",
    body: (
      <>
        <p>
          Gentek / Associated Materials is a siding manufacturer we install. We use these
          products for repairs, storm-damaged elevations, and full resides when the line fits
          the house. Color and profile choices get decided on the job, not from hype. See{" "}
          <Link to="/siding" className="text-primary hover:underline">siding</Link>.
        </p>
      </>
    ),
  },
];

export default function ManufacturerSections() {
  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-6">
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.04, 0.3) }}
            className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-heading font-bold mb-3">{section.name}</h2>
                <div className="text-muted-foreground leading-relaxed space-y-3 max-w-3xl">
                  {section.body}
                </div>
                <Link
                  to={`/products/${section.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-heading font-semibold text-primary hover:gap-2 transition-all mt-4"
                >
                  View Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <img
                src={section.image}
                alt={section.imageAlt}
                className="w-full sm:w-64 h-44 sm:h-40 object-cover rounded-xl border border-border/50 flex-shrink-0"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}