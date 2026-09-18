# Phone / chat owner email and knowledge refresh

Branch: `improvement/phone-agent-email-knowledge`
Knowledge version target: `2026.09.18.1`

## What this adds
- `notifyLeadEvent` — emails both owners when phone or Ask Demore captures or updates intake, not only when an appointment is booked.
- Duplicate prevention by intake fingerprint. Retries up to 3 times. `sent: true` only after Resend accepts the message.
- `refreshPublicKnowledge` — reads public www.demoreexteriorsolutions.com pages only. Excludes /ops, /install, /login and other staff routes.
- `sendOwnerNotificationTest` — one labeled test to both owners. Not a customer lead.
- LD-6B9F5797 is blocked from automatic recovery resend.

## Live checks already performed
- `POST https://demoreexteriorsolutions.com/functions/ingestAiPhoneLead` without secret returns **401 Unauthorized**. Function is published and `AI_PHONE_WEBHOOK_SECRET` is set.
- GET on the same function returns **405 Method not allowed**.
- `https://demorephoneagent.grok.me` Command Center already shows lead **LD-6B9F5797** (Ryan Clark, Mentor, booked inspection Fri Sep 18 2:00–4:00 PM). Do not resend that recovery email or create another appointment.
- ryan@ already received other Base44 owner emails (satellite estimate and a later TEST CALL ai-phone lead). The Brain app lead LD-6B9F5797 did not automatically email because that app stores leads locally and did not call `ingestAiPhoneLead` / `notifyLeadEvent` for that record.

## Preserve
- Verizon no-answer forwarding to the Vapi number
- Existing Vapi number and embed (`https://demorephoneagent.grok.me/embed.js`)
- Saved leads in Command Center

## Owner must still do after merge + Base44 function deploy
1. Confirm Secrets exist: `RESEND_API_KEY`, `AI_PHONE_WEBHOOK_SECRET`. Optional `RESEND_FROM_EMAIL` and `LEAD_NOTIFICATION_EMAILS`.
2. Point Vapi post-call webhook **and** Ask Demore capture/update events at:
   - `https://demoreexteriorsolutions.com/functions/ingestAiPhoneLead` (new leads)
   - `https://demoreexteriorsolutions.com/functions/notifyLeadEvent` (updates)
   Header: `x-demore-agent-secret`
3. Run `POST /functions/sendOwnerNotificationTest` with the same header. That is the labeled owner test.
4. Run `POST /functions/refreshPublicKnowledge` with the same header.
5. Publish Base44 only after those two calls return `provider_status: accepted` and a knowledge version.

Do not print secret values.
