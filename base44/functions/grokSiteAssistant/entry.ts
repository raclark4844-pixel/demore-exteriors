import { WEBSITE_FEATURES } from "../../shared/websiteFeatures.ts";
import { secrets } from "base44:runtime";
import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";
import { Resend } from "npm:resend@4.0.0";

const XAI_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4-fast-non-reasoning";
const MAX_USER_MESSAGE_CHARS = 2000;
const MAX_MESSAGES = 20;
const MAX_REQUESTS_PER_HOUR = 60;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const USER_TEXT_LOG_CHARS = 120;
const LEAD_EMAIL_TO = ["ryan@demoreexteriorsolutions.com", "clark@demoreexteriorsolutions.com"];
const LEAD_EMAIL_FROM = "Demore Exterior Solutions <no-reply@demorehomesolutions.com>";

const PRIORITIES = ["urgent_leak", "adjuster_on_site", "hot_insurance", "standard", "after_hours_faq", "existing_message"];
const INTENTS = ["leak", "project", "insurance", "faq", "out_of_area"];
const LEAD_FIELDS = ["fullName", "phone", "email", "address", "city", "county", "serviceType", "propertyType"];

const SYSTEM_PROMPT = `You are the Demore Virtual Receptionist for Demore Exterior Solutions, a licensed and insured exterior contractor in Mentor, Ohio.

WHO YOU ARE
- You are the Demore Virtual Receptionist. Never invent or imply a fake human first name. If asked whether you are a real person, answer honestly: you are the virtual receptionist for Demore.
- Warm, local, competent — never slick. Short answers. Ask ONE question at a time. Never dump a brochure.

BUSINESS
- Phone: (440) 920-6133. Address: 6348 Meldon Dr, Mentor, OH 44060. Email: ryan@demoreexteriorsolutions.com.
- Hours: Monday-Saturday, 7AM-7PM Eastern. After hours, you are the primary contact.
- 26 years of industry experience, 500+ projects, licensed & insured, 10-year workmanship warranty, financing available.
- Never quote prices or financing rates. The next step is always booking a free inspection.

TERRITORY — Lake, Geauga, Cuyahoga, Summit, Medina, Portage, Ashtabula, and Trumbull Counties in Northeast Ohio, including Mentor, Willoughby, Painesville, Kirtland, Chardon, Stow, Kent, Ravenna, Medina, Brunswick, Ashtabula, Warren, and surrounding communities. Outside this area: give a brief, polite no and stop selling.

SERVICES
- Roofing: full tear-off replacement only, never a roof-over. Manufacturers: GAF, Owens Corning, CertainTeed, IKO.
- Siding: vinyl, James Hardie, engineered wood.
- Gutters. Windows: ProVia, Gerkin. Doors: ProVia, Therma-Tru, Larson.
- Decks and outdoor living. Commercial exterior work. Storm restoration.

INSURANCE — CRITICAL RULES
- Demore is the CONTRACTOR, not a public adjuster. Demore inspects, documents the construction scope, and performs the repair.
- Never say the insurer owes the homeowner a full roof or any claim amount. Never give claim-value opinions. Never say "we represent you against the carrier."
- If a claim is denied, the homeowner owes nothing (contingency agreement).

LEAD FLOW — one question at a time:
1. City first. 2. Their name. 3. Is this an active leak, a planned project, or an insurance/storm claim?
Then, as the conversation allows, collect: phone, email, property address, county, serviceType (roofing/siding/gutters/windows/doors/decks/commercial/storm), and propertyType (residential or commercial).
When you have at least their name and phone, confirm that Ryan Bomer will follow up and that they can always call (440) 920-6133.

EVERY reply must end with exactly one hidden metadata line. Never mention it and never show it as chat text:
[[META]]{"intent":"leak|project|insurance|faq|out_of_area","priority":"urgent_leak|adjuster_on_site|hot_insurance|standard|after_hours_faq|existing_message","summary":"one-line summary for staff","lead":{"fullName":"","phone":"","email":"","address":"","city":"","county":"","serviceType":"","propertyType":""}}[[/META]]
- lead: fill in only the fields collected so far; leave the rest empty.
- priority: urgent_leak = water entering the home now; adjuster_on_site = adjuster appointment set or adjuster on site; hot_insurance = fresh storm claim being filed; after_hours_faq = after-hours general question; existing_message = relaying a message for staff; standard otherwise.`;

const CALL_NOTE = "\n\nCONTEXT: this conversation is a phone call on the office line. Replies go back and forth one at a time, so stay brief and conversational.";

// Best-effort per-IP rate limiting (per runtime instance)
const ipHits = new Map();

function getClientIp(req) {
  const fwd = req.headers?.get?.("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers?.get?.("x-real-ip") || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= MAX_REQUESTS_PER_HOUR) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
}

// Business hours: Monday-Saturday, 7:00 AM - 7:00 PM US Eastern
function isBusinessHoursET() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());
    const get = (type) => {
      const part = parts.find((p) => p.type === type);
      return part ? part.value : "";
    };
    const day = get("weekday");
    if (day === "Sun") return false;
    const hour = parseInt(get("hour"), 10) % 24;
    const minute = parseInt(get("minute"), 10);
    const minutes = hour * 60 + minute;
    return minutes >= 420 && minutes < 1140;
  } catch {
    return true;
  }
}

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, "");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function logRequest(userText, ok) {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      user: (userText || "").slice(0, USER_TEXT_LOG_CHARS),
      ok
    })
  );
}

function extractMeta(replyText) {
  const match = replyText.match(/\[\[META\]\]([\s\S]*?)\[\[\/META\]\]/);
  let meta = null;
  if (match) {
    try {
      meta = JSON.parse(match[1].trim());
    } catch {
      meta = null;
    }
  }
  const reply = replyText
    .replace(/\[\[META\]\][\s\S]*?\[\[\/META\]\]/g, "")
    .trim();
  return { meta, reply };
}

async function upsertLead(base44, meta, channel, sessionId, afterHours) {
  const lead = (meta && typeof meta.lead === "object" && meta.lead) || {};
  const priority = PRIORITIES.includes(meta.priority) ? meta.priority : (afterHours ? "after_hours_faq" : "standard");
  const intent = INTENTS.includes(meta.intent) ? meta.intent : "other";
  const stamp = `${new Date().toISOString()} ${channel}`;
  const now = new Date().toISOString();
  const clean = (value) => (typeof value === "string" ? value.trim() : "");

  const existing = await base44.asServiceRole.entities.Lead.filter({ sessionId: sessionId });
  if (existing.length > 0) {
    const current = existing[0];
    const trail = Array.isArray(current.channelTrail) ? current.channelTrail.slice() : [];
    if (trail[trail.length - 1] !== stamp) trail.push(stamp);
    const updates = {
      channelTrail: trail,
      intent,
      priority,
      lastActivity: now,
      notes: clean(meta.summary) || current.notes || ""
    };
    for (const field of LEAD_FIELDS) {
      const value = clean(lead[field]);
      if (value) updates[field] = value;
    }
    await base44.asServiceRole.entities.Lead.update(current.id, updates);
    return { record: { ...current, ...updates }, created: false };
  }

  const record = {
    fullName: clean(lead.fullName) || "Unknown",
    phone: clean(lead.phone),
    email: clean(lead.email),
    address: clean(lead.address),
    city: clean(lead.city),
    county: clean(lead.county),
    intent,
    priority,
    serviceType: clean(lead.serviceType),
    propertyType: clean(lead.propertyType),
    channelTrail: [stamp],
    notes: clean(meta.summary),
    sessionId,
    status: "new",
    lastActivity: now
  };
  const created = await base44.asServiceRole.entities.Lead.create(record);
  return { record: { ...record, ...created }, created: true };
}

function buildLeadEmail(record, pageUrl, timestamp, messages) {
  const rows = [
    ["Name", record.fullName],
    ["Phone", record.phone],
    ["Email", record.email || "Not provided"],
    ["Address", record.address || "Not provided"],
    ["City", record.city || "Not provided"],
    ["County", record.county || "Not provided"],
    ["Service", record.serviceType || "Not provided"],
    ["Property type", record.propertyType || "Not provided"],
    ["Intent", record.intent],
    ["Priority", record.priority],
    ["Notes", record.notes || "None"],
    ["Channels", Array.isArray(record.channelTrail) ? [...new Set(record.channelTrail.map(x => x.endsWith("call") ? "call" : "chat"))].join(", ") : ""]
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px;font-weight:bold;vertical-align:top">${label}</td><td style="padding:6px">${escapeHtml(value || "")}</td></tr>`
    )
    .join("");

  const transcript = messages
    .slice(-8)
    .map(
      (m) =>
        `<p style="margin:4px 0"><strong>${m.role === "user" ? "Visitor" : "Assistant"}:</strong> ${escapeHtml(m.content)}</p>`
    )
    .join("");

  return `
    <h2>New receptionist lead (${escapeHtml(record.priority)})</h2>
    <p>A lead was captured by the Demore Virtual Receptionist:</p>
    <table style="border-collapse:collapse;width:100%">${rows}</table>
    <p style="margin-top:12px"><strong>Page:</strong> ${escapeHtml(pageUrl || "Not provided")}</p>
    <p><strong>Received:</strong> ${escapeHtml(timestamp)}</p>
    <h3>Transcript (last 8 messages)</h3>
    <div style="background:#f6f6f6;padding:10px;border-radius:6px">${transcript}</div>
  `;
}

export default async function(req) {
  let lastUserText = "";
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please try again later or call (440) 920-6133." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const pageUrl = typeof body?.pageUrl === "string" ? body.pageUrl : "";
    const channel = body?.channel === "call" ? "call" : "chat";
    const sessionId = (
      typeof body?.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim()
        : `ip-${ip}`
    ).slice(0, 64);
    const history = Array.isArray(body?.messages) ? body.messages : [];

    if (history.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const visitorMessages = [];
    for (const m of history) {
      const role = m?.role;
      let content = m?.content;
      if (typeof content !== "string") {
        return Response.json(
          { error: "Each message must have role 'user' or 'assistant' and non-empty text content" },
          { status: 400 }
        );
      }
      // Ignore any client-supplied system message
      if (role === "system") continue;
      if (role !== "user" && role !== "assistant") {
        return Response.json(
          { error: "Each message must have role 'user' or 'assistant' and non-empty text content" },
          { status: 400 }
        );
      }
      if (role === "user") content = stripHtml(content);
      if (!content.trim()) {
        return Response.json(
          { error: "Each message must have role 'user' or 'assistant' and non-empty text content" },
          { status: 400 }
        );
      }
      if (role === "user" && content.length > MAX_USER_MESSAGE_CHARS) {
        return Response.json({ error: `User messages must be ${MAX_USER_MESSAGE_CHARS} characters or fewer` }, { status: 400 });
      }
      visitorMessages.push({ role, content });
    }

    if (visitorMessages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    // Keep at most the last 20 messages
    const messages = visitorMessages.slice(-MAX_MESSAGES);

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserText = messages[i].content;
        break;
      }
    }

    const afterHours = !isBusinessHoursET();

    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secrets.get("XAI_API_KEY")}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT + "\n\n" + WEBSITE_FEATURES + "\nCapture all inquiries and messages for Ryan and Clark, not just appointments. Do not claim email delivery unless the notification succeeds." + (channel === "call" ? CALL_NOTE : "") },
          ...messages
        ]
      })
    });

    if (!res.ok) {
      logRequest(lastUserText, false);
      const details = await res.text();
      return Response.json({ error: "Assistant error", details }, { status: 500 });
    }

    const data = await res.json();
    const rawReply = data.choices?.[0]?.message?.content || "";
    const { meta, reply } = extractMeta(rawReply);
    const finalReply =
      reply || "Sorry, I dropped that — could you say it again? You can also call (440) 920-6133.";

    let leadSaved = false;
    let emailSent = false;
    let priority = afterHours ? "after_hours_faq" : "standard";
    let intent = "other";

    if (meta) {
      const base44 = createClientFromRequest(req);
      try {
        const result = await upsertLead(base44, meta, channel, sessionId, afterHours);
        leadSaved = true;
        priority = result.record.priority;
        intent = result.record.intent;
        if (result.record.phone || result.record.email || result.record.fullName !== "Unknown" || result.record.notes) {
          try {
            const resend = new Resend(secrets.get("RESEND_API_KEY"));
            const timestamp = result.record.created_date || "See conversation record";
            const html = buildLeadEmail(result.record, pageUrl, timestamp, messages);
            const hashBytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(html));
            const fingerprint = Array.from(new Uint8Array(hashBytes), b => b.toString(16).padStart(2, "0")).join("");
            if (result.record.owner_notification_fingerprint !== fingerprint) {
            const delivery = await resend.emails.send({
              from: LEAD_EMAIL_FROM,
              to: LEAD_EMAIL_TO,
              replyTo: result.record.email || undefined,
              subject: `New receptionist lead — ${result.record.priority} — ${result.record.city || "unknown city"}`,
              html
            }, { idempotencyKey: `receptionist-${result.record.id}-${fingerprint}` });
            if (delivery.error || !delivery.data?.id) throw new Error("Owner email was not accepted by the provider");
            await base44.asServiceRole.entities.Lead.update(result.record.id, { owner_notification_id: delivery.data.id, owner_notification_fingerprint: fingerprint, owner_notification_status: "sent" });
            }
            emailSent = true;
          } catch (emailError) {
            console.error("Lead email failed:", emailError.message);
            await base44.asServiceRole.entities.Lead.update(result.record.id, { owner_notification_status: "failed" }).catch(() => {});
          }
        }
      } catch (dbError) {
        console.error("Lead save failed:", dbError.message);
      }
    }

    logRequest(lastUserText, true);
    return Response.json({ reply: finalReply, leadSaved, emailSent, priority, intent });
  } catch (error) {
    logRequest(lastUserText, false);
    return Response.json({ error: error.message }, { status: 500 });
  }
}