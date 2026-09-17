import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";
import { openAssistant } from "@/lib/openAssistant";

const HIDDEN_PREFIXES = ["/ops", "/login", "/register", "/forgot-password", "/reset-password"];

export default function GlobalAssistantLauncher() {
  const { pathname } = useLocation();
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:flex flex-col gap-2" aria-label="Demore contact shortcuts">
      <button
        type="button"
        onClick={() => openAssistant("How can Demore help with my exterior project?")}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/95 px-4 py-3 text-sm font-heading font-bold text-foreground shadow-xl backdrop-blur hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Ask Demore
      </button>
      <a
        href="tel:+14409206133"
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-heading font-bold text-accent-foreground shadow-xl hover:bg-accent/90 transition-colors"
        aria-label="Call Demore Exterior Solutions at 440-920-6133"
      >
        <Phone className="w-4 h-4" />
        Call (440) 920-6133
      </a>
    </div>
  );
}
