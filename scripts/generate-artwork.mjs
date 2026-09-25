// Generates original, local, dependency-free placeholder poster/backdrop
// artwork (SVG) for every demo title in lib/data.ts. No external network
// calls, no third-party image assets — everything here is procedurally
// drawn shapes/gradients/text, safe to ship as clearly-labeled demo art.
//
// Re-run with: node scripts/generate-artwork.mjs
// (Keep this list of titles in sync with lib/data.ts if titles change.)

import { mkdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

const GOLD = "#f99c00"

// Standard Tailwind palette hex values for the color tokens used in
// lib/data.ts's `gradient` field (kept in sync manually).
const TAILWIND_HEX = {
  black: "#000000",
  "neutral-900": "#171717",
  "neutral-950": "#0a0a0a",
  "slate-900": "#0f172a",
  "orange-900": "#7c2d12",
  "indigo-950": "#1e1b4b",
  "amber-950": "#451a03",
  "blue-950": "#172554",
  "rose-950": "#4c0519",
  "red-950": "#450a0a",
  "purple-950": "#3b0764",
  "violet-950": "#2e1065",
  "yellow-900": "#713f12",
  "cyan-950": "#083344",
  "teal-950": "#042f2e",
  "emerald-950": "#022c22",
}

function gradientStops(gradientClass) {
  const [, from, via, to] = gradientClass.match(/from-(\S+) via-(\S+) to-(\S+)/) ?? []
  return [TAILWIND_HEX[from], TAILWIND_HEX[via], TAILWIND_HEX[to]]
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function wrapTitle(title, maxCharsPerLine = 15, maxLines = 3) {
  const words = title.split(" ")
  const lines = []
  let current = ""

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxCharsPerLine && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)

  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines)
    truncated[maxLines - 1] = `${truncated[maxLines - 1].slice(0, maxCharsPerLine - 1)}…`
    return truncated
  }
  return lines
}

/** Portrait poster (2:3), title baked into the art like a real poster. */
function buildPoster({ title, genre, gradient }) {
  const [c1, c2, c3] = gradientStops(gradient)
  const lines = wrapTitle(title)
  const titleFontSize = lines.length >= 3 ? 34 : 42
  const lineHeight = titleFontSize * 1.12
  const titleStartY = 900 - 120 - (lines.length - 1) * lineHeight
  const pillWidth = Math.round(genre.length * 8.2 + 28)

  const titleLines = lines
    .map(
      (line, i) =>
        `<text x="32" y="${titleStartY + i * lineHeight}" font-family="Arial, Helvetica, sans-serif" font-size="${titleFontSize}" font-weight="800" fill="#ffffff" filter="url(#textShadow)">${escapeXml(line)}</text>`
    )
    .join("\n    ")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" role="img" aria-label="${escapeXml(title)} poster artwork">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="55%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c3}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="26%" r="55%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="scrim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.88" />
    </linearGradient>
    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" />
    </pattern>
    <filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#000000" flood-opacity="0.65" />
    </filter>
  </defs>

  <rect width="600" height="900" fill="url(#bg)" />
  <rect width="600" height="900" fill="url(#dots)" opacity="0.05" />
  <circle cx="300" cy="240" r="330" fill="url(#glow)" />

  <line x1="-60" y1="170" x2="660" y2="30" stroke="${GOLD}" stroke-opacity="0.12" stroke-width="2" />
  <line x1="-60" y1="230" x2="660" y2="90" stroke="${GOLD}" stroke-opacity="0.07" stroke-width="1" />

  <circle cx="300" cy="420" r="58" fill="#000000" fill-opacity="0.3" stroke="${GOLD}" stroke-opacity="0.45" stroke-width="2" />
  <path d="M286,396 L286,444 L326,420 Z" fill="${GOLD}" fill-opacity="0.65" />

  <rect x="0" y="600" width="600" height="300" fill="url(#scrim)" />

  <rect x="32" y="${titleStartY - titleFontSize - 22}" rx="13" ry="13" width="${pillWidth}" height="26" fill="${GOLD}" fill-opacity="0.16" stroke="${GOLD}" stroke-opacity="0.4" />
  <text x="${32 + pillWidth / 2}" y="${titleStartY - titleFontSize - 4}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5" fill="${GOLD}">${escapeXml(genre.toUpperCase())}</text>

  ${titleLines}

  <g opacity="0.55">
    <rect x="20" y="20" rx="10" ry="10" width="96" height="24" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.15" />
    <text x="68" y="36" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" letter-spacing="1" fill="#ffffff">DEMO ART</text>
  </g>
</svg>
`
}

/** Landscape backdrop (16:9), atmospheric only — real title text renders on top via HTML. */
function buildBackdrop({ title, gradient }) {
  const [c1, c2, c3] = gradientStops(gradient)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="${escapeXml(title)} backdrop artwork">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="55%" stop-color="${c2}" />
      <stop offset="100%" stop-color="${c3}" />
    </linearGradient>
    <radialGradient id="glow" cx="66%" cy="32%" r="50%">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0" />
    </radialGradient>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="#ffffff" />
    </pattern>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)" />
  <rect width="1600" height="900" fill="url(#dots)" opacity="0.05" />
  <circle cx="1060" cy="300" r="520" fill="url(#glow)" />

  <line x1="600" y1="900" x2="1650" y2="100" stroke="${GOLD}" stroke-opacity="0.1" stroke-width="2" />
  <line x1="700" y1="900" x2="1700" y2="180" stroke="${GOLD}" stroke-opacity="0.06" stroke-width="1" />

  <circle cx="1180" cy="470" r="92" fill="#000000" fill-opacity="0.22" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="2" />
  <path d="M1160,432 L1160,508 L1226,470 Z" fill="${GOLD}" fill-opacity="0.5" />

  <g opacity="0.55">
    <rect x="1484" y="20" rx="10" ry="10" width="96" height="24" fill="#000000" fill-opacity="0.5" stroke="#ffffff" stroke-opacity="0.15" />
    <text x="1532" y="36" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" letter-spacing="1" fill="#ffffff">DEMO ART</text>
  </g>
</svg>
`
}

// Kept in sync with lib/data.ts (slug, title, genre, gradient — the only
// fields this script needs).
const TITLES = [
  { slug: "inferno-protocol", title: "Inferno Protocol", genre: "Action", gradient: "from-orange-900 via-neutral-900 to-black" },
  { slug: "the-last-signal", title: "The Last Signal", genre: "Sci-Fi", gradient: "from-indigo-950 via-slate-900 to-black" },
  { slug: "glass-horizon", title: "Glass Horizon", genre: "Drama", gradient: "from-amber-950 via-neutral-900 to-black" },
  { slug: "midnight-ledger", title: "Midnight Ledger", genre: "Crime", gradient: "from-blue-950 via-neutral-900 to-black" },
  { slug: "paper-hearts", title: "Paper Hearts", genre: "Romance", gradient: "from-rose-950 via-neutral-900 to-black" },
  { slug: "hollow-chapel", title: "Hollow Chapel", genre: "Horror", gradient: "from-red-950 via-neutral-950 to-black" },
  { slug: "static-bloom", title: "Static Bloom", genre: "Sci-Fi", gradient: "from-purple-950 via-neutral-900 to-black" },
  { slug: "the-cartographers-oath", title: "The Cartographer's Oath", genre: "Fantasy", gradient: "from-violet-950 via-neutral-900 to-black" },
  { slug: "the-back-row", title: "The Back Row", genre: "Comedy", gradient: "from-yellow-900 via-neutral-900 to-black" },
  { slug: "deep-current", title: "Deep Current", genre: "Sci-Fi", gradient: "from-cyan-950 via-slate-900 to-black" },
  { slug: "the-cul-de-sac", title: "The Cul-de-Sac", genre: "Comedy", gradient: "from-yellow-900 via-neutral-900 to-black" },
  { slug: "borrowed-crown", title: "Borrowed Crown", genre: "Drama", gradient: "from-amber-950 via-neutral-900 to-black" },
  { slug: "precinct-9", title: "Precinct 9", genre: "Crime", gradient: "from-blue-950 via-neutral-900 to-black" },
  { slug: "still-water", title: "Still Water", genre: "Thriller", gradient: "from-slate-900 via-neutral-900 to-black" },
  { slug: "after-hours-kitchen", title: "After Hours Kitchen", genre: "Documentary", gradient: "from-emerald-950 via-neutral-900 to-black" },
  { slug: "nine-minute-city", title: "Nine Minute City", genre: "Short Drama", gradient: "from-teal-950 via-neutral-900 to-black" },
  { slug: "office-hours", title: "Office Hours", genre: "Short Drama", gradient: "from-teal-950 via-neutral-900 to-black" },
  { slug: "the-migration", title: "The Migration", genre: "Animation", gradient: "from-purple-950 via-neutral-900 to-black" },
]

const postersDir = path.join(ROOT, "public", "posters")
const backdropsDir = path.join(ROOT, "public", "backdrops")
mkdirSync(postersDir, { recursive: true })
mkdirSync(backdropsDir, { recursive: true })

for (const entry of TITLES) {
  writeFileSync(path.join(postersDir, `${entry.slug}.svg`), buildPoster(entry))
  writeFileSync(path.join(backdropsDir, `${entry.slug}.svg`), buildBackdrop(entry))
}

console.log(`Generated ${TITLES.length} posters and ${TITLES.length} backdrops.`)
