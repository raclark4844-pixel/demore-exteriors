import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MANUFACTURERS } from '../src/lib/manufacturerData.js';
import { SERVICE_AREAS, getAllCommunities, slugify } from '../src/lib/serviceAreaData.js';
import { isCitySeoIndexable } from '../src/lib/citySeoIndex.js';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const origin = 'https://demoreexteriorsolutions.com';
const privatePaths = new Set(['/login', '/register', '/forgot-password', '/reset-password']);
// Only routes outside ProtectedRoute are eligible. Keep the existing city
// approval policy; commercial city pages explicitly remain noindex.
const publicRoutes = read('src/App.jsx').split('<Route element={<ProtectedRoute')[0];
const paths = new Set([...publicRoutes.matchAll(/<Route path="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => !path.includes(':') && !privatePaths.has(path))
  .filter((path) => !/^\/service-area\/[^/]+\/[^/]+/.test(path) || isCitySeoIndexable(path.split('/')[3])));

for (const county of SERVICE_AREAS) {
  paths.add(`/service-area/${county.slug}`);
  for (const city of getAllCommunities(county)) {
    const slug = slugify(city.name);
    if (isCitySeoIndexable(slug)) paths.add(`/service-area/${county.slug}/${slug}`);
  }
}
for (const manufacturer of MANUFACTURERS) {
  paths.add(`/products/${manufacturer.slug}`);
  for (const category of manufacturer.categories) {
    for (const product of category.products) {
      paths.add(`/products/${manufacturer.slug}/${category.slug}/${product.slug}`);
    }
  }
}
const topicSource = read('src/pages/InsuranceHelpTopic.jsx').split('export default')[0];
const topics = [...topicSource.matchAll(/^  (?:"([^"]+)"|([\w-]+)):\s*\{/gm)]
  .map((match) => match[1] || match[2]);
if (!topics.length) throw new Error('No insurance-help topics found; review topic route coverage.');
for (const topic of topics) paths.add(`/insurance-claims/help/${topic}`);

// Omit lastmod rather than guessing dates or marking unchanged pages as new.
const xml = (entries) => '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + entries.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')
  + '\n</urlset>\n';
const entries = [...paths].sort();
const outputs = {
  'public/sitemap.xml': xml(entries),
  // Keep the old URL working for crawlers that already discovered it.
  'public/sitemap-additions.xml': xml(entries.filter((path) =>
    path === '/storm-damage' || path === '/financing' || path.startsWith('/insurance-claims/help'))),
};
for (const [path, content] of Object.entries(outputs)) {
  if (process.argv.includes('--check')) {
    if (read(path) !== content) throw new Error(`${path} is stale; run npm run sitemap`);
  } else {
    writeFileSync(fileURLToPath(new URL(path, root)), content);
  }
}
console.log(`${entries.length} eligible public URLs; private and unapproved city routes excluded.`);
