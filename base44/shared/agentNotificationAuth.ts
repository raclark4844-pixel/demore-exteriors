import { createClientFromRequest } from "npm:@base44/sdk@0.8.44";
export async function authorize(req) {
 const client=createClientFromRequest(req);
 const supplied=req.headers.get("x-demore-agent-secret");
 if(supplied!==null) {
  const expected=Deno.env.get("AI_PHONE_WEBHOOK_SECRET");
  if(!expected) return {response:Response.json({error:"Missing AI_PHONE_WEBHOOK_SECRET in Base44 Secrets"},{status:503})};
  if(supplied!==expected) return {response:Response.json({error:"Unauthorized"},{status:401})};
 } else {
  const user=await client.auth.me().catch(()=>null);
  if(user?.role!=="admin") return {response:Response.json({error:"Unauthorized"},{status:401})};
 }
 return {client,sr:client.asServiceRole};
}
