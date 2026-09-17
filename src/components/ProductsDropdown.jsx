import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Package, Home, Layers, AppWindow, DoorOpen, Trees } from "lucide-react";
import { MANUFACTURERS } from "@/lib/manufacturerData";

// Build a category-type → manufacturers map from the data
const PRODUCT_TYPES = [
  { key: "roofing", label: "Roofing", icon: Home },
  { key: "siding", label: "Siding", icon: Layers },
  { key: "windows", label: "Windows", icon: AppWindow },
  { key: "doors", label: "Doors", icon: DoorOpen },
  { key: "decks", label: "Decks & Outdoor Living", icon: Trees, isLink: true, href: "/decks" },
];

function getManufacturersForType(typeKey) {
  return MANUFACTURERS.filter(mfr =>
    mfr.categories.some(cat => cat.slug === typeKey)
  ).map(mfr => ({
    ...mfr,
    matchedCategory: mfr.categories.find(cat => cat.slug === typeKey),
  }));
}

// ── Mobile ────────────────────────────────────────────────────────────────────
function MobileProductsDropdown({ onClose }) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>Products</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="pl-3 border-l-2 border-primary/30 ml-3 space-y-1">
          {PRODUCT_TYPES.map((type) => {
            const mfrs = getManufacturersForType(type.key);
            return (
              <div key={type.key}>
                <button
                  onClick={() => setActiveType(activeType === type.key ? null : type.key)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    <type.icon className="w-3.5 h-3.5 text-primary" />
                    {type.label}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeType === type.key ? "rotate-90" : ""}`} />
                </button>

                {activeType === type.key && (
                  <div className="pl-3 border-l-2 border-border ml-3 space-y-0.5">
                    {type.isLink ? (
                      <Link
                        to={type.href}
                        onClick={onClose}
                        className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        View Decks & Outdoor Living →
                      </Link>
                    ) : mfrs.map((mfr) => (
                      <div key={mfr.slug}>
                        <p className="px-3 py-1 text-xs font-bold text-muted-foreground uppercase tracking-wider">{mfr.name}</p>
                        {mfr.matchedCategory.products.map((prod) => (
                          <Link
                            key={prod.slug}
                            to={`/products/${mfr.slug}/${type.key}/${prod.slug}`}
                            onClick={onClose}
                            className="block px-3 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            {prod.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Desktop ───────────────────────────────────────────────────────────────────
export default function ProductsDropdown({ mobile = false, onClose }) {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setActiveType(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (mobile) return <MobileProductsDropdown onClose={onClose} />;

  const close = () => { setOpen(false); setActiveType(null); };
  const activeMfrs = activeType ? getManufacturersForType(activeType) : [];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setActiveType(null); }}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-primary transition-colors"
      >
        <Package className="w-3.5 h-3.5" />
        Products
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 flex shadow-2xl rounded-xl overflow-hidden border border-border bg-background z-50 min-w-[580px]">

          {/* Column 1: Product Types */}
          <div className="w-44 border-r border-border bg-card py-2 flex-shrink-0">
            <p className="px-4 py-1.5 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider">Product Type</p>
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type.key}
                onMouseEnter={() => setActiveType(type.key)}
                onClick={() => setActiveType(type.key)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  activeType === type.key
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
                }`}
              >
                <span className="flex items-center gap-2">
                  <type.icon className="w-3.5 h-3.5" />
                  {type.label}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          {/* Column 2: Manufacturers for selected type */}
          {activeType && (activeMfrs.length > 0 || PRODUCT_TYPES.find(t => t.key === activeType)?.isLink) && (
            <div className="flex-1 py-2 min-w-[340px] max-h-96 overflow-y-auto">
              <p className="px-4 py-1.5 text-xs font-heading font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1">
                {PRODUCT_TYPES.find(t => t.key === activeType)?.label}{PRODUCT_TYPES.find(t => t.key === activeType)?.isLink ? "" : " — Manufacturers"}
              </p>
              {PRODUCT_TYPES.find(t => t.key === activeType)?.isLink ? (
                <div className="px-4 py-3">
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Custom wood &amp; composite decks, structural framing, three-season rooms, and screened porches — engineered to Ohio Residential Code (R507).
                  </p>
                  <Link
                    to={PRODUCT_TYPES.find(t => t.key === activeType).href}
                    onClick={close}
                    className="flex items-center gap-2 mx-1 px-3 py-2 rounded-lg bg-primary/8 text-primary text-xs font-heading font-bold hover:bg-primary/15 transition-colors"
                  >
                    View Decks &amp; Outdoor Living →
                  </Link>
                </div>
              ) : activeMfrs.map((mfr) => (
                <div key={mfr.slug} className="mt-2 first:mt-0">
                  <Link
                    to={`/products/${mfr.slug}`}
                    onClick={close}
                    className="flex items-center gap-2 mx-3 px-3 py-1.5 rounded-lg bg-primary/8 text-primary text-xs font-heading font-bold hover:bg-primary/15 transition-colors"
                  >
                    {mfr.name} →
                  </Link>
                  {mfr.matchedCategory.products.map((prod) => (
                    <Link
                      key={prod.slug}
                      to={`/products/${mfr.slug}/${activeType}/${prod.slug}`}
                      onClick={close}
                      className="flex flex-col px-6 py-1.5 hover:bg-primary/5 transition-colors group"
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{prod.name}</span>
                      <span className="text-xs text-muted-foreground">{prod.tagline}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Placeholder when no type selected */}
          {!activeType && (
            <div className="flex-1 flex items-center justify-center py-10 text-sm text-muted-foreground min-w-[280px]">
              Hover a product type to browse manufacturers
            </div>
          )}
        </div>
      )}
    </div>
  );
}