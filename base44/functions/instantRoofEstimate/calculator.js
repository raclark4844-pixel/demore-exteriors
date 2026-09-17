export const VERSION = '2026-09-17-v1';
export const RATES = { asphalt: [4.5, 12.25], metal: [7, 20] };
export const DISCLAIMER = 'Preliminary planning range only — not a bid, contract, insurance valuation, or coverage determination. A site inspection and written scope are required. Decking, structural repairs, permits, unusual access, and other site conditions may change the price.';

export function deriveRoofRange(input) {
  const area = Number(input.area);
  if (!Number.isFinite(area) || area < 200 || area > 20000) throw new Error('Enter an area between 200 and 20,000 square feet.');
  if (!['roof', 'footprint', 'living'].includes(input.size_mode)) throw new Error('Choose how you know the property size.');
  const pitches = { low: [1.02, 1.15], typical: [1.12, 1.35], steep: [1.3, 1.65], unknown: [1.05, 1.65] };
  if (!Object.hasOwn(pitches, input.pitch)) throw new Error('Choose a roof slope.');
  const stories = Number(input.stories);
  if (input.size_mode === 'living' && ![1, 1.5, 2, 3].includes(stories)) throw new Error('Choose the number of above-ground stories.');
  const footprint = input.size_mode === 'living' ? area / stories : area;
  const factors = input.size_mode === 'roof' ? [0.9, 1.1] : pitches[input.pitch].map((n, i) => n * (i ? 1.2 : 0.9));
  return {
    min_sqft: Math.floor(footprint * factors[0] / 10) * 10,
    max_sqft: Math.ceil(footprint * factors[1] / 10) * 10,
    source: 'homeowner_inputs',
    basis: input.size_mode === 'roof' ? 'Homeowner-reported roof area, with a ±10% planning allowance.' : input.size_mode === 'living' ? 'Above-ground living area divided by stories, adjusted for the selected slope and a broad size allowance. Unequal floors, garages and additions can make this inaccurate.' : 'Homeowner-reported building footprint adjusted for slope and a broad size allowance. Include attached garages and covered additions.',
  };
}

export function calculateEstimate(input, measurement) {
  if (!Object.hasOwn(RATES, input.material)) throw new Error('Choose asphalt shingles or metal roofing.');
  if (!['replacement', 'repair', 'storm_damage'].includes(input.service)) throw new Error('Choose the service needed.');
  if (!['simple', 'complex', 'unknown'].includes(input.complexity)) throw new Error('Choose the roof complexity.');
  if (!measurement || !Number.isFinite(measurement.min_sqft) || !Number.isFinite(measurement.max_sqft) || measurement.min_sqft <= 0 || measurement.max_sqft < measurement.min_sqft) throw new Error('A valid roof-size range is required.');
  const rates = RATES[input.material];
  const complexity = input.complexity === 'simple' ? 1 : 1.2;
  return {
    ...measurement, material: input.material, service: input.service,
    price_min: Math.floor(measurement.min_sqft * rates[0] / 100) * 100,
    price_max: Math.ceil(measurement.max_sqft * rates[1] * complexity / 100) * 100,
    rate_min: rates[0], rate_max: rates[1], complexity_allowance: complexity,
    price_scope: 'Full roof replacement planning comparison',
    inspection_required: input.service !== 'replacement' || input.active_leak === true,
    pricing_basis: 'Illustrative national installed-cost assumptions, not Demore pricing: asphalt $4.50–$12.25/sq ft; metal $7–$20/sq ft. Complex or unknown roofs add 20% to the upper bound. Rounded outward to $100.',
    pricing_sources: ['https://www.thisoldhouse.com/roofing/shingle-roof-cost-home', 'https://www.thisoldhouse.com/roofing/metal-roofs'],
    version: VERSION, disclaimer: DISCLAIMER,
  };
}
