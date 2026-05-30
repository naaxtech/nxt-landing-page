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
    const sweep = document.createElement("span")
    sweep.className = "btn-sweep-el"
    btn.appendChild(sweep)
    sweep.addEventListener("animationend", () => sweep.remove(), { once: true })
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
