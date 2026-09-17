import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Wrench, Home, Layers, Droplets, Square, DoorOpen, AlertTriangle, Trees, MapPin, Package, Umbrella, Camera } from "lucide-react";

const SERVICES = [
  { label: "Roofing", href: "/roofing", icon: Home, useLink: true },
  { label: "Siding", href: "/siding", icon: Layers, useLink: true },
  { label: "Windows", href: "/windows", icon: Square, useLink: true },
  { label: "Doors", href: "/doors", icon: DoorOpen, useLink: true },
  { label: "Gutters", href: "/gutters", icon: Droplets, useLink: true },
  { label: "Decks & Outdoor Living", href: "/decks", icon: Trees, useLink: true },
  { label: "Service Areas", href: "/service-areas", icon: MapPin, useLink: true },
  { label: "Products", href: "/products", icon: Package, useLink: true },
  { label: "Insurance Process", href: "/insurance-claims", icon: Umbrella, useLink: true },
  { label: "Storm Damage", href: "/insurance-claims", icon: AlertTriangle, useLink: true },
  { label: "Damage Check", href: "/damage-assessment", icon: Camera, useLink: true },
];

// ── Mobile version ──────────────────────────────────────────────────────────
function MobileDropdown({ onClose }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        <span>Services</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="pl-3 border-l-2 border-primary/30 ml-3 space-y-0.5">
          {SERVICES.map(({ label, href, icon: Icon, useLink }) =>
            useLink ? (
              <Link
                key={label}
                to={href}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ── Desktop version ─────────────────────────────────────────────────────────
export default function ServicesDropdown({ mobile = false, onClose }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (mobile) return <MobileDropdown onClose={onClose} />;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        <Wrench className="w-3.5 h-3.5" />
        Services
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 py-2">
          {SERVICES.map(({ label, href, icon: Icon, useLink }) =>
            useLink ? (
              <Link
                key={label}
                to={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                {label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  );
}