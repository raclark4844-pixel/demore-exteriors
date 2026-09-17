import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { Resend } from 'npm:resend@6.28.1';

const SPREADSHEET_ID = "1TBwiXElXwKjDJbsm6UTi1NZnQk-CvuU4KI1OpHBrWgo";
const SHEET_NAME = "Leads";
const DEFAULT_RECIPIENTS = ["ryan@demoreexteriorsolutions.com", "clark@demoreexteriorsolutions.com"];

const esc = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const show = (value, fallback = "Not provided") => value ? esc(value) : fallback;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const lead = payload.data;
    if (!lead?.id) return Response.json({ error: "Lead ID required" }, { status: 400 });

    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlesheets");
      const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      const row = [
        timestamp,
        lead.name || "",
        lead.phone || "",
        lead.email || "",
        lead.address || "",
        lead.service_type || "",
        lead.active_leak ? "YES" : "No",
        lead.insurance_claim_filed || "",
        lead.claim_carrier || "",
        lead.claim_number || "",
        lead.date_of_loss || "",
        lead.adjuster_name || "",
        lead.adjuster_phone || "",
        lead.adjuster_email || "",
        lead.lead_source || "website",
        lead.preferred_language || "en",
        lead.message || "",
        lead.status || "new",
        lead.id
      ];
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ values: [row] })
      });
    } catch (sheetError) {
      console.error("Google Sheet sync failed:", sheetError.message);
    }

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const from = Deno.env.get("RESEND_FROM_EMAIL") || "Demore Exterior Solutions <no-reply@demorehomesolutions.com>";
    const configuredRecipients = (Deno.env.get("LEAD_NOTIFICATION_EMAILS") || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    const recipients = [...new Set([...DEFAULT_RECIPIENTS, ...configuredRecipients])];
    const sourceLabel = (lead.lead_source || "website").replaceAll("_", " ");

    const ownerEmail = await resend.emails.send({
      from,
      to: recipients,
      replyTo: lead.email || "ryan@demoreexteriorsolutions.com",
      subject: `New ${lead.service_type === "storm_damage" ? "Storm Damage " : ""}Lead from ${lead.name} (${sourceLabel})`,
      html: `
        <h2>New Demore Lead</h2>
        <p>Lead reference: <strong>${esc(lead.id)}</strong></p>
        <p>A new lead was captured from <strong>${esc(sourceLabel)}</strong>.</p>
        <table style="border-collapse:collapse;width:100%;max-width:760px">
          <tr><td style="padding:6px;font-weight:bold">Name</td><td style="padding:6px">${show(lead.name)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Phone</td><td style="padding:6px">${show(lead.phone)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px">${show(lead.email)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Property address</td><td style="padding:6px">${show(lead.address)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Service</td><td style="padding:6px">${show(lead.service_type, "Not specified")}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Active leak</td><td style="padding:6px">${lead.active_leak ? "YES — PRIORITY" : "No"}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Claim filed?</td><td style="padding:6px">${show(lead.insurance_claim_filed, "Not specified")}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Carrier</td><td style="padding:6px">${show(lead.claim_carrier)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Claim number</td><td style="padding:6px">${show(lead.claim_number)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Date of loss</td><td style="padding:6px">${show(lead.date_of_loss)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Adjuster</td><td style="padding:6px">${show(lead.adjuster_name)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Adjuster phone</td><td style="padding:6px">${show(lead.adjuster_phone)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Adjuster email</td><td style="padding:6px">${show(lead.adjuster_email)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Language</td><td style="padding:6px">${show(lead.preferred_language, "en")}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Message</td><td style="padding:6px">${show(lead.message, "None").replaceAll("\n", "<br/>")}</td></tr>
        </table>
        <p><a href="https://www.demoreexteriorsolutions.com">Demore Exterior Solutions</a></p>
      `
    }, { idempotencyKey: `lead-owner-${lead.id}` });
    if (ownerEmail.error) throw new Error("Owner email was rejected by provider");
    if (ownerEmail.data?.id) await base44.asServiceRole.entities.ContactLead.update(lead.id, { owner_notification_id: ownerEmail.data.id });

    if (lead.email) {
      const customerEmail = await resend.emails.send({
        from,
        to: [lead.email],
        replyTo: "ryan@demoreexteriorsolutions.com",
        subject: "We received your request — Demore Exterior Solutions",
        html: `
          <h2>Thanks, ${esc(lead.name)}!</h2>
          <p>We've received your request and will be in touch shortly. Your lead reference is <strong>${esc(lead.id)}</strong>.</p>
          ${lead.lead_source === 'satellite_estimate' ? `<p>${show(lead.message).replaceAll('\n', '<br/>')}</p>` : ''}
          <p>If this is storm damage or an active leak, call <strong>(440) 920-6133</strong> so we can capture the details quickly.</p>
          <br/>
          <p>— Demore Exterior Solutions</p>
          <p style="color:#888;font-size:12px">6348 Meldon Dr, Mentor, OH 44060 | www.demoreexteriorsolutions.com</p>
        `
      }, { idempotencyKey: `lead-customer-${lead.id}` });
      if (customerEmail.error) throw new Error("Customer email was rejected by provider");
    }

    return Response.json({ success: true, notified: recipients });
  } catch (error) {
    console.error("Lead notification failed:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
