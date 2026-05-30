"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { RippleLink } from "@/components/ui/ripple-link"

// ─── Set NEXT_PUBLIC_FORMSPREE_ID in your environment ───────────────────────
// 1. Go to formspree.io → create a free account → New Form
// 2. Set notification email: naaxtech.official@gmail.com
//    (add naaxtech.marketing@gmail.com as CC in Form Settings → Notifications)
// 3. Copy your Form ID and set NEXT_PUBLIC_FORMSPREE_ID=your_id
//    in GitHub repo → Settings → Secrets → Actions → New repository secret
//    then redeploy. Until then the form shows a setup message.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID

const TIERS = [
  {
    id: "launch",
    name: "Launch Partner",
    regular: 8000,
    founding: 6000,
    save: 2000,
    saveLabel: "Save $2,000/mo",
    commitment: "3-month minimum",
    best: "Funded founders building from zero",
    features: [
      "Nicole (CTO) + Jo (CMO) oversight, always",
      "2 dedicated execution specialists",
      "AI tooling stack (Claude, Cursor, n8n)",
      "Automation infrastructure — foundation build",
      "Marketing strategy + GTM launch",
      "MVP / core product build",
      "Core workflow automation",
      "Monthly strategy sessions",
      "Dedicated Slack / Mattermost channel",
    ],
  },
  {
    id: "growth",
    name: "Growth Partner",
    regular: 15000,
    founding: 11000,
    save: 4000,
    saveLabel: "Save $4,000/mo",
    commitment: "6-month minimum",
    best: "Profitable operators scaling revenue & ops",
    featured: true,
    features: [
      "Nicole (CTO) + Jo (CMO) oversight, always",
      "3–4 dedicated execution specialists",
      "AI tooling stack (Claude, Cursor, n8n)",
      "Automation infrastructure — full build",
      "Accelerated marketing engine",
      "Scaling product build",
      "Full operational layer automation",
      "Priority execution queue",
      "Bi-weekly strategy sessions",
      "Dedicated Slack / Mattermost channel",
    ],
  },
  {
    id: "scale",
    name: "Scale Partner",
    regular: 25000,
    founding: null,
    save: null,
    saveLabel: null,
    commitment: "12-month minimum",
    best: "Funded scale-ups and multi-channel brands",
    features: [
      "Nicole (CTO) + Jo (CMO) oversight, always",
      "5+ specialists — full execution pod",
      "AI tooling stack (Claude, Cursor, n8n)",
      "Enterprise-grade automation infrastructure",
      "Multi-channel growth engine",
      "Full architecture + platform build",
      "End-to-end operations systems",
      "Fastest execution priority",
      "Weekly sessions + quarterly intensive",
      "Dedicated Slack / Mattermost channel",
    ],
  },
]

const INCLUSIONS = [
  { feature: "CTO oversight (Nicole)", launch: true, growth: true, scale: true },
  { feature: "CMO oversight (Jo)", launch: true, growth: true, scale: true },
  { feature: "Dedicated specialists", launch: "2", growth: "3–4", scale: "5+" },
  { feature: "AI tooling stack", launch: true, growth: true, scale: true },
  { feature: "Automation infrastructure", launch: "Foundation", growth: "Full build", scale: "Enterprise" },
  { feature: "Marketing execution", launch: "GTM launch", growth: "Accelerated engine", scale: "Multi-channel" },
  { feature: "Tech build", launch: "MVP / core", growth: "Scaling build", scale: "Full architecture" },
  { feature: "Strategy sessions", launch: "Monthly", growth: "Bi-weekly", scale: "Weekly + intensive" },
  { feature: "Execution priority", launch: "Standard", growth: "Priority", scale: "Fastest" },
  { feature: "Dedicated channel", launch: true, growth: true, scale: true },
]

const VALUE_COMPARISON = [
  { component: "Fractional CTO (monthly retainer)", cost: "$8,000–$15,000/mo" },
  { component: "Fractional CMO (monthly retainer)", cost: "$8,000–$15,000/mo" },
  { component: "2–4 dedicated specialists", cost: "$9,000–$13,000/mo" },
  { component: "AI & automation stack + management", cost: "$2,000–$5,000/mo" },
  { component: "Continuous product build", cost: "$5,000–$15,000/mo" },
]

function InclusionCell({ val }: { val: boolean | string }) {
  if (val === true) return <span className="check">✓</span>
  if (val === false) return <span className="dash">—</span>
  return <span style={{ color: "var(--white)", fontSize: 12 }}>{val}</span>
}

export default function PartnerPage() {
  const [selectedTier, setSelectedTier] = useState("growth")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!FORMSPREE_ID) return

    setStatus("sending")
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `Partnership Inquiry — ${data.name} | ${data.company}`,
          _cc: "naaxtech.marketing@gmail.com",
        }),
      })
      setStatus(res.ok ? "sent" : "error")
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
              We&apos;re opening three founding partnerships at locked rates — for the businesses
              that help shape what Naaxtech becomes. You don&apos;t get a discount. You get
              a co-founder team on day one, locked in for 24 months.
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

      {/* ── WHAT MAKES FOUNDING PARTNERS DIFFERENT ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-label">Founding Partner Benefits</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1, background: "var(--border)", border: "1px solid var(--border)",
            marginTop: 32,
          }}>
            {[
              { label: "Rate Lock", body: "Your founding rate stays fixed for the full 24 months — no increases, no renegotiation." },
              { label: "25–27% Off", body: "Founding rates are $6,000/mo (Launch) and $11,000/mo (Growth). Locked. Forever." },
              { label: "Direct Access", body: "Nicole and Jo are in your channel. Not account managers. Co-founders." },
              { label: "Founding Badge", body: "Recognised as a founding partner in our case studies and future positioning." },
              { label: "AI First", body: "Priority access to new AI capabilities and tooling as we build them — before general release." },
              { label: "Shape the Engine", body: "Your feedback shapes how we build. Founding partners influence the product roadmap." },
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

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "100px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div className="section-label">Partnership Investment</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(32px, 4vw, 52px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
          }}>
            Founding Rates.<br />
            <span style={{ color: "var(--yellow)" }}>Locked for 24 Months.</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--gray)", lineHeight: 1.75, maxWidth: 520, marginTop: 20 }}>
            Regular pricing after founding slots close. These rates reflect the early relationship —
            not a discount on the value. You get the full team either way.
          </p>

          <div className="pricing-grid">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`pricing-card${tier.featured ? " featured" : ""}`}>
                <div>
                  <div className="pricing-tier-name">{tier.name}</div>
                  {tier.founding ? (
                    <>
                      <div className="pricing-regular">${tier.regular.toLocaleString()}/mo regular</div>
                      <div className="pricing-amount">
                        <span className="currency">$</span>
                        {tier.founding.toLocaleString()}
                        <span className="period">/mo</span>
                      </div>
                      <div className="pricing-save">{tier.saveLabel} · Locked 24 months</div>
                    </>
                  ) : (
                    <>
                      <div className="pricing-amount">
                        <span className="currency">$</span>
                        {tier.regular.toLocaleString()}
                        <span className="period">/mo</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginTop: 4 }}>
                        Custom founding rate — enquire
                      </div>
                    </>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gray)", letterSpacing: "0.05em" }}>
                  Best for: {tier.best}
                </div>
                <div className="pricing-features">
                  {tier.features.map((f) => (
                    <div key={f} className="pricing-feature">{f}</div>
                  ))}
                </div>
                <div className="pricing-commitment">{tier.commitment}</div>
                <div className="pricing-cta-wrap">
                  <button
                    className="btn-primary"
                    style={{ width: "100%", cursor: "pointer", border: "none", textAlign: "center" }}
                    onClick={() => {
                      setSelectedTier(tier.id)
                      document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Apply — {tier.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUSIONS TABLE ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="section-inner">
          <div className="section-label">What&apos;s Included</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
          }}>
            Everything. Built in.
          </h2>
          <div style={{ overflowX: "auto", marginTop: 32 }}>
            <table className="inclusions-table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Included in every engagement</th>
                  <th>Launch</th>
                  <th style={{ color: "var(--yellow)" }}>Growth ★</th>
                  <th>Scale</th>
                </tr>
              </thead>
              <tbody>
                {INCLUSIONS.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td><InclusionCell val={row.launch} /></td>
                    <td><InclusionCell val={row.growth} /></td>
                    <td><InclusionCell val={row.scale} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            marginTop: 32, padding: "20px 24px",
            border: "1px solid var(--border)", background: "var(--card)",
            fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em",
            color: "var(--gray)",
          }}>
            NOT included (billed at cost, client owns accounts): third-party SaaS subscriptions
            · cloud & hosting · paid advertising budget · hardware · legal / compliance
          </div>
        </div>
      </section>

      {/* ── VALUE COMPARISON ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner" style={{ maxWidth: 800 }}>
          <div className="section-label">The Math</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 900,
            fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 0.95,
            letterSpacing: "-0.02em", textTransform: "uppercase", color: "var(--white)",
            marginBottom: 8,
          }}>
            What This Costs If You Assemble It Yourself.
          </h2>
          <p style={{ fontSize: 14, color: "var(--gray)", marginBottom: 40 }}>
            Market rates, 2026. Sources: Glassdoor, AlgoCentric, UX Continuum, Enrich Labs.
          </p>
          <div style={{ border: "1px solid var(--border)" }}>
            {VALUE_COMPARISON.map((row, i) => (
              <div key={i} className="value-row" style={{ padding: "16px 24px" }}>
                <span className="value-label">{row.component}</span>
                <span className="value-cost">{row.cost}</span>
              </div>
            ))}
            <div className="value-row" style={{
              padding: "16px 24px",
              background: "rgba(255,255,255,0.03)",
              borderTop: "1px solid var(--border-bright)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)" }}>
                Assembled separately
              </span>
              <span className="value-cost" style={{ color: "var(--gray-dim)", textDecoration: "line-through" }}>
                $32,000–$63,000/mo
              </span>
            </div>
          </div>
          <div className="value-highlight" style={{ marginTop: 16 }}>
            <div className="label">Naaxtech Growth Partner (Founding Rate)</div>
            <div className="amount">$11,000<span style={{ fontSize: "0.45em", color: "var(--gray)", fontWeight: 400 }}>/mo</span></div>
            <div className="note">
              CTO + CMO + team + AI stack. Day one. AI-accelerated delivery means we move faster than
              any assembled team — and cost less than one senior hire.
            </div>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT MODEL ── */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="section-inner">
          <div className="section-label">How It Works</div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 1, background: "var(--border)", border: "1px solid var(--border)", marginTop: 32,
          }}>
            {[
              { label: "Billing", body: "Monthly subscription. Not hourly, not per-task. One fee covers everything in scope." },
              { label: "Onboarding", body: "Discovery sprint in Week 1. Continuous execution from Week 2. No ramp-up lag." },
              { label: "Communication", body: "Dedicated Slack or Mattermost channel. You talk directly to the people doing the work." },
              { label: "Reporting", body: "Weekly async updates + monthly strategy review. You always know what's happening." },
              { label: "Payment", body: "50% of first month upfront on signing. Net-15 thereafter. Wire or Wise." },
              { label: "Ownership", body: "You own your data, content, and accounts. We own the automation engine. You keep everything." },
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
                  Nicole or Jo will be in touch within 48 hours. We read every inquiry personally —
                  no automated replies, no sales team.
                </p>
              </div>
            ) : !FORMSPREE_ID ? (
              <div style={{ textAlign: "center", padding: "48px 24px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", color: "var(--yellow)", textTransform: "uppercase", marginBottom: 16 }}>Form Setup Required</p>
                <p style={{ color: "var(--gray)", fontSize: 14, lineHeight: 1.7 }}>
                  Set <code style={{ color: "var(--white)", background: "var(--surface)", padding: "2px 6px" }}>NEXT_PUBLIC_FORMSPREE_ID</code> in your environment
                  to activate this form. See comment in <code style={{ color: "var(--white)", background: "var(--surface)", padding: "2px 6px" }}>partner/page.tsx</code> for setup instructions.
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
                    <option value="launch">Launch Partner — $6,000/mo founding ($8,000 regular)</option>
                    <option value="growth">Growth Partner ★ — $11,000/mo founding ($15,000 regular)</option>
                    <option value="scale">Scale Partner — $25,000/mo (founding rate on enquiry)</option>
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
                  We read every message personally. Nicole or Jo replies within 48 hours.
                  No sales team. No pitch decks until you ask.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link href="/" className="footer-logo">
          <span className="naax">NAAX</span><span className="tech">TECH</span>
        </Link>
        <span className="footer-copy">© 2025 Naaxtech. Technology · Marketing · Innovation.</span>
        <ul className="footer-links">
          <li><Link href="/">Landing</Link></li>
          <li><Link href="mailto:hello@naaxtech.com">hello@naaxtech.com</Link></li>
        </ul>
      </footer>
    </div>
  )
}
