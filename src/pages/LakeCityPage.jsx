import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ChevronRight, MapPin, Home, Hammer, Droplets, CloudLightning, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useSEO from "@/hooks/useSEO";
import { LAKE_CITY_CONTENT } from "@/lib/lakeCityContent";
import { isCitySeoIndexable } from "@/lib/citySeoIndex";

const SERVICE_CARDS = [
  { key: "roofing", icon: Home, title: "Roofing" },
  { key: "siding", icon: Hammer, title: "Siding" },
  { key: "gutters", icon: Droplets, title: "Gutters" },
  { key: "storm", icon: CloudLightning, title: "Storm, hail & wind damage" },
];

function CityView({ city }) {
  const { name, slug, county, countySlug, geoCity } = city;

  useSEO({
    title: city.title,
    description: city.description,
    keywords: city.keywords,
    canonical: `/service-area/${countySlug}/${slug}`,
    noIndexFollow: !isCitySeoIndexable(slug),
    geoCity,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: `Roofing, Siding & Storm Damage Services in ${name}, Ohio`,
          description: `Demore Exterior Solutions provides roofing repairs and replacement, siding, gutters, and storm damage work for ${name}, Ohio homeowners. Licensed and insured, with financing available for qualifying projects.`,
          provider: {
            "@type": "RoofingContractor",
            name: "Demore Exterior Solutions",
            telephone: "+1-440-920-6133",
            url: "https://www.demoreexteriorsolutions.com",
          },
          areaServed: {
            "@type": "City",
            name: `${name}, Ohio`,
            containedIn: { "@type": "AdministrativeArea", name: `${county}, Ohio` },
          },
          serviceType: [
            "Roofing",
            "Siding",
            "Gutter Installation",
            "Storm Damage Repair",
            "Hail Damage Repair",
            "Wind Damage Repair",
            "Insurance Claim Roofing",
          ],
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.demoreexteriorsolutions.com" },
            {
              "@type": "ListItem",
              position: 2,
              name: county,
              item: `https://www.demoreexteriorsolutions.com/service-area/${countySlug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name,
              item: `https://www.demoreexteriorsolutions.com/service-area/${countySlug}/${slug}`,
            },
          ],
        },
      ],
    },
  });

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
            <Link to={`/service-area/${countySlug}`} className="hover:text-primary transition-colors">{county}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="flex items-center gap-2 text-sm font-heading font-semibold text-primary tracking-widest uppercase">
              <MapPin className="w-4 h-4" /> {city.kicker}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mt-3 mb-4">{city.h1}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">{city.intro}</p>
            <div className="flex flex-wrap gap-4">
              <a href="tel:4409206133">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                  <Phone className="w-4 h-4 mr-2" /> Call (440) 920-6133
                </Button>
              </a>
              <a href="/#contact">
                <Button size="lg" variant="outline" className="border-primary/40 font-heading font-bold">
                  Request a Free Inspection <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Local context */}
      <section className="py-14 bg-secondary/20 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-4">{city.localHeading}</h2>
          <p className="text-muted-foreground leading-relaxed">{city.localText}</p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">
            What we do for {name} homeowners
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {SERVICE_CARDS.map(({ key, icon: Icon, title }) => (
              <div key={key} className="bg-card border border-border/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">{title} in {name}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{city[key]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="py-14 bg-secondary/10 border-y border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-heading font-bold mb-4">Nearby communities</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            From our Mentor HQ we also serve these communities and the rest of{" "}
            <Link to={`/service-area/${countySlug}`} className="text-primary hover:text-primary/80 transition-colors">
              {county}
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            {city.nearby.map((c) => (
              <Link
                key={`${c.countySlug}-${c.slug}`}
                to={`/service-area/${c.countySlug}/${c.slug}`}
                className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary/10 border-y border-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-3">
            Free inspection in {name} — call today
          </h2>
          <p className="text-muted-foreground mb-6">
            Licensed, insured, and headquartered at 6348 Meldon Dr in Mentor. We pull permits and stand behind
            our labor with a 10-year workmanship warranty.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:4409206133">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                <Phone className="w-4 h-4 mr-2" /> Call (440) 920-6133
              </Button>
            </a>
            <a href="/#contact">
              <Button size="lg" variant="outline" className="border-primary/40 font-heading font-bold">
                Request a Free Inspection <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function LakeCityPage() {
  const { city: slug } = useParams();
  const city = LAKE_CITY_CONTENT[slug];
  if (!city) return <Navigate to="/service-areas" replace />;
  return <CityView city={city} />;
}