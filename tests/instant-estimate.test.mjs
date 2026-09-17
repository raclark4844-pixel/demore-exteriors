import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveRoofRange, calculateEstimate } from '../base44/functions/instantRoofEstimate/calculator.js';

const input = { area: 2000, size_mode: 'roof', pitch: 'unknown', stories: 1, material: 'asphalt', service: 'replacement', complexity: 'simple' };
test('known roof area produces outward-rounded planning prices', () => {
  const estimate = calculateEstimate(input, deriveRoofRange(input));
  assert.equal(estimate.min_sqft, 1800);
  assert.equal(estimate.max_sqft, 2200);
  assert.equal(estimate.price_min, 8100);
  assert.equal(estimate.price_max, 27000);
  assert.equal(estimate.source, 'homeowner_inputs');
  assert.match(estimate.disclaimer, /not a bid/);
});
test('living area divides by stories; lot size is never inferred from address', () => {
  const range = deriveRoofRange({ ...input, size_mode: 'living', stories: 2, pitch: 'typical' });
  assert.equal(range.min_sqft, 1000);
  assert.equal(range.max_sqft, 1620);
  assert.match(range.basis, /garages/);
});
test('rejects impossible, missing and nonfinite measurements', () => {
  for (const area of [0, -1, 199, 20001, undefined, Infinity, NaN, 'abc']) assert.throws(() => deriveRoofRange({ ...input, area }));
  assert.throws(() => deriveRoofRange({ ...input, size_mode: 'living', stories: 0 }));
  assert.throws(() => deriveRoofRange({ ...input, pitch: '__proto__' }));
  assert.throws(() => calculateEstimate({ ...input, material: '__proto__' }, deriveRoofRange(input)));
});
test('repair and storm requests remain replacement comparisons requiring inspection', () => {
  for (const service of ['repair', 'storm_damage']) {
    const estimate = calculateEstimate({ ...input, service }, deriveRoofRange(input));
    assert.equal(estimate.inspection_required, true);
    assert.match(estimate.price_scope, /replacement/);
  }
  assert.equal(calculateEstimate({ ...input, active_leak: true }, deriveRoofRange(input)).inspection_required, true);
});
test('complexity expands only high end; metal rates are independent', () => {
  const simple = calculateEstimate({ ...input, material: 'metal' }, deriveRoofRange(input));
  const complex = calculateEstimate({ ...input, material: 'metal', complexity: 'complex' }, deriveRoofRange(input));
  assert.equal(simple.price_min, 12600);
  assert.equal(simple.price_max, 44000);
  assert.equal(complex.price_min, simple.price_min);
  assert.equal(complex.price_max, 52800);
});
