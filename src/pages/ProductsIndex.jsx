import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsIntro from "@/components/products/ProductsIntro";
import ManufacturerSections from "@/components/products/ManufacturerSections";
import ProductsFAQ from "@/components/products/ProductsFAQ";
import useSEO from "@/hooks/useSEO";

export default function ProductsIndex() {
  useSEO({
    title: "Products We Install in Northeast Ohio | Demore Exterior Solutions",
    description: "Demore Exterior Solutions installs roofing, siding, windows, and doors from CertainTeed, GAF, Owens Corning, IKO, ProVia, Gerkin, Larson, Therma-Tru & Gentek. Free inspection: (440) 920-6133.",
    keywords: "CertainTeed Landmark shingles Northeast Ohio, CertainTeed installer Mentor OH, CertainTeed Landmark PRO Ohio, CertainTeed Belmont shingles Ohio, CertainTeed Grand Manor Ohio, CertainTeed Presidential Shake Ohio, CertainTeed Monogram siding Ohio, GAF Timberline HDZ Ohio, GAF roofing contractor Ohio, GAF Camelot II Ohio, Owens Corning Duration shingles Northeast Ohio, Owens Corning Oakridge shingles Ohio, IKO Cambridge shingles Ohio, IKO Dynasty shingles Ohio, IKO Marathon Ohio, ProVia siding Ohio, ProVia CedarMAX Ohio, ProVia Cedar Peaks Ohio, ProVia HeartTech Ohio, ProVia Endure windows Ohio, ProVia Aeris windows Ohio, ProVia Embarq doors Ohio, ProVia Heritage doors Ohio, Therma-Tru Fiber-Classic Ohio, Therma-Tru Smooth-Star Ohio, Gerkin Series 900 windows Ohio, Larson storm doors Ohio, Larson Tradewinds Ohio, Gentek Signature Supreme siding Ohio, Apollo Supply Co roofing Ohio, best roofing products Lake County Ohio",
    canonical: "/products",
    noIndex: true,
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Products We Install in Northeast Ohio",
      "description": "Roofing, siding, windows, and door products installed by Demore Exterior Solutions throughout Northeast Ohio, sourced through Apollo Supply Co., Willoughby, OH.",
      "url": "https://www.demoreexteriorsolutions.com/products",
      "numberOfItems": 9,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "CertainTeed Roofing & Siding Products", "url": "https://www.demoreexteriorsolutions.com/products/certainteed" },
        { "@type": "ListItem", "position": 2, "name": "GAF Roofing Products", "url": "https://www.demoreexteriorsolutions.com/products/gaf" },
        { "@type": "ListItem", "position": 3, "name": "Owens Corning Roofing Products", "url": "https://www.demoreexteriorsolutions.com/products/owens-corning" },
        { "@type": "ListItem", "position": 4, "name": "IKO Roofing Products", "url": "https://www.demoreexteriorsolutions.com/products/iko" },
        { "@type": "ListItem", "position": 5, "name": "ProVia Siding, Windows & Doors", "url": "https://www.demoreexteriorsolutions.com/products/provia" },
        { "@type": "ListItem", "position": 6, "name": "Gerkin Windows & Doors", "url": "https://www.demoreexteriorsolutions.com/products/gerkin" },
        { "@type": "ListItem", "position": 7, "name": "Larson Storm & Screen Doors", "url": "https://www.demoreexteriorsolutions.com/products/larson" },
        { "@type": "ListItem", "position": 8, "name": "Therma-Tru Entry Doors", "url": "https://www.demoreexteriorsolutions.com/products/therma-tru" },
        { "@type": "ListItem", "position": 9, "name": "Gentek / Associated Materials Siding", "url": "https://www.demoreexteriorsolutions.com/products/gentek" }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-sm font-heading font-semibold mb-6">
            <Package className="w-4 h-4" />
            Trusted Manufacturer Partners
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            Products We Install in Northeast Ohio
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties
          </motion.p>
        </div>
      </section>

      <ProductsIntro />
      <ManufacturerSections />
      <ProductsFAQ />

      <section className="py-20 bg-primary/10 border-t border-primary/20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-heading font-bold mb-8"
          >
            Get a Free Inspection
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
      <Footer />
    </div>
  );
}