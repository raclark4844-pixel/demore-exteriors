import React from "react";
import { Info, CloudLightning, Camera, Star, Images, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { openAssistant } from "@/lib/openAssistant";

const quickActions = [
  { label: "Storm Damage", to: "/insurance-claims", Icon: CloudLightning },
  { label: "Damage Check", to: "/damage-assessment", Icon: Camera },
  { label: "Reviews", to: "/reviews", Icon: Star },
  { label: "Gallery", to: "/gallery", Icon: Images },
];

export default function MobileQuickActions() {
  return (
    <div className="flex items-center gap-1 lg:hidden">
      {quickActions.map(({ label, to, Icon }) => (
        <Link
          key={label}
          to={to}
          aria-label={label}
          title={label}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/90 hover:text-primary transition-colors"
        >
          <Icon className="w-4 h-4" />
        </Link>
      ))}
      <Link
        to="/about"
        aria-label="About"
        title="About"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/90 hover:text-primary transition-colors"
      >
        <Info className="w-4 h-4" />
      </Link>
      <button
        onClick={() => openAssistant()}
        aria-label="Free Estimate"
        title="Free Estimate"
        className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
    </div>
  );
}