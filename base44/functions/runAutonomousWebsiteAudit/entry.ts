import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { nextChangeId, writeAudit } from '../../shared/orchestrationCore.ts';

const SITE_ORIGIN = 'https://www.demoreexteriorsolutions.com';
const PAGE_PATHS = [
  '/',
  '/services',
  '/roofing',
  '/siding',
  '/insurance-claims',
  '/service-area/lake/mentor',
  '/contact',
];

const AUDIT_PROFILES = [
  {
    id: 'SEO',
    title: 'SEO & Local Search Audit',
    roleId: 'SEO_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for SEO and local-search opportunities. Check titles, meta descriptions, canonical signals, headings, indexability, internal-link clues, service/location relevance, and duplicate or weak search intent. Prioritize only findings grounded in the supplied snapshot.',
  },
  {
    id: 'GEO',
    title: 'GEO / AI Search Visibility Audit',
    roleId: 'GEO_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for generative-engine visibility and local entity clarity. Evaluate company/service-area/entity signals, citation readiness, service-location associations, and whether AI systems can clearly understand who Demore is, what it does, and where it serves.',
  },
  {
    id: 'AEO',
    title: 'AEO / Answer Engine Audit',
    roleId: 'AEO_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for answer-engine readiness. Identify opportunities for concise factual answers, FAQ/question coverage, extractable service explanations, and clearly structured homeowner answers without inventing facts not present in the snapshot.',
  },
  {
    id: 'CRO',
    title: 'Conversion Rate Audit',
    roleId: 'CRO_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for conversion opportunities involving calls, estimate/inspection requests, trust signals, and lead pathways. Treat any visual-placement conclusion not visible in the raw snapshot as a hypothesis, not an observed fact.',
  },
  {
    id: 'UX',
    title: 'Website UX & Mobile Audit',
    roleId: 'WEB_UX_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for navigation, usability, mobile-contact pathways, clarity, and friction. The snapshot is not a rendered browser session, so do not claim visual or interaction behavior that is not directly evidenced.',
  },
  {
    id: 'PERFORMANCE',
    title: 'Technical Performance Audit',
    roleId: 'TECHNICAL_PERFORMANCE_SPECIALIST',
    objective: 'Audit the provided deterministic page signals for technical-performance opportunities: HTML size, script/style counts, redirects, response status, and obvious asset concerns. Do not invent Core Web Vitals or PageSpeed measurements; clearly label those as needing measured data.',
  },
  {
    id: 'SCHEMA',
    title: 'Schema & Structured Data Audit',
    roleId: 'SCHEMA_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for structured-data coverage and consistency. Review detected JSON-LD counts/types and recommend schema improvements only where supported by real page/business facts. Do not invent certifications, ratings, offers, or reviews.',
  },
  {
    id: 'LEADS',
    title: 'Lead Generation Audit',
    roleId: 'LEAD_GENERATION_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for lead-capture opportunities: phone links, estimate/inspection language, contact pathways, service-intent routing, and friction. Do not claim a form field or conversion event exists unless evidenced by the snapshot.',
  },
  {
    id: 'CHATBOT',
    title: 'AI Chatbot Website Audit',
    roleId: 'AI_CHATBOT_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for chatbot/assistant opportunities and grounding needs. Focus on how a website assistant should answer service, service-area, storm, estimate, and contact questions using verified site facts; do not invent live chatbot behavior that is not visible in the snapshot.',
  },
  {
    id: 'CONTENT',
    title: 'Website Content Audit',
    roleId: 'CONTENT_SPECIALIST',
    objective: 'Audit the provided live-site snapshot for content clarity, service differentiation, local relevance, factual completeness, duplication, and homeowner usefulness. Recommend content improvements without changing protected SEO infrastructure.',
  },
  {
    id: 'ANALYTICS',
    title: 'Analytics & Measurement Audit',
    roleId: 'ANALYTICS_SPECIALIST',
    objective: 'Audit the provided live-site signals for analytics and conversion-measurement readiness. Report only tracking signals actually detected in raw HTML and clearly separate missing evidence from confirmed absence. Propose what should be measured, not unverified implementation claims.',
  },
];

function cleanText(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) return cleanText(match[1]);
  }
  return '';
}

function allMatches(html, pattern, cap = 20) {
  const values = [];
  let match;
  while ((match = pattern.exec(html)) && values.length < cap) {
    values.push(cleanText(match[1] || match[0]));
  }
  return values.filter(Boolean);
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'DemoreAutonomousAudit/1.0 (+https://www.demoreexteriorsolutions.com)' },
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      text: text.slice(0, 350000),
      bytes: text.length,
    };
  } catch (error) {
    return { ok: false, status: 0, finalUrl: url, text: '', bytes: 0, error: String(error?.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

function analyzeHtml(path, fetched) {
  const html = fetched.text || '';
  const title = firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const metaDescription = firstMatch(html, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
  ]);
  const canonical = firstMatch(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i,
  ]);
  const h1s = allMatches(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi, 8);
  const h2s = allMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 12);
  const hrefs = allMatches(html, /<a[^>]+href=["']([^"']+)["']/gi, 100);
  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  const schemaTypes = [...new Set(jsonLdBlocks.flatMap((block) => {
    const types = [];
    const re = /["']@type["']\s*:\s*["']([^"']+)["']/gi;
    let match;
    while ((match = re.exec(block))) types.push(match[1]);
    return types;
  }))].slice(0, 25);
  const plainText = cleanText(html);
  const textSample = plainText.slice(0, 1600);
  return {
    path,
    requestedUrl: `${SITE_ORIGIN}${path}`,
    status: fetched.status,
    finalUrl: fetched.finalUrl,
    redirected: Boolean(fetched.finalUrl && fetched.finalUrl !== `${SITE_ORIGIN}${path}`),
    htmlBytes: fetched.bytes,
    title,
    metaDescription,
    canonical,
    h1s,
    h2s,
    internalLinksDetected: hrefs.filter((href) => href.startsWith('/') || href.startsWith(SITE_ORIGIN)).length,
    telLinks: [...new Set(hrefs.filter((href) => href.startsWith('tel:')))].slice(0, 10),
    formTagDetected: /<form\b/i.test(html),
    estimateLanguageDetected: /free (estimate|inspection)|request (an )?(estimate|inspection)|get (a |your )?free/i.test(plainText),
    phoneTextDetected: /\(?440\)?[\s.-]*920[\s.-]*6133/.test(plainText),
    jsonLdCount: jsonLdBlocks.length,
    schemaTypes,
    scriptSrcCount: (html.match(/<script[^>]+src=/gi) || []).length,
    stylesheetCount: (html.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length,
    analyticsSignals: {
      gtag: /gtag\s*\(|googletagmanager\.com\/gtag/i.test(html),
      gtm: /googletagmanager\.com\/gtm/i.test(html),
      googleAnalytics: /google-analytics\.com|analytics\.google\.com/i.test(html),
    },
    textSample,
    fetchError: fetched.error || null,
  };
}

async function collectSiteSnapshot() {
  const pageFetches = await Promise.all(PAGE_PATHS.map((path) => fetchWithTimeout(`${SITE_ORIGIN}${path}`)));
  const pages = PAGE_PATHS.map((path, index) => analyzeHtml(path, pageFetches[index]));
  const [robots, sitemap] = await Promise.all([
    fetchWithTimeout(`${SITE_ORIGIN}/robots.txt`),
    fetchWithTimeout(`${SITE_ORIGIN}/sitemap.xml`),
  ]);
  const sitemapUrlCount = (sitemap.text.match(/<loc>/gi) || []).length;
  return {
    capturedAt: new Date().toISOString(),
    origin: SITE_ORIGIN,
    pages,
    robots: {
      status: robots.status,
      finalUrl: robots.finalUrl,
      excerpt: robots.text.slice(0, 1800),
      error: robots.error || null,
    },
    sitemap: {
      status: sitemap.status,
      finalUrl: sitemap.finalUrl,
      urlCount: sitemapUrlCount,
      excerpt: sitemap.text.slice(0, 1800),
      error: sitemap.error || null,
    },
    limitations: [
      'This is a deterministic HTTP/raw-HTML snapshot, not a rendered-browser or Lighthouse session.',
      'Client-rendered visual placement, interaction behavior, and Core Web Vitals must not be stated as observed unless separately measured.',
      'Absence from raw HTML is not proof that a client-rendered element is absent from the browser UI.',
    ],
  };
}

function compactSnapshot(snapshot) {
  const lines = [
    `Captured: ${snapshot.capturedAt}`,
    `Origin: ${snapshot.origin}`,
    `Robots: status=${snapshot.robots.status}; final=${snapshot.robots.finalUrl}; excerpt=${cleanText(snapshot.robots.excerpt).slice(0, 450)}`,
    `Sitemap: status=${snapshot.sitemap.status}; final=${snapshot.sitemap.finalUrl}; urlCount=${snapshot.sitemap.urlCount}`,
  ];
  for (const page of snapshot.pages) {
    lines.push([
      `PAGE ${page.path}`,
      `status=${page.status}`,
      `final=${page.finalUrl}`,
      `redirected=${page.redirected}`,
      `bytes=${page.htmlBytes}`,
      `title=${page.title || '(none)'}`,
      `meta=${page.metaDescription || '(none)'}`,
      `canonical=${page.canonical || '(none detected in raw HTML)'}`,
      `h1=${(page.h1s || []).join(' | ') || '(none)'}`,
      `h2=${(page.h2s || []).slice(0, 4).join(' | ') || '(none)'}`,
      `internalLinks=${page.internalLinksDetected}`,
      `telLinks=${(page.telLinks || []).join(',') || '(none in raw HTML)'}`,
      `formTag=${page.formTagDetected}`,
      `estimateLanguage=${page.estimateLanguageDetected}`,
      `phoneText=${page.phoneTextDetected}`,
      `jsonLd=${page.jsonLdCount}`,
      `schemaTypes=${(page.schemaTypes || []).slice(0, 12).join(',')}`,
      `scripts=${page.scriptSrcCount}`,
      `stylesheets=${page.stylesheetCount}`,
      `analytics=${JSON.stringify(page.analyticsSignals)}`,
      `textSample=${String(page.textSample || '').slice(0, 280)}`,
    ].join('; '));
  }
  lines.push(`LIMITATIONS: ${(snapshot.limitations || []).join(' ')}`);
  return lines.join('\n').slice(0, 6500);
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  let user = null;
  try { user = await base44.auth.me(); } catch (_) { user = null; }
  if (user && user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const sr = base44.asServiceRole;
  const body = await req.json().catch(() => ({}));
  const isTest = Boolean(body.test);
  const requestedProfileId = typeof body.profileId === 'string' ? body.profileId.toUpperCase() : null;
  let runRecord = null;
  try {
    let configs = await sr.entities.AutonomousAuditConfig.filter({ configId: 'DEFAULT' });
    let config = configs[0];
    if (!config) {
      config = await sr.entities.AutonomousAuditConfig.create({
        configId: 'DEFAULT',
        enabled: true,
        timezone: 'America/New_York',
        scheduleDescription: 'Weekdays at 6:30 AM Eastern; one rotating specialist audit per run',
        profileIndex: 0,
        maxJobsPerRun: 1,
        lastRunStatus: 'NOT_RUN',
        notes: 'Advisory-only autonomous website audits.',
      });
    }

    if (config.enabled === false) {
      await sr.entities.AutonomousAuditConfig.update(config.id, {
        lastRunAt: new Date().toISOString(),
        lastRunStatus: 'SKIPPED_DISABLED',
      });
      return Response.json({ status: 'SKIPPED', reason: 'Autonomous audits are paused' });
    }

    const configuredIndex = Math.max(0, Math.floor(Number(config.profileIndex || 0))) % AUDIT_PROFILES.length;
    const requestedIndex = requestedProfileId ? AUDIT_PROFILES.findIndex((p) => p.id === requestedProfileId) : -1;
    const index = requestedIndex >= 0 ? requestedIndex : configuredIndex;
    const profile = AUDIT_PROFILES[index];
    const startedAt = new Date().toISOString();
    const snapshot = await collectSiteSnapshot();
    const changeId = await nextChangeId(sr);
    const jobId = `${changeId}-J1`;
    const auditRunId = `${isTest ? 'AUDIT-TEST' : 'AUDIT'}-${startedAt.slice(0, 10).replace(/-/g, '')}-${profile.id}-${changeId.split('-').pop()}`;

    runRecord = await sr.entities.WebsiteAuditRun.create({
      auditRunId,
      profileId: profile.id,
      profileTitle: profile.title,
      roleId: profile.roleId,
      changeId,
      jobId,
      status: 'RUNNING',
      startedAt,
      siteSnapshot: snapshot,
      isTest,
      archived: false,
    });

    const job = await sr.entities.AgentJobs.create({
      changeId,
      jobId,
      createdBy: 'AUTONOMOUS_WEBSITE_AUDITOR',
      jobType: 'UNCLASSIFIED',
      priority: 'NORMAL',
      riskLevel: 'LOW',
      objective: `${profile.title}. ${profile.objective} Return 3-5 prioritized recommendations, evidence for each major finding, risks, next actions, and confidence. This is advisory only. Do not implement or modify the website.`,
      context: `AUTONOMOUS WEBSITE AUDIT. Use the deterministic live-site snapshot below as your primary evidence. Never claim a visual/client-rendered fact that the snapshot cannot prove.\n\nLIVE SITE SNAPSHOT:\n${compactSnapshot(snapshot)}`,
      status: 'NEW',
      requiresOwnerApproval: false,
      ownerApprovalStatus: 'NOT_REQUIRED',
      specialistApprovalStatus: 'PENDING',
      implementationStatus: 'NOT_REQUIRED',
      validationStatus: 'NOT_REQUIRED',
      isTest,
      archived: false,
      inputData: {
        specialistRole: profile.roleId,
        reviewerRole: 'QUALITY_ASSURANCE_AGENT',
        advisoryOnly: true,
        autonomousAudit: true,
        auditProfileId: profile.id,
      },
    });

    await writeAudit(sr, {
      changeId,
      jobId,
      agentId: 'AUTONOMOUS_WEBSITE_AUDITOR',
      eventType: 'JOB_CREATED',
      action: `Scheduled autonomous website audit started: ${profile.title}`,
      newState: 'RUNNING',
      details: `Profile ${profile.id}; deterministic live-site snapshot captured before specialist analysis.`,
    });

    // AgentJobs create triggers the existing Agent Job Orchestrator workflow asynchronously.
    // Do not wait for the full AI/reviewer cycle here: provider calls can exceed edge request timeouts.
    if (!isTest) {
      await sr.entities.AutonomousAuditConfig.update(config.id, {
        profileIndex: (index + 1) % AUDIT_PROFILES.length,
        lastRunAt: startedAt,
        lastProfileId: profile.id,
        lastRunStatus: 'QUEUED',
      });
    }

    return Response.json({
      status: 'QUEUED',
      auditRunId,
      profileId: profile.id,
      profileTitle: profile.title,
      changeId,
      jobId,
    });
  } catch (error) {
    const message = String(error?.message || error).slice(0, 1000);
    if (runRecord) {
      try {
        await sr.entities.WebsiteAuditRun.update(runRecord.id, {
          status: 'FAILED',
          completedAt: new Date().toISOString(),
          error: message,
        });
      } catch (_) {}
    }
    if (!isTest) {
      const configs = await sr.entities.AutonomousAuditConfig.filter({ configId: 'DEFAULT' }).catch(() => []);
      if (configs[0]) {
        await sr.entities.AutonomousAuditConfig.update(configs[0].id, {
          lastRunAt: new Date().toISOString(),
          lastRunStatus: 'FAILED',
        }).catch(() => {});
      }
    }
    return Response.json({ status: 'FAILED', error: message }, { status: 500 });
  }
}