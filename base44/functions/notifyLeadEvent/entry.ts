import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { Resend } from "npm:resend@6.28.1";

const DEFAULT_RECIPIENTS = ["ryan@demoreexteriorsolutions.com", "clark@demoreexteriorsolutions.com"];
const SKIP_RECOVERY_REFS = new Set(["LD-6B9F5797"]);
const MAX_ATTEMPTS = 3;

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const show = (value, fallback = "Not provided") => value ? esc(value) : fallback;

const fingerprint = (lead) => [
  lead.lead_ref || lead.id || "",
  lead.name || "",
  lead.phone || "",
  lead.email || "",
  lead.address || "",
  lead.message || lead.inquiry || "",
  lead.appointment_time || "",
  lead.appointment_status || "",
  lead.claim_carrier || "",
  lead.claim_number || "",
  lead.date_of_loss || "",
  lead.adjuster_name || "",
  lead.adjuster_phone || "",
  lead.adjuster_email || "",
  lead.call_summary || "",
  lead.transcript_url || "",
].join("|");

function missingEmailConfig() {
  const missing = [];
  if (!Deno.env.get("RESEND_API_KEY")) {
    missing.push({
      name: "RESEND_API_KEY",
      where: "Base44 Dashboard → Secrets (or Environment Variables)",
      why: "Server-side Resend credential used to send owner notifications",
    });
  }
  return missing;
}

function recipients() {
  const extra = (Deno.env.get("LEAD_NOTIFICATION_EMAILS") || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_RECIPIENTS, ...extra])];
}

function row(label, value) {
  return `<tr><td style="padding:6px;font-weight:bold;vertical-align:top">${esc(label)}</td><td style="padding:6px">${value}</td></tr>`;
}

export default async function (req) {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const expectedSecret = Deno.env.get("AI_PHONE_WEBHOOK_SECRET");
  if (!expectedSecret) {
    return Response.json({
      error: "AI phone webhook is not configured",
      missing: [{
        name: "AI_PHONE_WEBHOOK_SECRET",
        where: "Base44 Dashboard → Secrets",
        why: "Authenticates Vapi / Ask Demore / notifyLeadEvent posts via x-demore-agent-secret",
      }],
    }, { status: 503 });
  }
  const provided = req.headers.get("x-demore-agent-secret") || "";
  if (provided !== expectedSecret) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const lead = (body && (body.lead || body.intake)) || body || {};
  const eventType = body.event_type === "lead_updated" ? "lead_updated" : "lead_captured";
  const leadRef = String(lead.lead_ref || lead.external_id || lead.id || "");

  if (SKIP_RECOVERY_REFS.has(leadRef) && body.allow_ld6_recovery !== true) {
    return Response.json({
      success: true,
      skipped: true,
      reason: "LD-6B9F5797 recovery email and appointment must not be resent",
    });
  }

  const cfg = missingEmailConfig();
  if (cfg.length) {
    return Response.json({ error: "Email configuration is missing", missing: cfg, sent: false }, { status: 503 });
  }

  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;
  const snap = fingerprint(lead);
  const idempotencyKey = `${eventType}:${leadRef || lead.phone || "unknown"}:${snap}`;

  const existing = await sr.entities.EmailDeliveryLog.filter({ idempotency_key: idempotencyKey }).catch(() => []);
  if (Array.isArray(existing) && existing.some((row) => row.provider_status === "accepted")) {
    return Response.json({ success: true, duplicate: true, sent: false, idempotency_key: idempotencyKey });
  }

  const to = recipients();
  const source = (lead.lead_source || body.source || "ai_phone").replaceAll("_", " ");
  const subjectPrefix = eventType === "lead_updated" ? "Updated intake" : "New intake";
  const subject = `${subjectPrefix} — ${lead.name || "Unknown caller"} (${source})`;
  const from = Deno.env.get("RESEND_FROM_EMAIL") || "Demore Exterior Solutions <no-reply@demorehomesolutions.com>";

  const html = `
    <h2>${esc(subjectPrefix)} from phone or Ask Demore</h2>
    <p>This email is sent when information is captured, not only when an appointment is booked.</p>
    <table style="border-collapse:collapse;width:100%;max-width:760px">
      ${row("Lead ref", show(leadRef || lead.id))}
      ${row("Source", show(source))}
      ${row("Name", show(lead.name))}
      ${row("Phone", show(lead.phone))}
      ${row("Email", show(lead.email))}
      ${row("Property address", show(lead.address))}
      ${row("Inquiry / message", show(lead.message || lead.inquiry, "None").replaceAll("\n", "<br/>"))}
      ${row("Appointment time", show(lead.appointment_time))}
      ${row("Appointment status", show(lead.appointment_status, "Not confirmed by calendar"))}
      ${row("Service", show(lead.service_type))}
      ${row("Active leak", lead.active_leak ? "YES — PRIORITY" : "No")}
      ${row("Claim filed", show(lead.insurance_claim_filed))}
      ${row("Insurance carrier", show(lead.claim_carrier))}
      ${row("Claim number", show(lead.claim_number))}
      ${row("Date of loss", show(lead.date_of_loss))}
      ${row("Adjuster", show(lead.adjuster_name))}
      ${row("Adjuster phone", show(lead.adjuster_phone))}
      ${row("Adjuster email", show(lead.adjuster_email))}
      ${row("Call summary", show(lead.call_summary).replaceAll("\n", "<br/>"))}
      ${row("Transcript reference", show(lead.transcript_url))}
    </table>
  `;

  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  let lastError = "";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: lead.email || "ryan@demoreexteriorsolutions.com",
      subject,
      html,
    }, { idempotencyKey });
    if (result.error) {
      lastError = result.error.message || String(result.error);
      await sr.entities.EmailDeliveryLog.create({
        idempotency_key: `${idempotencyKey}:attempt-${attempt}`,
        lead_id: lead.id || "",
        lead_ref: leadRef,
        event_type: eventType,
        recipients: to.join(", "),
        subject,
        provider_status: attempt === MAX_ATTEMPTS ? "rejected" : "retrying",
        attempt_count: attempt,
        last_error: lastError,
        fingerprint: snap,
      }).catch(() => null);
      continue;
    }
    await sr.entities.EmailDeliveryLog.create({
      idempotency_key: idempotencyKey,
      lead_id: lead.id || "",
      lead_ref: leadRef,
      event_type: eventType,
      recipients: to.join(", "),
      subject,
      provider_status: "accepted",
      provider_message_id: result.data?.id || "",
      attempt_count: attempt,
      fingerprint: snap,
    }).catch(() => null);
    return Response.json({
      success: true,
      sent: true,
      provider_status: "accepted",
      provider_message_id: result.data?.id || null,
      recipients: to,
    });
  }

  return Response.json({
    success: false,
    sent: false,
    provider_status: "rejected",
    error: "Provider rejected the message",
  }, { status: 502 });
}
