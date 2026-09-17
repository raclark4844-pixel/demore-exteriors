// SEO Helper Utilities for Demore Exterior Solutions
// Provides manufacturer, product, county, and city data for comprehensive SEO metadata

import { MANUFACTURERS } from './manufacturerData';
import { SERVICE_AREAS } from './serviceAreaData';

// Extract all manufacturer names
export const ALL_MANUFACTURERS = MANUFACTURERS.map(m => m.name).join(', ');

// Extract all product names with their categories
export const ALL_PRODUCTS = MANUFACTURERS.flatMap(m => 
  m.categories.flatMap(c => 
    c.products.map(p => `${p.name} (${c.label})`)
  )
).join(', ');

// Extract all product slugs for keyword generation
export const PRODUCT_SLUGS = MANUFACTURERS.flatMap(m => 
  m.categories.flatMap(c => c.products.map(p => p.slug))
);

// Extract all county names
export const ALL_COUNTIES = SERVICE_AREAS.map(c => `${c.county} County`).join(', ');

// Extract all city names
export const ALL_CITIES = SERVICE_AREAS.flatMap(c => [
  ...c.cities,
  ...c.villages,
  ...c.unincorporated
]).join(', ');

// Generate manufacturer-specific keywords
export function getManufacturerKeywords(manufacturerSlug) {
  const manufacturer = MANUFACTURERS.find(m => m.slug === manufacturerSlug);
  if (!manufacturer) return '';
  
  const productNames = manufacturer.categories.flatMap(c => c.products.map(p => p.name)).join(', ');
  return `${manufacturer.name} roofing, ${manufacturer.name} siding, ${manufacturer.name} products, ${productNames}, ${manufacturer.name} Ohio, ${manufacturer.name} Northeast Ohio, ${manufacturer.name} contractor`;
}

// Generate product-specific keywords
export function getProductKeywords(manufacturerSlug, productSlug) {
  const manufacturer = MANUFACTURERS.find(m => m.slug === manufacturerSlug);
  if (!manufacturer) return '';
  
  const category = manufacturer.categories.find(c => c.products.some(p => p.slug === productSlug));
  if (!category) return '';
  
  const product = category.products.find(p => p.slug === productSlug);
  if (!product) return '';
  
  return `${product.name} ${manufacturer.name}, ${product.name} roofing Ohio, ${product.name} siding, ${category.label} ${product.name}, ${manufacturer.name} ${product.name} Northeast Ohio`;
}

// Generate county-specific keywords
export function getCountyKeywords(countySlug) {
  const county = SERVICE_AREAS.find(c => c.slug === countySlug);
  if (!county) return '';
  
  const cities = [...county.cities, ...county.villages, ...county.unincorporated].slice(0, 10).join(', ');
  return `${county.county} County roofing, ${county.county} County siding, ${county.county} County gutters, ${county.county} County contractor, roofing ${county.county} Ohio, siding ${county.county} Ohio, ${cities} roofing`;
}

// Generate city-specific keywords
export function getCityKeywords(cityName, countyName) {
  return `${cityName} roofing, ${cityName} siding, ${cityName} gutters, ${cityName} windows, ${cityName} doors, ${cityName} contractor, roofing ${cityName} Ohio, siding ${cityName} Ohio, ${countyName} County roofing, ${cityName} roof replacement, ${cityName} storm damage`;
}

// Full service area list for coverage meta
export const FULL_SERVICE_AREA = SERVICE_AREAS.flatMap(c => [
  ...c.cities.map(city => `${city}, ${c.county} County`),
  ...c.villages.map(village => `${village}, ${c.county} County`)
]).slice(0, 50).join(', ');

// All manufacturers with categories
export const MANUFACTURER_CATEGORIES = MANUFACTURERS.map(m => 
  `${m.name}: ${m.categories.map(c => c.label).join(', ')}`
).join(' | ');