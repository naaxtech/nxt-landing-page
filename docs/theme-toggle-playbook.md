# Theme Toggle Playbook
## For Claude Code — Next.js App Router + CSS Variables

This is a step-by-step recipe for adding a dark/light mode toggle to a Next.js App Router project that uses CSS custom properties for its design tokens. It documents what was actually built on the Naaxtech landing page, why each decision was made, and every gotcha encountered.

---

## Read the codebase first — 3 files

Before writing a single line, read these:

1. **`globals.css`** — look for:
   - How design tokens are defined (`:root { --black: ...; --white: ...; }`)
   - Hardcoded color values that are NOT tokens: `rgba(0,0,0,0.85)`, `#141414`, etc.
   - Any element where `var(--black)` or `var(--white)` is used as **text on a colored background** (yellow buttons, badges) — these will break in light mode
2. **`layout.tsx`** — confirm it is the App Router root layout. You will modify it.
3. **`nav.tsx`** (or wherever the header lives) — you will add the toggle button here.

---

## Decision: what stack to use

| Option | Use when |
|---|---|
| `next-themes` + CSS variables | The site uses CSS custom properties for all color tokens (most sites). Zero config, ~2kb, used by Vercel, shadcn, Linear. **Use this.** |
| Tailwind `dark:` classes | The site was built mobile-first with Tailwind utilities. Requires `darkMode: 'class'` in tailwind config and rewriting component classes. More work. |
| Radix `@radix-ui/react-switch` | Use for the **UI** of a pill-style checkbox toggle (the sliding thumb). Does not manage theme state — you still need `next-themes` for that. |
| Plain `<button>` with `aria-label` | Use for a simple icon toggle button (sun/moon). Same accessibility as Radix for this use case. No extra package. |

**On this project**: CSS variables throughout + simple icon button = `next-themes` + plain `<button>` + `lucide-react` icons (already installed).

---

## Step 1 — Install next-themes

```bash
npm install next-themes
```

Verify: `npm list next-themes` should show `next-themes@0.4.x` or later.

---

## Step 2 — Create `providers.tsx`

This must be a client component because `ThemeProvider` uses context.

```tsx
// src/components/providers.tsx
"use client"

import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"   // adds data-theme="dark"|"light" to <html>
      defaultTheme="dark"       // change to "light" or "system" if appropriate
      enableSystem={false}      // set true if you want to follow OS preference
      disableTransitionOnChange={false}  // false = allow CSS transitions on switch
      storageKey="naaxtech-theme"        // localStorage key
    >
      {children}
    </ThemeProvider>
  )
}
```

**Why `attribute="data-theme"` not `attribute="class"`?**
Using `data-theme` avoids interfering with Tailwind's class-based dark mode and gives cleaner CSS selectors: `[data-theme="light"] .foo {}` is unambiguous.

---

## Step 3 — Update `layout.tsx`

Two changes: import `Providers`, add `suppressHydrationWarning` to `<html>`.

```tsx
import { Providers } from "@/components/providers"

// suppressHydrationWarning is REQUIRED — next-themes sets data-theme on the
// client after SSR, causing a React hydration mismatch without this flag.
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="...">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

---

## Step 4 — Create the toggle button component

```tsx
// src/components/ui/theme-toggle.tsx
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"  // already installed on this project

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // CRITICAL: useTheme() returns undefined on the server.
  // Render a same-size placeholder until mounted to prevent layout shift.
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="theme-toggle-placeholder" />

  const isDark = theme === "dark"

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
    >
      {/* Show sun in dark mode (click = go light); moon in light mode (click = go dark) */}
      {isDark ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
    </button>
  )
}
```

Add the CSS for the button (in `globals.css`):

```css
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  color: var(--gray);
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s, transform 0.25s;
}
.theme-toggle:hover {
  border-color: var(--yellow);  /* use your accent color token */
  color: var(--yellow);
  transform: rotate(20deg);
}
.theme-toggle-placeholder { width: 34px; height: 34px; flex-shrink: 0; }
```

---

## Step 5 — Add the toggle to the nav

```tsx
// In nav.tsx — import and drop it in
import { ThemeToggle } from "@/components/ui/theme-toggle"

// Desktop nav: place between last link and CTA button
<li><ThemeToggle /></li>
<li><a className="nav-cta" href="/partner/">Partner With Us</a></li>

// Mobile nav: add as a list item at the bottom
<li style={{ paddingTop: 8 }}><ThemeToggle /></li>
```

---

## Step 6 — Write the light mode CSS tokens

This is the main work. Open `globals.css` and find the `:root` block where design tokens are defined. Add a `[data-theme="light"]` block that inverts the palette.

**Pattern:** dark mode = black bg / white text → light mode = white bg / black text. Yellow accent stays the same.

```css
[data-theme="light"] {
  /* Core palette inversion */
  --black:         #f8f8f8;   /* was #000 — now page background */
  --surface:       #efefef;   /* was #0a0a0a */
  --card:          #e6e6e6;   /* was #111 */
  --border:        #dedede;   /* was #1e1e1e */
  --border-bright: #c6c6c6;   /* was #2a2a2a */
  --white:         #111111;   /* was #fff — now primary text */
  --gray:          #555555;   /* was #888 — secondary text */
  --gray-dim:      #8a8a8a;   /* was #444 — muted text */

  /* Semi-transparent accent surfaces */
  --yellow-dim:    rgba(245,200,66,0.18);
  --yellow-glow:   rgba(245,200,66,0.09);

  /* If using shadcn/Tailwind tokens, update these too */
  --background:    oklch(0.97 0 0);
  --foreground:    oklch(0.09 0 0);
}
```

**Smooth transition on theme switch** (add near the top of globals.css, not inside `[data-theme]`):

```css
body { transition: background-color 0.2s ease, color 0.2s ease; }
```

---

## Step 7 — Fix hardcoded dark values

CSS variables adapt automatically. Hardcoded values do not. Hunt these down:

### Common hardcoded dark patterns and their fixes

```css
/* Nav blur backgrounds */
[data-theme="light"] nav#navbar     { background: rgba(248,248,248,0.92); }
[data-theme="light"] .nav-mobile    { background: rgba(248,248,248,0.98); }

/* Hover states that were hardcoded dark */
[data-theme="light"] .lane-card:hover      { background: #dcdcdc; }
[data-theme="light"] .featured-card        { background: #f4f4f4; }

/* rgba(255,255,255,0.03) highlights — invert the channel */
[data-theme="light"] .value-total          { background: rgba(0,0,0,0.03); }
[data-theme="light"] table tr:hover td     { background: rgba(0,0,0,0.04); }

/* Tab hover was rgba(255,255,255,0.04) */
[data-theme="light"] .tab-button:hover     { background: rgba(0,0,0,0.05); }
```

### The critical gotcha: `var(--black)` as TEXT COLOR on yellow backgrounds

Dark mode: `--black = #000` → black text on yellow button = high contrast ✓  
Light mode: `--black = #f8f8f8` → near-white text on yellow button = unreadable ✗

Grep for every element that uses `var(--black)` as a text/color property AND sits on a yellow background. Force them to literal black:

```css
/* All elements where text color = var(--black) on a yellow background */
[data-theme="light"] .btn-primary,
[data-theme="light"] .nav-cta,
[data-theme="light"] .form-submit,
[data-theme="light"] .founding-badge,
[data-theme="light"] .featured-badge,
[data-theme="light"] .active-tab { color: #000000 !important; }
```

**How to find all of them**: search `globals.css` for `color: var(--black)` and check each one — is that element on a yellow or accent-colored background?

---

## Checklist before shipping

- [ ] `suppressHydrationWarning` is on `<html>` in `layout.tsx`
- [ ] `ThemeToggle` has `!mounted` guard returning a same-size placeholder
- [ ] All `rgba(0,0,0,...)` backgrounds in CSS are overridden for light mode
- [ ] All `rgba(255,255,255,...)` subtle overlays are inverted for light mode
- [ ] All text-on-yellow elements have explicit `color: #000000` in light mode
- [ ] Scrollbar track color overridden if it was hardcoded dark
- [ ] Lab or secondary page navs with their own hardcoded backgrounds are covered
- [ ] Build passes: `npm run build` with no TypeScript errors

---

## What Radix Switch looks like (if you want it instead)

Install: `npm install @radix-ui/react-switch`

```tsx
"use client"
import * as Switch from "@radix-ui/react-switch"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      className="theme-switch"
      aria-label="Toggle dark mode"
    >
      <Switch.Thumb className="theme-switch-thumb" />
    </Switch.Root>
  )
}
```

```css
.theme-switch {
  width: 44px; height: 24px;
  background: var(--border); border-radius: 12px;
  cursor: pointer; border: none; position: relative;
  transition: background 0.2s;
}
.theme-switch[data-state="checked"] { background: var(--yellow); }
.theme-switch-thumb {
  display: block; width: 18px; height: 18px;
  background: var(--white); border-radius: 50%;
  position: absolute; top: 3px; left: 3px;
  transition: transform 0.2s;
}
.theme-switch-thumb[data-state="checked"] { transform: translateX(20px); }
```

Use this if the design calls for a slider-style toggle. The `mounted` guard is still required.

---

## Files modified on the Naaxtech project

| File | Change |
|---|---|
| `frontend/package.json` | Added `next-themes` |
| `frontend/src/components/providers.tsx` | NEW — `ThemeProvider` wrapper |
| `frontend/src/components/ui/theme-toggle.tsx` | NEW — icon button component |
| `frontend/src/app/layout.tsx` | Added `suppressHydrationWarning`, wrapped children in `<Providers>` |
| `frontend/src/components/nav.tsx` | Imported and rendered `ThemeToggle` in desktop + mobile nav |
| `frontend/src/app/globals.css` | Added `[data-theme="light"]` token block + hardcoded overrides + toggle button styles |
