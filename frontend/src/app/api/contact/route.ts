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

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 16px;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#666;white-space:nowrap;width:130px;border-bottom:1px solid #1e1e1e;">${label}</td>
      <td style="padding:12px 16px;font-size:14px;color:#ffffff;border-bottom:1px solid #1e1e1e;">${value}</td>
    </tr>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head>
<body style="margin:0;padding:0;background:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr><td style="background:#000000;padding:0 0 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:#F5C842;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="background:#0a0a0a;padding:28px 32px;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;">
                  <span style="color:#ffffff;">NAAX</span><span style="color:#F5C842;">TECH</span>
                </td>
                <td style="padding-left:20px;">
                  <span style="display:inline-block;background:#F5C84220;border:1px solid #F5C84260;padding:4px 10px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#F5C842;">NEW INQUIRY</span>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#0d0d0d;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0;">

        <!-- Lead row -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td colspan="2" style="padding:24px 32px 16px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#666;">Partnership Application</p>
              <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">${esc(name)}</p>
              <p style="margin:2px 0 0;font-size:14px;color:#888;">${esc(company)}${country ? ` &nbsp;·&nbsp; ${esc(country)}` : ""}</p>
            </td>
          </tr>
          ${row("Email", `<a href="mailto:${esc(email)}" style="color:#F5C842;text-decoration:none;">${esc(email)}</a>`)}
          ${row("Tier", safeTier)}
          ${referral ? row("Source", esc(referral)) : ""}
        </table>

        <!-- Message -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:24px 32px 8px;">
            <p style="margin:0 0 12px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#666;">Message</p>
            <p style="margin:0;font-size:15px;color:#cccccc;line-height:1.75;white-space:pre-wrap;">${esc(message)}</p>
          </td></tr>
        </table>

        <!-- Reply CTA -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:24px 32px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr><td style="background:#F5C842;padding:14px 28px;">
                <a href="mailto:${esc(email)}" style="font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#000000;text-decoration:none;font-weight:700;">Reply to ${esc(name)} &rarr;</a>
              </td></tr>
            </table>
          </td></tr>
        </table>

      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#000000;border:1px solid #1e1e1e;border-top:none;padding:20px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.1em;color:#444;">
              <span style="color:#ffffff;">NAAX</span><span style="color:#F5C842;">TECH</span> &nbsp;·&nbsp; naaxtech.com
            </td>
            <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.08em;color:#333;">
              Partnership Inquiry
            </td>
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
