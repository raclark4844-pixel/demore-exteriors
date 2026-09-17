import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MANUFACTURERS } from '../src/lib/manufacturerData.js';
import { SERVICE_AREAS, getAllCommunities, slugify } from '../src/lib/serviceAreaData.js';
import { isCitySeoIndexable } from '../src/lib/citySeoIndex.js';

const xml = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]));
const paths = new Set(urls.map((url) => url.pathname));

test('sitemap uses unique canonical URLs and excludes private routes', () => {
  assert.equal(paths.size, urls.length);
  for (const url of urls) {
    assert.equal(url.origin, 'https://demoreexteriorsolutions.com');
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
    assert.doesNotMatch(url.pathname, /^\/(ops|market-research|login|register|forgot-password|reset-password)(\/|$)/);
  }
  assert.ok(!paths.has('/products'), 'The catalog hub is currently protected/noindex');
});

test('city and commercial exclusions match the existing approval policy', () => {
  for (const county of SERVICE_AREAS) {
    assert.ok(paths.has(`/service-area/${county.slug}`));
    for (const city of getAllCommunities(county)) {
      const slug = slugify(city.name);
      const path = `/service-area/${county.slug}/${slug}`;
      assert.equal(paths.has(path), isCitySeoIndexable(slug), path);
      assert.ok(!paths.has(`${path}/commercial`));
    }
  }
});

test('all public manufacturer/product pages and new service pages are included', () => {
  for (const manufacturer of MANUFACTURERS) {
    assert.ok(paths.has(`/products/${manufacturer.slug}`));
    for (const category of manufacturer.categories) {
      for (const product of category.products) {
        assert.ok(paths.has(`/products/${manufacturer.slug}/${category.slug}/${product.slug}`));
      }
    }
  }
  for (const path of ['/roofing', '/instant-estimate', '/storm-damage', '/financing',
    '/insurance-claims/help', '/insurance-claims/help/ohio-matching']) assert.ok(paths.has(path));
});
