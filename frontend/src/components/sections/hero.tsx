"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"
import { RippleLink } from "@/components/ui/ripple-link"

const TAGS = [
  "Operations · Revenue · Growth",
  "Your team, without the payroll.",
  "Systems that run. Revenue that compounds.",
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
          <path d="M40 0 L0 0 L0 40" stroke="#F5C842" strokeWidth="1" opacity="0.6" />
          <path d="M160 0 L200 0 L200 40" stroke="#F5C842" strokeWidth="1" opacity="0.6" />
          <path d="M40 200 L0 200 L0 160" stroke="#F5C842" strokeWidth="1" opacity="0.6" />
          <path d="M160 200 L200 200 L200 160" stroke="#F5C842" strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="100" r="40" stroke="rgba(245,200,66,0.15)" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" stroke="rgba(245,200,66,0.07)" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="4" fill="#F5C842" opacity="0.8" />
        </svg>
      </div>

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
          Naaxtech is your <strong>dedicated execution team</strong> — without the cost of building one.
          We streamline your operations, grow your revenue, and <strong>make every part of your business work together</strong>.
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
          <div className="metric-num"><span>5</span> Disciplines</div>
          <div className="metric-label">Operations to revenue</div>
        </div>
        <div className="metric-divider" />
        <div className="metric-item">
          <div className="metric-num">1<span>x</span> Flat Rate</div>
          <div className="metric-label">One subscription, everything</div>
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
