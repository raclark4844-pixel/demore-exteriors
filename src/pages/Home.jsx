import React from "react";
import useSEO from "@/hooks/useSEO";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HomeTrustBar from "../components/HomeTrustBar";
import ServicesSection from "../components/ServicesSection";
import StormDamageSection from "../components/StormDamageSection";
import DamageCheckSection from "../components/DamageCheckSection";
import InsuranceSection from "../components/InsuranceSection";
import AboutSection from "../components/AboutSection";
import TermsSection from "../components/TermsSection";
import ContactSection from "../components/ContactSection";
import ReviewSection from "../components/ReviewSection";
import HomeFAQ from "../components/HomeFAQ";
import Footer from "../components/Footer";

export default function Home() {
  useSEO({
    title: "Roofing & Siding Contractor in Mentor, OH | Demore Exterior Solutions",
    description: "Trusted Northeast Ohio roofing and siding contractor based in Mentor, OH. Roof replacement, siding, gutters, windows, decks and storm damage inspections. Get a free estimate.",
    keywords: "roofing contractor Mentor Ohio, roof replacement Lake County OH, siding installation Northeast Ohio, gutter installation Mentor OH, storm damage repair Ohio, hail damage roof claim, CertainTeed Landmark GAF Timberline HDZ Owens Corning Duration IKO Cambridge Dynasty ProVia CedarMAX installer Ohio, free roof estimate Mentor OH, licensed roofing contractor 44060, Demore Exterior Solutions, wind damage siding Ohio, insurance claim roofing Northeast Ohio, shingle roof replacement Ohio, seamless gutters Lake County, best roofer Mentor Ohio, ProVia windows doors Ohio, Gerkin windows replacement, Therma-Tru entry doors Ohio, custom deck builder Mentor Ohio, wood and composite decks Northeast Ohio, deck replacement Lake County OH, Trex TimberTech Fiberon deck installer, deck railing stairs Ohio, elevated deck construction, three-season room foundation deck, outdoor living contractor Ohio",
    canonical: "/",
    geoCity: "Mentor, Ohio",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What areas does Demore Exterior Solutions serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We are based in Mentor, Ohio and serve Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties."
          }
        },
        {
          "@type": "Question",
          "name": "Do you help with storm damage and insurance claims?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. We inspect hail and wind damage and work with your insurance company. If the claim is denied, you owe nothing."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get a free estimate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Call (440) 920-6133 or use the estimate form on this page."
          }
        }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <HomeTrustBar />
      <ServicesSection />
      <StormDamageSection />
      <DamageCheckSection />
      <InsuranceSection />
      <AboutSection />
      <ReviewSection />
      <HomeFAQ />
      <TermsSection />
      <ContactSection mode="inspection" />
      <Footer />
    </div>
  );
}