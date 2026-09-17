import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, MapPin, Home, Building2, House, Building } from "lucide-react";
import { SERVICE_AREAS, getAllCommunities, slugify } from "@/lib/serviceAreaData";

// ── Mobile version ──────────────────────────────────────────────────────────
function MobileDropdown({ onClose }) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null); // "residential" | "commercial"
  const [activeCounty, setActiveCounty] = useState(null);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        <span>Service Areas</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="pl-3 border-l-2 border-primary/30 ml-3 space-y-1">
          {/* Residential / Commercial top-level */}
          {[
            { key: "residential", label: "Residential", icon: Home },
            { key: "commercial", label: "Commercial", icon: Building2 }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <button
                onClick={() => {
                  setActiveType(activeType === key ? null : key);
                  setActiveCounty(null);
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary"
              >
                <span className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{label}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeType === key ? "rotate-90" : ""}`} />
              </button>

              {activeType === key && (
                <div className="pl-3 border-l-2 border-border ml-3 space-y-0.5">
                  {SERVICE_AREAS.map((county) => (
                    <div key={county.slug}>
                      <button
                        onClick={() => setActiveCounty(activeCounty === county.slug ? null : county.slug)}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary"
                      >
                        <span>{county.county} County</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCounty === county.slug ? "rotate-90" : ""}`} />
                      </button>

                      {activeCounty === county.slug && (
                        <div className="pl-3 space-y-0.5 max-h-48 overflow-y-auto">
                          <Link
                            to={`/service-area/${county.slug}`}
                            onClick={onClose}
                            className="block px-3 py-1.5 text-xs text-primary font-semibold hover:underline"
                          >
                            View All {county.county} County →
                          </Link>
                          {getAllCommunities(county).map((c) => (
                            <Link
                              key={c.name}
                              to={
                                key === "commercial"
                                  ? `/service-area/${county.slug}/${slugify(c.name)}/commercial`
                                  : `/service-area/${county.slug}/${slugify(c.name)}`
                              }
                              onClick={onClose}
                              className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Desktop version ──────────────────────────────────────────────────────────
export default function ServiceAreaDropdown({ mobile = false, onClose }) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null); // "residential" | "commercial"
  const [activeCounty, setActiveCounty] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setActiveType(null);
        setActiveCounty(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (mobile) return <MobileDropdown onClose={onClose} />;

  const close = () => { setOpen(false); setActiveType(null); setActiveCounty(null); };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setActiveType(null); setActiveCounty(null); }}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        <MapPin className="w-3.5 h-3.5" />
        Service Areas
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 flex shadow-2xl rounded-xl overflow-hidden border border-border bg-background z-50">

          {/* Column 1: Residential / Commercial */}
          <div className="w-48 border-r border-border bg-card py-2">
            <p className="px-4 py-1.5 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Category</p>
            {[
              { key: "residential", label: "Residential", icon: Home },
              { key: "commercial", label: "Commercial", icon: Building2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onMouseEnter={() => { setActiveType(key); setActiveCounty(null); }}
                onClick={() => { setActiveType(key); setActiveCounty(null); }}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  activeType === key ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-secondary hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{label}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          {/* Column 2: County list */}
          {activeType && (
            <div className="w-52 border-r border-border bg-card/80 py-2">
              <p className="px-4 py-1.5 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">County</p>
              {SERVICE_AREAS.map((county) => (
                <button
                  key={county.slug}
                  onMouseEnter={() => setActiveCounty(county.slug)}
                  onClick={() => setActiveCounty(county.slug)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                    activeCounty === county.slug ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <span>{county.county} County</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}

          {/* Column 3: Community list */}
          {activeType && activeCounty && (() => {
            const county = SERVICE_AREAS.find(c => c.slug === activeCounty);
            const all = getAllCommunities(county);
            const isCommercial = activeType === "commercial";
            return (
              <div className="w-64 bg-background py-2 max-h-96 overflow-y-auto">
                <Link
                  to={`/service-area/${county.slug}`}
                  onClick={close}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors border-b border-border mb-1"
                >
                  All {county.county} County →
                </Link>
                {all.map((c) => (
                  <Link
                    key={c.name}
                    to={
                      isCommercial
                        ? `/service-area/${county.slug}/${slugify(c.name)}/commercial`
                        : `/service-area/${county.slug}/${slugify(c.name)}`
                    }
                    onClick={close}
                    className="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {isCommercial ? (
                      <Building className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                    ) : (
                      <House className="w-3.5 h-3.5 text-primary/60 flex-shrink-0" />
                    )}
                    {c.name}
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}