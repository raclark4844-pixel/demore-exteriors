export const PRIMARY_NUMBER = "(440) 920-6133";
export const BUSINESS_TIMEZONE = "America/New_York";
export const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6];
export const BUSINESS_OPEN_MINUTES = 7 * 60;
export const BUSINESS_CLOSE_MINUTES = 19 * 60;

export type PhoneLeadPayload = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  preferred_language: "en" | "es";
  service_type: string;
  active_leak: boolean;
  insurance_claim_filed?: "yes" | "no" | "not_sure";
  claim_carrier?: string;
  claim_number?: string;
  date_of_loss?: string;
  adjuster_name?: string;
  adjuster_phone?: string;
  adjuster_email?: string;
  call_summary?: string;
  transcript_url?: string;
  lead_source: "ai_phone";
  after_hours?: boolean;
  priority?: "urgent" | "normal";
  message?: string;
  description?: string;
  status: "new";
};

const text = (value: unknown, max = 500) => String(value ?? "").trim().slice(0, max);

export function isWithinBusinessHours(now = new Date(), timeZone = BUSINESS_TIMEZONE): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = dayMap[weekday ?? ""] ?? now.getDay();
  if (!BUSINESS_DAYS.includes(day)) return false;
  const minutes = hour * 60 + minute;
  return minutes >= BUSINESS_OPEN_MINUTES && minutes < BUSINESS_CLOSE_MINUTES;
}

export function normalizeLanguage(value: unknown): "en" | "es" {
  const v = text(value, 40).toLowerCase();
  if (v.startsWith("es") || v.includes("spanish") || v.includes("español") || v.includes("espanol")) return "es";
  return "en";
}

export function normalizeYesNoNotSure(value: unknown): "yes" | "no" | "not_sure" | undefined {
  const v = text(value, 40).toLowerCase();
  if (!v) return undefined;
  if (["yes", "y", "true", "filed", "open", "already filed"].includes(v)) return "yes";
  if (["no", "n", "false", "not filed", "none"].includes(v)) return "no";
  if (["not sure", "not_sure", "unsure", "unknown"].includes(v)) return "not_sure";
  return "not_sure";
}

export function normalizeActiveLeak(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const v = text(value, 40).toLowerCase();
  return ["yes", "y", "true", "active", "leaking", "water entering", "water is entering"].includes(v);
}

const STORM_HINTS = [
  "storm damage", "hail", "wind damage", "insurance claim", "adjuster", "date of loss", "loss date",
  "tormenta", "granizo", "daño por tormenta", "dano por tormenta",
];

const SERVICE_MAP: Record<string, string> = {
  roof: "roofing", roofing: "roofing", retail_roofing: "roofing",
  siding: "siding", gutter: "gutters", gutters: "gutters",
  window: "windows", windows: "windows", door: "doors", doors: "doors",
  deck: "decks", decks: "decks", storm: "storm_damage", storm_damage: "storm_damage",
  hail: "storm_damage", insurance: "storm_damage", multiple: "multiple", other: "other",
};

export function isStormCall(input: Record<string, unknown>): boolean {
  if (input.force_storm === true) return true;
  const service = text(input.service_needed || input.service_type, 120).toLowerCase();
  if (SERVICE_MAP[service] === "storm_damage") return true;
  if (["tormenta", "granizo", "daño por tormenta", "dano por tormenta"].some((h) => service.includes(h))) return true;
  if (text(input.claim_carrier, 80) || text(input.claim_number, 80) || text(input.adjuster_name, 80) || text(input.date_of_loss, 80)) return true;
  const claimStatus = text(input.insurance_claim_filed || input.claim_filed, 40).toLowerCase();
  if (["yes", "y", "true", "filed", "open", "no", "n", "not sure", "not_sure"].includes(claimStatus)) return true;
  return STORM_HINTS.some((hint) => service.includes(hint));
}

export function normalizeServiceType(input: Record<string, unknown>): string {
  if (isStormCall(input)) return "storm_damage";
  const raw = text(input.service_needed || input.service_type, 80).toLowerCase();
  for (const [key, value] of Object.entries(SERVICE_MAP)) {
    if (raw === key || raw.includes(key)) return value;
  }
  return raw || "other";
}

export function buildPhoneLeadPayload(raw: Record<string, unknown>, now = new Date()): PhoneLeadPayload {
  const name = text(raw.name || raw.caller_name, 180);
  const phone = text(raw.phone || raw.callback_phone || raw.caller_phone || raw.from, 80);
  const activeLeak = normalizeActiveLeak(raw.active_leak ?? raw.water_actively_entering ?? raw.water_entering ?? raw.emergency);
  const storm = isStormCall(raw) || activeLeak;
  const serviceType = storm ? "storm_damage" : normalizeServiceType(raw);
  const afterHours = raw.after_hours === true || raw.after_hours === "true" || !isWithinBusinessHours(now);
  const callSummary = text(raw.call_summary || raw.summary || raw.message, 1200);
  const transcriptUrl = text(raw.transcript_url || raw.transcript_reference || raw.transcript, 500);
  const language = normalizeLanguage(raw.preferred_language || raw.language);

  const payload: PhoneLeadPayload = {
    name,
    phone,
    email: text(raw.email, 240) || undefined,
    address: text(raw.address || raw.property_address || raw.full_property_address, 500) || undefined,
    preferred_language: language,
    service_type: serviceType,
    active_leak: activeLeak,
    insurance_claim_filed: normalizeYesNoNotSure(raw.insurance_claim_filed ?? raw.claim_filed),
    claim_carrier: text(raw.claim_carrier || raw.insurance_carrier || raw.carrier, 180) || undefined,
    claim_number: text(raw.claim_number, 180) || undefined,
    date_of_loss: text(raw.date_of_loss || raw.storm_date, 80) || undefined,
    adjuster_name: text(raw.adjuster_name, 180) || undefined,
    adjuster_phone: text(raw.adjuster_phone, 80) || undefined,
    adjuster_email: text(raw.adjuster_email, 240) || undefined,
    call_summary: callSummary || undefined,
    transcript_url: transcriptUrl || undefined,
    lead_source: "ai_phone",
    after_hours: afterHours,
    priority: activeLeak ? "urgent" : "normal",
    status: "new",
  };

  const messageParts = [
    callSummary,
    activeLeak ? "ACTIVE LEAK / PRIORITY RESPONSE REPORTED" : "",
    afterHours ? "After-hours AI phone intake" : "In-hours AI phone intake",
    transcriptUrl ? `Transcript: ${transcriptUrl}` : "",
  ].filter(Boolean);
  payload.message = messageParts.join("\n").slice(0, 2000);
  payload.description = text(`AI phone intake${activeLeak ? " — priority active leak" : ""}`, 1000);
  return payload;
}

export function validateRequiredIntake(payload: PhoneLeadPayload): string[] {
  const errors: string[] = [];
  if (!payload.name) errors.push("name");
  if (!payload.phone) errors.push("phone");
  return errors;
}

export function toContactLeadRecord(payload: PhoneLeadPayload) {
  return {
    name: payload.name,
    phone: payload.phone,
    email: payload.email || "",
    address: payload.address || "",
    service_type: payload.service_type,
    insurance_claim_filed: payload.insurance_claim_filed,
    claim_carrier: payload.claim_carrier || "",
    claim_number: payload.claim_number || "",
    date_of_loss: payload.date_of_loss || "",
    adjuster_name: payload.adjuster_name || "",
    adjuster_phone: payload.adjuster_phone || "",
    adjuster_email: payload.adjuster_email || "",
    preferred_language: payload.preferred_language,
    lead_source: payload.lead_source,
    active_leak: payload.active_leak,
    call_summary: payload.call_summary || "",
    transcript_url: payload.transcript_url || "",
    message: payload.message || "",
    description: payload.description || "",
    status: payload.status,
  };
}