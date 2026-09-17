import { Resend } from 'npm:resend@4.0.0';

const APPROVAL_PAGE = 'https://demoreexteriorsolutions.com/approval-response';
const EMAIL_FROM = 'Demore Exterior Solutions AI Control <no-reply@demorehomesolutions.com>';
const TOKEN_TTL_HOURS = 72;

function html(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function makeToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashApprovalToken(token: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sendSmsIfConfigured(contact: any, message: string) {
  if (!contact?.notifySms || !contact?.phone) return { sent: false, reason: 'SMS_DISABLED_OR_NO_PHONE' };
  const sid = Deno.env.get('TEXTGRID_ACCOUNT_SID');
  const authToken = Deno.env.get('TEXTGRID_AUTH_TOKEN');
  const from = Deno.env.get('TEXTGRID_FROM_NUMBER');
  if (!sid || !authToken || !from) return { sent: false, reason: 'TEXTGRID_NOT_CONFIGURED' };

  const body = new URLSearchParams({ To: contact.phone, From: from, Body: message });
  const response = await fetch(`https://api.textgrid.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const text = await response.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = { raw: text.slice(0, 300) }; }
  if (!response.ok) throw new Error(`TextGrid ${response.status}: ${data?.message || data?.error || text.slice(0, 200)}`);
  return { sent: true, id: data?.sid || data?.id || '' };
}

function emailBody(input: any, contact: any, rawToken: string) {
  const approveUrl = `${APPROVAL_PAGE}?token=${encodeURIComponent(rawToken)}&decision=APPROVED`;
  const rejectUrl = `${APPROVAL_PAGE}?token=${encodeURIComponent(rawToken)}&decision=REJECTED`;
  const required = 'One of the two designated human approvers (Ryan or Clark) must approve to pass this gate, including RED-risk requests. Either approver may reject it.';
  const preview = input.previewUrl ? `<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Preview:</strong> <a href="${html(input.previewUrl)}">Open Vercel preview</a></p>` : '';
  const pr = input.pullRequestUrl ? `<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Pull request:</strong> <a href="${html(input.pullRequestUrl)}">Review code change</a></p>` : '';

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td align="center" style="padding-top:24px;padding-right:12px;padding-bottom:24px;padding-left:12px;background-color:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;background-color:#ffffff;border-radius:10px">
<tr><td bgcolor="#111827" style="padding-top:22px;padding-right:24px;padding-bottom:22px;padding-left:24px;background-color:#111827;border-radius:10px 10px 0 0">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#fbbf24;font-weight:bold;letter-spacing:1px">DEMORE AI CONTROL</p>
<p style="margin:4px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:30px;color:#ffffff;font-weight:bold">${html(input.riskLevel)}-risk approval required</p>
</td></tr>
<tr><td style="padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px">
<p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#111827">Hi ${html(contact.name)}, a controlled AI workflow requires a human decision.</p>
<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Change ID:</strong> ${html(input.changeId)}</p>
<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Gate:</strong> ${html(input.gateType === 'STAGED_PRODUCTION' ? 'Final staged production approval' : 'Initial owner approval')}</p>
<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Risk:</strong> ${html(input.riskLevel)}</p>
<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#111827"><strong>Summary:</strong> ${html(input.summary)}</p>
${input.details ? `<p style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#374151"><strong>Details:</strong> ${html(input.details)}</p>` : ''}
${preview}${pr}
<p style="margin:16px 0 18px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:19px;color:#6b7280">${required}</p>
<table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
<td bgcolor="#166534" style="background-color:#166534;border-radius:6px"><a href="${approveUrl}" style="display:inline-block;padding-top:12px;padding-right:20px;padding-bottom:12px;padding-left:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;color:#ffffff;text-decoration:none;font-weight:bold">APPROVE</a></td>
<td style="width:12px"></td>
<td bgcolor="#b91c1c" style="background-color:#b91c1c;border-radius:6px"><a href="${rejectUrl}" style="display:inline-block;padding-top:12px;padding-right:20px;padding-bottom:12px;padding-left:20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;color:#ffffff;text-decoration:none;font-weight:bold">REJECT</a></td>
</tr></table>
<p style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#6b7280">The buttons open a secure confirmation page. Opening this email or link cannot approve a change. You may add an optional decision comment before confirming. The link expires in ${TOKEN_TTL_HOURS} hours.</p>
</td></tr></table></td></tr></table></body></html>`;
}

export async function sendHumanApprovalNotifications(sr: any, input: any) {
  if (!['HIGH', 'RED'].includes(String(input.riskLevel || '').toUpperCase())) {
    return { sent: 0, skipped: true, reason: 'RISK_NOT_HIGH_OR_RED' };
  }
  if (input.isTest && !input.allowTestNotification) {
    return { sent: 0, skipped: true, reason: 'TEST_NOTIFICATION_SUPPRESSED' };
  }

  const contacts = (await sr.entities.ApprovalContact.list('approvalOrder', 20))
    .filter((c: any) => c.enabled && (c.notifyEmail || c.notifySms));
  if (!contacts.length) return { sent: 0, skipped: true, reason: 'NO_APPROVAL_CONTACTS' };

  const resendKey = Deno.env.get('RESEND_API_KEY');
  const resend = resendKey ? new Resend(resendKey) : null;
  const results: any[] = [];

  for (const contact of contacts) {
    const identity = input.approvalRecordId || input.stageId || input.jobId || input.changeId;
    const notificationKey = `${input.changeId}:${input.gateType}:${identity}:${contact.contactId}`;
    const existing = await sr.entities.ApprovalActionToken.filter({ notificationKey });
    const alreadySent = existing.find((x: any) => x.status === 'PENDING' && (x.emailSentAt || x.smsSentAt));
    if (alreadySent) {
      results.push({ contact: contact.email, skipped: true, reason: 'ALREADY_SENT' });
      continue;
    }
    for (const old of existing.filter((x: any) => x.status === 'PENDING')) {
      await sr.entities.ApprovalActionToken.update(old.id, { status: 'REVOKED', archived: true });
    }

    const rawToken = makeToken();
    const tokenHash = await hashApprovalToken(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();
    const tokenRecord = await sr.entities.ApprovalActionToken.create({
      notificationKey,
      tokenHash,
      changeId: input.changeId,
      jobId: input.jobId || '',
      approvalRecordId: input.approvalRecordId || '',
      stageId: input.stageId || '',
      gateType: input.gateType,
      recipientName: contact.name,
      recipientEmail: contact.email,
      recipientPhone: contact.phone || '',
      riskLevel: input.riskLevel,
      status: 'PENDING',
      expiresAt,
      isTest: Boolean(input.isTest),
      archived: false,
    });

    let emailResult: any = { sent: false };
    if (contact.notifyEmail && resend) {
      const response: any = await resend.emails.send({
        from: EMAIL_FROM,
        to: [contact.email],
        subject: `[${input.riskLevel} RISK] Demore AI approval required — ${input.changeId}`,
        html: emailBody(input, contact, rawToken),
      });
      const messageId = response?.data?.id || response?.id || '';
      await sr.entities.ApprovalActionToken.update(tokenRecord.id, { emailMessageId: messageId, emailSentAt: new Date().toISOString() });
      emailResult = { sent: true, id: messageId };
    } else if (contact.notifyEmail && !resend) {
      emailResult = { sent: false, reason: 'RESEND_NOT_CONFIGURED' };
    }

    let smsResult: any = { sent: false, reason: 'SMS_DISABLED_OR_NO_PHONE' };
    try {
      const approvalUrl = `${APPROVAL_PAGE}?token=${encodeURIComponent(rawToken)}`;
      smsResult = await sendSmsIfConfigured(contact, `Demore AI Control: ${input.riskLevel}-risk change ${input.changeId} requires approval. Review: ${approvalUrl}`);
      if (smsResult.sent) await sr.entities.ApprovalActionToken.update(tokenRecord.id, { smsMessageId: smsResult.id || '', smsSentAt: new Date().toISOString() });
    } catch (error) {
      smsResult = { sent: false, reason: String(error?.message || error) };
    }

    results.push({ contact: contact.email, email: emailResult, sms: smsResult });
  }

  return { sent: results.filter((r) => r.email?.sent || r.sms?.sent).length, results };
}