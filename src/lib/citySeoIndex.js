// City-level indexability control (approved SEO batch A).
// A city page is index,follow ONLY when seoIndexable === true. Default: false.
// Mentor is the approved unique/HQ city page.
// County hubs (/service-area/:county) are controlled separately and do NOT
// depend on this flag. A city may be flipped to true ONLY after:
//   1. The page has legitimate unique local content.
//   2. SEO Demore has reviewed and approved that content.
export const CITY_SEO = {
  mentor: { seoIndexable: true },
};

export function isCitySeoIndexable(citySlug) {
  return Boolean(CITY_SEO[citySlug]?.seoIndexable);
}