# Reviews, storms, proof and city content

## Live functionality
- /review-us provides a stable QR destination. It links to Google only after the actual Google Business Profile review URL is saved in /ops/growth; until then it offers the existing website review form.
- /ops/growth is an administrator workspace for completed jobs, recorded email/SMS permission, opt-outs, outreach drafts, official storm notices and project outcomes.
- prepareCustomerOutreach runs hourly and prepares one review draft per eligible customer record and channel, 24 hours after recorded completion. The UI rejects duplicate job references. It does not send messages.
- monitorLocalStorms runs every 15 minutes using the official NWS Ohio alert feed. It creates county warning notices and an expiring homepage alert. These are warnings, not confirmed property damage reports. Cancellation messages archive referenced notices. No qualifying notices were found during verification.
- Storm SMS drafts require administrator-supplied verified ZIP codes and completed customers with recorded SMS permission. They are not sent.
- Project outcomes require approved distinct before/after photos, verified scope amounts, a city and publication consent. Drafts stay private. Published records appear on the homepage, gallery and matching priority city. No fabricated example records were added.
- Fifteen existing city pages gained linked official permit guidance, regional NWS storm context and distinct inspection notes. Their existing indexability settings and route architecture remain unchanged.
- Fixed static LakeCityPage routes that previously lacked a city parameter. Removed the unverified static aggregate rating of 47 reviews.

## Still required
1. Actual Google review URL.
2. Completed-job/customer source and documented email/SMS permissions.
3. Messaging provider connection, incoming opt-out handling, delivery tracking and verified sending identity before enabling delivery. This release prepares drafts only.
4. Approved photo pairings, city labels and verified initial/final claim scope amounts. The existing 69 imported gallery photos have no such labels.
5. Genuine city-specific project photos. No stock/generated images are represented as completed local jobs.

## Verification
Production build and targeted ESLint passed. Consent, review URL, outcome publication and weather eligibility rules passed 15 assertions. All 15 city route slugs matched the existing service-area data. Backend calls verified missing-review-link handling, a successful NWS poll with zero qualifying alerts, and 403 for anonymous administrative actions. Browser checks covered the review page, staff QR screen, missing-link guard and Willoughby routing/content. Customer delivery and public claim outcomes cannot be verified until real configuration/data is supplied.

Base44 production retains its pre-existing approval-response route. The GitHub App file omits that Base44-only route because its component is not in this repository.
