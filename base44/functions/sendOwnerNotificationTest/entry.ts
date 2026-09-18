import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
import { Resend } from "npm:resend@6.28.1";

const TO = ["ryan@demoreexteriorsolutions.com", "clark@demoreexteriorsolutions.com"];

export default async function (req) {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const expectedSecret = Deno.env.get("AI_PHONE_WEBHOOK_SECRET");
  const provided = req.headers.get("x-demore-agent-secret") || "";
  if (!expectedSecret || provided !== expectedSecret) {
    return Response.json({
      error: "Unauthorized or secret missing",
      missing: expectedSecret ? [] : [{
        name: "AI_PHONE_WEBHOOK_SECRET",
        where: "Base44 Dashboard → Secrets",
        why: "Required to run the labeled owner notification test",
      }],
      sent: false,
    }, { status: expectedSecret ? 401 : 503 });
  }

  if (!Deno.env.get("RESEND_API_KEY")) {
    return Response.json({
      error: "Email configuration is missing",
      missing: [{
        name: "RESEND_API_KEY",
        where: "Base44 Dashboard → Secrets",
        why: "Resend API key used only on the server",
      }],
      sent: false,
    }, { status: 503 });
  }

  const from = Deno.env.get("RESEND_FROM_EMAIL") || "Demore Exterior Solutions <no-reply@demorehomesolutions.com>";
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  const subject = "TEST NOTIFICATION — not a customer lead — Demore phone/chat email check";
  const result = await resend.emails.send({
    from,
    to: TO,
    subject,
    html: `
      <p><strong>TEST NOTIFICATION — not a customer lead.</strong></p>
      <p>This confirms owner email routing for phone and Ask Demore captures.</p>
      <p>Recipients: ryan@demoreexteriorsolutions.com and clark@demoreexteriorsolutions.com</p>
      <p>Do not create an appointment from this message. Do not contact a homeowner.</p>
    `,
  }, { idempotencyKey: `owner-notification-test-${new Date().toISOString().slice(0, 13)}` });

  if (result.error) {
    return Response.json({
      success: false,
      sent: false,
      provider_status: "rejected",
      error: result.error.message || "Provider rejected the message",
    }, { status: 502 });
  }

  const base44 = createClientFromRequest(req);
  await base44.asServiceRole.entities.EmailDeliveryLog.create({
    idempotency_key: `owner-test-${result.data?.id || Date.now()}`,
    event_type: "owner_test",
    recipients: TO.join(", "),
    subject,
    provider_status: "accepted",
    provider_message_id: result.data?.id || "",
    attempt_count: 1,
  }).catch(() => null);

  return Response.json({
    success: true,
    sent: true,
    provider_status: "accepted",
    provider_message_id: result.data?.id || null,
    recipients: TO,
    published: false,
  });
}
