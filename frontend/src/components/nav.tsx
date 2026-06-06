"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TextScramble } from "@/components/ui/text-scramble"
import { RippleLink } from "@/components/ui/ripple-link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const NAV_LINKS = [
  { label: "Services", href: "/#solution" },
  { label: "Systems", href: "/#proof" },
  { label: "Why Us",  href: "/#why" },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const close = () => setMobileOpen(false)

  return (
    <>
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <Link href="/" className="nav-logo">
          <span className="naax">NAAX</span><span className="tech">TECH</span>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>
                <TextScramble
                  text={link.label.toUpperCase()}
                  textClassName="font-mono text-[13px] tracking-[0.1em] uppercase"
                />
              </Link>
            </li>
          ))}
          <li>
            <Link href="/lab/">
              <TextScramble
                text="THE LAB"
                textClassName="font-mono text-[13px] tracking-[0.1em] uppercase"
              />
            </Link>
          </li>
          <li><ThemeToggle /></li>
          <li><RippleLink href="/partner/" className="nav-cta">Partner With Us</RippleLink></li>
        </ul>

        <button
          className={`nav-hamburger${mobileOpen ? " open" : ""}`}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <ul className={`nav-mobile${mobileOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} onClick={close}>{link.label}</Link>
          </li>
        ))}
        <li><Link href="/lab/" onClick={close}>The Lab</Link></li>
        <li><Link href="/partner/" className="nav-mobile-cta" onClick={close}>Partner With Us</Link></li>
        <li>
          <a href="https://www.linkedin.com/company/naaxtech/" target="_blank" rel="noopener noreferrer" onClick={close}>
            LinkedIn
          </a>
        </li>
        <li style={{ paddingTop: 8 }}><ThemeToggle /></li>
      </ul>
    </>
  )
}
