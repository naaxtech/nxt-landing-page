"use client"

import { useState, type FormEvent } from "react"
import Script from "next/script"
import Link from "next/link"
import { Layers, Zap, Globe } from "lucide-react"
import { Nav } from "@/components/nav"
import { RippleLink } from "@/components/ui/ripple-link"

const API_URL = "/api/contact"

// ─── Pricing ──────────────────────────────────────────────────────────────────
type Period = "monthly" | "yearly" | "founding"

const PERIODS: { id: Period; label: string; badge?: string }[] = [
  { id: "monthly",  label: "Month to Month" },
  { id: "yearly",   label: "1 Year",  badge: "Save 15%" },
  { id: "founding", label: "2 Years", badge: "Save 25–27%" },
]

const PRICES: Record<Period, { launch: number | null; growth: number | null; scale: null }> = {
  monthly:  { launch: 8000,  growth: 15000, scale: null },
  yearly:   { launch: 6800,  growth: 12750, scale: null },
  founding: { launch: 6000,  growth: 11000, scale: null },
}

const PERIOD_NOTES: Record<Period, string> = {
  monthly:  "/ mo  ·  no lock-in",
  yearly:   "/ mo  ·  billed annually",
  founding: "/ mo  ·  locked for 24 months",
}

const PERIOD_SAVE: Record<Period, string | null> = {
  monthly:  null,
  yearly:   "Save $1,200–$2,250/mo vs monthly",
  founding: "Save $2,000–$4,000/mo · Founding rate locked",
}

interface Tier {
  id: "launch" | "growth" | "scale"
  name: string
  icon: React.ReactNode
  desc: string
  commitment: Record<Period, string>
  features: string[]
  featured?: boolean
}

const TIERS: Tier[] = [
  {
    id: "launch",
    name: "Launch",
    icon: <Layers size={28} strokeWidth={1.5} />,
    desc: "For funded founders who need a team to build and launch fast.",
    commitment: {
      monthly:  "No minimum commitment",
      yearly:   "12-month contract",
      founding: "24-month contract — founding rate",
    },
    features: [
      "Senior leadership oversight",
      "2-person dedicated execution team",
      "Automation infrastructure — foundation",
      "Core product build — launch-ready",
      "Go-to-market execution",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    icon: <Zap size={28} strokeWidth={1.5} />,
    desc: "For profitable operators ready to scale revenue and operations.",
    featured: true,
    commitment: {
      monthly:  "No minimum commitment",
      yearly:   "12-month contract",
      founding: "24-month contract — founding rate",
    },
    features: [
      "Senior leadership oversight",
      "3–4 person execution team",
      "Full automation layer",
      "Accelerated marketing engine",
      "Scaling product build",
      "Priority execution queue",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    icon: <Globe size={28} strokeWidth={1.5} />,
    desc: "For funded companies with enterprise ambitions and multi-channel scope.",
    commitment: {
      monthly:  "Custom engagement",
      yearly:   "Custom engagement",
      founding: "Founding rate available on enquiry",
    },
    features: [
      "Senior leadership oversight",
      "Full execution pod — 5+ specialists",
      "Enterprise-grade automation",
      "Multi-channel growth engine",
      "Complete architecture build",
      "Weekly leadership sessions",
    ],
  },
]

function PriceDisplay({ tier, period }: { tier: Tier; period: Period }) {
  if (tier.id === "scale") {
    return (
      <>
        <div className="p-price-enquire">Custom</div>
        <div className="p-price-period">Tailored to scope — enquire below</div>
      </>
    )
  }
  const price = PRICES[period][tier.id]!
  return (
    <>
      <div className="p-price-amount">
        <span className="p-curr">$</span>
        {price.toLocaleString()}
      </div>
      <div className="p-price-period">{PERIOD_NOTES[period]}</div>
      {PERIOD_SAVE[period] && (
        <div className="p-price-save">{PERIOD_SAVE[period]}</div>
      )}
    </>
  )
}

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA"

export default function PartnerPage() {
  const [period, setPeriod] = useState<Period>("founding")
  const [selectedTier, setSelectedTier] = useState("growth")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const scrollApply = (tierId: string) => {
    setSelectedTier(tierId)
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!API_URL) return
    setStatus("sending")
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.ok) {
        setStatus("sent")
      } else {
        setErrorMessage(json.error ?? "Something went wrong.")
        setStatus("error")
      }
    } catch {
      setErrorMessage("Something went wrong. Email us at hello@naaxtech.com")
      setStatus("error")
    }
  }

  return (
    <div className="partner-page">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className="scanline" />
      <div className="grid-overlay" />
      <Nav />

      {/* ── HERO ── */}
      <section className="p-section" style={{ paddingTop: 120 }}>
        <div className="p-section-inner">
          <div className="founding-badge" style={{ marginBottom: 28 }}>
            ★ Founding Partner Program — 3 Spots Only
          </div>
          <h1 className="p-section-h1">
            Build With Us<br />
            <span style={{ color: "var(--yellow)" }}>From the Start.</span>
          </h1>
          <p className="p-section-p">
            Three founding partnerships at rates that get locked in for 24 months.
            A senior execution team from day one — the longer the contract, the better the rate.
          </p>
          <div className="p-btn-row">
            <RippleLink href="#pricing" className="btn-primary" >See Rates</RippleLink>
            <a href="#apply" className="btn-ghost">
              <span>Apply now</span>
              <span className="arrow" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOUNDING BENEFITS ── */}
      <section className="p-section p-section-alt">
        <div className="p-section-inner">
          <div className="section-label">What founding partners get</div>
          <div className="p-benefits-grid">
            {[
              { label: "Locked Rate",    body: "Your founding rate stays fixed for 24 months. No increases. No renegotiation at renewal." },
              { label: "25–27% Off",     body: "The 2-year founding rate is permanently lower than month-to-month. Locked forever." },
              { label: "Direct Access",  body: "You work directly with the people making decisions, not account managers." },
              { label: "Founding Status",body: "Recognised in case studies and positioning materials. Your story shapes our track record." },
              { label: "First to New",   body: "Priority access to new capabilities before they reach the general partner base." },
              { label: "Shape the Work", body: "Founding partners influence what gets built next. Your use case defines the roadmap." },
            ].map((b) => (
              <div key={b.label} className="p-benefit-card">
                <div className="p-benefit-label">{b.label}</div>
                <p className="p-benefit-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="p-section">
        <div className="p-section-inner">
          <div className="section-label">Partnership Investment</div>
          <h2 className="p-section-h2">
            The longer the contract,<br />
            <span style={{ color: "var(--yellow)" }}>the better the rate.</span>
          </h2>
          <p className="p-section-note" style={{ marginTop: 16, maxWidth: 480 }}>
            All tiers include the same full-scope execution. The rate reflects the commitment,
            not the service level.
          </p>

          {/* Period toggle */}
          <div className="p-period-wrap">
            <div className="p-period-tabs">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  className={`p-period-tab${period === p.id ? " active" : ""}`}
                  onClick={() => setPeriod(p.id)}
                >
                  {p.label}
                  {p.badge && period !== p.id && (
                    <span style={{
                      marginLeft: 8,
                      fontSize: 9,
                      color: "var(--yellow)",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.05em",
                    }}>
                      {p.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-pricing-grid">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`p-price-card${tier.featured ? " featured" : ""}`}>
                {tier.featured && (
                  <div className="p-featured-badge">Most Popular</div>
                )}
                <div>
                  <div className="p-tier-name">{tier.name}</div>
                  <div style={{ color: "var(--yellow)", margin: "12px 0 4px" }}>
                    {tier.icon}
                  </div>
                </div>
                <PriceDisplay tier={tier} period={period} />
                <p className="p-price-desc">{tier.desc}</p>
                <div className="p-price-features">
                  {tier.features.map((f) => (
                    <div key={f} className="p-price-feature">{f}</div>
                  ))}
                </div>
                <div className="p-price-commitment">{tier.commitment[period]}</div>
                <div className="p-price-cta">
                  {tier.featured ? (
                    <button
                      className="btn-primary"
                      style={{ width: "100%", border: "none", cursor: "pointer" }}
                      onClick={() => scrollApply(tier.id)}
                    >
                      Apply — Growth
                    </button>
                  ) : (
                    <button
                      className="btn-outline"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--white)",
                        border: "1px solid var(--border)",
                        padding: "16px 24px",
                        cursor: "pointer",
                        background: "none",
                        width: "100%",
                        transition: "border-color 0.2s, background 0.2s",
                        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
                        position: "relative" as const,
                        overflow: "hidden",
                      }}
                      onClick={() => scrollApply(tier.id)}
                    >
                      Apply — {tier.name}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: "center", marginTop: 24,
            fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.08em", color: "var(--gray-dim)",
          }}>
            After the founding period closes, rates revert to standard pricing.
            Existing founding partners keep their locked rate through renewal.
          </p>
        </div>
      </section>

      {/* ── VALUE COMPARISON ── */}
      <section className="p-section p-section-alt">
        <div className="p-section-inner" style={{ maxWidth: 800 }}>
          <div className="section-label">The math</div>
          <h2 className="p-section-h2">
            What this costs if you assemble it yourself.
          </h2>
          <p style={{ fontSize: 12, color: "var(--gray-dim)", marginTop: 10, marginBottom: 32, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
            Market rates, 2026 — Glassdoor · AlgoCentric · UX Continuum · Enrich Labs
          </p>
          <div className="p-value-table">
            {[
              ["Fractional CTO",                  "$8,000–$15,000/mo"],
              ["Fractional CMO",                  "$8,000–$15,000/mo"],
              ["2–4 dedicated specialists",        "$9,000–$13,000/mo"],
              ["AI & automation stack management", "$2,000–$5,000/mo"],
              ["Continuous product build",         "$5,000–$15,000/mo"],
            ].map(([label, cost], i) => (
              <div key={i} className="p-value-row">
                <span className="p-value-label">{label}</span>
                <span className="p-value-cost">{cost}</span>
              </div>
            ))}
            <div className="p-value-total">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)" }}>
                Assembled separately
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--gray-dim)", textDecoration: "line-through" }}>
                $32,000–$63,000/mo
              </span>
            </div>
          </div>
          <div className="p-value-highlight">
            <div className="label">Naaxtech Growth — 2-Year Founding Rate</div>
            <div className="amount">
              $11,000<span style={{ fontSize: "0.45em", color: "var(--gray)", fontWeight: 400 }}>/mo</span>
            </div>
            <p className="note">
              Senior leadership + full execution team + AI-powered delivery. Day one.
              Often less than a single senior engineer hire.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="p-section">
        <div className="p-section-inner">
          <div className="section-label">How it works</div>
          <div className="p-how-grid">
            {[
              { label: "Billing",       body: "Monthly subscription — not hourly, not per-task. One fee, everything in scope." },
              { label: "Onboarding",    body: "Discovery sprint in Week 1. Execution begins Week 2. No ramp-up lag." },
              { label: "Communication", body: "Dedicated Slack or Mattermost channel. Direct line to the people doing the work." },
              { label: "Reporting",     body: "Weekly async updates + monthly strategy review. Full visibility, always." },
              { label: "Payment",       body: "50% upfront on signing. Net-15 thereafter. Wire or Wise accepted." },
              { label: "Ownership",     body: "You own your data, content, and accounts. We own the automation engine. You keep everything." },
            ].map((item) => (
              <div key={item.label} className="p-how-card">
                <div className="p-how-label">{item.label}</div>
                <p className="p-how-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="apply" className="p-section p-section-alt">
        <div className="p-section-inner">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Apply</div>
            <h2 className="p-section-h2" style={{ maxWidth: 560, margin: "0 auto" }}>
              Let&apos;s Talk About<br />
              <span style={{ color: "var(--yellow)" }}>Your Business.</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.75, maxWidth: 460, margin: "16px auto 0" }}>
              One conversation. We&apos;ll tell you if we&apos;re the right fit —
              and what execution looks like for your situation.
            </p>
          </div>

          <div className="partner-form-wrap">
            {status === "sent" ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <h3>Message Received.</h3>
                <p>
                  You&apos;ll hear back within 48 hours — directly, no automated replies,
                  no sales team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label" htmlFor="name">Full Name *</label>
                    <input className="form-input" id="name" name="name" type="text" required placeholder="Jane Smith" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="email">Work Email *</label>
                    <input className="form-input" id="email" name="email" type="email" required placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label" htmlFor="company">Company / Project *</label>
                    <input className="form-input" id="company" name="company" type="text" required placeholder="Acme Inc." />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="country">Country / Region *</label>
                    <input className="form-input" id="country" name="country" type="text" required placeholder="United States" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label" htmlFor="position">Your Position / Title</label>
                    <input className="form-input" id="position" name="position" type="text" placeholder="CEO, Founder, Head of Ops…" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input className="form-input" id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="form-label" htmlFor="website">Website</label>
                    <input className="form-input" id="website" name="website" type="url" placeholder="https://yourcompany.com" />
                  </div>
                  <div className="form-field">
                    <label className="form-label" htmlFor="linkedin">LinkedIn</label>
                    <input className="form-input" id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="tier">Tier of Interest *</label>
                  <select
                    className="form-select"
                    id="tier" name="tier" required
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    style={{ color: "var(--white)" }}
                  >
                    <option value="" disabled>Select a tier…</option>
                    <option value="launch">Launch — from $6,000/mo (2-yr) to $8,000/mo</option>
                    <option value="growth">Growth ★ — from $11,000/mo (2-yr) to $15,000/mo</option>
                    <option value="scale">Scale — Custom pricing, enquire</option>
                    <option value="unsure">Not sure yet — help me decide</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="message">Tell us about your business *</label>
                  <textarea
                    className="form-textarea"
                    id="message" name="message" required
                    placeholder="What are you building? What's your biggest challenge right now? Are you funded or generating revenue?"
                    style={{ minHeight: 140 }}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="referral">How did you find us?</label>
                  <input className="form-input" id="referral" name="referral" type="text" placeholder="Referral, LinkedIn, search…" />
                </div>
                <div
                  className="cf-turnstile"
                  data-sitekey={TURNSTILE_SITE_KEY}
                  data-theme="dark"
                  data-response-field="token"
                />
                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#ff6b6b", letterSpacing: "0.08em" }}>
                    {errorMessage}
                  </p>
                )}
                <button type="submit" className="form-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send Your Application →"}
                </button>
                <p className="form-note">
                  Every message is read personally. You&apos;ll hear back within 48 hours —
                  no automation, no pitch decks unless you ask.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer>
        <Link href="/" className="footer-logo">
          <span className="naax">NAAX</span><span className="tech">TECH</span>
        </Link>
        <span className="footer-copy">© 2026 Naaxtech. Operations · Revenue · Growth.</span>
        <ul className="footer-links">
          <li><Link href="/">Home</Link></li>
          <li><a href="mailto:hello@naaxtech.com">hello@naaxtech.com</a></li>
          <li>
            <a href="https://www.linkedin.com/company/naaxtech/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </li>
        </ul>
      </footer>
    </div>
  )
}
