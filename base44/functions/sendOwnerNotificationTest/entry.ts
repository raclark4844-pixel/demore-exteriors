import { authorize } from "../../shared/agentNotificationAuth.ts";
import { Resend } from "npm:resend@6.28.1";

const TO = ["ryan@demoreexteriorsolutions.com", "clark@demoreexteriorsolutions.com"];

export default async function (req) {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });

  const access=await authorize(req); if(access.response) return access.response;
  const sr=access.sr;
  const key="demore-owner-notification-test-2026-09-18-reviewed-v1";
  const prior=await sr.entities.EmailDeliveryLog.filter({idempotency_key:key});
  if(prior.some(r=>["accepted","delivered"].includes(r.provider_status))) return Response.json({success:true,duplicate:true,sent:false,provider_message_id:prior[0].provider_message_id});
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
      <p>This tests the Base44 owner email service. The external phone/chat handoff requires a separate end-to-end test.</p>
      <p>Recipients: ryan@demoreexteriorsolutions.com and clark@demoreexteriorsolutions.com</p>
      <p>Do not create an appointment from this message. Do not contact a homeowner.</p>
    `,
  }, { idempotencyKey: key });

  if (result.error || !result.data?.id) {
    return Response.json({
      success: false,
      sent: false,
      provider_status: "rejected",
      error: result.error?.message || "Provider rejected the message",
    }, { status: 502 });
  }

  await sr.entities.EmailDeliveryLog.create({
    idempotency_key: key,
    event_type: "owner_test",
    recipients: TO.join(", "),
    subject,
    provider_status: "accepted",
    provider_message_id: result.data?.id || "",
    attempt_count: 1,
  });

  return Response.json({
    success: true,
    sent: true,
    provider_status: "accepted",
    provider_message_id: result.data?.id || null,
    recipients: TO,
    published: false,
  });
}
