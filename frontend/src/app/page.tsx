"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/sections/hero"
import { ProofSection } from "@/components/sections/proof"
import { TextScramble } from "@/components/ui/text-scramble"
import { RippleLink } from "@/components/ui/ripple-link"

const PAIN_ITEMS = [
  "Manual work consuming hours your team should be spending on the business",
  "Marketing spend with no clear line back to revenue",
  "Disconnected departments — teams, data, and tools that can't talk to each other",
  "Operations that break down exactly when you need to scale",
  "No single partner who understands both the technology and the growth side",
]

const LANES = [
  {
    num: "01 / LANE",
    title: "Automation",
    desc: "Remove the hours your team wastes on tasks a machine can handle.",
    expand: "We map every repetitive task your team runs — emails, approvals, reports, data entry — and replace them with automated workflows. If your team does it more than once a week, we automate it.",
    tags: ["Workflow Automation", "Custom Integrations", "Process Design"],
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    num: "02 / LANE",
    title: "Business Systems",
    desc: "Custom operational software built around how you actually work — not the other way around.",
    expand: "Off-the-shelf software forces your team to adapt. We build internal tools — inventory tracking, HR systems, project management, financial dashboards — mapped exactly to how your business runs. All connected, all yours.",
    tags: ["Custom Dashboards", "Operations Software", "System Integrations"],
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>,
  },
  {
    num: "03 / LANE",
    title: "AI Systems",
    desc: "Put AI where it earns its keep — inside your operations, not in a demo.",
    expand: "Automated decision-making, document processing, intelligent assistants, and smart routing built directly into your workflows. Systems that improve over time and pay back in hours recovered and errors eliminated.",
    tags: ["AI Assistants", "Document Automation", "Decision Systems"],
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  {
    num: "04 / LANE",
    title: "Infrastructure",
    desc: "Technology that stays fast and stable as your business grows.",
    expand: "We build for the scale you'll reach in 12 months, not just today. Server management, automated deployments, database optimization, and uptime monitoring — so your systems never become a bottleneck to growth.",
    tags: ["Cloud Hosting", "99.9% Uptime", "Auto-Scaling"],
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>,
  },
  {
    num: "05 / LANE",
    title: "Revenue Marketing",
    desc: "Marketing built as a system — every channel tracked, every dollar attributed.",
    expand: "We build the infrastructure that turns traffic into revenue — search visibility, conversion funnels, email sequences, and attribution pipelines. Every campaign has a measurable system behind it. No guesswork, no wasted spend.",
    tags: ["Lead Generation", "Conversion Funnels", "Revenue Attribution"],
    icon: <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
]

const PILLARS = [
  {
    tag: "Clarity",
    title: "Business-First Decisions",
    desc: "Every decision maps to a revenue or efficiency outcome. No technology for technology's sake.",
  },
  {
    tag: "Speed",
    title: "Execution Without Lag",
    desc: "We deploy in days, not quarters. Senior oversight from day one — so you don't scale wrong before we arrive.",
  },
  {
    tag: "Control",
    title: "You Own Everything",
    desc: "Your data, your content, your accounts — all yours. We own the execution engine. When you grow, the system grows with you.",
  },
  {
    tag: "Scale",
    title: "Built for What's Next",
    desc: "Infrastructure designed for 10× your current volume. The decisions you make today won't break you tomorrow.",
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
                We Build Systems That <span style={{ color: "var(--yellow)" }}>Work Together.</span>
              </h2>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="solution-desc">
                One partnership that handles systems, growth, and strategy — end to end.{" "}
                <strong>No agencies. No fragmented freelancers. No gap between your operations and your revenue.</strong>
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
                Good Systems <span className="accent">Don&apos;t</span> Happen by Accident.
              </h2>
              <blockquote className="why-quote">
                We don&apos;t sell software subscriptions or marketing campaigns. We build the full system —
                operations, growth, and strategy — that makes your business compound.
                <br /><br />
                <strong>Most vendors talk about their product. We measure your outcomes.</strong>
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

      {/* NERP PRODUCT TEASER */}
      <section id="nerp-teaser">
        <div className="section-inner">
          <div className="lab-teaser-inner reveal">
            <div className="section-label">Product</div>
            <h2 className="lab-teaser-headline">
              Meet NERP<br />
              <span className="accent">business that feels easy.</span>
            </h2>
            <p className="lab-teaser-sub">
              Our own ERP shell — guided by Boopy, the watch-blob with a big job.
              Self-serve for owners who want invoices, bills, and boards without the jargon.
            </p>
            <Link href="/nerp/" className="btn-primary">Explore NERP →</Link>
          </div>
        </div>
      </section>

      {/* LAB TEASER */}
      <section id="lab-teaser">
        <div className="section-inner">
          <div className="lab-teaser-inner reveal">
            <div className="section-label">The Lab</div>
            <h2 className="lab-teaser-headline">
              See the machine<br />
              <span className="accent">behind the work.</span>
            </h2>
            <p className="lab-teaser-sub">
              An interactive look at the systems we use to run operations, deploy AI, and grow revenue — live.
            </p>
            <Link href="/lab/" className="btn-primary">Explore The Lab →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="cta-bg-text" aria-hidden="true">EXECUTE</div>
        <div className="section-inner" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="reveal">
            <div className="cta-label">Ready to move?</div>
            <h2 className="cta-headline">Stop Patching. Start Compounding.</h2>
            <p className="cta-sub">
              One conversation. We&apos;ll map your biggest inefficiency — in operations, growth, or strategy —
              and show you exactly what closing it looks like.
            </p>
            <div className="cta-actions">
              <RippleLink href="/partner/" className="btn-primary">Become a Partner</RippleLink>
              <Link href="mailto:hello@naaxtech.com" className="btn-ghost">
                <span>Book a Free Strategy Call</span>
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
        <span className="footer-copy">© 2026 Naaxtech. Operations · Revenue · Growth.</span>
        <ul className="footer-links">
          <li><Link href="/#solution">Services</Link></li>
          <li><Link href="/#proof">How It Works</Link></li>
          <li><Link href="/partner/">Partner With Us</Link></li>
          <li><a href="mailto:hello@naaxtech.com">Contact</a></li>
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
    </>
  )
}
