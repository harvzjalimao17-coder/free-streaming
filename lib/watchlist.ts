import { useSyncExternalStore } from "react"

/**
 * Watchlist storage — localStorage only, no backend, no accounts. Stores
 * just the stable Title.slug strings (never full title/movie objects), so
 * the catalog in lib/data.ts remains the single source of truth for actual
 * title data. Consumers resolve slugs back to Title records themselves
 * (see components/watchlist-view.tsx).
 *
 * Safe by construction: every localStorage access is guarded against
 * running with no `window` (SSR) and wrapped in try/catch (private
 * browsing, storage disabled/full, or malformed JSON all fail silently —
 * this is a convenience feature, never required for the app to work).
 */

const WATCHLIST_STORAGE_KEY = "streamfree:watchlist"
const EMPTY_SLUGS: string[] = []

const listeners = new Set<() => void>()

function notifyListeners() {
  for (const listener of listeners) listener()
}

function parseSlugs(raw: string | null): string[] {
  if (!raw) return EMPTY_SLUGS
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY_SLUGS
    const slugs = parsed.filter((value): value is string => typeof value === "string")
    return slugs.length > 0 ? slugs : EMPTY_SLUGS
  } catch {
    return EMPTY_SLUGS
  }
}

// useSyncExternalStore requires getSnapshot to return a referentially
// stable value when nothing has actually changed (otherwise it re-renders
// forever). localStorage.getItem always returns a fresh string, so cache
// the last-seen raw value alongside the array it parsed to, and only
// re-parse (allocating a new array) when the raw string actually differs.
let lastRaw: string | null = null
let lastSnapshot: string[] = EMPTY_SLUGS

function readSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_SLUGS
  let raw: string | null
  try {
    raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY)
  } catch {
    raw = null
  }
  if (raw === lastRaw) return lastSnapshot
  lastRaw = raw
  lastSnapshot = parseSlugs(raw)
  return lastSnapshot
}

function writeSlugs(slugs: string[]) {
  if (typeof window === "undefined") return
  const raw = JSON.stringify(slugs)
  try {
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, raw)
    lastRaw = raw
    lastSnapshot = slugs
  } catch {
    // Best-effort only — the write didn't happen, so don't update the cache.
  }
  notifyListeners()
}

// Keep multiple open tabs/windows in sync with each other too.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === WATCHLIST_STORAGE_KEY) notifyListeners()
  })
}

export function getWatchlistSlugs(): string[] {
  return readSnapshot()
}

export function isInWatchlist(slug: string): boolean {
  return readSnapshot().includes(slug)
}

export function addToWatchlist(slug: string): void {
  const current = readSnapshot()
  if (current.includes(slug)) return
  writeSlugs([...current, slug])
}

export function removeFromWatchlist(slug: string): void {
  const current = readSnapshot()
  if (!current.includes(slug)) return
  writeSlugs(current.filter((value) => value !== slug))
}

export function toggleWatchlist(slug: string): void {
  if (isInWatchlist(slug)) {
    removeFromWatchlist(slug)
  } else {
    addToWatchlist(slug)
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getServerSnapshot(): string[] {
  return EMPTY_SLUGS
}

/**
 * Reactive read of the saved slugs — re-renders the calling component
 * whenever the watchlist changes (this tab or another). Uses
 * useSyncExternalStore (not useState+useEffect) specifically so the SSR
 * snapshot and the first client render can never mismatch/flicker, and so
 * repeated reads of unchanged data return the same array reference.
 */
export function useWatchlistSlugs(): string[] {
  return useSyncExternalStore(subscribe, getWatchlistSlugs, getServerSnapshot)
}
