import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import { Resend } from 'npm:resend@4.0.0';

const SPREADSHEET_ID = "1TBwiXElXwKjDJbsm6UTi1NZnQk-CvuU4KI1OpHBrWgo";
const SHEET_NAME = "Leads";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const lead = payload.data;

    // Sync lead to Google Sheet
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
        lead.message || "",
        lead.status || "new"
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

    await resend.emails.send({
      from: "Demore Exterior Solutions <no-reply@demorehomesolutions.com>",
      to: ["ryan@demorehomesolutions.com"],
      reply_to: lead.email || undefined,
      subject: `New Estimate Request from ${lead.name}`,
      html: `
        <h2>New Estimate Request</h2>
        <p>A new lead was submitted on the website:</p>
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:6px;font-weight:bold">Name</td><td style="padding:6px">${lead.name}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Phone</td><td style="padding:6px">${lead.phone}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td style="padding:6px">${lead.email || 'Not provided'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Address</td><td style="padding:6px">${lead.address || 'Not provided'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Service</td><td style="padding:6px">${lead.service_type || 'Not specified'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Message</td><td style="padding:6px">${lead.message || 'None'}</td></tr>
        </table>
        <p><a href="https://www.demorehomesolutions.com">Log in to review leads</a></p>
      `
    });

    // Auto-reply to the person who submitted the form (only if they provided an email)
    if (lead.email) {
      await resend.emails.send({
        from: "Demore Exterior Solutions <no-reply@demorehomesolutions.com>",
        to: [lead.email],
        reply_to: "ryan@demorehomesolutions.com",
        subject: "We received your request — Demore Exterior Solutions",
        html: `
          <h2>Thanks, ${lead.name}!</h2>
          <p>We've received your estimate request and will be in touch shortly.</p>
          <p>In the meantime, feel free to call us directly at <strong>(440) 920-6133</strong>.</p>
          <br/>
          <p>— Ryan Bomer & the Demore Exterior Solutions Team</p>
          <p style="color:#888;font-size:12px">6348 Meldon Dr, Mentor, OH 44060 | www.demorehomesolutions.com</p>
        `
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});