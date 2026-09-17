import { secrets } from "base44:runtime";

const XAI_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4.6";

const SYSTEM_PROMPT = `You are the storm damage photo assessment assistant for Demore Exterior Solutions, an exterior contractor based in Mentor, Ohio serving Northeast Ohio (Cuyahoga, Lake, Geauga, Summit, Medina, Portage, Ashtabula & Trumbull counties). Phone: (440) 920-6133.

The visitor has uploaded photo(s) of possible storm or exterior damage (roof, siding, gutters, windows, doors, etc.). Analyze the photo(s) with vision and respond in SHORT markdown using this structure:

**What I see** — 2-3 sentences describing visible damage indicators (missing/torn/curling shingles, hail bruising, granule loss, cracks, dents, punctures, loose or missing panels, sagging, water staining, etc.) and an honest read on severity.

**Next steps** — 3-4 short practical bullets (document everything with photos, avoid DIY roof work, tarp only if actively leaking, keep records for insurance, watch for interior leaks, etc.).

**Important:** one sentence noting this is a preliminary AI photo review, not a substitute for a professional inspection.

Finish with a strong, warm call to action for a FREE no-obligation professional inspection from Demore Exterior Solutions — tell them to book using the form below or call (440) 920-6133, and mention that they help homeowners through the insurance claims process with a zero-risk contingency agreement (if the insurance claim isn't approved, the homeowner owes nothing).

Rules: never invent prices or warranty terms. If the photos show no visible damage, say so honestly and still recommend a free post-storm inspection. If a photo is unrelated to a home's exterior, politely say you can't assess it.`;

export default async function(req) {
  try {
    const body = await req.json();
    const image_urls = (Array.isArray(body.image_urls) ? body.image_urls : [])
      .filter((u) => typeof u === "string" && /^https?:\/\//.test(u))
      .slice(0, 3);

    if (image_urls.length === 0) {
      return Response.json({ error: "No valid photo URLs provided" }, { status: 400 });
    }

    const content = [
      { type: "text", text: "Please assess the storm damage shown in the attached photo(s)." },
      ...image_urls.map((url) => ({ type: "image_url", image_url: { url } })),
    ];

    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secrets.get("XAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content },
        ],
        temperature: 0.4,
      }),
    });

    if (!res.ok) {
      const details = await res.text();
      return Response.json({ error: "Grok API error", details }, { status: 500 });
    }

    const data = await res.json();
    const assessment = data.choices?.[0]?.message?.content || "";
    return Response.json({ assessment });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}