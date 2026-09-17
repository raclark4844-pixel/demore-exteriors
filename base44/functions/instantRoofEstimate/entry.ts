import { createClientFromRequest } from 'npm:@base44/sdk@0.8.48';
import { deriveRoofRange, calculateEstimate } from './calculator.js';

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const clean = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : '';

// No address, coordinates, API keys or contact details are written to logs.
async function satelliteMeasurement(address) {
  const key = Deno.env.get('GOOGLE_SOLAR_API_KEY');
  if (!key) return null;
  const json = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!res.ok) throw new Error('Measurement provider unavailable');
    return res.json();
  };
  try {
    const geocode = await json(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:US&key=${encodeURIComponent(key)}`);
    const place = geocode.results?.[0];
    if (geocode.status !== 'OK' || geocode.results.length !== 1 || place.partial_match || place.geometry?.location_type !== 'ROOFTOP') return null;
    const point = place.geometry.location;
    const roof = await json(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${point.lat}&location.longitude=${point.lng}&requiredQuality=HIGH&key=${encodeURIComponent(key)}`);
    const box = roof.boundingBox;
    // Reject nearby buildings whose bounds do not contain the address rooftop point.
    if (!box || point.lat < box.sw.latitude || point.lat > box.ne.latitude || point.lng < box.sw.longitude || point.lng > box.ne.longitude) return null;
    const area = roof.solarPotential?.wholeRoofStats?.areaMeters2 * 10.7639;
    if (!Number.isFinite(area) || area < 200 || area > 30000) return null;
    const date = roof.imageryDate;
    return { min_sqft: Math.floor(area * .9 / 10) * 10, max_sqft: Math.ceil(area * 1.1 / 10) * 10, source: 'google_solar', basis: 'Google Solar roof-surface model with a ±10% planning allowance; property match and roof condition require inspection.', imagery_date: date ? `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}` : null };
  } catch { return null; }
}

export default async function(req) {
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  let input;
  try {
    const raw = await req.text();
    if (raw.length > 12000) return reply({ error: 'Request too large' }, 413);
    input = JSON.parse(raw);
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error();
  } catch { return reply({ error: 'Invalid request' }, 400); }
  const address = clean(input.address, 300);
  if (address.length < 12 || !/\d/.test(address)) return reply({ error: 'Enter a full street address, city, state and ZIP.' }, 400);
  if (input.website) return reply({ error: 'Unable to process this request.' }, 400);
  if (input.action === 'measure') {
    const measurement = await satelliteMeasurement(address);
    return reply({ measurement, message: measurement ? 'Satellite-derived roof model found. Confirm this is your property.' : 'Satellite measurement is unavailable for this address. Use the property-size options below; we will label the result as derived from your inputs.' });
  }
  if (input.action !== 'submit') return reply({ error: 'Invalid action' }, 400);
  const name = clean(input.name, 100), phone = clean(input.phone, 40), email = clean(input.email, 200);
  if (name.length < 2 || !/^1?\d{10}$/.test(phone.replace(/\D/g, '')) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.consent !== true) return reply({ error: 'Enter your name, valid US phone and email, and agree to be contacted about this request.' }, 400);
  if (!/^[0-9a-f-]{36}$/i.test(input.request_id || '')) return reply({ error: 'Refresh this form and try again.' }, 400);
  const sr = createClientFromRequest(req).asServiceRole;
  try {
    // Same submission token survives retries and reloads. Do not use a caller-provided lead ID to modify a record.
    const existing = await sr.entities.ContactLead.filter({ estimate_request_id: input.request_id }, '-created_date', 1);
    if (existing.length) {
      if (existing[0].email !== email || existing[0].phone !== phone || existing[0].address !== address) return reply({ error: 'This request was already saved. Start a new estimate for another property.' }, 409);
      return reply({ success: true, lead_id: existing[0].id, estimate: existing[0].estimate_data, reused: true });
    }
    let measurement;
    if (input.size_mode === 'satellite') {
      if (input.property_confirmed !== true) return reply({ error: 'Confirm the property address before continuing.' }, 400);
      measurement = await satelliteMeasurement(address);
      if (!measurement) return reply({ error: 'Satellite measurement is unavailable. Choose a property-size option and retry.' }, 422);
    } else {
      try { measurement = deriveRoofRange(input); } catch (e) { return reply({ error: e.message }, 400); }
    }
    let estimate;
    try { estimate = calculateEstimate(input, measurement); } catch (e) { return reply({ error: e.message }, 400); }
    const message = [
      'INSTANT SATELLITE ESTIMATE — PRELIMINARY, NOT A BID',
      `Service: ${input.service}; material: ${input.material}; complexity: ${input.complexity}.`,
      `Roof range: ${estimate.min_sqft}–${estimate.max_sqft} sq ft. Source: ${estimate.source}. ${estimate.basis}`,
      `Full replacement planning range: $${estimate.price_min}–$${estimate.price_max}.`,
      estimate.pricing_basis, estimate.disclaimer,
      input.service !== 'replacement' ? 'Repair/storm request: replacement comparison only; repair cost and insurance coverage are NOT estimated.' : '',
      `Homeowner note: ${clean(input.message, 1000)}`,
    ].filter(Boolean).join('\n');
    const lead = await sr.entities.ContactLead.create({ name, phone, email, address, service_type: input.service === 'storm_damage' || input.active_leak === true ? 'storm_damage' : 'roofing', active_leak: input.active_leak === true, lead_source: 'satellite_estimate', status: 'new', message, description: 'Preliminary roof estimate; inspection and written scope required.', estimate_request_id: input.request_id, estimate_data: estimate, contact_consent_at: new Date().toISOString() });
    // The existing ContactLead create workflow sends the owner notifications, using this same ID.
    return reply({ success: true, lead_id: lead.id, estimate });
  } catch {
    console.error('Instant estimate lead save failed');
    return reply({ error: 'We could not confirm your request was saved. Retry with this form, or call (440) 920-6133.' }, 503);
  }
}
