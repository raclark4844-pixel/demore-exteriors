import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

// Priority city links shared by the Roofing and Insurance Claims pages.
const SERVING_CITIES = [
  { name: "Mentor", to: "/service-area/lake/mentor" },
  { name: "Willoughby", to: "/service-area/lake/willoughby" },
  { name: "Eastlake", to: "/service-area/lake/eastlake" },
  { name: "Wickliffe", to: "/service-area/lake/wickliffe" },
  { name: "Painesville", to: "/service-area/lake/painesville" },
  { name: "Chardon", to: "/service-area/geauga/chardon" },
  { name: "Mayfield Heights", to: "/service-area/cuyahoga/mayfield-heights" },
  { name: "Parma", to: "/service-area/cuyahoga/parma" },
];

export default function ServingCitiesRow() {
  return (
    <section className="py-8 bg-secondary/20 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 text-sm font-heading font-semibold text-primary uppercase tracking-wider">
            <MapPin className="w-4 h-4" /> Serving
          </span>
          {SERVING_CITIES.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}