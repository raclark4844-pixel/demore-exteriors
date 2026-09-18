import {buildPhoneLeadPayload,toContactLeadRecord} from "../ingestAiPhoneLead/phoneAgent.ts";
import { authorize } from "../../shared/agentNotificationAuth.ts";
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

  const access=await authorize(req); if(access.response) return access.response;
  const sr=access.sr;
  const body = await req.json().catch(() => ({}));
  const raw = (body && (body.lead || body.intake)) || body || {};
  if(!raw || typeof raw!=="object" || Array.isArray(raw)) return Response.json({error:"Intake object required"},{status:400});
  const lead = {};
  for(const key of ["lead_ref","external_id","id","name","phone","email","address","message","inquiry","appointment_time","appointment_status","service_type","insurance_claim_filed","claim_carrier","claim_number","date_of_loss","adjuster_name","adjuster_phone","adjuster_email","call_summary","transcript_url","lead_source"]) {
    if(raw[key]!=null) lead[key]=String(raw[key]).trim().slice(0,key==="call_summary"||key==="message"?12000:1000);
  }
  if(raw.active_leak!==undefined) lead.active_leak=raw.active_leak===true || raw.active_leak==="true" || raw.active_leak==="yes";
  lead.name ||= String(raw.caller_name||"").slice(0,180);
  lead.phone ||= String(raw.callback_phone||raw.caller_phone||"").slice(0,80);
  lead.address ||= String(raw.property_address||"").slice(0,500);
  lead.claim_carrier ||= String(raw.insurance_carrier||"").slice(0,180);
  lead.call_summary ||= String(raw.summary||"").slice(0,12000);
  lead.transcript_url ||= String(raw.transcript_reference||"").slice(0,1000);
  if(!["name","phone","email","address","message","inquiry","call_summary"].some(k=>lead[k])) return Response.json({error:"No captured information"},{status:400});
  const eventType = body.event_type === "lead_updated" ? "lead_updated" : "lead_captured";
  const leadRef = String(lead.lead_ref || lead.external_id || lead.id || (lead.phone ? "legacy-phone:"+lead.phone : ""));

  if (SKIP_RECOVERY_REFS.has(leadRef)) {
    return Response.json({
      success: true,
      skipped: true,
      reason: "LD-6B9F5797 recovery email and appointment must not be resent",
    });
  }

  if(!leadRef) return Response.json({error:"Stable lead_ref or call ID required"},{status:400});
  lead.lead_ref=leadRef;
  const snap = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(lead))))).map(b=>b.toString(16).padStart(2,"0")).join("");
  const idempotencyKey = "demore-intake-"+snap;

  const existing = await sr.entities.EmailDeliveryLog.filter({ idempotency_key: idempotencyKey });
  if (Array.isArray(existing) && existing.some((row) => ["accepted","delivered"].includes(row.provider_status))) {
    return Response.json({ success: true, duplicate: true, sent: false, idempotency_key: idempotencyKey });
  }

  const to = recipients();
  const source = String(lead.lead_source || body.source || "ai_phone").replaceAll("_", " ");
  const subjectPrefix = "Captured intake";
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

  const record=existing[0] || await sr.entities.EmailDeliveryLog.create({
    idempotency_key:idempotencyKey,lead_ref:leadRef,event_type:eventType,recipients:to.join(", "),
    subject,provider_status:"pending",attempt_count:0,fingerprint:snap,intake:lead,
  });
  // Store qualified intakes in the existing lead inbox; partial intakes remain in the delivery log.
  if(lead.name && lead.phone) {
    const matches=await sr.entities.ContactLead.filter({external_intake_ref:leadRef});
    const data=toContactLeadRecord(buildPhoneLeadPayload(lead));
    data.external_intake_ref=leadRef;
    data.owner_notification_managed=true;
    data.lead_source=lead.lead_source==="chat"||body.source==="chat"?"chat":"ai_phone";
    data.appointment_time=lead.appointment_time||"";
    data.appointment_status=lead.appointment_status||"Not confirmed";
    if(matches[0]) {delete data.status;await sr.entities.ContactLead.update(matches[0].id,data);}
    else await sr.entities.ContactLead.create(data);
  }
  const cfg=missingEmailConfig();
  if(cfg.length) {await sr.entities.EmailDeliveryLog.update(record.id,{provider_status:"blocked_config"});return Response.json({error:"Email configuration missing",missing:cfg,sent:false,delivery_log_id:record.id},{status:503});}
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
  for(let attempt=1;attempt<=MAX_ATTEMPTS;attempt++) {
    let result;
    try {result=await resend.emails.send({from,to,replyTo:lead.email||DEFAULT_RECIPIENTS[0],subject,html},{idempotencyKey});}
    catch {result={error:{message:"Email provider connection failed",statusCode:503}};}
    if(result.data?.id && !result.error) {
      await sr.entities.EmailDeliveryLog.update(record.id,{provider_status:"accepted",provider_message_id:result.data.id,attempt_count:(record.attempt_count||0)+attempt,last_error:""});
      return Response.json({success:true,sent:true,provider_status:"accepted",provider_message_id:result.data.id,recipients:to,delivery_log_id:record.id});
    }
    const code=Number(result.error?.statusCode||503);
    const retryable=code===429 || code>=500;
    await sr.entities.EmailDeliveryLog.update(record.id,{
      provider_status:retryable?"retrying":"rejected",attempt_count:(record.attempt_count||0)+attempt,
      last_error:result.error?.message||"Provider returned no message ID",
    });
    if(!retryable) break;
    if(attempt<MAX_ATTEMPTS) await new Promise(r=>setTimeout(r,1000*2**(attempt-1)));
  }
  return Response.json({success:false,sent:false,provider_status:"failed",delivery_log_id:record.id,error:"Owner notification not accepted; intake retained for retry"},{status:502});
}
