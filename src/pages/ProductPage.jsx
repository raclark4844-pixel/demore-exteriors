import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ArrowLeft, Wind, ShieldCheck, Palette, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { findManufacturer, findCategory, findProduct } from "@/lib/manufacturerData";
import useSEO from "@/hooks/useSEO";
import ProductColorList from "@/components/ProductColorList";
import { openAssistant } from "@/lib/openAssistant";

export default function ProductPage() {
  const { manufacturer, category, product } = useParams();
  const mfr = findManufacturer(manufacturer);
  const cat = findCategory(mfr, category);
  const prod = findProduct(cat, product);

  useSEO({
    title: prod
      ? `${prod.name} by ${mfr?.name} | Installed in Northeast Ohio | Demore Exterior Solutions`
      : "Product | Demore Exterior Solutions",
    description: prod
      ? `${prod.name} by ${mfr?.name} — ${prod.tagline} ${prod.warranty ? `${prod.warranty} warranty.` : ""} Professionally installed by Demore Exterior Solutions throughout Northeast Ohio (Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull Counties). Free estimates — (440) 920-6133.`
      : "",
    keywords: prod
      ? `${prod.name} installer Ohio, ${prod.name} contractor Northeast Ohio, ${mfr?.name} ${cat?.label} Ohio, ${prod.name} installation Lake County OH, ${prod.name} Mentor Ohio, ${prod.name} warranty, ${prod.name} installation cost Ohio, ${prod.name} Cuyahoga County, ${mfr?.name} ${prod.name} Northeast Ohio, ${prod.name} price Ohio, ${prod.name} review Ohio, ${prod.name} specifications Ohio, ${prod.name} colors available Ohio, ${prod.name} vs competitor Ohio, ${prod.name} lifespan Ohio, ${prod.name} wind rating Ohio, ${prod.name} energy efficient Ohio, ${prod.name} near me, buy ${prod.name} Ohio, ${prod.name} dealer Ohio, ${prod.name} supplier Lake County, ${prod.name} installation specialists Ohio, ${prod.name} certified installer Ohio, ${prod.name} warranty registration Ohio, ${prod.name} maintenance Ohio, ${prod.name} durability Ohio, ${prod.name} best price Ohio, ${prod.name} free estimate Ohio, ${prod.name} 44060, ${prod.name} Cleveland Ohio, ${prod.name} Akron Ohio, ${prod.name} Youngstown Ohio, ${prod.name} ${cat?.products.map(p => p.name).filter(n => n !== prod.name).slice(0, 5).join(", ")} Ohio, ${mfr?.name} ${prod.name} Cuyahoga Lake Geauga Summit Medina Portage Ashtabula Trumbull County`
      : "",
    canonical: prod ? `/products/${mfr?.slug}/${cat?.slug}/${prod.slug}` : "/products",
    schema: prod ? {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          "name": prod.name,
          "description": prod.description,
          "brand": { "@type": "Brand", "name": mfr?.name, "url": mfr?.website },
          "image": prod.image,
          "category": cat?.label,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "47",
            "bestRating": "5"
          },
          "offers": {
            "@type": "Offer",
            "seller": {
              "@type": "RoofingContractor",
              "name": "Demore Exterior Solutions",
              "telephone": "+1-440-920-6133",
              "url": "https://www.demoreexteriorsolutions.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "6348 Meldon Dr",
                "addressLocality": "Mentor",
                "addressRegion": "OH",
                "postalCode": "44060"
              }
            },
            "areaServed": [
              { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" },
              { "@type": "AdministrativeArea", "name": "Lake County, Ohio" },
              { "@type": "AdministrativeArea", "name": "Geauga County, Ohio" },
              { "@type": "AdministrativeArea", "name": "Summit County, Ohio" }
            ],
            "availability": "https://schema.org/InStock",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "priceCurrency": "USD",
              "description": "Free estimate — contact us for pricing"
            }
          },
          "additionalProperty": [
            prod.warranty && { "@type": "PropertyValue", "name": "Warranty", "value": prod.warranty },
            prod.windRating && { "@type": "PropertyValue", "name": "Wind Rating", "value": prod.windRating },
            prod.style && { "@type": "PropertyValue", "name": "Style", "value": prod.style },
            prod.colors && { "@type": "PropertyValue", "name": "Colors Available", "value": prod.colors }
          ].filter(Boolean)
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Products", "item": "https://www.demoreexteriorsolutions.com/products" },
            { "@type": "ListItem", "position": 2, "name": mfr?.name, "item": `https://www.demoreexteriorsolutions.com/products/${mfr?.slug}` },
            { "@type": "ListItem", "position": 3, "name": prod.name, "item": `https://www.demoreexteriorsolutions.com/products/${mfr?.slug}/${cat?.slug}/${prod.slug}` }
          ]
        }
      ]
    } : undefined
  });

  if (!mfr || !cat || !prod) return <Navigate to="/products" replace />;

  const specs = [
    prod.warranty && { icon: ShieldCheck, label: "Warranty", value: prod.warranty },
    prod.windRating && { icon: Wind, label: "Wind Rating", value: prod.windRating },
    prod.style && { icon: Star, label: "Style", value: prod.style },
    prod.colors && { icon: Palette, label: "Colors", value: prod.colors },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-24 pb-0 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products/${mfr.slug}`} className="hover:text-primary transition-colors">{mfr.name}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{prod.name}</span>
        </nav>
      </div>

      {/* Hero image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-2xl overflow-hidden h-64 sm:h-80 relative bg-card">
          <img 
            src={prod.image} 
            alt={prod.name} 
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-8">
            <p className="text-xs font-heading font-semibold text-primary tracking-widest uppercase mb-1">{mfr.name} · {cat.label}</p>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white">{prod.name}</h1>
            <p className="text-white/70 mt-1">{prod.tagline}</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-heading font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{prod.description}</p>
            </motion.section>

            {/* Features */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-heading font-bold mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {prod.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feat}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Ideal For */}
            {prod.idealFor && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="text-xl font-heading font-bold mb-3">Ideal For</h2>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-5">
                  <p className="text-sm text-foreground/90 leading-relaxed">{prod.idealFor}</p>
                </div>
              </motion.section>
            )}

            {/* Color Options */}
            {prod.colorList && prod.colorList.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h2 className="text-xl font-heading font-bold mb-1">Available Colors</h2>
                <p className="text-sm text-muted-foreground mb-2">Swatches are approximate representations. Request a physical sample for accurate color matching.</p>
                <ProductColorList colorList={prod.colorList} />
              </motion.section>
            )}

            {/* Other products from this manufacturer / category */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-heading font-bold mb-4">More {cat.label} Products from {mfr.name}</h2>
              <div className="flex flex-col gap-3">
                {cat.products.filter(p => p.slug !== prod.slug).map((other) => (
                  <Link key={other.slug}
                    to={`/products/${mfr.slug}/${cat.slug}/${other.slug}`}
                    className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-4 hover:border-primary/40 transition-colors group">
                    <img src={other.image} alt={other.name} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm group-hover:text-primary transition-colors">{other.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{other.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                ))}
                {cat.products.filter(p => p.slug !== prod.slug).length === 0 && (
                  <Link to={`/products/${mfr.slug}`}
                    className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to all {mfr.name} products
                  </Link>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Specs card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-heading font-bold mb-4">Specifications</h3>
              <div className="space-y-4">
                {specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <spec.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{spec.label}</p>
                      <p className="text-sm font-heading font-semibold mt-0.5">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <h3 className="font-heading font-bold text-base mb-2">Get a Free Estimate</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Interested in {prod.name}? We install this product throughout Northeast Ohio. Contact us for a free, no-pressure estimate.
              </p>
              <div className="flex flex-col gap-3">
                <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                    Request Estimate
                  </Button>
                </a>
                <a href="tel:4409206133">
                  <Button variant="outline" className="w-full border-primary/40 hover:bg-primary/10 font-heading font-bold">
                    (440) 920-6133
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Manufacturer link */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
              className="bg-card border border-border/50 rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-2">Manufactured by</p>
              <Link to={`/products/${mfr.slug}`}
                className="font-heading font-bold text-base hover:text-primary transition-colors flex items-center justify-between">
                {mfr.name}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground mt-1">{mfr.tagline}</p>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}