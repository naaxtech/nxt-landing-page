"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"
import { RippleLink } from "@/components/ui/ripple-link"
import { RevenueEngineeringVortex } from "@/components/ui/revenue-engineering-vortex"

const TAGS = [
  "Technology · Revenue Marketing · Innovation",
  "Systems that run it. Growth that compounds it.",
  "Subscribe to a team that builds and grows — not just delivers.",
]

export function HeroSection() {
  const [tagIdx, setTagIdx] = useState(0)
  const [tagVisible, setTagVisible] = useState(true)
  const [vortexEnabled, setVortexEnabled] = useState(true)

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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)")
    const apply = () => setVortexEnabled(!media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  return (
    <section id="hero">
      <RevenueEngineeringVortex
        enabled={vortexEnabled}
        text="REVENUE ENGINEERING"
        accentColor="#F5C842"
        dimColor="rgba(230, 230, 230, 0.42)"
        cellSize={12}
        density={0.56}
        followStrength={0.06}
      />

      <div className="hero-main">
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
          <span className="hero-line">
            <span className="hero-line-inner">
              <TextScramble text="BUILD" textClassName="scramble-heading" restCharClassName="text-white" bare />
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner">
              <TextScramble text="SMARTER" textClassName="scramble-heading" restCharClassName="hero-stroke-char" bare />
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner">
              <TextScramble text="SYSTEMS." textClassName="scramble-heading" restCharClassName="text-primary" bare />
            </span>
          </span>
        </h1>

        <p className="hero-sub">
          Naaxtech is your <strong>technology execution team</strong> — without the overhead of hiring one.
          We build the systems, drive the growth, and execute the strategy <strong>that makes your business compound</strong>.
        </p>

        <div className="hero-actions">
          <RippleLink href="/partner/" className="btn-primary">Become a Partner</RippleLink>
          <a href="#solution" className="btn-ghost">
            <span>See how it works</span>
            <span className="arrow" />
          </a>
        </div>
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
          <div className="metric-num">1<span>x</span> Partner</div>
          <div className="metric-label">Built-in, not bolted on</div>
        </div>
      </div>
    </section>
  )
}
