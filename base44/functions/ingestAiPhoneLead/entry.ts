import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import {
  buildPhoneLeadPayload,
  toContactLeadRecord,
  validateRequiredIntake,
} from "./phoneAgent.ts";

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
    const input = (body && typeof body === "object" && (body.lead || body.intake)) || body || {};

    const payload = buildPhoneLeadPayload(input);
    const missing = validateRequiredIntake(payload);
    if (missing.length) {
      return Response.json({ error: `${missing.join(" and ")} are required` }, { status: 400 });
    }

    const lead = await sr.entities.ContactLead.create(toContactLeadRecord(payload));

    return Response.json({
      success: true,
      lead_id: lead.id,
      service_type: payload.service_type,
      preferred_language: payload.preferred_language,
      active_leak: payload.active_leak,
      priority: payload.priority,
      after_hours: payload.after_hours,
    });
  } catch (error) {
    console.error("AI phone lead ingestion failed:", error.message);
    return Response.json({ error: "Unable to create lead" }, { status: 500 });
  }
}
