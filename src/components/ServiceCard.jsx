import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { openAssistant } from "@/lib/openAssistant";

export default function ServiceCard({ title, description, image, icon: Icon, features, href, index }) {
  return (
    <Link to={href || "/services"} className="block">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={`${title} service by Demore Exterior Solutions in Mentor Ohio`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-primary/90 backdrop-blur-sm">
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
        <ul className="space-y-2 mb-5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
              <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); openAssistant(); }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
        >
          Request Estimate <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
    </Link>
  );
}