import React, { useState } from "react";
import { Star, X, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { openAssistant } from "@/lib/openAssistant";

// CSS color fallback map for products without manufacturer swatch images (siding, windows, doors)
const CSS_COLOR_MAP = {
  "white": "#F5F5F0", "antique white": "#FAEBD7", "classic white": "#F5F5F0",
  "linen": "#F5ECD7", "almond": "#EFDECD", "cream": "#FFFDD0", "alabaster": "#F2F0EB",
  "tan": "#D2B48C", "sandalwood": "#C8A882", "beige": "#F5F5DC", "clay": "#B8956A",
  "autumn tan": "#C49A6C", "desert tan": "#C2A06E", "canyon": "#B07050",
  "gray": "#808080", "grey": "#808080", "pewter": "#8E8E8E", "pewter gray": "#8E8E8E",
  "slate gray": "#6B7B8D", "slate": "#6B7B8D", "myst gray": "#7B8794",
  "charcoal gray": "#4A4A4A", "charcoal": "#4A4A4A", "charcoal black": "#3A3A3A",
  "dark bronze": "#4A3728", "granite": "#7A7A7A", "timberline": "#8A7050",
  "premium blue": "#3A5F8A", "midnight blue": "#1B2A4A", "navy blue": "#1A2A5E",
  "sea slate": "#4A6475", "nightfall": "#2A3545",
  "sage": "#7C9E7A", "heathered moss": "#6B7C5E", "forest green": "#228B22", "harvest green": "#5A7A3A",
  "burnt sienna": "#A0522D", "brownstone": "#7A5C4A", "harvest red": "#A03028",
  "autumn red": "#A03028", "red": "#CC3333", "brown": "#7B4F2A",
  "black": "#1A1A1A", "coal black": "#1A1A1A", "moire black": "#2A2A2A", "onyx black": "#1A1A1A",
  "bronze": "#8B6914", "walnut (woodgrain)": "#6A3F1A",
  "stainable (unfinished)": "#D4AA70", "factory stained woodgrain": "#9A6A40",
  "pre-stained light oak": "#C8A060", "pre-stained dark walnut": "#4A2F1A",
  "pre-painted white": "#F5F5F0", "pre-painted black": "#1A1A1A",
  "primed (paintable)": "#E8E8E8", "custom color (field painted)": "#A0A0C0",
};

function getCSSColor(colorName) {
  const key = colorName.toLowerCase().trim();
  if (CSS_COLOR_MAP[key]) return CSS_COLOR_MAP[key];
  for (const [mapKey, val] of Object.entries(CSS_COLOR_MAP)) {
    if (key.includes(mapKey)) return val;
  }
  if (key.includes("black")) return "#1A1A1A";
  if (key.includes("white") || key.includes("cream")) return "#F5F5F0";
  if (key.includes("gray") || key.includes("grey") || key.includes("slate")) return "#808080";
  if (key.includes("brown") || key.includes("wood") || key.includes("oak")) return "#8B6340";
  if (key.includes("blue")) return "#3A5F8A";
  if (key.includes("green")) return "#3A6A3A";
  if (key.includes("red")) return "#AA3030";
  return "#888888";
}

function ColorModal({ color, onClose }) {
  const hasSwatchImage = !!color.swatchUrl;
  const isPremium = color.tier === "premium";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large swatch */}
          <div className="flex justify-center mb-5">
            {hasSwatchImage ? (
              <img
                src={color.swatchUrl}
                alt={color.name}
                className="w-32 h-32 rounded-2xl object-cover border border-white/10 shadow-xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-32 h-32 rounded-2xl border border-white/10 shadow-xl"
              style={{
                backgroundColor: getCSSColor(color.name),
                display: hasSwatchImage ? 'none' : 'block',
              }}
            />
          </div>

          {/* Color name */}
          <h3 className="font-heading font-bold text-xl text-center mb-2">{color.name}</h3>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isPremium
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-secondary text-muted-foreground"
            }`}>
              {isPremium ? "Premium Color" : "Standard Color"}
            </span>
            {color.popular && (
              <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
                <Star className="w-3 h-3 fill-primary" />
                Popular in NE Ohio
              </span>
            )}
          </div>

          {/* Notes */}
          <div className="bg-secondary/40 rounded-xl p-4 flex items-start gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Swatches are approximate representations. Colors may appear different on screen. Request a physical sample for accurate color matching before purchasing.
            </p>
          </div>

          <a href="/#contact" onClick={(e) => { e.preventDefault(); openAssistant(); }}>
            <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-bold text-sm py-2.5 rounded-lg transition-colors">
              Request Sample / Free Estimate
            </button>
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductColorList({ colorList }) {
  const [filter, setFilter] = useState("all");
  const [selectedColor, setSelectedColor] = useState(null);

  if (!colorList || colorList.length === 0) return null;

  const filtered = filter === "all" ? colorList : colorList.filter(c => c.tier === filter);
  const standardCount = colorList.filter(c => c.tier === "standard").length;
  const premiumCount = colorList.filter(c => c.tier === "premium").length;

  return (
    <div className="mt-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { key: "all", label: `All (${colorList.length})` },
          { key: "standard", label: `Standard (${standardCount})` },
          ...(premiumCount > 0 ? [{ key: "premium", label: `Premium (${premiumCount})` }] : []),
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1 rounded-full text-xs font-heading font-semibold transition-colors ${
              filter === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Color grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {filtered.map((color, i) => {
          const isPremium = color.tier === "premium";
          const hasSwatchImage = !!color.swatchUrl;

          return (
            <button
              key={i}
              onClick={() => setSelectedColor(color)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all hover:scale-105 hover:shadow-lg cursor-pointer text-left ${
                isPremium
                  ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70"
                  : "border-border/50 bg-secondary/30 hover:border-primary/40"
              }`}
              title={`View ${color.name} details`}
            >
              {/* Swatch */}
              <div className="relative">
                {hasSwatchImage ? (
                  <img
                    src={color.swatchUrl}
                    alt={color.name}
                    className="w-12 h-12 rounded-lg object-cover border border-white/10 shadow-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div
                  className="w-12 h-12 rounded-lg border border-white/10 shadow-md flex-shrink-0"
                  style={{
                    backgroundColor: getCSSColor(color.name),
                    display: hasSwatchImage ? 'none' : 'block',
                  }}
                />
                {color.popular && (
                  <Star className="w-3 h-3 fill-primary text-primary absolute -top-1 -right-1 drop-shadow" />
                )}
                {isPremium && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">P</span>
                )}
              </div>
              {/* Color name */}
              <span className={`text-[10px] font-medium text-center leading-tight ${isPremium ? "text-amber-200" : "text-foreground/80"}`}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-primary text-primary" />
          Popular in Northeast Ohio
        </span>
        {premiumCount > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50 inline-block" />
            <span className="text-amber-400 font-bold text-[9px]">P</span> Premium color
          </span>
        )}
        <span className="text-[10px] italic">Click any color to view details.</span>
      </div>

      {/* Color detail modal */}
      {selectedColor && (
        <ColorModal color={selectedColor} onClose={() => setSelectedColor(null)} />
      )}
    </div>
  );
}