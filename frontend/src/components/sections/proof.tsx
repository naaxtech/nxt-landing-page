"use client"

import { useEffect, useRef, useState } from "react"

const LAYERS = [
  { num: "LAYER 01", title: "Business Input", tag: "Goals → Requirements → Architecture" },
  { num: "LAYER 02", title: "Automation Core", tag: "n8n · AI Agents · Workflows" },
  { num: "LAYER 03", title: "Delivery Layer", tag: "Apps · APIs · Dashboards" },
  { num: "LAYER 04", title: "Data & Infrastructure", tag: "Cloud · Supabase · VPS" },
  { num: "LAYER 05", title: "Monitoring", tag: "Cattr · Syncthing · Alerts" },
  { num: "OUTPUT", title: "Scaled Operations", tag: "Your business, running faster", accent: true },
]

const COUNTERS = [
  { id: "c1", target: 82, unit: "%", label: "Ops Time Recovered", duration: 1800 },
  { id: "c2", target: 14, unit: "x", label: "Faster Than Hiring", duration: 1600 },
  { id: "c3", target: 100, unit: "%", label: "Delivery Ownership", duration: 1400 },
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

function Counter({ target, unit, label, duration, active }: { target: number; unit: string; label: string; duration: number; active: boolean }) {
  const val = useCounter(target, duration, active)
  return (
    <div className="text-center">
      <div className="font-mono text-4xl md:text-5xl font-bold text-white">
        {val}<span className="text-primary text-2xl">{unit}</span>
      </div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-white/40 mt-2">{label}</div>
    </div>
  )
}

export function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [countersActive, setCountersActive] = useState(false)
  const [activeNode, setActiveNode] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCountersActive(true); observer.disconnect() } },
      { threshold: 0.4 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setActiveNode((n) => (n + 1) % LAYERS.length), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="proof" ref={sectionRef} className="py-32 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="section-label">Visual Proof</div>
            <h2 className="section-headline">A System, Not a Service.</h2>
          </div>
          <p className="text-white/50 leading-relaxed self-end">
            Every Naaxtech engagement runs through a proprietary execution engine — n8n automation core, dedicated app accounts,
            and real-time orchestration. You own the outcomes. We own the machine.
          </p>
        </div>

        {/* System diagram */}
        <div className="border border-border p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/40 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            NAAXTECH EXECUTION ENGINE — LIVE ARCHITECTURE
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {LAYERS.map((layer, i) => (
              <div
                key={i}
                className="border p-4 transition-all duration-500"
                style={{
                  borderColor: activeNode === i ? "rgba(245,200,66,0.5)" : "rgba(255,255,255,0.06)",
                  background: layer.accent
                    ? activeNode === i ? "rgba(245,200,66,0.08)" : "rgba(245,200,66,0.04)"
                    : activeNode === i ? "rgba(245,200,66,0.04)" : "transparent",
                }}
              >
                <div className={`font-mono text-[9px] tracking-widest mb-2 ${layer.accent ? "text-primary" : "text-white/30"}`}>
                  {layer.num}
                </div>
                <div className={`font-sans font-semibold text-sm mb-1 ${layer.accent ? "text-primary" : "text-white"}`}>
                  {layer.title}
                </div>
                <div className="font-mono text-[9px] text-white/30 leading-relaxed">{layer.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {COUNTERS.map((c) => (
            <div key={c.id} className="bg-background py-10 px-6 flex items-center justify-center">
              <Counter target={c.target} unit={c.unit} label={c.label} duration={c.duration} active={countersActive} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
