"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/sections/hero"
import { ProofSection } from "@/components/sections/proof"

const PAIN_ITEMS = [
  "Manual processes consuming hours your team doesn't have",
  "Disconnected tools that don't speak to each other",
  "Software you're paying for but no one fully uses",
  "Operations that break down exactly when you scale",
  "No internal tech lead — and no budget to hire one full-time",
]

const LANES = [
  {
    num: "01 / LANE",
    title: "Automation",
    desc: "Remove repetitive work. Let your team focus on decisions, not data entry.",
    expand: "We map every repetitive task your team runs — emails, data syncs, reporting, approvals — and replace them with automated workflows. If your team does it more than once a week, we automate it.",
    tags: ["n8n", "Zapier", "Make", "Custom APIs"],
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    num: "02 / LANE",
    title: "ERP Systems",
    desc: "Custom operational platforms built for your processes, not against them.",
    expand: "Off-the-shelf software forces your team to adapt. We build internal tools — inventory, HR, project tracking, finance — mapped to how your business actually runs. All connected, all yours.",
    tags: ["Supabase", "Custom Dashboards", "API Integrations"],
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
  },
  {
    num: "03 / LANE",
    title: "AI Systems",
    desc: "Deploy intelligence where it compounds — not where it impresses.",
    expand: "AI agents, document processing, intelligent routing, and decision automation. We pick the right model for each task and build systems that improve with use — not demos that impress once.",
    tags: ["Claude", "GPT-4", "LangGraph", "RAG"],
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  {
    num: "04 / LANE",
    title: "Infrastructure",
    desc: "Cloud architecture and DevOps that doesn't collapse at 10× your current load.",
    expand: "We architect for the load you'll have in 12 months — not just today. VPS management, Docker deployments, CI/CD pipelines, database optimization, and uptime monitoring. Built to stay fast.",
    tags: ["Railway", "Vercel", "Docker", "GitHub Actions"],
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>,
  },
  {
    num: "05 / LANE",
    title: "Growth Systems",
    desc: "CRM, marketing automation, and conversion infrastructure — built to compound.",
    expand: "Lead capture, nurture sequences, CRM setup, analytics pipelines, and attribution tracking. We build growth infrastructure where every system feeds the next — your pipeline scales without adding headcount.",
    tags: ["HubSpot", "Klaviyo", "PostHog", "Custom CRM"],
    icon: <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
]

const PILLARS = [
  {
    tag: "Clarity",
    title: "Business-First Architecture",
    desc: "Every technical decision maps to a revenue or efficiency outcome. No bloated solutions built to impress your CTO.",
  },
  {
    tag: "Speed",
    title: "Execution Without Lag",
    desc: "We deploy in days, not quarters. Architect oversight from day one — not after you've already scaled wrong.",
  },
  {
    tag: "Control",
    title: "You Own the Outcomes",
    desc: "You own your data, your content, your accounts. Naaxtech owns the automation engine. When you grow, the system grows with you.",
  },
  {
    tag: "Scale",
    title: "Built for What's Next",
    desc: "Infrastructure designed for 10× your current load. So the systems you build today don't break tomorrow.",
  },
]

export default function Home() {
  const [expandedLane, setExpandedLane] = useState<number | null>(null)

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
    document.querySelectorAll(".lane-card").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="scanline" />
      <div className="grid-overlay" />
      <Nav />

      <HeroSection />

      {/* PAIN */}
      <section id="pain">
        <div className="section-inner">
          <div className="pain-grid">
            <div className="reveal">
              <div className="section-label">The Problem</div>
              <h2 className="pain-headline">
                Your Business Runs on <span className="accent">Digital Duct Tape.</span>
              </h2>
              <p className="pain-body">
                Most companies patch tools together, hire people to manage the gaps, and call it a system.
                It works — until it doesn&apos;t. Growth exposes every weak joint.
              </p>
            </div>
            <div className="pain-items reveal reveal-delay-2">
              {PAIN_ITEMS.map((item, i) => (
                <div key={i} className="pain-item">
                  <span className="pain-item-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pain-item-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section id="solution">
        <div className="section-inner">
          <div className="solution-top">
            <div className="reveal">
              <div className="section-label">How We Help</div>
              <h2 className="solution-headline">
                We Design Systems That <span style={{ color: "var(--yellow)" }}>Work Together.</span>
              </h2>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="solution-desc">
                Subscribe to a technology execution team instead of hiring employees.{" "}
                <strong>One flat rate. Five execution lanes. Zero overhead.</strong>{" "}
                We sit between your business goals and the technical stack that delivers them.
              </p>
            </div>
          </div>

          <div className="lanes-grid">
            {LANES.map((lane, i) => (
              <div
                key={lane.num}
                className={`lane-card${expandedLane === i ? " expanded" : ""}`}
                onMouseEnter={() => setExpandedLane(i)}
                onClick={() => setExpandedLane(expandedLane === i ? null : i)}
              >
                <div className="lane-num">{lane.num}</div>
                <div className="lane-icon">{lane.icon}</div>
                <div className="lane-title">{lane.title}</div>
                <div className="lane-desc">{lane.desc}</div>
                <div className="lane-expand">
                  <div className="lane-expand-inner">
                    <div className="lane-expand-content">
                      <p className="lane-expand-body">{lane.expand}</p>
                      <div className="lane-tags">
                        {lane.tags.map((t) => (
                          <span key={t} className="lane-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <ProofSection />

      {/* WHY US */}
      <section id="why">
        <div className="section-inner">
          <div className="why-grid">
            <div className="reveal">
              <div className="section-label">Why Naaxtech</div>
              <h2 className="why-headline">
                Technology is Easy. <span className="accent">Adoption</span> is Hard.
              </h2>
              <blockquote className="why-quote">
                We don&apos;t sell you software. We build the system that makes your business run — and we stay until it does.
                <br /><br />
                <strong>Most tech companies talk about themselves. We track your outcomes.</strong>
              </blockquote>
            </div>
            <div className="why-pillars reveal reveal-delay-2">
              {PILLARS.map((p) => (
                <div key={p.tag} className="pillar">
                  <div className="pillar-tag">{p.tag}</div>
                  <div>
                    <div className="pillar-title">{p.title}</div>
                    <div className="pillar-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-bg-text" aria-hidden="true">EXECUTE</div>
        <div className="section-inner" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="reveal">
            <div className="cta-label">Ready to fix this?</div>
            <h2 className="cta-headline">Let&apos;s Remove the Bottlenecks Slowing You Down.</h2>
            <p className="cta-sub">
              One conversation. We&apos;ll map your biggest operational drag and show you what a fix looks like — no pitch, no fluff.
            </p>
            <div className="cta-actions">
              <Link href="mailto:hello@naaxtech.com" className="btn-primary">Book a Strategy Session</Link>
              <Link href="mailto:hello@naaxtech.com" className="btn-ghost">
                <span>Get a Systems Audit</span>
                <span className="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Link href="/" className="footer-logo">
          <span className="naax">NAAX</span><span className="tech">TECH</span>
        </Link>
        <span className="footer-copy">© 2025 Naaxtech. Technology Execution Partner.</span>
        <ul className="footer-links">
          <li><Link href="#">Services</Link></li>
          <li><Link href="#">Systems</Link></li>
          <li><Link href="#">Contact</Link></li>
        </ul>
      </footer>
    </>
  )
}
