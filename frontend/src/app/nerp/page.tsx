"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { TextScramble } from "@/components/ui/text-scramble"
import { RippleLink } from "@/components/ui/ripple-link"

/** Product app — self-serve door (distinct from Partner sales). */
const NERP_APP = "https://nerp-shell.vercel.app"

const PROMISES = [
  {
    title: "One home for the business",
    body: "Invoices, bills, boards, and tools live under one login — so you stop hopping between five apps that don’t talk.",
  },
  {
    title: "Plain verbs, not jargon",
    body: "Make an invoice. Track a bill. Move a card. If your grandmother can’t follow the next step, we haven’t shipped it.",
  },
  {
    title: "Boopy keeps you moving",
    body: "A Disney-cute watch-blob with a serious job: celebrate wins, point at what’s next, and never shout ERP-speak at you.",
  },
  {
    title: "Built for how PH shops work",
    body: "Peso-first money, real business days, and workflows that fit owner-operators — not a finance department of twenty.",
  },
]

const APPS = [
  {
    name: "Docmaker",
    tag: "Get paid",
    blurb: "Beautiful invoices and receipts in plain language — ask for money without the fear.",
  },
  {
    name: "Boopy",
    tag: "Stay on top",
    blurb: "Bills and subscriptions with a mascot who nudges you before anything goes late.",
  },
  {
    name: "Noard",
    tag: "Stay organised",
    blurb: "A friendly board for work-in-progress — clear columns, calm cards, zero project-jargon fog.",
  },
  {
    name: "Connecty",
    tag: "Coming tools",
    blurb: "Tell us which tools you actually use. We queue them honestly — no fake “Connected” badges.",
  },
]

const STEPS = [
  { n: "01", title: "Open NERP", body: "Sign in once. Your business home is waiting — warm, clear, ready." },
  { n: "02", title: "Do one real job", body: "Make an invoice, track a bill, or park a to-do. Boopy points the way." },
  { n: "03", title: "Feel the lift", body: "Complex stays under the hood. You only see the next clear step." },
]

function BoopyMark({ size = 88 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      aria-hidden
      className="nerp-boopy-mark"
    >
      <defs>
        <radialGradient id="boopyBlob" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f7c8e8" />
          <stop offset="55%" stopColor="#f063b8" />
          <stop offset="100%" stopColor="#c6137f" />
        </radialGradient>
      </defs>
      <ellipse cx="44" cy="48" rx="30" ry="26" fill="url(#boopyBlob)" />
      <ellipse cx="44" cy="22" rx="14" ry="8" fill="#2a2438" />
      <rect x="30" y="18" width="28" height="10" rx="5" fill="#1e1b2e" />
      <circle cx="34" cy="20" r="2.2" fill="#8e73ff" />
      <circle cx="44" cy="20" r="2.2" fill="#ffe066" />
      <circle cx="54" cy="20" r="2.2" fill="#12b76a" />
      <circle cx="34" cy="46" r="4.5" fill="#1e1b2e" />
      <circle cx="54" cy="46" r="4.5" fill="#1e1b2e" />
      <circle cx="35.5" cy="44.5" r="1.4" fill="#fff" />
      <circle cx="55.5" cy="44.5" r="1.4" fill="#fff" />
      <path
        d="M36 56c3.5 4 12.5 4 16 0"
        fill="none"
        stroke="#1e1b2e"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function NerpPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) {
            el.target.classList.add("visible")
            observer.unobserve(el.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Nav />

      <main className="nerp-page">
        {/* Hero */}
        <section className="nerp-hero">
          <div className="section-inner nerp-hero-inner">
            <div className="reveal nerp-hero-copy">
              <div className="section-label">NERP · by Naaxtech</div>
              <h1 className="nerp-hero-title">
                Run your business like it’s{" "}
                <span className="accent">supposed to feel — easy.</span>
              </h1>
              <p className="nerp-hero-sub">
                NERP is the friendly ERP shell for Philippine owners: get paid,
                stay on top of bills, organise work, and keep moving — with{" "}
                <strong>Boopy</strong>, the watch-blob who makes the hard parts
                simple.
              </p>
              <div className="nerp-hero-actions">
                <RippleLink href={NERP_APP} className="btn-primary">
                  Start free in NERP →
                </RippleLink>
                <Link href="#how" className="btn-ghost">
                  <span>See how it works</span>
                  <span className="arrow" />
                </Link>
              </div>
              <p className="nerp-hero-note">
                Open the app. Finish one real job today. No sales call required.
              </p>
            </div>
            <div className="reveal nerp-hero-stage" aria-hidden>
              <div className="nerp-stage-card">
                <BoopyMark size={120} />
                <p className="nerp-stage-quote">
                  “One thing at a time — what should we do next?”
                </p>
                <span className="nerp-stage-by">— Boopy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Promises — outcome-led, no competitor framing */}
        <section className="nerp-contrast">
          <div className="section-inner reveal">
            <div className="section-label">What you get</div>
            <h2 className="nerp-h2">
              Software that works as hard as you do —
              <br />
              <span className="accent">without making you feel small.</span>
            </h2>
            <div className="nerp-promises-grid">
              {PROMISES.map((p) => (
                <article key={p.title} className="nerp-promise-card">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Apps */}
        <section className="nerp-apps" id="apps">
          <div className="section-inner">
            <div className="reveal">
              <div className="section-label">Inside the shell</div>
              <h2 className="nerp-h2">
                One home. Apps that mount when you need them.
              </h2>
            </div>
            <div className="nerp-apps-grid">
              {APPS.map((app) => (
                <article key={app.name} className="reveal nerp-app-card">
                  <span className="nerp-app-tag">{app.tag}</span>
                  <h3>{app.name}</h3>
                  <p>{app.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How */}
        <section className="nerp-how" id="how">
          <div className="section-inner reveal">
            <div className="section-label">How it feels</div>
            <h2 className="nerp-h2">Three steps. Zero intimidation.</h2>
            <ol className="nerp-steps">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="nerp-step-n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Boopy */}
        <section className="nerp-boopy">
          <div className="section-inner nerp-boopy-inner reveal">
            <BoopyMark size={96} />
            <div>
              <div className="section-label">Meet Boopy</div>
              <h2 className="nerp-h2">
                Cute on purpose.
                <br />
                <span className="accent">Serious about your business.</span>
              </h2>
              <p>
                Boopy is NERP’s guide — a Disney-cute watch-blob who celebrates
                wins, points at the next useful action, and keeps complex systems
                from shouting. If someone you love can follow it, we shipped it.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="nerp-cta">
          <div className="cta-bg-text" aria-hidden="true">
            SIMPLE
          </div>
          <div
            className="section-inner"
            style={{ textAlign: "center", position: "relative", zIndex: 1 }}
          >
            <div className="reveal">
              <div className="cta-label">Your next move</div>
              <h2 className="cta-headline">
                <TextScramble
                  text="Make business feel easy."
                  textClassName="cta-headline"
                  bare
                />
              </h2>
              <p className="cta-sub">
                Open NERP, say hi to Boopy, and finish one real job before lunch.
              </p>
              <div className="cta-actions">
                <RippleLink href={NERP_APP} className="btn-primary">
                  Start free in NERP
                </RippleLink>
                <Link href="/partner/" className="btn-ghost">
                  <span>Need a custom build instead?</span>
                  <span className="arrow" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <Link href="/" className="footer-logo">
          <span className="naax">NAAX</span>
          <span className="tech">TECH</span>
        </Link>
        <span className="footer-copy">© 2026 Naaxtech. Operations · Revenue · Growth.</span>
        <ul className="footer-links">
          <li>
            <Link href="/nerp/">NERP</Link>
          </li>
          <li>
            <Link href="/#solution">Services</Link>
          </li>
          <li>
            <Link href="/partner/">Partner With Us</Link>
          </li>
          <li>
            <a href="mailto:hello@naaxtech.com">Contact</a>
          </li>
        </ul>
      </footer>
    </>
  )
}
