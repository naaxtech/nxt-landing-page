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

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: String(email),
      subject: `Partnership Inquiry — ${esc(company)} (${safeTier})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #111;">
          <h2 style="margin: 0 0 24px; font-size: 20px;">New Partnership Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${esc(name)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${esc(email)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0; font-weight: 600;">${esc(company)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Country</td><td style="padding: 8px 0;">${esc(country ?? "—")}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Tier</td><td style="padding: 8px 0;">${safeTier}</td></tr>
            ${referral ? `<tr><td style="padding: 8px 0; color: #666;">Source</td><td style="padding: 8px 0;">${esc(referral)}</td></tr>` : ""}
          </table>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Message</p>
          <p style="white-space: pre-wrap; line-height: 1.7;">${esc(message)}</p>
        </div>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to send" }, { status: 500 })
  }
}
