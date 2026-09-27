import { useSyncExternalStore } from "react"

/**
 * Watch history storage — localStorage only, no backend, no accounts.
 * Mirrors lib/watchlist.ts's proven pattern: stores only stable content
 * identifiers (never full Title/Episode objects), validates every field on
 * read, fails silently on any storage problem, and exposes a
 * useSyncExternalStore-based hook for reactive reads.
 *
 * Identifiers match what WatchGate already uses for the ad-gate:
 * movies are keyed by Title.slug, episodes by Episode.id.
 */

export type HistoryContentType = "movie" | "episode"

export interface HistoryEntry {
  contentType: HistoryContentType
  contentId: string
  /** Epoch ms — also the sort key; entries are kept most-recent-first. */
  lastWatchedAt: number
  completed: boolean
}

const HISTORY_STORAGE_KEY = "streamfree:history"
const HISTORY_MAX_ENTRIES = 50
const EMPTY_ENTRIES: HistoryEntry[] = []

const listeners = new Set<() => void>()

function notifyListeners() {
  for (const listener of listeners) listener()
}

function isValidEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    (candidate.contentType === "movie" || candidate.contentType === "episode") &&
    typeof candidate.contentId === "string" &&
    candidate.contentId.trim() !== "" &&
    typeof candidate.lastWatchedAt === "number" &&
    Number.isFinite(candidate.lastWatchedAt) &&
    typeof candidate.completed === "boolean"
  )
}

function parseEntries(raw: string | null): HistoryEntry[] {
  if (!raw) return EMPTY_ENTRIES
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY_ENTRIES
    const entries = parsed.filter(isValidEntry)
    return entries.length > 0 ? entries : EMPTY_ENTRIES
  } catch {
    return EMPTY_ENTRIES
  }
}

// Same referential-stability requirement as lib/watchlist.ts's
// useSyncExternalStore usage: only re-parse (allocating a new array) when
// the raw stored string actually changes.
let lastRaw: string | null = null
let lastSnapshot: HistoryEntry[] = EMPTY_ENTRIES

function readSnapshot(): HistoryEntry[] {
  if (typeof window === "undefined") return EMPTY_ENTRIES
  let raw: string | null
  try {
    raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
  } catch {
    raw = null
  }
  if (raw === lastRaw) return lastSnapshot
  lastRaw = raw
  lastSnapshot = parseEntries(raw)
  return lastSnapshot
}

function writeEntries(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return
  const raw = JSON.stringify(entries)
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, raw)
    lastRaw = raw
    lastSnapshot = entries
  } catch {
    // Best-effort only — the write didn't happen, so don't update the cache.
  }
  notifyListeners()
}

/**
 * Upserts by (contentType, contentId): the touched entry always moves to
 * the front (most-recent-first), and never appears twice. `update` receives
 * the existing entry (if any) so callers can decide what to preserve.
 */
function upsertEntry(
  contentType: HistoryContentType,
  contentId: string,
  update: (existing: HistoryEntry | undefined) => HistoryEntry
) {
  const current = readSnapshot()
  const existingIndex = current.findIndex(
    (entry) => entry.contentType === contentType && entry.contentId === contentId
  )
  const existing = existingIndex >= 0 ? current[existingIndex] : undefined
  const nextEntry = update(existing)
  const withoutExisting =
    existingIndex >= 0
      ? [...current.slice(0, existingIndex), ...current.slice(existingIndex + 1)]
      : current

  writeEntries([nextEntry, ...withoutExisting].slice(0, HISTORY_MAX_ENTRIES))
}

/** Already most-recent-first — upsertEntry always moves the touched entry to the front. */
export function getHistoryEntries(): HistoryEntry[] {
  return readSnapshot()
}

/**
 * Called when playback starts (or resumes) and periodically while it
 * continues. Upserts the entry and bumps lastWatchedAt, but — deliberately —
 * never turns an already-completed entry back into incomplete. Completion
 * is only ever set by recordWatchCompleted (called on the video's `ended`
 * event), never inferred from progress.
 */
export function recordWatchStarted(contentType: HistoryContentType, contentId: string): void {
  if (!contentId) return
  upsertEntry(contentType, contentId, (existing) => ({
    contentType,
    contentId,
    lastWatchedAt: Date.now(),
    completed: existing?.completed ?? false,
  }))
}

export function recordWatchCompleted(contentType: HistoryContentType, contentId: string): void {
  if (!contentId) return
  upsertEntry(contentType, contentId, () => ({
    contentType,
    contentId,
    lastWatchedAt: Date.now(),
    completed: true,
  }))
}

/** Not wired to any UI control yet — available for a future "Remove" action. */
export function removeHistoryEntry(contentType: HistoryContentType, contentId: string): void {
  const current = readSnapshot()
  const next = current.filter(
    (entry) => !(entry.contentType === contentType && entry.contentId === contentId)
  )
  if (next.length !== current.length) writeEntries(next)
}

/** Not wired to any UI control yet — available for a future "Clear history" action. */
export function clearHistory(): void {
  writeEntries(EMPTY_ENTRIES)
}

// Keep multiple open tabs/windows in sync with each other too.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === HISTORY_STORAGE_KEY) notifyListeners()
  })
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getServerSnapshot(): HistoryEntry[] {
  return EMPTY_ENTRIES
}

/**
 * Reactive read of the saved history, most-recent-first — re-renders the
 * calling component whenever it changes (this tab or another).
 */
export function useHistoryEntries(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, getHistoryEntries, getServerSnapshot)
}
