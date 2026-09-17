import { createClientFromRequest } from "npm:@base44/sdk";
import { eligible, reviewDraft, validReviewUrl } from "../../shared/growthRules.ts";

// Scheduled preparation only. This function never sends messages or accepts recipients.
Deno.serve(async (req) => {
  try {
    const sr = createClientFromRequest(req).asServiceRole;
    const settings = (await sr.entities.GrowthSettings.filter({key:"default"}))[0];
    if (!validReviewUrl(settings?.google_review_url)) return Response.json({status:"waiting_for_google_review_link",created:0});
    let created = 0;
    for (let offset = 0; offset < 5000; offset += 100) {
      const customers = await sr.entities.CustomerFollowup.list("created_date",100,offset);
      for (const c of customers) {
        const completed = Date.parse(c.completed_at);
        if (!Number.isFinite(completed) || completed > Date.now() - 86400000) continue;
        for (const channel of ["email","sms"]) {
          if (!eligible(c,channel)) continue;
          const draft = reviewDraft(c,channel,settings.google_review_url);
          if (!(await sr.entities.OutreachDraft.filter({dedupe_key:draft.dedupe_key})).length) {
            await sr.entities.OutreachDraft.create(draft); created++;
          }
        }
      }
      if (customers.length < 100) break;
    }
    return Response.json({status:"drafts_prepared",created,delivery:"Not sent; delivery provider setup required"});
  } catch { return Response.json({error:"Could not prepare outreach drafts. Retry from the outreach workspace."},{status:500}); }
});