"use client"

import { useEffect, useRef, useState } from "react"

const LAYERS = [
  { num: "LAYER 01", title: "Business Input", tag: "Goals → Requirements → Architecture" },
  { num: "LAYER 02", title: "Automation Core", tag: "Workflows · AI Agents · Integrations" },
  { num: "LAYER 03", title: "Delivery Layer", tag: "Apps · Dashboards · Customer Touchpoints" },
  { num: "LAYER 04", title: "Data & Infrastructure", tag: "Cloud · Database · Storage" },
  { num: "LAYER 05", title: "Monitoring", tag: "Uptime · Alerts · Performance" },
  { num: "OUTPUT", title: "Scaled Operations", tag: "Your business, running faster", accent: true },
]

function useCounter(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return value
}

export function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lanesRef = useRef<HTMLDivElement>(null)
  const [countersActive, setCountersActive] = useState(false)
  const [activeNode, setActiveNode] = useState(0)

  const c1 = useCounter(82, 1800, countersActive)
  const c2 = useCounter(14, 1600, countersActive)
  const c3 = useCounter(100, 1400, countersActive)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setCountersActive(true), 400)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const laneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            laneObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    const lanes = lanesRef.current?.querySelectorAll(".lane-card")
    lanes?.forEach((el) => laneObserver.observe(el))
    return () => laneObserver.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setActiveNode((n) => (n + 1) % LAYERS.length), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <div ref={lanesRef} style={{ display: "none" }} />

      <section id="proof" ref={sectionRef}>
        <div className="section-inner">
          <div className="proof-top">
            <div className="reveal">
              <div className="section-label">How It Works</div>
              <h2 className="proof-headline">A System, Not a Service.</h2>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="proof-desc">
                Every Naaxtech engagement runs through a purpose-built execution engine — automated workflows,
                dedicated tooling, and real-time oversight. You own the outcomes. We own the machine.
              </p>
            </div>
          </div>

          <div className="system-diagram reveal">
            <div className="sys-label">
              <span className="sys-dot" />
              NAAXTECH EXECUTION ENGINE — LIVE ARCHITECTURE
            </div>
            <div className="sys-flow">
              {LAYERS.map((layer, i) => (
                <div
                  key={i}
                  className={`sys-node${layer.accent ? " sys-node-accent" : ""}`}
                  style={
                    activeNode === i
                      ? { borderColor: "rgba(245,200,66,0.5)", background: "rgba(245,200,66,0.04)" }
                      : undefined
                  }
                >
                  <div
                    className="sys-node-num"
                    style={activeNode === i ? { color: "var(--yellow)" } : undefined}
                  >
                    {layer.num}
                  </div>
                  <div className="sys-node-title">{layer.title}</div>
                  <div className="sys-node-tag">{layer.tag}</div>
                </div>
              ))}
            </div>

            <div className="counter-strip">
              <div className="counter-cell">
                <div className="counter-val">{c1}<span className="unit">%</span></div>
                <div className="counter-lbl">Operations Time Recovered</div>
              </div>
              <div className="counter-cell">
                <div className="counter-val">{c2}<span className="unit">x</span></div>
                <div className="counter-lbl">Faster Than Hiring In-House</div>
              </div>
              <div className="counter-cell">
                <div className="counter-val">{c3}<span className="unit">%</span></div>
                <div className="counter-lbl">Delivery Ownership</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
