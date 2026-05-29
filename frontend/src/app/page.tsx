import Link from "next/link"
import { Nav } from "@/components/nav"
import { HeroSection } from "@/components/sections/hero"
import { ProofSection } from "@/components/sections/proof"
import { TextScramble } from "@/components/ui/text-scramble"

const PAIN_ITEMS = [
  "Manual processes consuming hours your team doesn't have",
  "Disconnected tools that don't speak to each other",
  "Software you're paying for but no one fully uses",
  "Operations that break down exactly when you scale",
  "No internal tech lead — and no budget to hire one full-time",
]

const LANES = [
  {
    num: "01",
    title: "AUTOMATION",
    desc: "Remove repetitive work. Let your team focus on decisions, not data entry.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "ERP SYSTEMS",
    desc: "Custom operational platforms built for your processes, not against them.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI SYSTEMS",
    desc: "Deploy intelligence where it compounds — not where it impresses.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "INFRASTRUCTURE",
    desc: "Cloud architecture and DevOps that doesn't collapse at 10× your current load.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
        <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
        <path d="M6 6h.01M6 18h.01"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "GROWTH SYSTEMS",
    desc: "CRM, marketing automation, and conversion infrastructure — built to compound.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-6 h-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
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
  return (
    <>
      <div className="grid-overlay" aria-hidden="true" />
      <Nav />
      <main className="relative z-10">

        {/* HERO */}
        <HeroSection />

        {/* PAIN */}
        <section id="pain" className="py-32 px-6 md:px-12 border-t border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="reveal">
              <div className="section-label">The Problem</div>
              <h2 className="section-headline mb-6">
                Your Business Runs on{" "}
                <span className="accent">Digital Duct Tape.</span>
              </h2>
              <p className="text-white/50 leading-relaxed">
                Most companies patch tools together, hire people to manage the gaps, and call it a system.
                It works — until it doesn't. Growth exposes every weak joint.
              </p>
            </div>
            <div className="reveal reveal-delay-2 flex flex-col gap-0 divide-y divide-border">
              {PAIN_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-5 py-5">
                  <span className="font-mono text-[10px] tracking-widest text-primary shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white/60 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="solution" className="py-32 px-6 md:px-12 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="reveal">
                <div className="section-label">How We Help</div>
                <h2 className="section-headline">
                  We Design Systems That{" "}
                  <span className="accent">Work Together.</span>
                </h2>
              </div>
              <p className="reveal reveal-delay-2 text-white/50 leading-relaxed self-end">
                Subscribe to a technology execution team instead of hiring employees.{" "}
                <strong className="text-white">One flat rate. Five execution lanes. Zero overhead.</strong>{" "}
                We sit between your business goals and the technical stack that delivers them.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border">
              {LANES.map((lane) => (
                <div
                  key={lane.num}
                  className="bg-background p-8 flex flex-col gap-6 group hover:bg-card transition-colors duration-300 reveal"
                >
                  <div className="font-mono text-[9px] tracking-widest text-white/25">
                    {lane.num} / LANE
                  </div>
                  <div className="text-white/40 group-hover:text-primary transition-colors">
                    {lane.icon}
                  </div>
                  <TextScramble text={lane.title} />
                  <p className="text-white/40 text-xs leading-relaxed">{lane.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROOF */}
        <ProofSection />

        {/* WHY US */}
        <section id="why" className="py-32 px-6 md:px-12 border-t border-border">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
            <div className="reveal">
              <div className="section-label">Why Naaxtech</div>
              <h2 className="section-headline mb-6">
                Technology is Easy.{" "}
                <span className="accent">Adoption</span> is Hard.
              </h2>
              <blockquote className="border-l-2 border-primary pl-6 text-white/50 leading-relaxed text-sm">
                We don&apos;t sell you software. We build the system that makes your business run — and we stay until it does.
                <br /><br />
                <strong className="text-white">Most tech companies talk about themselves. We track your outcomes.</strong>
              </blockquote>
            </div>
            <div className="reveal reveal-delay-2 flex flex-col gap-0 divide-y divide-border">
              {PILLARS.map((p) => (
                <div key={p.tag} className="flex items-start gap-5 py-6">
                  <span className="font-mono text-[9px] tracking-widest text-primary border border-primary/30 px-2 py-1 shrink-0 mt-0.5">
                    {p.tag}
                  </span>
                  <div>
                    <div className="font-sans font-bold text-sm text-white mb-1">{p.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="relative py-40 px-6 md:px-12 border-t border-border overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-sans font-black text-white/[0.03] leading-none"
              style={{ fontSize: "clamp(120px, 20vw, 260px)" }}
            >
              EXECUTE
            </span>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center reveal">
            <div className="section-label justify-center">Ready to fix this?</div>
            <h2 className="section-headline mb-6">
              Let&apos;s Remove the Bottlenecks Slowing You Down.
            </h2>
            <p className="text-white/50 leading-relaxed mb-10">
              One conversation. We&apos;ll map your biggest operational drag and show you what a fix looks like — no pitch, no fluff.
            </p>
            <div className="flex items-center justify-center gap-5">
              <Link
                href="#"
                className="inline-flex items-center px-8 py-4 bg-primary text-black font-mono text-[11px] font-bold tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
              >
                Book a Strategy Session
              </Link>
              <Link href="#" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors group">
                <span>Get a Systems Audit</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border px-12 py-8 flex items-center justify-between relative z-10">
        <Link href="/" className="font-mono text-[18px] font-black tracking-wider uppercase">
          <span className="text-white">NAAX</span>
          <span className="text-primary">TECH</span>
        </Link>
        <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
          © 2025 Naaxtech. Technology Execution Partner.
        </span>
        <ul className="flex items-center gap-8">
          {["Services", "Systems", "Contact"].map((label) => (
            <li key={label}>
              <Link href="#" className="font-mono text-[10px] tracking-widest uppercase text-white/40 hover:text-white transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </footer>
    </>
  )
}
