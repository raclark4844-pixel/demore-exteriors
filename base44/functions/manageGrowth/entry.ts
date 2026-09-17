import { createClientFromRequest } from "npm:@base44/sdk";
import { eligible, publishableOutcome } from "../../shared/growthRules.ts";
Deno.serve(async (req) => {
  const base44=createClientFromRequest(req);
  const user=await base44.auth.me().catch(()=>null);
  if (user?.role !== "admin") return Response.json({error:"Administrator access required"},{status:403});
  try {
    const sr=base44.asServiceRole;
    const body=await req.json();
    if (body.action === "publish_outcome") {
      const item=await sr.entities.ProjectOutcome.get(body.id);
      if (!publishableOutcome(item)) return Response.json({error:"Add two different approved HTTPS photos, city, summary, consent confirmation and verified nonnegative claim amounts before publishing."},{status:400});
      await sr.entities.ProjectOutcome.update(item.id,{status:"published"});
      return Response.json({status:"published"});
    }
    if (body.action === "prepare_storm") {
      const storm=await sr.entities.StormNotice.get(body.id);
      const zips=[...new Set((body.zips || "").split(/[\s,]+/).filter(Boolean))];
      if (!zips.length || zips.some(z=>!/^\d{5}$/.test(z))) return Response.json({error:"Enter the verified affected five-digit ZIP codes."},{status:400});
      if (storm.status !== "published") return Response.json({error:"Publish the notice first."},{status:400});
      await sr.entities.StormNotice.update(storm.id,{affected_zips:zips});
      let created=0;
      for(let offset=0;offset<5000;offset+=100) {
        const customers=await sr.entities.CustomerFollowup.list("created_date",100,offset);
        for(const c of customers) {
          if(!zips.includes(c.zip) || !eligible(c,"sms") || !Number.isFinite(Date.parse(c.completed_at)) || Date.parse(c.completed_at)>Date.now()) continue;
          const key="storm:"+storm.source_id+":"+c.id+":sms";
          if((await sr.entities.OutreachDraft.filter({dedupe_key:key})).length) continue;
          const message="Demore Exterior Solutions: A "+storm.event.toLowerCase()+" was issued for parts of "+storm.county+" County on "+new Date(storm.issued_at).toLocaleDateString("en-US",{timeZone:"America/New_York"})+". When conditions are safe, check from the ground for missing shingles or loose siding. Details: https://www.demoreexteriorsolutions.com/storm-updates/"+storm.slug+". Reply STOP to opt out.";
          await sr.entities.OutreachDraft.create({dedupe_key:key,customer_id:c.id,kind:"storm",channel:"sms",destination:c.phone,subject:storm.title,message,status:"draft",storm_id:storm.id}); created++;
        }
        if(customers.length<100) break;
      }
      return Response.json({status:"drafts_prepared",created,delivery:"Not sent"});
    }
    return Response.json({error:"Unknown action"},{status:400});
  } catch { return Response.json({error:"The action failed. Your existing records are unchanged unless shown as saved. Refresh before retrying."},{status:500}); }
});