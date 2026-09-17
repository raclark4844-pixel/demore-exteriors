import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ServiceAreaDropdown from "@/components/ServiceAreaDropdown";
import ProductsDropdown from "@/components/ProductsDropdown";
import ServicesDropdown from "@/components/ServicesDropdown";
import { openAssistant } from "@/lib/openAssistant";
import MobileQuickActions from "@/components/MobileQuickActions";

const LOGO_URL = "https://media.base44.com/images/public/user_6a22dc88783b484dd6ef2b08/899ea39b7_Demorelogo.jpg";

const navLinks = [
  { label: "Storm Damage", href: "/storm-damage", to: "/storm-damage" },
  { label: "Damage Check", href: "/damage-assessment", to: "/damage-assessment" },
  { label: "Insurance Process", href: "/insurance-claims", to: "/insurance-claims" },
  { label: "Reviews", href: "/reviews", to: "/reviews" },
  { label: "Gallery", href: "/gallery", to: "/gallery" },
  { label: "About", href: "/about", to: "/about" },
  { label: "Contact", href: "/contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex-shrink-0" />

          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-white/90 hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.href}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-white/90 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-white/90 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <ServicesDropdown />
            <ServiceAreaDropdown />
            <ProductsDropdown />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:4409206133" className="flex items-center gap-2 text-sm font-semibold text-white">
              <Phone className="w-4 h-4" />
              (440) 920-6133
            </a>
            <Button
              onClick={() => openAssistant()}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold text-sm"
            >
              Free Estimate
            </Button>
          </div>

          <MobileQuickActions />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
          >
            <div className="px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.href}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
              <ServicesDropdown mobile onClose={() => setMenuOpen(false)} />
              <ServiceAreaDropdown mobile onClose={() => setMenuOpen(false)} />
              <ProductsDropdown mobile onClose={() => setMenuOpen(false)} />
              <div className="pt-3 border-t border-border flex flex-col gap-3">
                <a href="tel:4409206133" className="flex items-center gap-2 px-3 text-white font-semibold">
                  <Phone className="w-4 h-4" />
                  (440) 920-6133
                </a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); openAssistant(); }}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-bold">
                    Free Estimate
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}