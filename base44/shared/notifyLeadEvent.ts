const SECURITY_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

// Do not force-resend notifications or render approval links while the
// tenant-scoped, transactional notification and approval flow is blocked.
// No secret reads, email sends, or database operations occur in this handler.
export default function notifyLeadEvent(req: Request): Response {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      {
        status: 405,
        headers: { ...SECURITY_HEADERS, Allow: "POST" },
      },
    );
  }

  // Fail closed rather than acknowledge an intake that was not persisted.
  // Keep approveLeadNotification independently disabled with HTTP 503.
  // Re-enable only after scoped configuration, atomic persistence, dedicated
  // HMAC tokens, atomic consumption, audit storage, and replay/concurrency
  // tests have passed security review. No version bump is authorized here.
  return Response.json(
    {
      success: false,
      sent: false,
      error: "Lead notifications temporarily disabled pending security review",
      code: "NOTIFICATION_SECURITY_HOLD",
    },
    { status: 503, headers: SECURITY_HEADERS },
  );
}