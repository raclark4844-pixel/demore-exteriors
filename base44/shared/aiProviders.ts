/**
 * Provider-neutral AI adapter layer for the Demore multi-agent system.
 * Keys are server-side only (base44:runtime secrets) and never reach the browser.
 * Every request is logged to AIProviderRequestLog with usage, latency, errors,
 * and fallback information, under the job's shared Change ID.
 */
import { secrets } from "base44:runtime";

export const MAX_RETRIES = 2;          // per provider attempt chain
export const MAX_REVIEW_ROUNDS = 2;    // cross-agent revision rounds per job
export const MAX_HANDOFFS = 6;         // agent handoffs per Change ID
export const PROVIDER_TIMEOUT_MS = 90000; // hard stop so a provider cannot hang the workflow forever

const GENERIC_PROMPT = "You are an AI specialist for Demore Exterior Solutions — a Northeast Ohio exterior contractor (roofing, siding, gutters, windows, doors, decks, storm & insurance restoration) in Mentor, OH. Owner: Ryan Bomer. Phone: (440) 920-6133. Website: https://www.demoreexteriorsolutions.com. Ground every recommendation in this business's real services and site content. PROPOSE changes — never claim to execute. Production SEO, domains, redirects, robots.txt, and the sitemap are lock-protected.";

function getKey(provider) {
  if (provider === "XAI") return secrets.get("XAI_API_KEY");
  if (provider === "OPENAI") return secrets.get("OPENAI_API_KEY");
  if (provider === "ANTHROPIC") return secrets.get("ANTHROPIC_API_KEY");
  return null;
}

export function parseJsonLoose(text) {
  if (text === null || text === undefined) return null;
  if (typeof text === "object") return text;
  let t = String(text).trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}

const KEY_ALIASES = {
  requestType: ["request_type", "category", "workType", "work_type"],
  riskLevel: ["risk", "risk_level"],
  specialistRole: ["specialist_role", "specialist"],
  reviewerRole: ["reviewer_role", "reviewer"],
  recommendations: ["recommendation", "suggestions", "actions"],
  evidence: ["supportingEvidence", "supporting_evidence"],
  risks: ["risksAcknowledged", "risks_acknowledged", "risk"],
  nextActions: ["next_actions", "nextSteps", "next_steps"],
  confidence: ["confidenceScore", "confidence_score"],
  proposedImplementation: ["proposed_implementation", "implementation"],
  filesAffected: ["files_affected", "files"],
  acceptanceTests: ["acceptance_tests", "tests"],
  rollbackPlan: ["rollback_plan"],
  comments: ["comment", "reviewComments", "review_comments"],
  concerns: ["concern", "issues"],
};

function normalizeToSchema(value, schema) {
  if (!schema || value === null || value === undefined) return value;

  if (schema.type === "object") {
    if (typeof value !== "object" || Array.isArray(value)) return value;
    const out = { ...value };
    for (const key of Object.keys(schema.properties || {})) {
      if (out[key] === undefined) {
        const alias = (KEY_ALIASES[key] || []).find((candidate) => out[candidate] !== undefined);
        if (alias) out[key] = out[alias];
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (out[key] !== undefined) out[key] = normalizeToSchema(out[key], childSchema);
    }
    return out;
  }

  if (schema.type === "array") {
    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => normalizeToSchema(item, schema.items || {}));
  }

  if (schema.type === "string") {
    let normalized = typeof value === "string" ? value : JSON.stringify(value);
    if (Array.isArray(schema.enum)) {
      const match = schema.enum.find((candidate) => String(candidate).toLowerCase() === normalized.toLowerCase());
      if (match !== undefined) normalized = match;
    }
    return normalized;
  }

  if (schema.type === "number") {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace("%", "").trim());
      if (Number.isFinite(parsed)) return parsed;
    }
    return value;
  }

  if (schema.type === "boolean") {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
    }
  }

  return value;
}

function validateAgainstSchema(value, schema, path = "$") {
  const errors = [];
  if (!schema) return errors;

  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [`${path} must be an object`];
    for (const requiredKey of schema.required || []) {
      if (value[requiredKey] === undefined || value[requiredKey] === null) {
        errors.push(`${path}.${requiredKey} is required`);
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (value[key] !== undefined && value[key] !== null) {
        errors.push(...validateAgainstSchema(value[key], childSchema, `${path}.${key}`));
      }
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(value)) return [`${path} must be an array`];
    value.forEach((item, index) => errors.push(...validateAgainstSchema(item, schema.items || {}, `${path}[${index}]`)));
  } else if (schema.type === "string") {
    if (typeof value !== "string") errors.push(`${path} must be a string`);
  } else if (schema.type === "number") {
    if (typeof value !== "number" || !Number.isFinite(value)) errors.push(`${path} must be a number`);
  } else if (schema.type === "boolean") {
    if (typeof value !== "boolean") errors.push(`${path} must be a boolean`);
  }

  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    errors.push(`${path} must be one of: ${schema.enum.join(", ")}`);
  }
  return errors;
}

function schemaContract(schema) {
  if (!schema) return "";
  return `\n\nOUTPUT CONTRACT — return ONLY one JSON object. Use the exact property names and types in this schema. Do not rename keys, wrap the object in prose, or return markdown:\n${JSON.stringify(schema)}`;
}

async function withTimeout(promise, ms, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function callProvider(sr, provider, model, systemPrompt, userPrompt, schema) {
  // Built-in Base44 provider (always available; model is managed by the platform)
  if (provider === "BASE44") {
    const res = await withTimeout(
      sr.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        response_json_schema: schema,
      }),
      PROVIDER_TIMEOUT_MS,
      "BASE44 provider request"
    );
    const text = typeof res === "string" ? res : JSON.stringify(res);
    return { text, tokens: null };
  }
  const key = getKey(provider);
  if (!key) throw new Error(`Missing API key for ${provider}`);

  if (provider === "ANTHROPIC") {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
    let res;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
    } catch (e) {
      if (e && e.name === "AbortError") throw new Error("ANTHROPIC timed out after 90s");
      throw e;
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) throw new Error(`ANTHROPIC HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return {
      text: (data.content && data.content[0] && data.content[0].text) || "",
      tokens: ((data.usage && data.usage.input_tokens) || 0) + ((data.usage && data.usage.output_tokens) || 0),
    };
  }

  // OpenAI-compatible (OPENAI, XAI, future providers on this shape)
  const urls = {
    OPENAI: "https://api.openai.com/v1/chat/completions",
    XAI: "https://api.x.ai/v1/chat/completions",
  };
  const url = urls[provider];
  if (!url) throw new Error(`Unknown provider: ${provider}`);
  const payload = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
  };
  if (schema) payload.response_format = { type: "json_object" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    if (e && e.name === "AbortError") throw new Error(`${provider} timed out after 90s`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`${provider} HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return {
    text: (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "",
    tokens: ((data.usage && data.usage.prompt_tokens) || 0) + ((data.usage && data.usage.completion_tokens) || 0),
  };
}

async function logCall(sr, entry) {
  return sr.entities.AIProviderRequestLog.create({
    changeId: entry.changeId,
    jobId: entry.jobId,
    roleId: entry.roleId,
    agentId: entry.agentId,
    provider: entry.provider,
    model: entry.model,
    purpose: entry.purpose,
    status: entry.status,
    requestSummary: (entry.requestSummary || "").slice(0, 200),
    responseSummary: (entry.responseSummary || "").slice(0, 400),
    tokens: entry.tokens,
    latencyMs: entry.latencyMs,
    error: entry.error,
    fallbackUsed: entry.fallbackUsed,
    attemptedAt: new Date().toISOString(),
  });
}

async function touchProvider(sr, provider, patch) {
  const rows = await sr.entities.AIProviderRegistry.filter({ providerId: provider });
  if (rows[0]) await sr.entities.AIProviderRegistry.update(rows[0].id, patch);
}

async function touchRole(sr, roleId, patch) {
  const rows = await sr.entities.AISpecialistRole.filter({ roleId });
  if (rows[0]) await sr.entities.AISpecialistRole.update(rows[0].id, patch);
}

/**
 * Execute a role's request on its configured provider with automatic fallback.
 * opts: { roleId, purpose, changeId, jobId, agentId, userPrompt, schema }
 * Returns { ok, provider, model, fallbackUsed, text, json, tokens, latencyMs }
 * or { ok: false, blocked: true, error } — an API failure is NEVER an approval.
 */
export async function callAI(sr, opts) {
  const rows = await sr.entities.AISpecialistRole.filter({ roleId: opts.roleId });
  const role = rows[0];
  const primaryProvider = (role && role.provider) || "BASE44";
  const primaryModel = (role && role.model) || "automatic";
  const systemPrompt = (role && role.systemPrompt) || GENERIC_PROMPT;
  const chain = [primaryProvider];
  if (role && role.fallbackProvider && role.fallbackProvider !== primaryProvider) {
    chain.push(role.fallbackProvider);
  }

  let lastError = null;
  for (const provider of chain) {
    const providerRows = await sr.entities.AIProviderRegistry.filter({ providerId: provider });
    const providerModel = provider === primaryProvider
      ? primaryModel
      : ((providerRows[0] && providerRows[0].defaultModel) || (provider === "BASE44" ? "automatic" : primaryModel));
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const started = Date.now();
      try {
        const contractedPrompt = `${opts.userPrompt}${schemaContract(opts.schema)}`;
        const out = await callProvider(sr, provider, providerModel, systemPrompt, contractedPrompt, opts.schema);
        const parsed = parseJsonLoose(out.text);
        if (opts.schema && !parsed) throw new Error("Model returned invalid JSON");
        const json = opts.schema ? normalizeToSchema(parsed, opts.schema) : parsed;
        if (opts.schema) {
          const schemaErrors = validateAgainstSchema(json, opts.schema);
          if (schemaErrors.length) throw new Error(`Schema validation failed: ${schemaErrors.slice(0, 5).join("; ")}`);
        }
        const latencyMs = Date.now() - started;
        await logCall(sr, {
          changeId: opts.changeId, jobId: opts.jobId, roleId: opts.roleId, agentId: opts.agentId,
          provider, model: providerModel, purpose: opts.purpose, status: "SUCCESS",
          requestSummary: opts.userPrompt, responseSummary: out.text, tokens: out.tokens,
          latencyMs, fallbackUsed: provider !== primaryProvider,
        });
        await touchProvider(sr, provider, {
          authStatus: "CONNECTED",
          lastSuccessAt: new Date().toISOString(),
          lastError: null,
          lastErrorAt: null,
        });
        await touchRole(sr, opts.roleId, {
          lastActivityAt: new Date().toISOString(),
          successCount: ((role && role.successCount) || 0) + 1,
          totalResponseMs: ((role && role.totalResponseMs) || 0) + latencyMs,
        });
        return { ok: true, provider, model: providerModel, fallbackUsed: provider !== primaryProvider, text: out.text, json, tokens: out.tokens, latencyMs };
      } catch (e) {
        lastError = e;
        const msg = String((e && e.message) || e).slice(0, 400);
        await logCall(sr, {
          changeId: opts.changeId, jobId: opts.jobId, roleId: opts.roleId, agentId: opts.agentId,
          provider, model: providerModel, purpose: opts.purpose, status: "ERROR",
          requestSummary: opts.userPrompt, latencyMs: Date.now() - started, error: msg,
          fallbackUsed: provider !== primaryProvider,
        });
        const outputContractError = msg.startsWith("Model returned invalid JSON") || msg.startsWith("Schema validation failed");
        await touchProvider(sr, provider, {
          authStatus: msg.startsWith("Missing API key") ? "MISSING_KEY" : (outputContractError ? "CONNECTED" : "ERROR"),
          lastError: msg,
          lastErrorAt: new Date().toISOString(),
        });
      }
    }
  }
  await touchRole(sr, opts.roleId, {
    lastActivityAt: new Date().toISOString(),
    errorCount: ((role && role.errorCount) || 0) + 1,
  });
  return { ok: false, blocked: true, error: lastError ? String(lastError.message || lastError) : "No AI provider available" };
}