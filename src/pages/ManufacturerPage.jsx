import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ShieldCheck, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findManufacturer } from "@/lib/manufacturerData";
import useSEO from "@/hooks/useSEO";
import ProductColorList from "@/components/ProductColorList";
import { openAssistant } from "@/lib/openAssistant";

export default function ManufacturerPage() {
  const { manufacturer } = useParams();
  const mfr = findManufacturer(manufacturer);

  useSEO({
    title: mfr
      ? `${mfr.name} Roofing & Siding Products Installed in Northeast Ohio | Demore Exterior Solutions`
      : "Manufacturer | Demore Exterior Solutions",
    description: mfr
      ? `Demore Exterior Solutions installs ${mfr.name} products throughout Northeast Ohio — ${mfr.categories.map(c => c.label).join(", ")}. Manufacturer warranty-backed installation, free estimates. Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull Counties. Call (440) 920-6133.`
      : "",
    keywords: mfr
      ? `${mfr.name} installer Ohio, ${mfr.name} contractor Northeast Ohio, ${mfr.name} products Lake County Ohio, ${mfr.name} ${mfr.categories.map(c => c.label.toLowerCase()).join(", ")} Ohio, ${mfr.name} authorized installer Mentor OH, ${mfr.name} warranty Ohio, ${mfr.name} installation cost Ohio, ${mfr.name} dealer Northeast Ohio, ${mfr.name} Cuyahoga County, ${mfr.name} contractor 44060, ${mfr.name} roofing shingles Ohio, ${mfr.name} vinyl siding Ohio, ${mfr.name} windows Ohio, ${mfr.name} entry doors Ohio, ${mfr.name} storm doors Ohio, ${mfr.name} replacement windows Northeast Ohio, ${mfr.name} products near me Ohio, buy ${mfr.name} products Ohio, ${mfr.name} distributor Ohio, ${mfr.name} supplier Lake County, ${mfr.name} color options Ohio, ${mfr.name} product catalog Ohio, ${mfr.name} vs competitors Ohio, ${mfr.name} reviews Ohio, best ${mfr.name} installer near me, ${mfr.name} certified contractor Ohio, ${mfr.name} warranty claim Ohio, ${mfr.name} installation specialists Northeast Ohio, ${mfr.name} ${mfr.categories.map(c => c.products.map(p => p.name)).flat().slice(0, 10).join(", ")} Ohio, ${mfr.name} installer Cuyahoga Lake Geauga Summit Medina Portage Ashtabula Trumbull County`
      : "",
    canonical: mfr ? `/products/${mfr.slug}` : "/products",
    geoCity: "Mentor, Ohio",
    schema: mfr ? {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `${mfr.name} Installation Services`,
      "description": `Demore Exterior Solutions installs ${mfr.name} products throughout Northeast Ohio with manufacturer-backed warranties.`,
      "provider": {
        "@type": "RoofingContractor",
        "name": "Demore Exterior Solutions",
        "url": "https://www.demoreexteriorsolutions.com",
        "telephone": "+1-440-920-6133"
      },
      "areaServed": [
        { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Lake County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Geauga County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Summit County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Medina County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Portage County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Ashtabula County, Ohio" },
        { "@type": "AdministrativeArea", "name": "Trumbull County, Ohio" }
      ],
      "serviceType": mfr.categories.map(c => `${mfr.name} ${c.label} Installation`),
      "url": `https://www.demoreexteriorsolutions.com/products/${mfr.slug}`
    } : undefined
  });

  if (!mfr) return <Navigate to="/products" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={mfr.heroImage} alt={mfr.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs font-heading font-semibold text-primary tracking-widest uppercase mb-2">
            Manufacturer Partner
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-heading font-bold text-white mb-2">
            {mfr.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-white/70 text-lg">{mfr.tagline}</motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1">
            <p className="text-muted-foreground leading-relaxed text-base">{mfr.description}</p>
            <a href={mfr.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-heading font-semibold text-primary hover:underline">
              Visit {mfr.name} Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <p className="font-heading font-bold text-sm">Installed by Demore</p>
              <p className="text-xs text-muted-foreground">Northeast Ohio</p>
            </div>
          </div>
        </motion.div>

        {/* Categories & Products */}
        {mfr.categories.map((cat, ci) => (
          <section key={cat.slug} className="mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">{cat.label}</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">{cat.description}</p>
            </motion.div>

            <div className={`grid gap-6 ${cat.products.some(p => p.colorList) ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {cat.products.map((prod, pi) => (
                <motion.div key={prod.slug}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: pi * 0.08 }}>
                  <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
                    {/* Product image */}
                    <div className="h-52 overflow-hidden relative flex-shrink-0">
                      <img
                        src={prod.image}
                        alt={`${prod.name} siding product`}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="text-white font-heading font-bold text-lg leading-tight drop-shadow">{prod.name}</p>
                          <p className="text-white/80 text-xs drop-shadow">{prod.tagline}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">{prod.description}</p>

                      {/* Specs row */}
                      <div className="flex flex-wrap gap-2 text-xs mb-4">
                        {prod.warranty && (
                          <span className="bg-secondary text-foreground px-2 py-1 rounded font-medium">{prod.warranty}</span>
                        )}
                        {prod.windRating && prod.windRating !== "N/A — door system" && prod.windRating !== "N/A — steel panel" && (
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded font-medium">{prod.windRating} wind</span>
                        )}
                        {prod.style && (
                          <span className="bg-secondary/60 text-muted-foreground px-2 py-1 rounded">{prod.style}</span>
                        )}
                      </div>

                      {/* Color list */}
                      {prod.colorList && (
                        <div className="border-t border-border/40 pt-4 mb-4">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Palette className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-heading font-semibold text-primary">Available Colors</span>
                          </div>
                          <ProductColorList colorList={prod.colorList} />
                        </div>
                      )}

                      <div className="mt-auto">
                        <Link to={`/products/${mfr.slug}/${cat.slug}/${prod.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-heading font-semibold text-primary hover:gap-2 transition-all group">
                          Full Details & Specifications <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
          <h3 className="font-heading font-bold text-2xl mb-2">Ready to get a quote?</h3>
          <p className="text-muted-foreground mb-6">We install {mfr.name} products throughout Northeast Ohio. Get a free estimate today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold px-8">
                Request Free Estimate <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="tel:4409206133">
              <Button size="lg" variant="outline" className="border-primary/40 hover:bg-primary/10 font-heading font-bold px-8">
                Call (440) 920-6133
              </Button>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}