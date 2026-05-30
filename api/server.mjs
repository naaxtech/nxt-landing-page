import http from 'node:http'
import nodemailer from 'nodemailer'

const {
  PORT = 3001,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  GMAIL_TO   = 'naaxtech.official@gmail.com',
  GMAIL_CC   = 'naaxtech.marketing@gmail.com',
  ALLOWED_ORIGINS = 'https://naaxtech.github.io',
} = process.env

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error('[naaxtech-api] Missing GMAIL_USER or GMAIL_APP_PASSWORD — exiting.')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

// ── In-memory rate limiter: 3 submissions per IP per 15 min ──────────────────
const limits = new Map()
function isRateLimited(ip) {
  const now  = Date.now()
  const win  = 15 * 60 * 1000
  const rec  = limits.get(ip) ?? { n: 0, reset: now + win }
  if (now > rec.reset) { rec.n = 0; rec.reset = now + win }
  rec.n++
  limits.set(ip, rec)
  return rec.n > 3
}
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of limits) if (now > v.reset) limits.delete(k)
}, 5 * 60 * 1000)

// ── Email template ───────────────────────────────────────────────────────────
function buildEmail({ name, email, company, country, tier, message, referral }) {
  const tierLabels = {
    launch:  'Launch Partner — $6,000/mo founding',
    growth:  'Growth Partner ★ — $11,000/mo founding',
    scale:   'Scale Partner — $25,000/mo',
    unsure:  'Not sure yet',
  }
  return {
    from:    `"Naaxtech Inquiries" <${GMAIL_USER}>`,
    to:      GMAIL_TO,
    cc:      GMAIL_CC,
    replyTo: email,
    subject: `Partnership Inquiry — ${name} | ${company}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#000;padding:20px 24px;border-bottom:2px solid #F5C842">
          <span style="font-family:monospace;font-weight:900;font-size:18px;color:#fff;letter-spacing:2px">NAAX</span>
          <span style="font-family:monospace;font-weight:900;font-size:18px;color:#F5C842;letter-spacing:2px">TECH</span>
          <span style="font-family:monospace;font-size:11px;color:#888;margin-left:16px;letter-spacing:1px;text-transform:uppercase">New Partnership Inquiry</span>
        </div>
        <div style="background:#f8f8f8;padding:28px 24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${[
              ['Name',    name],
              ['Email',   `<a href="mailto:${email}" style="color:#000">${email}</a>`],
              ['Company', company],
              ['Country', country],
              ['Tier',    `<strong style="color:#9a7b00">${tierLabels[tier] ?? tier}</strong>`],
              ...(referral ? [['Referral', referral]] : []),
            ].map(([k, v]) => `
              <tr>
                <td style="padding:8px 12px 8px 0;color:#666;width:100px;vertical-align:top">${k}</td>
                <td style="padding:8px 0">${v}</td>
              </tr>
            `).join('')}
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #ddd">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:10px">Message</p>
          <p style="line-height:1.8;white-space:pre-wrap;font-size:14px">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
        </div>
        <div style="background:#000;padding:12px 24px;font-family:monospace;font-size:10px;color:#444;letter-spacing:1px">
          NAAXTECH · naaxtech.official@gmail.com · reply directly to this email
        </div>
      </div>
    `,
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const ORIGINS = ALLOWED_ORIGINS.split(',').map(o => o.trim())

http.createServer(async (req, res) => {
  const origin = req.headers.origin ?? ''
  res.setHeader('Access-Control-Allow-Origin',  ORIGINS.includes(origin) ? origin : ORIGINS[0])
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.url === '/health') { res.writeHead(200); res.end('ok'); return }

  if (req.method === 'POST' && req.url === '/contact') {
    const ip = (req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim()

    if (isRateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: 'Too many requests. Try again in 15 minutes.' }))
      return
    }

    let raw = ''
    req.on('data', chunk => { raw += chunk; if (raw.length > 20_000) req.destroy() })
    req.on('end', async () => {
      try {
        const data = JSON.parse(raw)
        const missing = ['name','email','company','country','tier','message'].filter(k => !String(data[k] ?? '').trim())
        if (missing.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: false, error: `Missing: ${missing.join(', ')}` }))
          return
        }
        await transporter.sendMail(buildEmail(data))
        console.log(`[ok] ${data.email} — ${data.tier}`)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        console.error('[error]', err.message)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'Failed to send email.' }))
      }
    })
    return
  }

  res.writeHead(404); res.end()
}).listen(PORT, () => console.log(`[naaxtech-api] listening on :${PORT}`))
