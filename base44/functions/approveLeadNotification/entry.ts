import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req: Request) {
  const url = new URL(req.url);
  const leadRef = url.searchParams.get('ref') || '';
  const token = url.searchParams.get('token') || '';
  if (!leadRef || !token) {
    return new Response('Missing ref or token', { status: 400 });
  }

  const expected = Deno.env.get('AI_PHONE_WEBHOOK_SECRET') || '';
  if (!expected || token !== expected.slice(0, 16)) {
    return new Response('Invalid token', { status: 401 });
  }

  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;

  const logs = await sr.entities.EmailDeliveryLog.filter({ lead_ref: leadRef });
  if (logs.length) {
    await sr.entities.EmailDeliveryLog.update(logs[0].id, { provider_status: 'approved_by_owner', last_error: 'Approved via email button' });
  }

  const leads = await sr.entities.ContactLead.filter({ external_intake_ref: leadRef });
  if (leads.length) {
    await sr.entities.ContactLead.update(leads[0].id, { status: 'approved' });
  }

  return new Response(`
    <html><body style="font-family:sans-serif;padding:40px">
      <h1>Approved</h1>
      <p>Lead ${leadRef} has been marked as approved.</p>
      <p><a href="https://www.demoreexteriorsolutions.com">Back to site</a></p>
    </body></html>
  `, { headers: { 'Content-Type': 'text/html' } });
}
