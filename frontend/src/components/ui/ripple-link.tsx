"use client"

import { type ReactNode } from "react"
import Link from "next/link"

interface RippleLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function RippleLink({ href, className = "", children }: RippleLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2.5
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const ripple = document.createElement("span")
    Object.assign(ripple.style, {
      position: "absolute",
      borderRadius: "50%",
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: "rgba(255,255,255,0.22)",
      animation: "btn-ripple 0.65s ease-out forwards",
      pointerEvents: "none",
    })
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 700)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
