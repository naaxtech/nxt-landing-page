"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

type Hub = {
  name: string; cc: string; lat: number; lon: number
  act: number; dom: string[]; sig: string; v?: number[]
}

const HUBS: Hub[] = [
  { name:"San Francisco", cc:"USA", lat:37.77,  lon:-122.42, act:.98, dom:["AI Agents","Autonomous","Infra"],        sig:"Agentic systems crossing from demo into production ops." },
  { name:"New York",      cc:"USA", lat:40.71,  lon:-74.01,  act:.82, dom:["Fintech","Commerce","Data"],             sig:"Capital flowing to applied AI in finance and retail." },
  { name:"Toronto",       cc:"CAN", lat:43.65,  lon:-79.38,  act:.71, dom:["Deep Learning","Health AI"],             sig:"Research talent compounding into product." },
  { name:"London",        cc:"UK",  lat:51.51,  lon:-0.13,   act:.84, dom:["Fintech","Gen AI","Climate"],            sig:"Grant-funded founders shipping across the EU/UK corridor." },
  { name:"Berlin",        cc:"DE",  lat:52.52,  lon:13.40,   act:.74, dom:["Climate Tech","SaaS","Mobility"],        sig:"EU non-dilutive capital building deep-tech." },
  { name:"Stockholm",     cc:"SE",  lat:59.33,  lon:18.07,   act:.66, dom:["Climate","Hardware","Payments"],         sig:"Small market, outsized export-grade product." },
  { name:"Tel Aviv",      cc:"IL",  lat:32.08,  lon:34.78,   act:.86, dom:["Security","AI","Infra"],                 sig:"Security-first engineering density per capita." },
  { name:"Nairobi",       cc:"KE",  lat:-1.29,  lon:36.82,   act:.62, dom:["Fintech","Mobile","Agritech"],           sig:"Mobile-native systems leapfrogging legacy rails." },
  { name:"Bangalore",     cc:"IN",  lat:12.97,  lon:77.59,   act:.88, dom:["SaaS","AI","Platforms"],                 sig:"Global product teams operating at low burn, high velocity." },
  { name:"Singapore",     cc:"SG",  lat:1.35,   lon:103.82,  act:.80, dom:["Fintech","Logistics","Web3"],            sig:"Cross-border commerce infrastructure." },
  { name:"Shenzhen",      cc:"CN",  lat:22.54,  lon:114.06,  act:.90, dom:["Hardware","Robotics","Supply"],          sig:"Hardware iteration cycles measured in days." },
  { name:"Seoul",         cc:"KR",  lat:37.57,  lon:126.98,  act:.77, dom:["Consumer AI","Gaming","Chips"],          sig:"Consumer-grade AI shipped at national scale." },
  { name:"Tokyo",         cc:"JP",  lat:35.68,  lon:139.69,  act:.75, dom:["Robotics","Automation","Mobility"],      sig:"Automation woven through physical industry." },
  { name:"Manila",        cc:"PH",  lat:14.60,  lon:120.98,  act:.70, dom:["Execution","AI Ops","Growth"],           sig:"Lean teams shipping global-grade systems on AI leverage." },
  { name:"Sydney",        cc:"AU",  lat:-33.87, lon:151.21,  act:.64, dom:["SaaS","Climate","Fintech"],              sig:"Premium product, global-first distribution." },
  { name:"São Paulo",     cc:"BR",  lat:-23.55, lon:-46.63,  act:.68, dom:["Fintech","Commerce","Logistics"],        sig:"LatAm commerce rails scaling fast." },
]

export default function LabPage() {
  const [tab, setTab] = useState<"immerse" | "systems">("immerse")
  const [sysLoaded, setSysLoaded] = useState(false)
  const resizeFnRef = useRef<(() => void) | null>(null)

  function switchTab(t: "immerse" | "systems") {
    setTab(t)
    if (t === "systems" && !sysLoaded) setSysLoaded(true)
  }

  // Restore globe canvas dimensions when switching back to immerse tab
  useEffect(() => {
    if (tab === "immerse" && resizeFnRef.current) {
      const id = setTimeout(resizeFnRef.current, 50)
      return () => clearTimeout(id)
    }
  }, [tab])

  // iframe height sync via postMessage
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "engine-height") {
        const frame = document.getElementById("sys-frame") as HTMLIFrameElement | null
        if (frame && e.data.height) frame.style.height = (e.data.height + 12) + "px"
      }
    }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [])

  // All canvas animation — runs once after mount
  useEffect(() => {
    const TAU = Math.PI * 2, D2R = Math.PI / 180

    // Precompute hub 3D vectors
    HUBS.forEach(h => {
      const p = h.lat * D2R, t = h.lon * D2R
      h.v = [Math.cos(p) * Math.sin(t), Math.sin(p), Math.cos(p) * Math.cos(t)]
    })

    // ── Fibonacci sphere surface dots ──
    const dots: number[][] = []
    const N = 620, off = 2 / N, inc = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = i * off - 1 + off / 2, r = Math.sqrt(1 - y * y), phi = i * inc
      dots.push([Math.cos(phi) * r, y, Math.sin(phi) * r])
    }

    function slerp(a: number[], b: number[], t: number) {
      let d = a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
      d = Math.max(-1, Math.min(1, d))
      const o = Math.acos(d)
      if (o < 1e-4) return a.slice()
      const s = Math.sin(o), w1 = Math.sin((1-t)*o)/s, w2 = Math.sin(t*o)/s
      return [a[0]*w1 + b[0]*w2, a[1]*w1 + b[1]*w2, a[2]*w1 + b[2]*w2]
    }
    function scaleV(v: number[], s: number) { return [v[0]*s, v[1]*s, v[2]*s] }

    // ── Arc pulses ──
    const arcs: { a:number[], b:number[], phase:number, speed:number }[] = []
    function seedArcs() {
      arcs.length = 0
      for (let k = 0; k < 7; k++) {
        const i = (Math.random() * HUBS.length) | 0, j = (Math.random() * HUBS.length) | 0
        if (i === j) continue
        arcs.push({ a: HUBS[i].v!, b: HUBS[j].v!, phase: Math.random(), speed: 0.12 + Math.random() * 0.18 })
      }
    }
    seedArcs()
    const arcInterval = setInterval(seedArcs, 5200)

    // ── Globe projection state ──
    let rotY = -1.2, rotX = -0.32, autoSpd = 0.0016, dragging = false
    let lastX = 0, lastY = 0, vel = 0.0016
    let activeHub = 0, cx = 0, cy = 0, R = 0

    const canvas = document.getElementById("globe") as HTMLCanvasElement | null
    const gctx = canvas?.getContext("2d") ?? null

    function project(v: number[]) {
      const [x, y, z] = v
      const x1 = x*Math.cos(rotY) + z*Math.sin(rotY), z1 = -x*Math.sin(rotY) + z*Math.cos(rotY)
      const y2 = y*Math.cos(rotX) - z1*Math.sin(rotX), z2 = y*Math.sin(rotX) + z1*Math.cos(rotX)
      return [cx + x1*R, cy - y2*R, z2]
    }

    function resize() {
      if (!canvas) return
      const w = canvas.clientWidth, h = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr; canvas.height = h * dpr
      gctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2; cy = h / 2; R = Math.min(w, h) * 0.40
    }
    resizeFnRef.current = resize
    window.addEventListener("resize", resize)

    function draw() {
      if (!canvas || !gctx) return
      const w = canvas.clientWidth, h = canvas.clientHeight
      gctx.clearRect(0, 0, w, h)

      const g = gctx.createRadialGradient(cx, cy, R*0.2, cx, cy, R*1.25)
      g.addColorStop(0, "rgba(245,200,66,0.05)"); g.addColorStop(1, "rgba(245,200,66,0)")
      gctx.fillStyle = g; gctx.beginPath(); gctx.arc(cx, cy, R*1.25, 0, TAU); gctx.fill()

      for (let i = 0; i < dots.length; i++) {
        const p = project(dots[i]); if (p[2] < 0) continue
        gctx.fillStyle = `rgba(160,160,160,${0.10 + p[2]*0.32})`
        gctx.fillRect(p[0], p[1], 1.3, 1.3)
      }

      for (let k = 0; k < arcs.length; k++) {
        const arc = arcs[k]; arc.phase += arc.speed * 0.016; if (arc.phase > 1) arc.phase -= 1
        gctx.beginPath(); let started = false
        for (let t = 0; t <= 1.0001; t += 1/40) {
          const pp = project(scaleV(slerp(arc.a, arc.b, t), 1 + 0.16*Math.sin(Math.PI*t)))
          if (pp[2] < -0.1) { started = false; continue }
          if (!started) { gctx.moveTo(pp[0], pp[1]); started = true } else gctx.lineTo(pp[0], pp[1])
        }
        gctx.strokeStyle = "rgba(245,200,66,0.18)"; gctx.lineWidth = 1; gctx.stroke()
        const pp2 = project(scaleV(slerp(arc.a, arc.b, arc.phase), 1 + 0.16*Math.sin(Math.PI*arc.phase)))
        if (pp2[2] >= -0.1) {
          gctx.fillStyle = "rgba(245,200,66,0.9)"
          gctx.beginPath(); gctx.arc(pp2[0], pp2[1], 2, 0, TAU); gctx.fill()
        }
      }

      for (let m = 0; m < HUBS.length; m++) {
        const h = HUBS[m], hp = project(h.v!), front = hp[2] >= 0, isAct = m === activeHub
        if (!front && !isAct) continue
        const rad = 2 + h.act * 3.2
        if (isAct) {
          const pulse = (Date.now() % 2000) / 2000
          gctx.strokeStyle = `rgba(245,200,66,${0.6*(1-pulse)})`; gctx.lineWidth = 1
          gctx.beginPath(); gctx.arc(hp[0], hp[1], rad + pulse*18, 0, TAU); gctx.stroke()
        }
        gctx.fillStyle = isAct ? "rgba(245,200,66,1)" : `rgba(245,200,66,${front ? 0.4 + hp[2]*0.6 : 0.25})`
        gctx.beginPath(); gctx.arc(hp[0], hp[1], isAct ? rad+1 : rad, 0, TAU); gctx.fill()
        if (isAct || (front && h.act > 0.82)) {
          gctx.fillStyle = isAct ? "rgba(255,255,255,0.95)" : "rgba(160,160,160,0.6)"
          gctx.font = "10px 'Geist Mono', monospace"
          gctx.fillText(h.name.toUpperCase(), hp[0] + rad + 6, hp[1] + 3)
        }
      }
    }

    let globeRaf: number
    function loop() {
      if (!dragging) { rotY += vel; vel += (autoSpd - vel) * 0.02 }
      rotX += ((-0.32) - rotX) * 0.01
      draw()
      globeRaf = requestAnimationFrame(loop)
    }

    if (canvas) {
      canvas.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId) })
      canvas.addEventListener("pointermove", (e) => {
        if (!dragging) return
        const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY
        rotY += dx * 0.006; vel = dx * 0.006
        rotX = Math.max(-1.1, Math.min(1.1, rotX - dy * 0.005))
      })
      canvas.addEventListener("pointerup", () => { dragging = false })
      canvas.addEventListener("pointercancel", () => { dragging = false })
      canvas.addEventListener("click", (e) => {
        const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top
        let best = -1, bd = 22
        for (let m = 0; m < HUBS.length; m++) {
          const hp = project(HUBS[m].v!); if (hp[2] < 0) continue
          const d = Math.hypot(hp[0] - mx, hp[1] - my); if (d < bd) { bd = d; best = m }
        }
        if (best >= 0) setActiveHub(best)
      })
    }

    // ── Signal panel ──
    const sig = {
      idx:    document.getElementById("sig-index"),
      hub:    document.getElementById("sig-hub"),
      coords: document.getElementById("sig-coords"),
      line:   document.getElementById("sig-line"),
      dom:    document.getElementById("sig-domains"),
      bar:    document.getElementById("sig-bar-i"),
      act:    document.getElementById("sig-act"),
    }

    function setActiveHub(i: number) {
      activeHub = i; const h = HUBS[i]
      if (!sig.hub) return
      sig.idx!.textContent = "NODE " + String(i + 1).padStart(2, "0") + " / " + HUBS.length + " · " + h.cc
      sig.hub.textContent = h.name
      sig.coords!.textContent = Math.abs(h.lat).toFixed(2) + "° " + (h.lat >= 0 ? "N" : "S") + " · " + Math.abs(h.lon).toFixed(2) + "° " + (h.lon >= 0 ? "E" : "W")
      sig.line!.innerHTML = h.sig
      sig.dom!.innerHTML = h.dom.map(d => `<span class="sig-domain">${d}</span>`).join("")
      if (sig.act) sig.act.textContent = Math.round(h.act * 100) + "%"
      if (sig.bar) { sig.bar.style.width = "0%"; setTimeout(() => { if (sig.bar) sig.bar.style.width = Math.round(h.act * 100) + "%" }, 60) }
    }

    let cycleInterval: ReturnType<typeof setInterval>
    function startCycle() { stopCycle(); cycleInterval = setInterval(() => setActiveHub((activeHub + 1) % HUBS.length), 4600) }
    function stopCycle() { if (cycleInterval) clearInterval(cycleInterval) }

    // ── Ticker ──
    const track = document.getElementById("ticker-track")
    if (track) {
      const html = HUBS.map(h => `<span class="ticker-item"><span class="b"></span>${h.name.toUpperCase()} <span class="c">· ${h.dom[0]}</span></span>`).join("")
      track.innerHTML = html + html
    }

    // ── Exhibit canvases ──
    function exReticle(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      ctx.clearRect(0, 0, w, h)
      const cx = w/2, cy = h/2, r = Math.min(w, h) * 0.3
      ctx.strokeStyle = "rgba(245,200,66,0.5)"; ctx.lineWidth = 1
      ;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(c => {
        const bx = cx + c[0]*r*1.5, by = cy + c[1]*r*1.5
        ctx.beginPath(); ctx.moveTo(bx - c[0]*14, by); ctx.lineTo(bx, by); ctx.lineTo(bx, by - c[1]*14); ctx.stroke()
      })
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.5)
      ctx.strokeStyle = "rgba(245,200,66,0.4)"; ctx.setLineDash([3, 7])
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.restore()
      ctx.setLineDash([])
      ctx.fillStyle = "#F5C842"; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, TAU); ctx.fill()
      const pr = (t % 2) / 2 * r * 1.6
      ctx.strokeStyle = `rgba(245,200,66,${0.5 * (1 - (t % 2) / 2)})`
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, TAU); ctx.stroke()
    }

    const flowP: number[][] = []
    function exFlow(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      if (flowP.length === 0) { for (let i = 0; i < 90; i++) flowP.push([Math.random()*w, Math.random()*h]) }
      ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < flowP.length; i++) {
        const p = flowP[i], a = Math.sin(p[0]*0.02 + t) + Math.cos(p[1]*0.02 - t)
        p[0] += Math.cos(a * Math.PI) * 0.9; p[1] += Math.sin(a * Math.PI) * 0.9
        if (p[0] < 0) p[0] = w; if (p[0] > w) p[0] = 0; if (p[1] < 0) p[1] = h; if (p[1] > h) p[1] = 0
        ctx.fillStyle = i % 7 === 0 ? "rgba(245,200,66,0.8)" : "rgba(150,150,150,0.4)"
        ctx.fillRect(p[0], p[1], 1.4, 1.4)
      }
    }

    function exLattice(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      ctx.clearRect(0, 0, w, h)
      const cx = w/2, cy = h/2, n = 9, sp = 16
      for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) {
        const ox = (x - n/2)*sp, oy = (y - n/2)*sp
        const z = Math.sin(ox*0.05 + t) + Math.cos(oy*0.05 + t)
        const s = 1 + z * 0.5
        ctx.fillStyle = z > 1 ? "rgba(245,200,66,0.85)" : `rgba(120,120,120,${0.25 + z*0.15})`
        ctx.fillRect(cx + ox*1.4 - s/2, cy + oy*1.4 + z*6 - s/2, s+1, s+1)
      }
    }

    type Ex = { fn:(c:CanvasRenderingContext2D,w:number,h:number,t:number)=>void, id:string, c?:HTMLCanvasElement, ctx?:CanvasRenderingContext2D, w:number, h:number }
    const EX: Ex[] = [
      { fn: exReticle, id: "ex1", w: 0, h: 0 },
      { fn: exFlow,    id: "ex2", w: 0, h: 0 },
      { fn: exLattice, id: "ex3", w: 0, h: 0 },
    ]
    const exCleanup: (() => void)[] = []
    EX.forEach(e => {
      const c = document.getElementById(e.id) as HTMLCanvasElement | null; if (!c) return
      e.c = c; e.ctx = c.getContext("2d")!
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rs = () => { e.w = c.clientWidth; e.h = c.clientHeight; c.width = e.w*dpr; c.height = e.h*dpr; e.ctx!.setTransform(dpr,0,0,dpr,0,0) }
      rs(); window.addEventListener("resize", rs)
      exCleanup.push(() => window.removeEventListener("resize", rs))
    })

    let exRaf: number
    function exLoop() {
      const t = Date.now() * 0.001
      EX.forEach(e => { if (e.ctx) e.fn(e.ctx, e.w, e.h, t) })
      exRaf = requestAnimationFrame(exLoop)
    }

    // Init
    resize(); setActiveHub(0); loop(); startCycle(); exLoop()

    return () => {
      cancelAnimationFrame(globeRaf)
      cancelAnimationFrame(exRaf)
      clearInterval(cycleInterval)
      clearInterval(arcInterval)
      window.removeEventListener("resize", resize)
      exCleanup.forEach(fn => fn())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="grid-overlay" aria-hidden="true" />

      <header className="lab-nav">
        <div className="lab-brand">
          <Link href="/" className="nav-logo">
            <span className="naax">NAAX</span><span className="tech">TECH</span>
          </Link>
          <span className="lab-brand-sep" />
          <span className="lab-brand-sub">THE LAB</span>
        </div>
        <div className="lab-tabs">
          <button className={tab === "immerse" ? "on" : ""} onClick={() => switchTab("immerse")}>Immerse</button>
          <button className={tab === "systems" ? "on" : ""} onClick={() => switchTab("systems")}>Systems</button>
        </div>
        <Link href="/" className="lab-back">&#x2197; Back to site</Link>
      </header>

      {/* ══ IMMERSE ══ */}
      <section id="immerse" className={`tab${tab === "immerse" ? " active" : ""}`}>
        <div className="tab-intro">
          <div className="tab-eyebrow">The Lab · Code as Art</div>
          <h1 className="tab-title">WHERE THE<br /><span className="y">WORK</span> SPEAKS.</h1>
          <p className="tab-sub">No case studies. No logos. Just the thing itself — running live in your browser. <strong>The same engine that draws this builds what we ship.</strong></p>
        </div>

        <div className="globe-stage">
          <div className="globe-wrap">
            <div className="globe-watermark"><span className="live" />Global Innovation Index · Live Map</div>
            <canvas id="globe" />
            <div className="globe-hint">Drag to rotate · click a node</div>
          </div>
          <aside className="signal">
            <div className="signal-kicker"><span className="dot" />Innovation Signal</div>
            <div className="sig-index" id="sig-index" />
            <div className="sig-hub" id="sig-hub" />
            <div className="sig-coords" id="sig-coords" />
            <div className="sig-line" id="sig-line" />
            <div className="sig-domains" id="sig-domains" />
            <div className="sig-meter">
              <div className="sig-meter-lab"><span>Signal density</span><span id="sig-act">—</span></div>
              <div className="sig-bar"><i id="sig-bar-i" /></div>
              <div className="sig-foot">Curated signal feed — live wiring via the Naaxtech backend.<br />We watch the frontier so our partners build on it.</div>
            </div>
          </aside>
        </div>

        <div className="ticker"><div className="ticker-track" id="ticker-track" /></div>

        <div className="exhibits">
          <div className="tab-eyebrow">The Exhibits</div>
          <h2 className="tab-title" style={{ fontSize: "clamp(28px,4vw,48px)" }}>Small <span className="stroke">Studies</span> in Systems.</h2>
          <p className="tab-sub">Each is a few lines of code, running live. A hint of the visual engineering we bring to everything we build.</p>
          <div className="ex-grid">
            <div className="ex">
              <canvas id="ex1" className="ex-canvas" />
              <div className="ex-meta">
                <div className="ex-k">Exhibit 01</div>
                <div className="ex-name">Lock-On</div>
                <div className="ex-desc">The targeting reticle — our motif for precision, rendered as a living pulse. Locked on the outcome.</div>
              </div>
            </div>
            <div className="ex">
              <canvas id="ex2" className="ex-canvas" />
              <div className="ex-meta">
                <div className="ex-k">Exhibit 02</div>
                <div className="ex-name">Flowfield</div>
                <div className="ex-desc">Particles following an invisible vector field — the way work should move through a system. No friction.</div>
              </div>
            </div>
            <div className="ex">
              <canvas id="ex3" className="ex-canvas" />
              <div className="ex-meta">
                <div className="ex-k">Exhibit 03</div>
                <div className="ex-name">Lattice</div>
                <div className="ex-desc">A structured grid breathing in real time. Infrastructure isn&apos;t static — it flexes with load.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SYSTEMS ══ */}
      <section id="systems" className={`tab${tab === "systems" ? " active" : ""}`}>
        <div className="tab-intro">
          <div className="tab-eyebrow">The Lab · The Logical Twin</div>
          <h1 className="tab-title">THE MACHINE,<br /><span className="y">MAPPED.</span></h1>
          <p className="tab-sub">For the operator who wants the receipts. Every layer, every tool, every outcome — <strong>read it as outcomes, or as the architecture underneath.</strong></p>
        </div>
        <div className="sys-embed-wrap">
          <iframe
            id="sys-frame"
            title="Naaxtech Execution Engine — interactive"
            src={sysLoaded ? `${BASE}/engine-embed.html` : undefined}
            scrolling="no"
          />
        </div>
      </section>
    </>
  )
}
