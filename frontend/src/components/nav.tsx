"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"

const NAV_LINKS = [
  { label: "Services", href: "#solution" },
  { label: "Systems", href: "#proof" },
  { label: "Why Us", href: "#why" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""}>
      <Link href="/" className="nav-logo">
        <span className="naax">NAAX</span><span className="tech">TECH</span>
      </Link>
      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} style={{ color: "inherit", textDecoration: "none" }}>
              <TextScramble
                text={link.label.toUpperCase()}
                textClassName="font-mono text-[11px] tracking-[0.1em] uppercase"
              />
            </Link>
          </li>
        ))}
        <li>
          <Link href="#cta" className="nav-cta">Book a Call</Link>
        </li>
      </ul>
    </nav>
  )
}
