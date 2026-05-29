"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"

const navLinks = [
  { label: "SERVICES", href: "#solution" },
  { label: "SYSTEMS", href: "#proof" },
  { label: "WHY US", href: "#why" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16 backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-black/90" : "border-b border-white/5 bg-black/70"
      }`}
    >
      <Link
        href="/"
        className="font-mono text-[22px] font-black tracking-wider uppercase select-none"
      >
        <span className="text-white">NAAX</span>
        <span className="text-primary">TECH</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <TextScramble text={link.label} />
          </Link>
        ))}
      </div>

      <Link
        href="#cta"
        className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-black font-mono text-[11px] font-bold tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
      >
        BOOK A CALL
      </Link>
    </nav>
  )
}
