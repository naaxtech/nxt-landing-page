"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Layers, Zap, Globe } from "lucide-react"
import { Nav } from "@/components/nav"
import { PricingModule, type PricingPlan } from "@/components/ui/pricing-module"

// ─── Self-hosted contact API (deployed on Coolify) ──────────────────────────
// Add NEXT_PUBLIC_API_URL as a GitHub secret (repo → Settings → Secrets → Actions)
// Value = your Coolify service URL, e.g. https://api.yourdomain.com
// Then redeploy. Until configured, the form shows a mailto: fallback.
const API_URL = process.env.NEXT_PUBLIC_API_URL

// ─── Pricing data ─────────────────────────────────────────────────────────────
// priceMonthly = regular rate · priceYearly = founding rate (shown by default)
const PLANS: PricingPlan[] = [
  {
    id: "launch",
    name: "Launch",
    description: "For funded founders who need a team to build and launch fast.",
    icon: <Layers className="w-8 h-8 text-primary" />,
    priceMonthly: 8000,
    priceYearly: 6000,
    users: "3-month minimum engagement",
    features: [
      { label: "Senior leadership oversight", included: true },
      { label: "2-person dedicated execution team", included: true },
      { label: "Automation infrastructure — foundation", included: true },
      { label: "Core product build — launch-ready", included: true },
      { label: "Go-to-market execution", included: true },
      { label: "Accelerated marketing engine", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "For profitable operators ready to scale revenue and operations.",
    icon: <Zap className="w-8 h-8 text-primary" />,
    priceMonthly: 15000,
    priceYearly: 11000,
    users: "6-month minimum engagement",
    recommended: true,
    features: [
      { label: "Senior leadership oversight", included: true },
      { label: "3–4 person execution team", included: true },
      { label: "Full automation layer", included: true },
      { label: "Accelerated marketing engine", included: true },
      { label: "Scaling product build", included: true },
      { label: "Priority execution queue", included: true },
    ],
  },
  {
    id: "scale",
    name: "Scale",
    description: "For funded companies with enterprise ambitions and multi-channel scope.",
    icon: <Globe className="w-8 h-8 text-primary" />,
    priceMonthly: 25000,
    priceYearly: 25000,
    users: "12-month minimum · founding rate on enquiry",
    features: [
      { label: "Senior leadership oversight", included: true },
      { label: "Full execution pod — 5+ specialists", included: true },
      { label: "Enterprise-grade automation", included: true },
      { label: "Multi-channel growth engine", included: true },
      { label: "Complete architecture build", included: true },
      { label: "Weekly leadership sessions", included: true },
    ],
  },
]

export default function PartnerPage() {
  const [selectedTier, setSelectedTier] = useState("growth")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handlePlanSelect = (planId: string) => {
    setSelectedTier(planId)
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!API_URL) return

    setStatus("sending")
    const data = Object.fromEntries(new FormData(e.currentTarget))

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setStatus(json.ok ? "sent" : "error")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="partner-page">
      <div className="scanline" />
      <div className="grid-overlay" />
      <Nav />

      {/* ── FOUNDING HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 80, borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div style={{ maxWidth: 760 }}>
            <div className="founding-badge" style={{ marginBottom: 32 }}>
              ★ Founding Partner Program — 3 Spots Only
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 900,
              fontSize: "clamp(44px, 7vw, 80px)", lineHeight: 0.95,
              letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--white)",
              marginBottom: 32,
            }}>
              Build With Us<br />
              <span style={{ color: "var(--yellow)" }}>From the Start.</span>
            </h1>
            <p style={{ fontSize: 18, color: "var(--gray)", lineHeight: 1.75, maxWidth: 560, marginBottom: 40 }}>
              We&apos;re opening three founding partnerships at locked rates —
              for the businesses that help shape what Naaxtech becomes.
              You get a senior execution team on day one, locked in for 24 months.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#pricing" className="btn-primary" style={{ textDecoration: "none" }}>
                See Founding Rates
              </a>
              <a href="#apply" className="btn-ghost" style={{ textDecoration: "none" }}>
                <span>Apply now</span>
                <span className="arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING BENEFITS ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-label">What founding partners get</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1, background: "var(--border)", border: "1px solid var(--border)", marginTop: 32,
          }}>
            {[
              { label: "Locked Rate", body: "Your founding rate stays fixed for 24 months. No increases. No renegotiation at renewal." },
              { label: "25–27% Off", body: "Founding rates are permanently lower than standard pricing — for the life of the contract." },
              { label: "Direct Access", body: "You work directly with the people making decisions, not account managers." },
              { label: "Founding Status", body: "Recognised as a founding partner in case studies and future positioning materials." },
              { label: "First to New", body: "Priority access to new capabilities and systems before they reach the general partner base." },
              { label: "Shape the Work", body: "Founding partners influence what gets built next. Your use case helps define the roadmap." },
            ].map((b) => (
              <div key={b.label} style={{ background: "var(--card)", padding: "28px 24px" }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "var(--yellow)", marginBottom: 10,
                }}>{b.label}</div>
                <p style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.65 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING MODULE ── */}
      <section id="pricing" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-label" style={{ paddingTop: 80 }}>Partnership Investment</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
          }}>
            Founding Rates.<br />
            <span style={{ color: "var(--yellow)" }}>Locked for 24 Months.</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.75, maxWidth: 520, marginTop: 16 }}>
            Toggle to compare founding vs. standard rates. All tiers include full-scope execution —
            the rate difference reflects the early relationship, not the value delivered.
          </p>
        </div>
        <PricingModule
          title=""
          subtitle=""
          annualBillingLabel="Founding Partner Rates"
          buttonLabel="Apply for This Tier"
          periodMonthly="/ mo  ·  standard rate"
          periodAnnual="/ mo  ·  locked for 24 months"
          plans={PLANS}
          defaultAnnual={true}
          onPlanSelect={handlePlanSelect}
          className="pt-0"
        />
      </section>

      {/* ── VALUE COMPARISON ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="section-inner" style={{ maxWidth: 800 }}>
          <div className="section-label">The math</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
            marginBottom: 8,
          }}>
            What this costs assembled yourself.
          </h2>
          <p style={{ fontSize: 13, color: "var(--gray)", marginBottom: 40, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
            Market rates, 2026 — Glassdoor, AlgoCentric, UX Continuum, Enrich Labs
          </p>
          <div style={{ border: "1px solid var(--border)" }}>
            {[
              ["Fractional CTO", "$8,000–$15,000/mo"],
              ["Fractional CMO", "$8,000–$15,000/mo"],
              ["2–4 dedicated specialists", "$9,000–$13,000/mo"],
              ["AI & automation stack", "$2,000–$5,000/mo"],
              ["Continuous product build", "$5,000–$15,000/mo"],
            ].map(([label, cost], i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 24px", borderBottom: "1px solid var(--border)", gap: 24,
              }}>
                <span style={{ fontSize: 14, color: "var(--gray)" }}>{label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--white)", whiteSpace: "nowrap" }}>{cost}</span>
              </div>
            ))}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 24px", background: "rgba(255,255,255,0.03)",
              borderTop: "1px solid var(--border-bright)", gap: 24,
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)" }}>
                Assembled separately
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--gray-dim)", textDecoration: "line-through" }}>
                $32,000–$63,000/mo
              </span>
            </div>
          </div>
          <div style={{
            background: "var(--yellow-dim)", border: "1px solid rgba(245,200,66,0.3)",
            padding: "24px", marginTop: 16,
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--yellow)", marginBottom: 8 }}>
              Naaxtech Growth — Founding Rate
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "clamp(28px, 3vw, 40px)", color: "var(--white)", letterSpacing: "-0.02em" }}>
              $11,000<span style={{ fontSize: "0.45em", color: "var(--gray)", fontWeight: 400 }}>/mo</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--gray)", marginTop: 6 }}>
              Senior leadership + full execution team + AI-powered delivery. Day one.
              Often less than hiring one senior engineer.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-label">How it works</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 1, background: "var(--border)", border: "1px solid var(--border)", marginTop: 32,
          }}>
            {[
              { label: "Billing",        body: "Monthly subscription — not hourly, not per-task. One fee covers everything in scope." },
              { label: "Onboarding",     body: "Discovery sprint in Week 1. Execution starts Week 2. No ramp-up lag." },
              { label: "Communication",  body: "Dedicated Slack or Mattermost channel. You talk directly to the people doing the work." },
              { label: "Reporting",      body: "Weekly async updates + monthly strategy review. You always know what's in motion." },
              { label: "Payment",        body: "50% upfront on signing. Net-15 thereafter. Wire or Wise." },
              { label: "Ownership",      body: "You own your data, content, and accounts. We own the automation engine. You keep everything." },
            ].map((item) => (
              <div key={item.label} style={{ background: "var(--card)", padding: "24px 20px" }}>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "var(--yellow)", marginBottom: 8,
                }}>{item.label}</div>
                <p style={{ fontSize: 13, color: "var(--gray)", lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section id="apply" style={{ padding: "100px 0" }}>
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Apply</div>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 900,
              fontSize: "clamp(32px, 4.5vw, 56px)", lineHeight: 0.95,
              letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
              marginBottom: 16,
            }}>
              Let&apos;s Talk About<br />
              <span style={{ color: "var(--yellow)" }}>Your Business.</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
              One conversation. We&apos;ll tell you honestly if we&apos;re the right fit —
              and what execution would look like for your specific situation.
            </p>
          </div>

          <div className="partner-form-wrap">
            {status === "sent" ? (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                <h3>Message Received.</h3>
                <p>
                  You&apos;ll hear from us within 48 hours — directly, no automated replies,
                  no sales team in between.
                </p>
              </div>
            ) : !API_URL ? (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--yellow)", textTransform: "uppercase", marginBottom: 16 }}>
                  Form Setup Required
                </p>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.7 }}>
                  Set <code style={{ color: "var(--white)", background: "var(--surface)", padding: "2px 6px" }}>NEXT_PUBLIC_API_URL</code> in GitHub Secrets
                  and deploy <code style={{ color: "var(--white)", background: "var(--surface)", padding: "2px 6px" }}>api/</code> on Coolify to activate.
                </p>
                <div style={{ marginTop: 24 }}>
                  <a href="mailto:hello@naaxtech.com?subject=Partnership Inquiry" className="btn-primary" style={{ textDecoration: "none" }}>
                    Email Us Directly
                  </a>
                </div>
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
                <div className="form-field">
                  <label className="form-label" htmlFor="tier">Partnership Tier Interest *</label>
                  <select
                    className="form-select"
                    id="tier"
                    name="tier"
                    required
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    style={{ color: "var(--white)" }}
                  >
                    <option value="" disabled>Select a tier…</option>
                    <option value="launch">Launch — $6,000/mo founding ($8,000 standard)</option>
                    <option value="growth">Growth ★ — $11,000/mo founding ($15,000 standard)</option>
                    <option value="scale">Scale — $25,000/mo (founding rate on enquiry)</option>
                    <option value="unsure">Not sure yet — help me figure it out</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="message">Tell us about your business *</label>
                  <textarea
                    className="form-textarea"
                    id="message"
                    name="message"
                    required
                    placeholder="What are you building? What's your biggest operational or growth challenge right now? Are you funded or generating revenue?"
                    style={{ minHeight: 140 }}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="referral">How did you hear about us?</label>
                  <input className="form-input" id="referral" name="referral" type="text" placeholder="Referral, LinkedIn, search…" />
                </div>
                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#ff6b6b", letterSpacing: "0.08em" }}>
                    Something went wrong. Email us directly at hello@naaxtech.com
                  </p>
                )}
                <button type="submit" className="form-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send Your Application →"}
                </button>
                <p className="form-note">
                  We read every message personally. You&apos;ll hear back within 48 hours —
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
        <span className="footer-copy">© 2025 Naaxtech. Technology · Marketing · Innovation.</span>
        <ul className="footer-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="mailto:hello@naaxtech.com">hello@naaxtech.com</Link></li>
        </ul>
      </footer>
    </div>
  )
}
