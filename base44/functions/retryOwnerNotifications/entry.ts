import {authorize} from "../../shared/agentNotificationAuth.ts";
import notify from "../notifyLeadEvent/entry.ts";
export default async function(req) {
 if(req.method!=="POST") return Response.json({error:"Method not allowed"},{status:405});
 const access=await authorize(req);if(access.response)return access.response;
 const rows=await access.sr.entities.EmailDeliveryLog.filter({provider_status:{$in:["pending","retrying","blocked_config"]}},"created_date",20);
 const results=[];
 for(const row of rows) {
  if(!row.intake || (row.attempt_count||0)>=9)continue;
  // Do not retry an ambiguous provider send beyond its 24-hour idempotency window.
  if(Date.now()-new Date(row.created_date).getTime()>23*3600000)continue;
  const headers=new Headers(req.headers);headers.set("content-type","application/json");
  const response=await notify(new Request(req.url,{method:"POST",headers,body:JSON.stringify({lead:row.intake,event_type:row.event_type})}));
  results.push({id:row.id,status:response.status});
 }
 return Response.json({success:true,results});
}
