"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/sections/hero"
import { ProofSection } from "@/components/sections/proof"
import { TextScramble } from "@/components/ui/text-scramble"

const PAIN_ITEMS = [
  "Manual processes consuming hours your team doesn't have",
  "Marketing spend with no clear line back to revenue",
  "Disconnected ops and marketing — systems that can't talk to each other",
  "Operations that break down exactly when you scale",
  "No one person who understands both the technology and the growth",
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
    title: "Revenue Marketing",
    desc: "Marketing that's built by engineers, not bolted on by marketers. Funnels, attribution, and retention infrastructure that compounds.",
    expand: "We build the systems that turn traffic into revenue — SEO infrastructure, conversion funnels, email automation, attribution pipelines, and retention sequences. Marketing strategy applied through tech, not guesswork. Every campaign has a system behind it.",
    tags: ["SEO Infrastructure", "Conversion Funnels", "Email Automation", "Attribution"],
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
    desc: "You own your data, your content, your accounts. Naaxtech owns the execution engine. When you grow, the system grows with you.",
  },
  {
    tag: "Scale",
    title: "Built for What's Next",
    desc: "Infrastructure designed for 10× your current load. So the systems you build today don't break tomorrow.",
  },
]

export default function Home() {
  const [expandedLane, setExpandedLane] = useState<number | null>(null)
  const [visibleLanes, setVisibleLanes] = useState<boolean[]>(Array(LANES.length).fill(false))
  const laneRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((el) => {
          if (el.isIntersecting) { el.target.classList.add("visible"); observer.unobserve(el.target) }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = laneRefs.current.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) {
              setVisibleLanes((prev) => { const next = [...prev]; next[idx] = true; return next })
              observer.unobserve(entry.target)
            }
          }
        })
      },
      { threshold: 0.12 }
    )
    laneRefs.current.forEach((el) => { if (el) observer.observe(el) })
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
                Your Business Runs on{" "}
                <TextScramble
                  text="DIGITAL DUCT TAPE."
                  textClassName="scramble-heading"
                  restCharClassName="text-primary"
                  bare
                  className="align-middle"
                />
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
                We Design Systems That{" "}
                <TextScramble
                  text="WORK TOGETHER."
                  textClassName="scramble-heading"
                  restCharClassName="text-primary"
                  bare
                  className="align-middle"
                />
              </h2>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="solution-desc">
                Subscribe to a team that builds systems, drives growth, and executes strategy — under one partnership.{" "}
                <strong>No agencies. No fragmented freelancers. No gaps between your tech and your revenue.</strong>
              </p>
            </div>
          </div>

          <div className="lanes-grid">
            {LANES.map((lane, i) => (
              <div
                key={lane.num}
                ref={(el) => { laneRefs.current[i] = el }}
                className={[
                  "lane-card",
                  visibleLanes[i] ? "visible" : "",
                  expandedLane === i ? "expanded" : "",
                ].filter(Boolean).join(" ")}
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
                Technology is Easy.{" "}
                <TextScramble
                  text="ADOPTION"
                  textClassName="scramble-heading"
                  restCharClassName="text-primary"
                  bare
                  className="align-middle"
                />{" "}
                is Hard.
              </h2>
              <blockquote className="why-quote">
                We don&apos;t sell software or marketing plans. We build the full system — tech, growth, and strategy —
                that makes your business compound.
                <br /><br />
                <strong>Most partners talk about themselves. We track your outcomes.</strong>
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
            <h2 className="cta-headline">Let&apos;s Build What Actually Grows You.</h2>
            <p className="cta-sub">
              One conversation. We&apos;ll map your biggest gap — in operations, growth, or strategy —
              and show you exactly what closing it looks like.
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
        <span className="footer-copy">© 2025 Naaxtech. Technology · Marketing · Innovation.</span>
        <ul className="footer-links">
          <li><Link href="#">Services</Link></li>
          <li><Link href="#">Systems</Link></li>
          <li><Link href="#">Contact</Link></li>
        </ul>
      </footer>
    </>
  )
}
