import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";

const ORIGIN = "https://www.demoreexteriorsolutions.com";
const PATHS = [
  "/instant-estimate",
  "/financing",
  "/storm-damage",
  "/storm-updates",
  "/insurance-claims/help",
  "/insurance-claims/help/what-is-an-insurance-supplement",
  "/insurance-claims/help/ohio-matching-siding-roofing-exterior-materials",
  "/insurance-claims/help/acv-vs-rcv",
  "/insurance-claims/help/depreciation-depreciation-release",
  "/insurance-claims/help/how-to-file-an-ohio-department-of-insurance-complaint",
  "/review-us",
  "/gallery",
];

const BLOCKED = ["/ops", "/install", "/login", "/register", "/ai-control", "/market-research"];
const VERSION = "2026.09.18.1";

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

function categoryFor(path) {
  if (path.includes("insurance")) return "STORM_RULE";
  if (path.includes("storm")) return "STORM_RULE";
  if (path.includes("financ")) return "SERVICE";
  if (path.includes("estimate")) return "SERVICE";
  if (path.includes("review")) return "CONTACT";
  if (path.includes("gallery")) return "SERVICE";
  return "BUSINESS_FACT";
}

export default async function (req) {
  if (req.method !== "POST" && req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const expectedSecret = Deno.env.get("AI_PHONE_WEBHOOK_SECRET");
  const provided = req.headers.get("x-demore-agent-secret") || "";
  if (!expectedSecret || provided !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;
  const ok = [];
  const failed = [];

  for (const path of PATHS) {
    if (BLOCKED.some((b) => path.startsWith(b))) continue;
    const url = `${ORIGIN}${path}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        failed.push(`${path} (${res.status})`);
        continue;
      }
      const html = await res.text();
      const text = strip(html);
      const subject = `Public page ${path}`;
      const existing = await sr.entities.SharedKnowledge.filter({ subject }).catch(() => []);
      const record = {
        knowledgeId: `web${path.replaceAll("/", "-")}`,
        category: categoryFor(path),
        subject,
        content: text || `Page fetched with no extractable public text: ${url}`,
        source: url,
        verificationStatus: "UNVERIFIED",
      };
      if (Array.isArray(existing) && existing[0]?.id) {
        await sr.entities.SharedKnowledge.update(existing[0].id, record);
      } else {
        await sr.entities.SharedKnowledge.create(record);
      }
      ok.push(path);
    } catch (error) {
      failed.push(`${path} (${error.message})`);
    }
  }

  const staticFacts = [
    {
      knowledgeId: "instant-estimate-boundary",
      category: "SERVICE",
      subject: "Instant estimate is preliminary",
      content: "/instant-estimate produces a preliminary range, not a bid. Use satellite measurements when available and a manual roof-size fallback when satellite data is missing. Never invent a price.",
      source: `${ORIGIN}/instant-estimate`,
      verificationStatus: "UNVERIFIED",
    },
    {
      knowledgeId: "financing-acorn-synchrony",
      category: "SERVICE",
      subject: "Financing partners",
      content: "Demore offers financing options through Acorn and Synchrony for qualified customers. Demore is not a lender. Approval, rates, fees and terms are set by the provider.",
      source: `${ORIGIN}/financing`,
      verificationStatus: "UNVERIFIED",
    },
    {
      knowledgeId: "google-review-link",
      category: "CONTACT",
      subject: "Google review link",
      content: "Public Google review link: https://g.page/r/CZodbedugEwIEAI/review (from /review-us). Do not invent review counts or customer quotes.",
      source: `${ORIGIN}/review-us`,
      verificationStatus: "UNVERIFIED",
    },
    {
      knowledgeId: "contractor-not-adjuster",
      category: "STORM_RULE",
      subject: "Insurance boundary",
      content: "Demore Exterior Solutions is a contractor. It inspects, documents, estimates and restores. It is not an insurer, public adjuster or attorney and must not promise coverage or claim approval.",
      source: `${ORIGIN}/insurance-claims/help`,
      verificationStatus: "UNVERIFIED",
    },
  ];

  for (const fact of staticFacts) {
    const existing = await sr.entities.SharedKnowledge.filter({ knowledgeId: fact.knowledgeId }).catch(() => []);
    if (Array.isArray(existing) && existing[0]?.id) {
      await sr.entities.SharedKnowledge.update(existing[0].id, fact);
    } else {
      await sr.entities.SharedKnowledge.create(fact);
    }
  }

  const status = failed.length === 0 ? "success" : ok.length ? "partial" : "failed";
  const refresh = await sr.entities.KnowledgeRefresh.create({
    version: VERSION,
    status,
    source_origin: ORIGIN,
    pages_ok: ok.length,
    pages_failed: failed.length,
    failed_paths: failed.join(", "),
    summary: `Refreshed ${ok.length} public pages. Failed: ${failed.length}. Staff and customer-record paths excluded.`,
    last_success_at: status === "failed" ? undefined : new Date().toISOString(),
  });

  return Response.json({
    success: status !== "failed",
    version: VERSION,
    last_success_at: refresh.last_success_at || null,
    pages_ok: ok,
    pages_failed: failed,
    published: false,
  });
}
