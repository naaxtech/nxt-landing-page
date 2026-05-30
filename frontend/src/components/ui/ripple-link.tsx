"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface RippleLinkProps {
  href: string
  className?: string
  children: ReactNode
}

export function RippleLink({ href, className = "", children }: RippleLinkProps) {
  const router = useRouter()
  const isInternal = href.startsWith("/")

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Sweep animation
    const btn = e.currentTarget
    const sweep = document.createElement("span")
    sweep.className = "btn-sweep-el"
    btn.appendChild(sweep)
    sweep.addEventListener("animationend", () => sweep.remove(), { once: true })

    // Smooth page transition for internal routes
    if (isInternal) {
      e.preventDefault()
      if ("startViewTransition" in document) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(document as any).startViewTransition(() => router.push(href))
      } else {
        router.push(href)
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
