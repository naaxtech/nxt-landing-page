import { NextRequest, NextResponse } from "next/server"

const BOT_UA_PATTERNS = [
  /^$/,
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /\bcurl\b/i,
  /\bwget\b/i,
  /python-requests/i,
  /go-http-client/i,
  /java\//i,
  /libwww-perl/i,
  /httpclient/i,
  /axios\//i,
  /node-fetch/i,
  /got\//i,
  /undici/i,
  /^-$/,
]

// Per-instance in-memory rate limiter (complementary to Cloudflare)
const rateStore = new Map<string, { count: number; reset: number }>()

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateStore.get(key)
  if (!entry || now > entry.reset) {
    rateStore.set(key, { count: 1, reset: now + windowMs })
    return false
  }
  entry.count++
  return entry.count > limit
}

export function proxy(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? ""
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"

  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api/contact")) {
    // Block headless/scripted user agents
    if (BOT_UA_PATTERNS.some((p) => p.test(ua))) {
      return new NextResponse(JSON.stringify({ ok: false, error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Rate limit: max 5 submissions per IP per 10 minutes
    if (isRateLimited(ip, 5, 10 * 60 * 1000)) {
      return new NextResponse(JSON.stringify({ ok: false, error: "Too many requests — please wait before trying again" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
