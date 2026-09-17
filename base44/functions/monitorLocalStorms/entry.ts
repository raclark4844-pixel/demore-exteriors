import { createClientFromRequest } from "npm:@base44/sdk";
import { qualifyingAlert, stormCounties, COUNTY_CODES } from "../../shared/growthRules.ts";

// Fixed, official source only. Caller input cannot change the source or content.
Deno.serve(async (req) => {
  try {
    const sr = createClientFromRequest(req).asServiceRole;
    const response = await fetch("https://api.weather.gov/alerts?area=OH&limit=500", {headers:{"User-Agent":"DemoreExteriorSolutions (ryan@demoreexteriorsolutions.com)","Accept":"application/geo+json"},signal:AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error("NWS unavailable");
    const data = await response.json();
    if (!Array.isArray(data.features)) throw new Error("Invalid NWS response");
    let created=0, updated=0;
    for (const feature of data.features.slice(0,500)) {
      const p = feature.properties;
      if (p?.status === "Actual" && p.messageType === "Cancel") {
        for (const ref of (p.references || [])) {
          const prior = ref["@id"] || (ref.identifier ? "https://api.weather.gov/alerts/" + ref.identifier : "");
          if (!prior.startsWith("https://api.weather.gov/alerts/")) continue;
          for (const county of Object.values(COUNTY_CODES)) {
            const records=await sr.entities.StormNotice.filter({source_id:prior+"#"+county});
            for (const old of records) await sr.entities.StormNotice.update(old.id,{expires_at:p.sent,status:"archived"});
          }
        }
        continue;
      }
      if (!qualifyingAlert(p,Date.now())) continue;
      const source = feature.id || p["@id"];
      if (typeof source !== "string" || !source.startsWith("https://api.weather.gov/alerts/")) continue;
      if (!Number.isFinite(Date.parse(p.expires))) continue;
      for (const county of stormCounties(p)) {
        const key=source+"#"+county;
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(key)))).map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,12);
        const date = new Date(p.sent).toLocaleDateString("en-US",{timeZone:"America/New_York",year:"numeric",month:"long",day:"numeric"});
        const record = {source_id:key,slug:county.toLowerCase()+"-"+hash,title:date+" — "+p.event+" in "+county+" County",county,event:p.event,issued_at:p.sent,expires_at:p.expires,source_url:source,summary:"The National Weather Service issued a "+p.event.toLowerCase()+" for parts of "+county+" County, Ohio. A warning is not confirmation of damage at your property.",instruction:String(p.instruction || "Follow current National Weather Service instructions.").slice(0,6000)};
        const existing=(await sr.entities.StormNotice.filter({source_id:key}))[0];
        if (existing) { await sr.entities.StormNotice.update(existing.id,record); updated++; }
        else { await sr.entities.StormNotice.create({...record,status:"published",affected_zips:[]}); created++; }
      }
    }
    return Response.json({status:"checked",created,updated,checked_at:new Date().toISOString()});
  } catch { return Response.json({error:"Official weather feed is unavailable. Existing notices retain their original issue and expiration times."},{status:502}); }
});