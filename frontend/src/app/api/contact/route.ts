import { Resend } from "resend"
import { NextRequest, NextResponse } from "next/server"

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Email service not configured" }, { status: 503 })
  }

  const resend = new Resend(apiKey)
  const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@naaxtech.com"
  const TO = process.env.CONTACT_TO_EMAIL ?? "hello@naaxtech.com"

  const body = await req.json()
  const { name, email, company, country, tier, message, referral, token } = body

  if (!name || !email || !company || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 })
  }

  if (!EMAIL_RE.test(String(email))) {
    return NextResponse.json({ ok: false, error: "Invalid email address" }, { status: 400 })
  }

  // Cloudflare Turnstile verification (only enforced when secret key is configured)
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!token) {
      return NextResponse.json({ ok: false, error: "Bot verification required" }, { status: 400 })
    }
    const check = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
    })
    const result = await check.json()
    if (!result.success) {
      return NextResponse.json({ ok: false, error: "Bot verification failed" }, { status: 400 })
    }
  }

  const tierLabel: Record<string, string> = {
    launch: "Launch — from $6,000/mo",
    growth: "Growth — from $11,000/mo",
    scale: "Scale — Custom",
    unsure: "Not sure yet",
  }

  const safeTier = esc(tierLabel[String(tier)] ?? tier)

  const field = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;width:110px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#999;vertical-align:top;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:10px 0 10px 16px;font-size:14px;color:#111;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#111111;padding:24px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <span style="font-size:20px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">NAAX</span><span style="font-size:20px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:#F5C842;">TECH</span>
        </td>
        <td align="right">
          <span style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#F5C842;">New Inquiry</span>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="background:#F5C842;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Body -->
  <tr><td style="background:#ffffff;padding:32px 32px 24px;">

    <!-- Lead -->
    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Partnership Application</p>
    <p style="margin:0 0 2px;font-size:22px;font-weight:700;color:#111;letter-spacing:-0.01em;">${esc(name)}</p>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">${esc(company)}${country ? ` &nbsp;&middot;&nbsp; ${esc(country)}` : ""}</p>

    <!-- Fields -->
    <table width="100%" cellpadding="0" cellspacing="0">
      ${field("Email", `<a href="mailto:${esc(email)}" style="color:#111;text-decoration:none;font-weight:500;">${esc(email)}</a>`)}
      ${field("Tier", safeTier)}
      ${referral ? field("Source", esc(referral)) : ""}
    </table>

    <!-- Message -->
    <p style="margin:24px 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#999;">Message</p>
    <p style="margin:0;font-size:15px;color:#333;line-height:1.75;white-space:pre-wrap;padding:20px;background:#f9f9f9;border-left:3px solid #F5C842;">${esc(message)}</p>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr><td style="background:#111111;padding:13px 24px;">
        <a href="mailto:${esc(email)}" style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#F5C842;text-decoration:none;">Reply to ${esc(name)} &rarr;</a>
      </td></tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#ffffff;border-top:1px solid #f0f0f0;padding:16px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-size:12px;color:#999;">
          <a href="https://naaxtech.com" style="color:#111;text-decoration:none;font-weight:600;">naaxtech.com</a>
          &nbsp;&middot;&nbsp;
          <a href="https://www.linkedin.com/company/naaxtech/" style="color:#999;text-decoration:none;">LinkedIn</a>
          &nbsp;&middot;&nbsp;
          <a href="tel:+63289831727" style="color:#999;text-decoration:none;">+63 2 8983 1727</a>
        </td>
        <td align="right" style="font-size:11px;color:#ccc;letter-spacing:0.06em;text-transform:uppercase;">Naaxtech</td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: String(email),
      subject: `New Inquiry — ${esc(name)} · ${esc(company)} (${safeTier})`,
      html,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 500 })
  }
}
