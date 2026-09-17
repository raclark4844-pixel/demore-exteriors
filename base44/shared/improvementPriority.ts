function unique(values = [], max = 20) {
  const out = [];
  const seen = new Set();
  for (const raw of values || []) {
    const value = String(raw || '').trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length >= max) break;
  }
  return out;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hashString(value = '') {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
}

function extractPaths(text = '') {
  const matches = String(text).match(/\/(?:[a-z0-9-]+\/?){1,5}/gi) || [];
  const knownPrefixes = [
    '/services', '/roofing', '/siding', '/insurance-claims', '/service-area', '/contact',
    '/windows', '/doors', '/gutters', '/decks', '/reviews', '/gallery', '/about',
    '/damage-assessment', '/products', '/service-areas'
  ];
  return unique(matches.map((p) => p.replace(/[.,;:)]+$/, '')))
    .filter((p) => !p.startsWith('//') && knownPrefixes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`)))
    .sort();
}

function detectTheme(text = '', category = '') {
  const t = String(text).toLowerCase();
  if (/canonical|preferred host|www.?→.?apex|www to apex|apex host/.test(t)) return 'CANONICAL_HOST';
  if (/title tag|meta description|metadata|titles?\/metas?|title and meta/.test(t)) return 'METADATA';
  if (/\bh1\b|\bh2\b|heading hierarchy|headings?/.test(t)) return 'HEADINGS';
  if (/internal link|cross-link|under-linked/.test(t)) return 'INTERNAL_LINKING';
  if (/tel:|click-to-call|phone link|clickable phone/.test(t)) return 'PHONE_CTA';
  if (/lead capture|estimate path|inspection path|form field|contact form|conversion path/.test(t)) return 'LEAD_CAPTURE';
  if (/schema|json-ld|structured data/.test(t)) return 'SCHEMA';
  if (/core web vital|pagespeed|performance|script count|stylesheet|asset load|load speed/.test(t)) return 'PERFORMANCE';
  if (/analytics|gtag|gtm|tracking|conversion measurement|measurement/.test(t)) return 'ANALYTICS';
  if (/faq|answer engine|question coverage|concise answer/.test(t)) return 'AEO_CONTENT';
  if (/chatbot|website assistant|ai assistant/.test(t)) return 'CHATBOT';
  if (/mentor|lake county|service area|local relevance|local search|northeast ohio/.test(t)) return 'LOCAL_RELEVANCE';
  if (/duplicate|templated|thin content|unique copy|content differentiation|rewrite/.test(t)) return 'CONTENT_UNIQUENESS';
  return `${String(category || 'GENERAL').toUpperCase()}_GENERAL`;
}

function scoreImpact(theme, text = '') {
  const base = {
    CANONICAL_HOST: 5,
    METADATA: 5,
    LOCAL_RELEVANCE: 5,
    LEAD_CAPTURE: 5,
    PHONE_CTA: 4,
    INTERNAL_LINKING: 4,
    SCHEMA: 4,
    PERFORMANCE: 4,
    ANALYTICS: 4,
    AEO_CONTENT: 4,
    CONTENT_UNIQUENESS: 4,
    HEADINGS: 4,
    CHATBOT: 3,
  }[theme] || 3;
  return clamp(base + (/sitewide|every page|all pages|core pages/.test(String(text).toLowerCase()) ? 0 : 0), 1, 5);
}

function scoreEffort(theme, text = '') {
  let value = {
    CANONICAL_HOST: 3,
    METADATA: 3,
    LOCAL_RELEVANCE: 4,
    LEAD_CAPTURE: 3,
    PHONE_CTA: 2,
    INTERNAL_LINKING: 3,
    SCHEMA: 3,
    PERFORMANCE: 4,
    ANALYTICS: 3,
    AEO_CONTENT: 3,
    CONTENT_UNIQUENESS: 4,
    HEADINGS: 3,
    CHATBOT: 3,
  }[theme] || 3;
  if (/sitewide|all pages|241|mass|rewrite/.test(String(text).toLowerCase())) value += 1;
  return clamp(value, 1, 5);
}

function scoreRisk(theme, text = '') {
  const t = String(text).toLowerCase();
  if (/robots\.txt|sitemap|domain|redirect|canonical host|preferred host/.test(t)) return 5;
  return clamp({
    CANONICAL_HOST: 5,
    METADATA: 3,
    LOCAL_RELEVANCE: 3,
    LEAD_CAPTURE: 3,
    PHONE_CTA: 2,
    INTERNAL_LINKING: 2,
    SCHEMA: 3,
    PERFORMANCE: 3,
    ANALYTICS: 2,
    AEO_CONTENT: 2,
    CONTENT_UNIQUENESS: 3,
    HEADINGS: 3,
    CHATBOT: 2,
  }[theme] || 3, 1, 5);
}

function priorityScore({ impact, effort, risk, confidence, occurrence }) {
  const impactNorm = impact * 20;
  const effortInverse = (6 - effort) * 20;
  const riskInverse = (6 - risk) * 20;
  const recurrenceNorm = Math.min(100, Math.max(20, occurrence * 25));
  return Math.round(
    impactNorm * 0.45 +
    clamp(Number(confidence || 70), 0, 100) * 0.20 +
    recurrenceNorm * 0.15 +
    effortInverse * 0.10 +
    riskInverse * 0.10
  );
}

function makeTitle(text = '') {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return 'Website improvement opportunity';
  const sentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  return sentence.length > 120 ? `${sentence.slice(0, 117).trim()}…` : sentence;
}

export async function syncRecommendationsFromResult(sr, { job, run, result }) {
  if (!job || !run || !result || job.isTest || run.isTest || result.isTest) {
    return { created: 0, updated: 0, skipped: true };
  }
  const category = String(run.profileId || job.jobType || 'GENERAL').toUpperCase();
  const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
  let created = 0;
  let updated = 0;
  const now = new Date().toISOString();

  for (const recommendation of recommendations.slice(0, 8)) {
    const description = String(recommendation || '').trim();
    if (!description) continue;
    const theme = detectTheme(description, category);
    const targetPaths = extractPaths(description);
    const dedupeKey = `${theme}|${targetPaths.join(',') || 'SITEWIDE'}`;
    const existingRows = await sr.entities.ImprovementRecommendation.filter({ dedupeKey });
    const existing = existingRows.find((row) => !row.archived) || existingRows[0];
    const alreadySeenThisRun = Boolean(existing?.sourceAuditRunIds?.includes(run.auditRunId));
    const priorOccurrence = Number(existing?.occurrenceCount || 0);
    const occurrence = existing ? priorOccurrence + (alreadySeenThisRun ? 0 : 1) : 1;
    const confidenceCurrent = clamp(Number(result.confidence || 70), 0, 100);
    const confidence = existing
      ? alreadySeenThisRun
        ? Number(existing.confidence || confidenceCurrent)
        : Math.round(((Number(existing.confidence || confidenceCurrent) * Math.max(1, priorOccurrence)) + confidenceCurrent) / Math.max(1, occurrence))
      : confidenceCurrent;
    const impact = Math.max(Number(existing?.impactScore || 1), scoreImpact(theme, description));
    const effort = Math.max(Number(existing?.effortScore || 1), scoreEffort(theme, description));
    const risk = Math.max(Number(existing?.riskScore || 1), scoreRisk(theme, description));
    const score = priorityScore({ impact, effort, risk, confidence, occurrence });
    const evidence = unique([...(existing?.evidence || []), ...(result.evidence || [])], 12);
    const nextActions = unique([...(existing?.nextActions || []), ...(result.nextActions || [])], 10);
    const sourceChangeIds = unique([...(existing?.sourceChangeIds || []), job.changeId], 20);
    const sourceAuditRunIds = unique([...(existing?.sourceAuditRunIds || []), run.auditRunId], 20);
    const sourceResultIds = unique([...(existing?.sourceResultIds || []), result.id || result.resultId], 20);

    const payload = {
      dedupeKey,
      title: makeTitle(description),
      description,
      category,
      theme,
      targetPaths,
      sourceChangeIds,
      sourceAuditRunIds,
      sourceResultIds,
      evidence,
      nextActions,
      confidence,
      impactScore: impact,
      effortScore: effort,
      riskScore: risk,
      priorityScore: score,
      occurrenceCount: occurrence,
      lastSeenAt: now,
      archived: false,
    };

    if (existing) {
      await sr.entities.ImprovementRecommendation.update(existing.id, payload);
      updated++;
    } else {
      await sr.entities.ImprovementRecommendation.create({
        recommendationId: `IMP-${hashString(dedupeKey)}`,
        ...payload,
        ownerDecision: 'NEW',
        status: 'OPEN',
        firstSeenAt: now,
      });
      created++;
    }
  }

  return { created, updated, skipped: false };
}
