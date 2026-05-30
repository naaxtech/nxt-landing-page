"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const TAGS = [
  "Technology Execution Partner  ·  Est. Philippines",
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
    <section id="hero">
      <div className="corner-bracket" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <path d="M40 0 L0 0 L0 40" stroke="#F5C842" strokeWidth="1" opacity="0.6"/>
          <path d="M160 0 L200 0 L200 40" stroke="#F5C842" strokeWidth="1" opacity="0.6"/>
          <path d="M40 200 L0 200 L0 160" stroke="#F5C842" strokeWidth="1" opacity="0.6"/>
          <path d="M160 200 L200 200 L200 160" stroke="#F5C842" strokeWidth="1" opacity="0.6"/>
          <circle cx="100" cy="100" r="40" stroke="rgba(245,200,66,0.15)" strokeWidth="0.5" strokeDasharray="4 4"/>
          <circle cx="100" cy="100" r="70" stroke="rgba(245,200,66,0.07)" strokeWidth="0.5" strokeDasharray="2 6"/>
          <circle cx="100" cy="100" r="4" fill="#F5C842" opacity="0.8"/>
        </svg>
      </div>

      <div
        className="hero-tag"
        style={{
          opacity: tagVisible ? undefined : 0,
          transform: tagVisible ? undefined : "translateY(8px)",
          transition: "opacity 0.4s, transform 0.4s",
        }}
      >
        {TAGS[tagIdx]}
      </div>

      <h1 className="hero-headline">
        <span className="hero-line"><span className="hero-line-inner hl-white">BUILD</span></span>
        <span className="hero-line"><span className="hero-line-inner hl-stroke">SMARTER</span></span>
        <span className="hero-line"><span className="hero-line-inner hl-yellow">SYSTEMS.</span></span>
      </h1>

      <p className="hero-sub">
        Naaxtech is your <strong>technology execution team</strong> — without the overhead of hiring one.
        We automate operations, integrate platforms, and build infrastructure <strong>that actually scales</strong>.
      </p>

      <div className="hero-actions">
        <Link href="#cta" className="btn-primary">Book a Strategy Call</Link>
        <Link href="#solution" className="btn-ghost">
          <span>See how it works</span>
          <span className="arrow" />
        </Link>
      </div>

      <div className="hero-metrics">
        <div className="metric-item">
          <div className="metric-num"><span>5</span> Lanes</div>
          <div className="metric-label">Execution disciplines</div>
        </div>
        <div className="metric-divider" />
        <div className="metric-item">
          <div className="metric-num">1<span>x</span> Flat Rate</div>
          <div className="metric-label">Subscription model</div>
        </div>
        <div className="metric-divider" />
        <div className="metric-item">
          <div className="metric-num"><span>∞</span> Scale</div>
          <div className="metric-label">Built for growth</div>
        </div>
        <div className="metric-divider" />
        <div className="metric-item">
          <div className="metric-num">0<span>x</span> Agency</div>
          <div className="metric-label">We&apos;re your tech partner</div>
        </div>
      </div>
    </section>
  )
}
