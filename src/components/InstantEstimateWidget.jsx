import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

const control = 'w-full min-h-12 rounded-lg border border-border bg-background px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';
const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const number = (n) => new Intl.NumberFormat('en-US').format(n);
function requestId() {
  try {
    const existing = sessionStorage.getItem('demore_estimate_request');
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem('demore_estimate_request', id);
    return id;
  } catch { return crypto.randomUUID(); }
}

export default function InstantEstimateWidget() {
  const [form, setForm] = useState({ address: '', size_mode: 'living', area: '', stories: '1', pitch: 'unknown', complexity: 'unknown', material: 'asphalt', service: 'replacement', name: '', phone: '', email: '', message: '', website: '', consent: false, active_leak: false, property_confirmed: false });
  const [measurement, setMeasurement] = useState(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const pending = useRef(false);
  const resultRef = useRef(null);
  const errorRef = useRef(null);
  const id = useRef(null);
  const set = (key, value) => {
    setForm((old) => ({ ...old, [key]: value, ...(key === 'address' ? { size_mode: old.size_mode === 'satellite' ? 'living' : old.size_mode, property_confirmed: false } : {}) }));
    if (key === 'address') { setMeasurement(null); setNotice(''); }
  };
  const fail = (e) => {
    setError(e.response?.data?.error || e.message || 'Unable to save. Please retry or call (440) 920-6133.');
    setTimeout(() => errorRef.current?.focus(), 0);
  };
  const lookup = async () => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError('');
    try {
      const { data } = await base44.functions.invoke('instantRoofEstimate', { action: 'measure', address: form.address, website: form.website });
      setMeasurement(data.measurement); setNotice(data.message);
      if (data.measurement) set('size_mode', 'satellite');
    } catch (e) { fail(e); }
    finally { pending.current = false; setBusy(false); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true; setBusy(true); setError('');
    id.current ||= requestId();
    try {
      const { data } = await base44.functions.invoke('instantRoofEstimate', { ...form, action: 'submit', request_id: id.current });
      if (!data.success || !data.lead_id || !data.estimate) throw new Error('Your save could not be confirmed. Please retry.');
      setResult(data);
      setTimeout(() => resultRef.current?.focus(), 0);
    } catch (e) { fail(e); }
    finally { pending.current = false; setBusy(false); }
  };
  const field = (key, label, props = {}) => <label className="block space-y-2"><span className="font-medium">{label}</span><input className={control} name={key} value={form[key]} onChange={(e) => set(key, e.target.value)} {...props} /></label>;
  const select = (key, label, options) => <label className="block space-y-2"><span className="font-medium">{label}</span><select className={control} name={key} value={form[key]} onChange={(e) => set(key, e.target.value)}>{options.map(([value, text]) => <option value={value} key={value}>{text}</option>)}</select></label>;

  return <section id="instant-estimate" aria-label="Instant Satellite Estimate" className="py-16 px-4 scroll-mt-24">
    <div className="max-w-3xl mx-auto rounded-2xl border border-primary/30 bg-card p-5 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">Plan your roofing project</p>
      <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3">Instant Satellite Estimate</h2>
      <p className="text-muted-foreground mt-4 mb-6">Get a preliminary roof replacement price range for your Northeast Ohio property. We check satellite measurements where available, or use the size details you provide. A free inspection confirms the scope.</p>
      {result ? <div ref={resultRef} tabIndex={-1} className="space-y-5 focus:outline-none" aria-live="polite">
        <h3 className="text-xl font-semibold">Preliminary price range — not a bid</h3>
        <p className="text-3xl sm:text-4xl font-bold text-primary">{money(result.estimate.price_min)}–{money(result.estimate.price_max)}</p>
        <p className="font-medium">Full roof replacement planning comparison · {result.estimate.material === 'asphalt' ? 'Asphalt shingles' : 'Metal roofing'}</p>
        {result.estimate.inspection_required && <p className="border border-primary/40 rounded-lg p-3">Your repair, storm, or active-leak request needs an inspection. This is a full replacement comparison, not a repair estimate or insurance payout.</p>}
        <p>Estimated roof surface: <strong>{number(result.estimate.min_sqft)}–{number(result.estimate.max_sqft)} sq ft</strong>.</p>
        <p>{result.estimate.source === 'google_solar' ? 'Satellite-derived model · Google Solar' : 'Derived from homeowner inputs — not satellite measured'}. {result.estimate.basis}</p>
        {result.estimate.imagery_date && <p>Imagery date: {result.estimate.imagery_date}</p>}
        <details className="rounded-lg border border-border p-4"><summary className="cursor-pointer font-semibold">Price assumptions and limitations</summary><p className="mt-3">{result.estimate.pricing_basis}</p><p className="mt-3">{result.estimate.disclaimer}</p><p className="mt-3 text-sm">Planning references: <a className="underline" href="https://www.thisoldhouse.com/roofing/shingle-roof-cost-home" target="_blank" rel="noreferrer">shingle cost guide</a> and <a className="underline" href="https://www.thisoldhouse.com/roofing/metal-roofs" target="_blank" rel="noreferrer">metal roof guide</a>.</p></details>
        <p className="text-sm">Your request is saved. Demore will follow up about an inspection. Reference: <strong className="break-all">{result.lead_id}</strong>. No appointment has been booked.</p>
        <a href="tel:+14409206133" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent text-accent-foreground px-5 font-bold">Discuss this estimate: (440) 920-6133</a>
        <p className="text-sm">Keep your reference number so we can continue with the same lead.</p>
        <button type="button" className="min-h-11 underline block" onClick={() => { try { sessionStorage.removeItem('demore_estimate_request'); } catch { /* Storage is optional. */ } id.current = null; setResult(null); }}>Start a new estimate</button>
      </div> : <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={busy} className="space-y-5">
          <legend className="text-lg font-bold mb-3">1. Property and roof size</legend>
          {field('address', 'Full property address *', { required: true, minLength: 12, maxLength: 300, autoComplete: 'street-address', placeholder: 'Street, city, OH, ZIP' })}
          <button type="button" disabled={busy || form.address.trim().length < 12} onClick={lookup} className="min-h-12 rounded-lg border border-primary px-4 font-semibold disabled:opacity-50">Check satellite availability</button>
          {notice && <p role="status" className="text-sm">{notice}</p>}
          {select('size_mode', 'Size information', [...(measurement ? [['satellite', 'Use satellite-derived model']] : []), ['living', 'I know the above-ground living area'], ['footprint', 'I know the building footprint'], ['roof', 'I know the roof surface area']])}
          {form.size_mode === 'satellite' && measurement ? <div className="space-y-3"><p>Google Solar model: {number(measurement.min_sqft)}–{number(measurement.max_sqft)} sq ft. Satellite imagery may be outdated or include nearby structures.</p><label className="flex gap-3 items-start"><input type="checkbox" required checked={form.property_confirmed} onChange={(e) => set('property_confirmed', e.target.checked)} className="mt-1 h-5 w-5 shrink-0" /><span>I confirm the full address above is my property; I understand measurements require inspection.</span></label></div> : <>
            <div className="grid sm:grid-cols-2 gap-4">{field('area', `${form.size_mode === 'living' ? 'Above-ground living area' : form.size_mode === 'footprint' ? 'Building footprint' : 'Roof surface area'} (sq ft) *`, { type: 'number', min: 200, max: 20000, required: true, inputMode: 'numeric' })}{form.size_mode === 'living' && select('stories', 'Above-ground stories', [['1', '1 story'], ['1.5', '1½ stories'], ['2', '2 stories'], ['3', '3 stories']])}</div>
            <p className="text-sm text-muted-foreground">Do not use lot size or basement area. Living area is only a rough proxy: garages, additions and unequal floors can change roof size. No roof access is needed.</p>
            {select('pitch', 'Roof slope (from the ground)', [['unknown', 'Not sure'], ['low', 'Low slope'], ['typical', 'Moderate slope'], ['steep', 'Steep slope']])}
          </>}
        </fieldset>
        <fieldset disabled={busy} className="space-y-5"><legend className="text-lg font-bold mb-3">2. Roofing project</legend>
          <div className="grid sm:grid-cols-2 gap-4">{select('material', 'Preferred material', [['asphalt', 'Asphalt shingles'], ['metal', 'Metal roofing']])}{select('service', 'Service needed', [['replacement', 'Roof replacement'], ['repair', 'Roof repair'], ['storm_damage', 'Storm damage inspection']])}</div>
          {select('complexity', 'Roof shape and access', [['unknown', 'Not sure'], ['simple', 'Simple roof with easy access'], ['complex', 'Many valleys, dormers, or difficult access']])}
          <label className="flex gap-3 items-center min-h-11"><input type="checkbox" checked={form.active_leak} onChange={(e) => set('active_leak', e.target.checked)} className="h-5 w-5" />Water is actively entering the property</label>
          {form.active_leak && <p role="status">For an active leak, <a href="tel:+14409206133" className="underline font-bold">call (440) 920-6133</a>. Your request will be marked as priority; this form does not dispatch emergency service.</p>}
          {form.service !== 'replacement' && <p className="text-sm">We can show a full replacement comparison. Repair costs and insurance coverage require an inspection and are not calculated here.</p>}
        </fieldset>
        <fieldset disabled={busy} className="space-y-5"><legend className="text-lg font-bold mb-3">3. Where can we reach you?</legend>
          {field('name', 'Full name *', { required: true, minLength: 2, maxLength: 100, autoComplete: 'name' })}
          <div className="grid sm:grid-cols-2 gap-4">{field('phone', 'Phone *', { type: 'tel', required: true, maxLength: 40, autoComplete: 'tel', placeholder: '(440) 555-0123' })}{field('email', 'Email *', { type: 'email', required: true, maxLength: 200, autoComplete: 'email' })}</div>
          {field('message', 'Anything else we should know?', { maxLength: 1000 })}
          <div hidden aria-hidden="true">{field('website', 'Website', { tabIndex: -1, autoComplete: 'off' })}</div>
          <label className="flex gap-3 items-start"><input type="checkbox" required checked={form.consent} onChange={(e) => set('consent', e.target.checked)} className="h-5 w-5 shrink-0 mt-1" /><span className="text-sm">I agree that Demore may contact me by phone or email about this request. My details and preliminary estimate will be saved for follow-up. This is not a bid or a booking.</span></label>
        </fieldset>
        <p className="text-sm text-muted-foreground">Planning assumptions, not Demore pricing: asphalt $4.50–$12.25/sq ft; metal $7–$20/sq ft. Complex or unknown roofs add 20% to the upper bound. Inspection and a written scope determine your actual price.</p>
        {error && <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive p-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full min-h-14 rounded-lg bg-accent text-accent-foreground px-5 py-4 font-bold text-lg disabled:opacity-60">{busy ? 'Working…' : 'Get my preliminary price range'}</button>
      </form>}
    </div>
  </section>;
}
