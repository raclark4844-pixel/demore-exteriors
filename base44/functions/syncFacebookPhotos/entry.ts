import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Source: the Demoré posting-bot app's public gallery feed (its API key is
// public-by-design — it ships inside the shareable <demore-gallery> embed).
const SOURCE_APP_ID = '6a9bdb67620441958b8187a1';
const SOURCE_API_KEY = '596c09a151414e84b832a20f909afe66';

// Posts permanently excluded from the gallery (logo banners, promo graphics).
const SKIP_POST_URLS = new Set([
  "https://www.facebook.com/122123800011165865",
  "https://www.facebook.com/122123811021165865/posts/2309171093236394?substory_index=2309171093236394",
  "https://www.facebook.com/122123811021165865/posts/122123806959165865",
]);

// Case-insensitive caption keyword rules → exact ProjectPhoto category enum values.
// Storm words checked first so "hail damage on a roof" files under Storm Damage.
const CATEGORY_RULES = [
  ["Storm Damage", [/\bstorm/, /\bhail/, /\bwind(?!ow)/, /\binsurance/, /\bice dam/]],
  ["Roofing", [/\broof/, /\bshingle/, /\bridge cap/, /\bflashing/]],
  ["Siding", [/\bsiding/, /\bvinyl/, /\bhardie/, /\breside/]],
  ["Gutters", [/\bgutter/, /\bdownspout/]],
  ["Decks & Outdoor Living", [/\bdeck/, /\boutdoor living/, /\bporch/]],
  ["Windows", [/\bwindow/]],
  ["Doors", [/\bdoor/]],
];

function detectCategory(caption) {
  const text = (caption || "").toLowerCase();
  for (const [category, patterns] of CATEGORY_RULES) {
    if (patterns.some((re) => re.test(text))) return category;
  }
  return "Other";
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Pull gallery items from the source app
    const url = `https://app.base44.com/api/apps/${SOURCE_APP_ID}/entities/GalleryItem?limit=200&sort=-postedDate&fields=imageUrl,caption,category,postedDate,postUrl`;
    const res = await fetch(url, { headers: { api_key: SOURCE_API_KEY } });
    if (!res.ok) {
      const body = await res.text();
      console.error("Gallery feed fetch error:", res.status, body.slice(0, 200));
      return Response.json({ error: `Gallery feed fetch failed (${res.status})` }, { status: 502 });
    }
    const items = await res.json();

    // De-duplicate against existing gallery photos by the Facebook post link
    const existing = await base44.asServiceRole.entities.ProjectPhoto.list("-created_date", 500);
    const knownUrls = new Set((existing || []).map((p) => p.facebook_post_url).filter(Boolean));

    let added = 0;
    let skipped = 0;
    for (const it of items || []) {
      if (SKIP_POST_URLS.has(it.postUrl)) {
        skipped++;
        continue;
      }
      if (!it.imageUrl || !it.postUrl || knownUrls.has(it.postUrl)) {
        skipped++;
        continue;
      }
      try {
        // Re-host the image: Facebook CDN links expire, so store a permanent copy here.
        const imgRes = await fetch(it.imageUrl);
        if (!imgRes.ok) {
          skipped++;
          continue;
        }
        const buf = await imgRes.arrayBuffer();
        const file = new File([buf], "photo.jpg", { type: "image/jpeg" });
        const up = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        await base44.asServiceRole.entities.ProjectPhoto.create({
          title: "",
          image_url: up.file_url,
          category: detectCategory(it.caption),
          description: "",
          project_date: it.postedDate || null,
          facebook_post_url: it.postUrl,
        });
        added++;
      } catch (err) {
        console.error("Failed to import photo", it.postUrl, err?.message || err);
        skipped++;
      }
    }

    return Response.json({ fetched: (items || []).length, added, skipped });
  } catch (error) {
    console.error("syncFacebookPhotos error:", error?.message || error);
    return Response.json({ error: error?.message || "Failed to sync photos" }, { status: 500 });
  }
}