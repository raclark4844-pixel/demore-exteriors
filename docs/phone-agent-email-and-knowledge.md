# Phone/chat notification integration

Reviewed replacement for the initial PR implementation. Production is Base44, not the Vercel preview.

## Base44 behavior
- Both ingestAiPhoneLead and notifyLeadEvent use the same authenticated handler.
- Authenticate external calls with x-demore-agent-secret from AI_PHONE_WEBHOOK_SECRET. Signed-in Base44 admins can run staff tests and refresh actions without revealing that secret.
- Send accumulated intake in lead, with stable lead_ref (Grok lead ID or Vapi call ID), lead_source chat/ai_phone, and available contact, address, message, claim, appointment and transcript-reference fields.
- Partial intakes persist in staff-only EmailDeliveryLog; qualified name/phone intakes also reach ContactLead. No appointments are created by these endpoints.
- Both owners receive notifications. SHA-256 event keys prevent duplicate emails across capture/update retries. Active-leak changes are included.
- Provider acceptance requires a message ID. Failed/configuration-blocked intake is retained. Transient sends retry with backoff up to three attempts per request; staff can retry pending records from Knowledge. There is no background retry scheduler yet. Ambiguous sends older than 23 hours need staff review, avoiding resends outside provider idempotency retention.
- Recovery lead LD-6B9F5797 is always excluded. Do not resend the previous manually recovered email.

## Knowledge
Existing feature context remains in websiteFeatures.ts and is used by Base44 assistants/orchestration. Public refresh checks correct help routes plus 15 cities, only accepts main/article content, and preserves previous knowledge when the website responds with a navigation-only shell. A partial/failed refresh does not claim a last successful refresh.

## External app
Grok Build is still blocked by its free-tier limit and the interrupted preview returns HTTPError 500. Actual Grok/Vapi integration and knowledge synchronization are NOT verified. Do not publish the broken Grok preview. Preserve the current working number, forwarding and embed.

## Validation
Mock checks: syntax, both recipients, long intake hashing, capture/update dedupe, changed active leak, provider rejection, missing configuration persistence, recovered-call exclusion and empty intake. Production build passed. Live owner delivery test and public refresh results must be recorded separately.

## Verified live results
The one labeled owner test was delivered to both owners; provider ID 01a0b26c-3a9d-71c6-8e9a-a48da987c8ac, delivery record 6aaca6f8b22afd1631cbc06b. All four new/updated protected endpoints return 401 without authentication after deployment. A fresh public refresh correctly reports 27 unreadable navigation-only pages, preserving the curated catalog. Accidental navigation metadata records from validation were retired, and their refresh status corrected to failed. The external widget is excluded from staff, preview and token-bearing URLs because it forwards the parent URL; public embedding remains unchanged.
