# Instant Satellite Estimate

Entry point: `/instant-estimate`, linked from Home and Roofing. The route is lazy loaded. Existing metadata, schema, routes, phone/chat CTAs, and inspection forms are retained.

## Behavior

- Captures full address, roof-size inputs, material, service, complexity, active leak, contact details, and consent.
- Optional Google Solar lookup uses Geocoding rooftop matches and checks the rooftop point against the returned building bounds. Unsupported, ambiguous, timed-out, or unavailable results fall back to manual sizing. A returned model is not a surveyed measurement and needs inspection.
- Manual sizing explicitly distinguishes roof surface area, building footprint, and above-ground living area divided by stories. Living area is an imperfect proxy; attached garages and unequal floors can substantially affect the result. Never use lot or basement area.
- Pricing is calculated on the server using disclosed national planning assumptions authorized for this feature: asphalt $4.50–$12.25/sq ft; metal $7–$20/sq ft. Complex/unknown roofs add 20% to the upper end. These are not Demore quotes. The result is a full replacement comparison, including when a visitor requests repair/storm inspection.
- Creates `ContactLead` with `lead_source=satellite_estimate`; stores the full estimate, version, and consent timestamp. The result, owner/customer emails, and appended sheet column retain the Base44 lead ID.
- A random session submission token and server lookup recover the existing lead on sequential retries. The browser disables concurrent submissions. Cross-instance simultaneous API requests do not have a database uniqueness guarantee; a unique constraint/transactional store is needed before claiming strict exactly-once creation.
- Existing `ContactLead` create workflow sends to both Ryan and Clark. Provider errors are detected and the accepted owner message ID is saved. Resend idempotency keys protect notification retries for the provider's 24-hour window. Sheets keep the existing append behavior.

## Satellite configuration

Set **GOOGLE_SOLAR_API_KEY** in the existing Base44 app's server secrets. The key must have Geocoding API and Solar API enabled with the appropriate Google Cloud billing and API restrictions. Never expose it in a `VITE_` variable or GitHub. No Google project, billable plan, or secret was created for this feature. If the key or coverage is unavailable, the form still works with clearly labeled homeowner inputs. Verify a known covered property and the imagery date before promoting satellite measurement claims.

Provider reference: https://developers.google.com/maps/documentation/solar/building-insights

Pricing references: https://www.thisoldhouse.com/roofing/shingle-roof-cost-home and https://www.thisoldhouse.com/roofing/metal-roofs

## Verification and deployment

Run `node --test tests/instant-estimate*.test.mjs`, the targeted ESLint check, and `npm run build` with the existing Base44 environment values. Run one marked test submission, confirm the same ID after retry, verify `owner_notification_id`, and check email delivery. Mark the test record completed rather than mixing it with customer follow-up.

GitHub/Vercel and Base44 currently have different route lists. Deploy the feature to each without replacing its unrelated routes. In Base44, resource files auto-sync; publish the frontend from the existing app dashboard to update the custom domain. GitHub main triggers the existing Vercel deployment. Do not create a new project or change domain ownership.
