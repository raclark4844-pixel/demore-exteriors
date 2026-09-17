import React from "react";
import { motion } from "framer-motion";
import { MapPin, CloudSun, ClipboardCheck } from "lucide-react";

// Unique local content (weather, neighborhoods, code notes) for a city page.
// Renders nothing when the city has no deep-dive entry.
export default function CityLocalDetail({ cityName, data }) {
  if (!data) return null;

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-bold mb-2">
          Local Insight: Working in {cityName}
        </h2>
        <p className="text-muted-foreground text-sm mb-10">
          Weather, neighborhoods, and exterior project planning in {cityName}.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
              <CloudSun className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3">{cityName} Weather & Your Roof</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.weather}</p>
          </motion.div>

          {/* Neighborhoods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3">{cityName} Neighborhoods</h3>
            <div className="space-y-4">
              {data.neighborhoods.map((n, i) => (
                <div key={i}>
                  <p className="text-sm font-heading font-semibold text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{n.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Code & permit notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-3">{cityName} Code & Permit Notes</h3>
            <div className="space-y-3">
              {data.codePoints.map((point, i) => (
                <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                  {point}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}