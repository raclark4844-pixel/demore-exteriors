import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const text = (value, max = 500) => String(value ?? "").trim().slice(0, max);
const normalizeYesNo = (value) => {
  const v = text(value, 40).toLowerCase();
  if (["yes", "y", "true", "filed", "open"].includes(v)) return "yes";
  if (["no", "n", "false", "not filed"].includes(v)) return "no";
  return "not_sure";
};
const normalizeLanguage = (value) => text(value, 20).toLowerCase().startsWith("es") ? "es" : "en";

export default async function(req) {
  try {
    if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

    const expectedSecret = Deno.env.get("AI_PHONE_WEBHOOK_SECRET");
    if (!expectedSecret) return Response.json({ error: "AI phone webhook is not configured" }, { status: 503 });
    const providedSecret = req.headers.get("x-demore-agent-secret") || "";
    if (providedSecret !== expectedSecret) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const base44 = createClientFromRequest(req);
    const sr = base44.asServiceRole;
    const body = await req.json().catch(() => ({}));
    const input = body.lead || body;

    const name = text(input.name || input.caller_name, 180);
    const phone = text(input.phone || input.caller_phone || input.from, 80);
    if (!name || !phone) return Response.json({ error: "name and phone are required" }, { status: 400 });

    const activeLeak = Boolean(input.active_leak || input.emergency || input.water_entering);
    const messageParts = [
      text(input.message || input.summary || input.call_summary, 1200),
      activeLeak ? "ACTIVE LEAK / PRIORITY RESPONSE REPORTED" : "",
      input.transcript_url ? `Transcript: ${text(input.transcript_url, 500)}` : ""
    ].filter(Boolean);

    const lead = await sr.entities.ContactLead.create({
      name,
      phone,
      email: text(input.email, 240),
      address: text(input.address || input.property_address, 500),
      service_type: "storm_damage",
      insurance_claim_filed: normalizeYesNo(input.insurance_claim_filed || input.claim_filed),
      claim_carrier: text(input.claim_carrier || input.carrier, 180),
      claim_number: text(input.claim_number, 180),
      date_of_loss: text(input.date_of_loss || input.storm_date, 80),
      adjuster_name: text(input.adjuster_name, 180),
      adjuster_phone: text(input.adjuster_phone, 80),
      adjuster_email: text(input.adjuster_email, 240),
      preferred_language: normalizeLanguage(input.preferred_language || input.language),
      lead_source: "ai_phone",
      message: messageParts.join("\n").slice(0, 2000),
      description: text(`AI phone intake${activeLeak ? " — priority active leak" : ""}`, 1000),
      status: "new"
    });

    return Response.json({ success: true, lead_id: lead.id, priority: activeLeak ? "urgent" : "normal" });
  } catch (error) {
    console.error("AI phone lead ingestion failed:", error.message);
    return Response.json({ error: "Unable to create lead" }, { status: 500 });
  }
}
