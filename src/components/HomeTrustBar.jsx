import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Calendar, ShieldCheck, Hammer, Star } from "lucide-react";

export default function HomeTrustBar() {
  return (
    <section
      aria-label="Why homeowners trust Demore Exterior Solutions"
      className="bg-secondary/40 border-y border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-heading font-semibold text-foreground/90">
          <span className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
            CertainTeed, GAF, Owens Corning &amp; ProVia Installed to Manufacturer Spec
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            26 Years of Experience
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            Licensed &amp; Insured in Ohio
          </span>
          <span className="flex items-center gap-2">
            <Hammer className="w-4 h-4 text-primary flex-shrink-0" />
            10-Year Workmanship Warranty
          </span>
          <Link
            to="/reviews"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Star className="w-4 h-4 flex-shrink-0" />
            Read Our Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}