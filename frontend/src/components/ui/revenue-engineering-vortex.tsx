"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type RevenueEngineeringVortexProps = {
  text?: string
  accentColor?: string
  dimColor?: string
  cellSize?: number
  density?: number
  followStrength?: number
  enabled?: boolean
  enablePointerEvents?: boolean
  zIndex?: number
}

const GLYPHS = "0123456789abcdef{}<>/\\=;:.*░▒▓"
const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const fract = (value: number) => value - Math.floor(value)

// Compact deterministic pseudo-random helper for stable per-cell variation.
const hash2 = (x: number, y: number, seed: number) =>
  fract(Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123)

type GridState = {
  cols: number
  rows: number
  mask: Float32Array
  glyphOffsets: Uint8Array
}

function buildTextMask(cols: number, rows: number, text: string): Float32Array {
  const canvas = document.createElement("canvas")
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext("2d")

  const mask = new Float32Array(cols * rows)
  if (!ctx) return mask

  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return mask

  ctx.clearRect(0, 0, cols, rows)
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#ffffff"

  let chosenLines: string[] = [text]
  let chosenFont = Math.max(8, Math.floor(rows * 0.22))

  // Fit the string into the low-res grid, then sample luminance as density.
  for (let fontSize = Math.floor(rows * 0.38); fontSize >= 8; fontSize--) {
    ctx.font = `900 ${fontSize}px ${MONO_STACK}`
    const maxWidth = cols * 0.88
    const lines: string[] = []
    let current = ""

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate
      } else {
        if (current) lines.push(current)
        current = word
      }
    }
    if (current) lines.push(current)

    const lineHeight = fontSize * 1.08
    const blockHeight = lines.length * lineHeight
    const fits = lines.length <= 3 && blockHeight <= rows * 0.58

    if (fits) {
      chosenLines = lines
      chosenFont = fontSize
      break
    }
  }

  ctx.font = `900 ${chosenFont}px ${MONO_STACK}`
  const lineHeight = chosenFont * 1.08
  const totalHeight = chosenLines.length * lineHeight
  const startY = rows * 0.5 - totalHeight * 0.5 + lineHeight * 0.5

  chosenLines.forEach((line, idx) => {
    ctx.fillText(line, cols * 0.5, startY + idx * lineHeight)
  })

  const img = ctx.getImageData(0, 0, cols, rows).data
  for (let i = 0; i < mask.length; i++) {
    // White text on transparent background: alpha is our density signal.
    mask[i] = img[i * 4 + 3] / 255
  }

  return mask
}

export function RevenueEngineeringVortex({
  text = "REVENUE ENGINEERING",
  accentColor = "#F5C842",
  dimColor = "rgba(225, 225, 225, 0.42)",
  cellSize = 12,
  density = 0.58,
  followStrength = 0.05,
  enabled = true,
  enablePointerEvents = false,
  zIndex = 65,
}: RevenueEngineeringVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const resizeDebounceRef = useRef<number | null>(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })
  const gridRef = useRef<GridState | null>(null)
  const seedRef = useRef(Math.random() * 1000)
  const [reducedMotion, setReducedMotion] = useState(false)

  const safeCellSize = useMemo(() => clamp(Math.floor(cellSize), 8, 20), [cellSize])
  const safeDensity = useMemo(() => clamp(density, 0.1, 1), [density])
  const safeFollowStrength = useMemo(() => clamp(followStrength, 0.01, 0.25), [followStrength])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReducedMotion(media.matches)
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let start = performance.now()

    const setupGrid = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = `${safeCellSize * 0.95}px ${MONO_STACK}`

      const cols = Math.ceil(width / safeCellSize)
      const rows = Math.ceil(height / safeCellSize)
      const total = cols * rows

      const mask = buildTextMask(cols, rows, text)
      const glyphOffsets = new Uint8Array(total)
      for (let i = 0; i < total; i++) {
        glyphOffsets[i] = Math.floor(Math.random() * GLYPHS.length)
      }

      gridRef.current = { cols, rows, mask, glyphOffsets }

      centerRef.current = { x: width * 0.5, y: height * 0.45 }
      mouseRef.current = { x: width * 0.5, y: height * 0.45 }
    }

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
    }

    const onResize = () => {
      if (resizeDebounceRef.current) window.clearTimeout(resizeDebounceRef.current)
      resizeDebounceRef.current = window.setTimeout(setupGrid, 120)
    }

    const draw = (timestamp: number) => {
      const grid = gridRef.current
      if (!grid) return

      frame++
      const elapsed = (timestamp - start) / 1000

      // Eased target center creates cursor pull without jitter.
      centerRef.current.x += (mouseRef.current.x - centerRef.current.x) * safeFollowStrength
      centerRef.current.y += (mouseRef.current.y - centerRef.current.y) * safeFollowStrength

      const centerX = centerRef.current.x
      const centerY = centerRef.current.y
      const cursorX = mouseRef.current.x
      const cursorY = mouseRef.current.y

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "rgba(10, 10, 10, 0.16)"
      ctx.fillRect(0, 0, width, height)

      const { cols, rows, mask, glyphOffsets } = grid
      const total = cols * rows
      const maxRadius = Math.hypot(width, height)
      const cursorRadius = safeCellSize * 9
      const cursorRadiusSq = cursorRadius * cursorRadius
      const dirInfluence = clamp((cursorX - centerX) / Math.max(1, width), -1, 1)
      const spiralDirection = dirInfluence >= 0 ? 1 : -1

      const flickerBudget = Math.max(2, Math.floor(total * 0.015))
      for (let i = 0; i < flickerBudget; i++) {
        const idx = Math.floor(Math.random() * total)
        glyphOffsets[idx] = Math.floor(Math.random() * GLYPHS.length)
      }

      // Spiral field:
      // - radialProgress moves "source coordinates" inward over time
      // - angularDrift rotates + twists by distance to keep the field alive
      // The text mask remains fixed in grid space while the flowing field is sampled each frame.
      const inwardSpeed = 48
      const baseRotation = elapsed * 0.5 * spiralDirection

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col
          const x = (col + 0.5) * safeCellSize
          const y = (row + 0.5) * safeCellSize

          const dx = x - centerX
          const dy = y - centerY
          const radius = Math.hypot(dx, dy)
          const angle = Math.atan2(dy, dx)

          const cursorDx = x - cursorX
          const cursorDy = y - cursorY
          const cursorDistSq = cursorDx * cursorDx + cursorDy * cursorDy
          const cursorInfluence = Math.exp(-cursorDistSq / cursorRadiusSq)

          const radialProgress = (radius - elapsed * inwardSpeed) / Math.max(1, maxRadius)
          const angularDrift =
            angle +
            baseRotation +
            spiralDirection * radius * 0.012 +
            Math.sin(elapsed * 1.2 + radius * 0.018) * 0.25

          const flowX = Math.cos(angularDrift) * radialProgress * 180
          const flowY = Math.sin(angularDrift) * radialProgress * 180
          const flowNoise = hash2(flowX, flowY, seedRef.current)

          const band = 0.5 + 0.5 * Math.sin(radius * 0.03 - elapsed * 3.2 + flowNoise * Math.PI)
          const maskStrength = mask[idx]
          const inText = maskStrength > 0.09
          const baseVisibility = inText ? 0.72 : safeDensity * (0.3 + 0.35 * flowNoise)

          if (!inText && flowNoise > baseVisibility) continue

          const turbulence = cursorInfluence * 0.42
          const lum = clamp(
            (inText ? 0.45 + maskStrength * 0.95 : 0.08 + band * 0.34 + safeDensity * 0.16) +
              cursorInfluence * 0.5 +
              turbulence,
            0.02,
            1
          )

          const glyphBase = Math.floor((flowNoise * GLYPHS.length + glyphOffsets[idx]) % GLYPHS.length)
          const glyph = GLYPHS[glyphBase]

          ctx.globalAlpha = inText ? clamp(lum, 0.38, 1) : clamp(lum * 0.45, 0.08, 0.55)
          ctx.fillStyle = inText ? accentColor : dimColor
          ctx.fillText(glyph, x, y)
        }
      }

      ctx.globalAlpha = 1

      if (!reducedMotion) {
        rafRef.current = window.requestAnimationFrame(draw)
      }
    }

    setupGrid()
    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("resize", onResize)

    if (reducedMotion) {
      draw(start)
    } else {
      rafRef.current = window.requestAnimationFrame(draw)
    }

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
      if (resizeDebounceRef.current) window.clearTimeout(resizeDebounceRef.current)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
    }
  }, [accentColor, dimColor, enabled, reducedMotion, safeCellSize, safeDensity, safeFollowStrength, text])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: enablePointerEvents ? "auto" : "none",
        zIndex,
      }}
    />
  )
}
