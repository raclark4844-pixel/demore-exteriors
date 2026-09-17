// Opens the external Demore Virtual Receptionist (embed.js iframe) from
// anywhere in the app. Pass an optional prefill message
// (e.g. "I'd like to schedule a free inspection").
const EMBED_ORIGIN = "https://demorephoneagent.grok.me";

export function openAssistant(prefill) {
  const iframe = document.querySelector('iframe[title="Ask Demore"]');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      {
        type: "demore-open-chat",
        path: location.pathname + location.search,
        prefill: prefill || ""
      },
      EMBED_ORIGIN
    );
  }
}

// Lead-CTA visible-text patterns -> receptionist prefill message.
const PREFILL_RULES = [
  {
    re: /free\s+inspection|(schedule|book)\s+(an?\s+)?inspection/,
    prefill: "I'd like to schedule a free inspection"
  },
  {
    re: /free\s+estimate/,
    prefill: "I'd like to request a free estimate"
  },
  {
    re: /\bquote\b/,
    prefill: "I'd like to get a quote"
  }
];

// Global capture-phase interceptor for lead CTAs, mounted once when this
// module loads (Navbar/Footer import it on every page). Skips tel:/mailto:
// links (the embed's call overlay handles those) and forms.
export function initLeadCTAInterceptor() {
  const handler = (e) => {
    const el = e.target && e.target.closest ? e.target.closest("a,button") : null;
    if (!el || el.closest("form")) return;
    const href = el.getAttribute("href") || "";
    if (href.startsWith("tel:") || href.startsWith("mailto:")) return;
    const text = (el.innerText || el.textContent || "").trim().toLowerCase();
    if (!text) return;
    const rule = PREFILL_RULES.find((r) => r.re.test(text));
    if (!rule) return;
    e.preventDefault();
    e.stopPropagation();
    openAssistant(rule.prefill);
  };
  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}

if (typeof document !== "undefined") {
  initLeadCTAInterceptor();
}