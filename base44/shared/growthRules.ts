export const COUNTY_CODES = { "039007": "Ashtabula", "039035": "Cuyahoga", "039055": "Geauga", "039085": "Lake", "039103": "Medina", "039133": "Portage", "039153": "Summit", "039155": "Trumbull" };
export const validReviewUrl = (value) => {
  try { const u = new URL(value); return u.protocol === "https:" && (["g.page", "maps.app.goo.gl", "search.google.com", "maps.google.com", "www.google.com"].includes(u.hostname)); } catch { return false; }
};
export const eligible = (customer, channel) => !customer.opted_out && Boolean(customer.consent_reference?.trim()) && Boolean(customer[channel + "_consent"]) && (channel === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email || "") : /^\+[1-9]\d{7,14}$/.test(customer.phone || ""));
export function reviewDraft(customer, channel, reviewUrl) {
  return { dedupe_key: "review:" + customer.id + ":" + channel, customer_id: customer.id, kind: "review", channel, destination: channel === "email" ? customer.email : customer.phone, subject: "How did we do? — Demore Exterior Solutions", message: "Thank you for choosing Demore Exterior Solutions. Please share your honest experience on Google: " + reviewUrl + (channel === "sms" ? " Reply STOP to opt out." : "\n\nAll feedback is welcome. To stop review reminders, reply unsubscribe.\nDemore Exterior Solutions, 6348 Meldon Dr, Mentor, OH 44060."), status: "draft" };
}
export function stormCounties(p) {
  const same = p.geocode?.SAME || [];
  const ugc = p.geocode?.UGC || [];
  return Object.entries(COUNTY_CODES).filter(([code]) => same.includes(code) || ugc.includes("OHC" + code.slice(-3))).map(([,name]) => name);
}
export function qualifyingAlert(p, now) {
  return p?.status === "Actual" && p.messageType !== "Cancel" && ["Severe Thunderstorm Warning","Tornado Warning","High Wind Warning"].includes(p.event) && Number.isFinite(Date.parse(p.sent)) && Date.parse(p.sent) <= now && Date.parse(p.sent) >= now - 86400000 && stormCounties(p).length > 0;
}
export function publishableOutcome(p) {
  return Boolean(p.title?.trim() && p.city_slug?.trim() && p.city_name?.trim() && p.summary?.trim() && p.consent_confirmed && p.amounts_verified && /^https:\/\//.test(p.before_url || "") && /^https:\/\//.test(p.after_url || "") && p.before_url !== p.after_url && Number.isFinite(p.initial_amount) && p.initial_amount >= 0 && Number.isFinite(p.final_amount) && p.final_amount >= 0);
}