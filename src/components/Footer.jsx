import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Facebook, LogOut, Shield } from "lucide-react";
import { openAssistant } from "@/lib/openAssistant";
import { base44 } from "@/api/base44Client";

const LOGO_URL = "https://media.base44.com/images/public/user_6a22dc88783b484dd6ef2b08/899ea39b7_Demorelogo.jpg";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    base44.auth
      .isAuthenticated()
      .then(setIsLoggedIn)
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <footer className="bg-secondary/40 border-t border-border/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={LOGO_URL} alt="Demore Exterior Solutions logo" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Northeast Ohio's trusted exterior contractor. Roofing, siding, and gutters — 
              installed with precision, backed by integrity.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Serving Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull Counties.
            </p>
            <a
              href="https://www.facebook.com/share/14cDuZ4TLPU/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              Follow Us on Facebook
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/roofing" className="hover:text-primary transition-colors">Shingle Roofing</a></li>
              <li><a href="/siding" className="hover:text-primary transition-colors">Siding Installation</a></li>
              <li><a href="/windows" className="hover:text-primary transition-colors">Window Replacement</a></li>
              <li><a href="/doors" className="hover:text-primary transition-colors">Door Installation</a></li>
              <li><a href="/gutters" className="hover:text-primary transition-colors">Gutter Systems</a></li>
              <li><a href="/decks" className="hover:text-primary transition-colors">Decks & Outdoor Living</a></li>
              <li><a href="/storm-damage" className="hover:text-primary transition-colors">Storm Damage Repair</a></li>
              <li><a href="/damage-assessment" className="hover:text-primary transition-colors">Free AI Damage Check</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><Link to="/storm-updates" className="hover:text-primary transition-colors">Storm Updates</Link></li>
              <li><a href="/reviews" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="/gallery" className="hover:text-primary transition-colors">Project Gallery</a></li>
              <li><a href="/insurance-claims" className="hover:text-primary transition-colors">Insurance Process</a></li>
              <li><a href="/insurance-claims/help" className="hover:text-primary transition-colors">Ohio Insurance Claim Help</a></li>
              <li><a href="/financing" className="hover:text-primary transition-colors">Financing: Acorn & Synchrony</a></li>
              <li><a href="#terms" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); openAssistant(); }} className="hover:text-primary transition-colors">Contact / Free Estimate</a></li>
              <li>
                <a
                  href="https://media.base44.com/files/public/user_6a22dc88783b484dd6ef2b08/6a43445b3_DemoreContingencyAgreement.pdf"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Contingency Agreement
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:4409206133" className="hover:text-primary transition-colors">(440) 920-6133</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>6348 Meldon Dr, Mentor, OH 44060</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>https://www.demoreexteriorsolutions.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Staff links — only visible when logged in */}
        {isLoggedIn && (
          <div className="border-t border-border/50 pt-6 mb-2 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-primary" /> Staff
            </span>
            <Link to="/ops" className="text-xs text-muted-foreground hover:text-primary transition-colors">Ops Dashboard</Link>
            <a href="/products" className="text-xs text-muted-foreground hover:text-primary transition-colors">Products</a>
            <a href="/market-research" className="text-xs text-muted-foreground hover:text-primary transition-colors">Market Research</a>
            <button
              onClick={() => base44.auth.logout()}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        )}

        {/* Bottom */}
        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Demore Exterior Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Licensed & Insured General Contractor · Mentor, Ohio
          </p>
        </div>
      </div>
    </footer>
  );
}