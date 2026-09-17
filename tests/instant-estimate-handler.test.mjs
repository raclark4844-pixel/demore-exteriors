import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { deriveRoofRange, calculateEstimate } from '../base44/functions/instantRoofEstimate/calculator.js';

function harness({ failSave = false } = {}) {
  const records = [];
  const source = fs.readFileSync(new URL('../base44/functions/instantRoofEstimate/entry.ts', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '').replace('export default async function(req)', 'async function handler(req)');
  const sr = { entities: { ContactLead: { filter: async (q) => records.filter(r => r.estimate_request_id === q.estimate_request_id), create: async (record) => { if (failSave) throw new Error('Unavailable'); const saved = { ...record, id: 'saved-lead-id' }; records.push(saved); return saved; } } } };
  const context = vm.createContext({ Response, AbortSignal, console: { error() {} }, Deno: { env: { get: () => undefined } }, createClientFromRequest: () => ({ asServiceRole: sr }), deriveRoofRange, calculateEstimate });
  vm.runInContext(source, context);
  return { records, invoke: (body, method = 'POST') => context.handler(new Request('https://example.test', { method, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) })) };
}
const input = { action: 'submit', address: '6348 Meldon Dr, Mentor, OH 44060', name: 'Test Lead', phone: '4405550199', email: 'test@example.com', consent: true, request_id: '12345678-1234-4123-8123-123456789abc', area: 2000, size_mode: 'roof', pitch: 'unknown', stories: 1, material: 'asphalt', service: 'replacement', complexity: 'simple' };

test('anonymous estimate submission recomputes prices and retries preserve lead ID', async () => {
  const h = harness();
  const first = await (await h.invoke({ ...input, price_min: 1, price_max: 2 })).json();
  const retry = await (await h.invoke(input)).json();
  assert.equal(first.estimate.price_min, 8100);
  assert.equal(retry.lead_id, first.lead_id);
  assert.equal(retry.reused, true);
  assert.equal(h.records.length, 1);
  assert.equal(h.records[0].lead_source, 'satellite_estimate');
});
test('missing consent, malformed contact, invalid size and honeypot cannot create leads', async () => {
  const h = harness();
  for (const patch of [{ consent: false }, { phone: '123' }, { email: 'bad' }, { area: -1 }, { website: 'spam' }, { request_id: 'bad' }]) {
    assert.equal((await h.invoke({ ...input, ...patch })).status, 400);
  }
  assert.equal(h.records.length, 0);
});
test('missing satellite configuration returns explicit fallback without creating a lead', async () => {
  const h = harness();
  const res = await (await h.invoke({ action: 'measure', address: input.address })).json();
  assert.equal(res.measurement, null);
  assert.match(res.message, /unavailable/);
  assert.equal(h.records.length, 0);
});
test('save failures never return a successful quote or lead ID', async () => {
  const h = harness({ failSave: true });
  const res = await h.invoke(input);
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.lead_id, undefined);
  assert.equal(data.success, undefined);
});
test('active leaks use existing storm lead routing, and a token cannot change another contact', async () => {
  const h = harness();
  await h.invoke({ ...input, active_leak: true });
  assert.equal(h.records[0].service_type, 'storm_damage');
  assert.equal(h.records[0].active_leak, true);
  assert.equal((await h.invoke({ ...input, email: 'other@example.com' })).status, 409);
  assert.equal(h.records.length, 1);
});
