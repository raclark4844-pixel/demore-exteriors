import { secrets } from "base44:runtime";
import { DEMORE_SYSTEM_PROMPT as SYSTEM_PROMPT } from "../../shared/demoreSystemPrompt.ts";

const XAI_URL = "https://api.x.ai/v1/chat/completions";
const MODEL = "grok-4.6";

export default async function(req) {
  try {
    const body = await req.json();
    const history = Array.isArray(body.messages) ? body.messages : [];
    const messages = history
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-20)
      .map((m) => {
        const image_url =
          m.role === "user" && typeof m.image_url === "string" && /^https?:\/\//.test(m.image_url)
            ? m.image_url
            : undefined;
        return { role: m.role, content: m.content.slice(0, 2000), image_url };
      });

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map(({ role, content, image_url }) =>
        role === "user" && image_url
          ? { role, content: [{ type: "text", text: content }, { type: "image_url", image_url: { url: image_url } }] }
          : { role, content }
      ),
    ];

    if (messages.length === 0) {
      return Response.json({ error: "No valid messages provided" }, { status: 400 });
    }

    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secrets.get("XAI_API_KEY")}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const details = await res.text();
      return Response.json({ error: "Grok API error", details }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}