import { useEffect } from "react";
import { ALL_MANUFACTURERS, ALL_PRODUCTS, ALL_COUNTIES, ALL_CITIES, FULL_SERVICE_AREA, MANUFACTURER_CATEGORIES } from "@/lib/seoData";

const SITE_URL = "https://www.demoreexteriorsolutions.com";
const DEFAULT_OG_IMAGE = "https://media.base44.com/images/public/user_6a22dc88783b484dd6ef2b08/899ea39b7_Demorelogo.jpg";
const BUSINESS_NAME = "Demore Exterior Solutions";
const PHONE = "+1-440-920-6133";
const PHONE_DISPLAY = "(440) 920-6133";
const ADDRESS = { street: "6348 Meldon Dr", city: "Mentor", state: "OH", zip: "44060" };
const GEO = { lat: 41.6661, lon: -81.3396 };

/**
 * Comprehensive SEO hook — sets:
 *  - document.title
 *  - meta: description, keywords, robots, author
 *  - geo meta tags (geo.region, geo.placename, geo.position, ICBM)
 *  - Open Graph (og:*) tags
 *  - Twitter Card tags
 *  - canonical link
 *  - JSON-LD structured data (LocalBusiness / Product schema)
 */
export default function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  schema,          // optional JSON-LD object or array — overrides default LocalBusiness schema
  noIndex = false,
  noIndexFollow = false, // noindex,follow — page stays crawlable but out of the index
  geoCity,         // e.g. "Mentor"
  geoRegion = "US-OH",
  }) {
  const apply = () => {
    // ── Title ─────────────────────────────────────────────────────────────
    if (title) document.title = title;

    // ── Helpers ───────────────────────────────────────────────────────────
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    const setJsonLd = (data) => {
      let el = document.querySelector('script[data-seo-jsonld]');
      if (!el) {
        el = document.createElement("script");
        el.setAttribute("type", "application/ld+json");
        el.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };

    const image = ogImage || DEFAULT_OG_IMAGE;
    const canonicalUrl = canonical ? `${SITE_URL}${canonical.startsWith("/") ? canonical : "/" + canonical}` : `${SITE_URL}${window.location.pathname}`;

    // ── Standard meta ─────────────────────────────────────────────────────
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", noIndex ? "noindex, nofollow" : noIndexFollow ? "noindex, follow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    setMeta("author", BUSINESS_NAME);
    setMeta("revisit-after", "7 days");
    setMeta("rating", "general");
    setMeta("classification", "Roofing Contractor, Home Improvement");
    setMeta("coverage", "Northeast Ohio, Lake County, Cuyahoga County, Geauga County, Summit County, Medina, Portage, Ashtabula, Trumbull");
    setMeta("service_area", FULL_SERVICE_AREA);
    setMeta("industry", "Roofing Contractor, Siding Contractor, Gutter Installation, Storm Damage Restoration, Window Replacement, Door Installation, Custom Deck Construction, Outdoor Living");
    setMeta("business_type", "LocalBusiness, RoofingContractor, HomeAndConstructionBusiness, GeneralContractor");
    setMeta("products_carried", ALL_PRODUCTS);
    setMeta("manufacturers", ALL_MANUFACTURERS);
    setMeta("manufacturer_categories", MANUFACTURER_CATEGORIES);
    setMeta("service_counties", ALL_COUNTIES);
    setMeta("service_cities", ALL_CITIES);

    // ── Geo meta ──────────────────────────────────────────────────────────
    setMeta("geo.region", geoRegion);
    setMeta("geo.placename", geoCity || `${ADDRESS.city}, Ohio`);
    setMeta("geo.position", `${GEO.lat};${GEO.lon}`);
    setMeta("ICBM", `${GEO.lat}, ${GEO.lon}`);
    
    // ── Additional local SEO ─────────────────────────────────────────────
    setMeta("place:location:latitude", `${GEO.lat}`);
    setMeta("place:location:longitude", `${GEO.lon}`);
    setMeta("location:country", "United States");
    setMeta("location:region", "Ohio");
    setMeta("location:city", geoCity || ADDRESS.city);
    setMeta("location:postal_code", ADDRESS.zip);

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", BUSINESS_NAME, true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", image, true);
    setMeta("og:image:width", "1200", true);
    setMeta("og:image:height", "630", true);
    setMeta("og:image:alt", title, true);
    setMeta("og:locale", "en_US", true);
    setMeta("og:phone_number", PHONE_DISPLAY, true);
    setMeta("business:contact_data:street_address", "6348 Meldon Dr", true);
    setMeta("business:contact_data:locality", "Mentor", true);
    setMeta("business:contact_data:region", "OH", true);
    setMeta("business:contact_data:postal_code", "44060", true);
    setMeta("business:contact_data:country_name", "United States", true);

    // ── Twitter Card ──────────────────────────────────────────────────────
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", title);
    setMeta("twitter:site", "@DemoreExterior");
    setMeta("twitter:creator", "@DemoreExterior");

    // ── Canonical ─────────────────────────────────────────────────────────
    setLink("canonical", canonicalUrl);

    // ── JSON-LD ───────────────────────────────────────────────────────────
    if (schema) {
      setJsonLd(schema);
    } else {
      setJsonLd({
        "@context": "https://schema.org",
        "@type": ["RoofingContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
        "name": BUSINESS_NAME,
        "url": SITE_URL,
        "telephone": PHONE,
        "image": image,
        "description": description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": ADDRESS.street,
          "addressLocality": ADDRESS.city,
          "addressRegion": ADDRESS.state,
          "postalCode": ADDRESS.zip,
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": GEO.lat,
          "longitude": GEO.lon
        },
        "areaServed": [
          { "@type": "AdministrativeArea", "name": "Cuyahoga County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Lake County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Geauga County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Summit County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Medina County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Portage County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Ashtabula County, Ohio" },
          { "@type": "AdministrativeArea", "name": "Trumbull County, Ohio" }
        ],
        "makesOffer": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roofing Installation & Replacement" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Siding Installation & Replacement" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gutter Systems" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Replacement" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Door Installation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Deck Construction & Outdoor Living" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Storm Damage Repair" } }
        ],
        "brand": [
          { "@type": "Brand", "name": "CertainTeed" },
          { "@type": "Brand", "name": "GAF" },
          { "@type": "Brand", "name": "Owens Corning" },
          { "@type": "Brand", "name": "IKO" },
          { "@type": "Brand", "name": "ProVia" },
          { "@type": "Brand", "name": "Gerkin Windows & Doors" },
          { "@type": "Brand", "name": "Larson" },
          { "@type": "Brand", "name": "Therma-Tru" },
          { "@type": "Brand", "name": "Gentek" }
        ],
        "serviceType": ["Roofing", "Siding", "Gutter Installation", "Storm Damage Repair", "Insurance Claim Roofing", "Custom Deck Construction", "Outdoor Living"],
        "sameAs": ["https://www.facebook.com/share/14cDuZ4TLPU/?mibextid=wwXIfr"],
        "openingHours": "Mo-Sa 07:00-19:00",
        "priceRange": "$$",
        "hasMap": `https://maps.google.com/?q=${GEO.lat},${GEO.lon}`,
        "currenciesAccepted": "USD",
        "paymentAccepted": "Cash, Check, Financing"
      });
    }

  };

  // Apply synchronously during render so the prerendered HTML served to crawlers
  // carries this route's title, description, and canonical instead of the global
  // homepage defaults in index.html.
  apply();

  useEffect(() => {
    apply();
    return () => {
      // Clean up dynamic JSON-LD on unmount to avoid stale data
      const el = document.querySelector('script[data-seo-jsonld]');
      if (el) el.remove();
      // Restore the default robots meta after leaving a noindex page
      if (noIndex || noIndexFollow) {
        const robots = document.querySelector('meta[name="robots"]');
        if (robots) robots.setAttribute("content", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
      }
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noIndex, noIndexFollow, geoCity, geoRegion, schema]);
}