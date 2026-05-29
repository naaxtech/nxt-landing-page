"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const TAGS = [
  "Technology Execution Partner · Est. Philippines",
  "Automation · ERP · AI · Infrastructure · Growth",
  "Subscribe to a tech team. Not employees.",
]

export function HeroSection() {
  const [tagIdx, setTagIdx] = useState(0)
  const [tagVisible, setTagVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setTagVisible(false)
      setTimeout(() => {
        setTagIdx((i) => (i + 1) % TAGS.length)
        setTagVisible(true)
      }, 320)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-12 pt-32 pb-20 z-10 overflow-hidden">
      {/* Corner brackets */}
      <div className="absolute inset-6 pointer-events-none" aria-hidden="true">
        <svg className="absolute top-0 left-0 w-24 h-24 opacity-60" viewBox="0 0 80 80" fill="none">
          <path d="M20 0 L0 0 L0 20" stroke="#F5C842" strokeWidth="1"/>
          <path d="M60 0 L80 0 L80 20" stroke="#F5C842" strokeWidth="1"/>
          <path d="M20 80 L0 80 L0 60" stroke="#F5C842" strokeWidth="1"/>
          <path d="M60 80 L80 80 L80 60" stroke="#F5C842" strokeWidth="1"/>
        </svg>
      </div>

      {/* Hero tag */}
      <div
        className="font-mono text-[11px] tracking-[0.18em] text-primary uppercase mb-8 flex items-center gap-3 transition-all duration-300"
        style={{ opacity: tagVisible ? 1 : 0, transform: tagVisible ? "translateY(0)" : "translateY(8px)" }}
      >
        <span className="block w-8 h-px bg-primary shrink-0" />
        {TAGS[tagIdx]}
      </div>

      {/* Headline */}
      <h1 className="font-sans font-black leading-[0.92] tracking-[-0.02em] uppercase max-w-4xl mb-8"
          style={{ fontSize: "clamp(64px, 10vw, 120px)" }}>
        <span className="block overflow-hidden">
          <span className="block animate-slide-up" style={{ animationDelay: "0.1s" }}>
            BUILD
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="block animate-slide-up hero-stroke" style={{ animationDelay: "0.2s" }}>
            SMARTER
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="block animate-slide-up text-primary" style={{ animationDelay: "0.3s" }}>
            SYSTEMS.
          </span>
        </span>
      </h1>

      {/* Subtext */}
      <p className="max-w-xl text-base text-white/60 leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: "0.5s" }}>
        Naaxtech is your <strong className="text-white">technology execution team</strong> — without the overhead of hiring one.
        We automate operations, integrate platforms, and build infrastructure{" "}
        <strong className="text-white">that actually scales</strong>.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-5 mb-20 animate-fade-up" style={{ animationDelay: "0.65s" }}>
        <Link
          href="#cta"
          className="inline-flex items-center px-6 py-3 bg-primary text-black font-mono text-[11px] font-bold tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
        >
          Book a Strategy Call
        </Link>
        <Link href="#solution" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] uppercase text-white/50 hover:text-white transition-colors group">
          <span>See how it works</span>
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Metrics strip */}
      <div className="flex items-center gap-0 border-t border-border pt-8 animate-fade-up" style={{ animationDelay: "0.75s" }}>
        {[
          { num: "5", unit: "", label: "Execution disciplines", suffix: " Lanes" },
          { num: "1", unit: "x", label: "Subscription model", suffix: " Flat Rate" },
          { num: "∞", unit: "", label: "Built for growth", suffix: " Scale" },
          { num: "0", unit: "x", label: "We're your tech partner", suffix: " Agency" },
        ].map((m, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && <div className="w-px h-8 bg-border mx-8 shrink-0" />}
            <div>
              <div className="font-mono text-xl font-bold text-white">
                <span className="text-primary">{m.num}</span>{m.unit}{m.suffix}
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-0.5">{m.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
