"use client"

import { History as HistoryIcon } from "lucide-react"
import { getTitleById, getTitleBySlug } from "@/lib/data"
import { getEpisodeById } from "@/lib/episodes"
import type { HistoryEntry } from "@/lib/history"
import { useHistoryEntries } from "@/lib/history"
import { CatalogHeader } from "@/components/catalog-header"
import { ComingSoon } from "@/components/coming-soon"
import { HistoryRow } from "@/components/history-row"

interface ResolvedHistoryItem {
  key: string
  href: string
  posterSrc: string
  posterAlt: string
  gradient: string
  primaryLabel: string
  secondaryLabel?: string
  typeLabel: "Movie" | "Series"
  completed: boolean
  watchedAt: number
}

/** Resolves a stored entry against the current catalog; null if it no longer exists. */
function resolveEntry(entry: HistoryEntry): ResolvedHistoryItem | null {
  if (entry.contentType === "movie") {
    const title = getTitleBySlug(entry.contentId)
    if (!title) return null

    return {
      key: `movie:${title.slug}`,
      href: `/watch/movie/${title.slug}`,
      posterSrc: title.poster,
      posterAlt: `${title.title} poster`,
      gradient: title.gradient,
      primaryLabel: title.title,
      typeLabel: "Movie",
      completed: entry.completed,
      watchedAt: entry.lastWatchedAt,
    }
  }

  const episode = getEpisodeById(entry.contentId)
  const series = episode ? getTitleById(episode.seriesId) : undefined
  if (!episode || !series) return null

  return {
    key: `episode:${episode.id}`,
    href: `/watch/episode/${episode.id}`,
    posterSrc: series.poster,
    posterAlt: `${series.title} poster`,
    gradient: series.gradient,
    primaryLabel: series.title,
    secondaryLabel: `Ep ${episode.episodeNumber}: ${episode.title}`,
    typeLabel: "Series",
    completed: entry.completed,
    watchedAt: entry.lastWatchedAt,
  }
}

export function HistoryView() {
  const entries = useHistoryEntries()
  // Drop any entry whose content no longer resolves against the catalog
  // (removed/renamed title or episode) — fails safe, never crashes.
  const items = entries
    .map(resolveEntry)
    .filter((item): item is ResolvedHistoryItem => item !== null)

  if (items.length === 0) {
    return (
      <ComingSoon
        icon={HistoryIcon}
        title="No watch history yet"
        description="Movies and episodes you watch will show up here."
        backHref="/"
        backLabel="Browse StreamFree"
      />
    )
  }

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={HistoryIcon}
        title="Watch History"
        description="Movies and episodes you've watched recently."
        count={items.length}
        countLabel="entries"
      />
      <div className="space-y-3">
        {items.map((item) => (
          <HistoryRow
            key={item.key}
            href={item.href}
            posterSrc={item.posterSrc}
            posterAlt={item.posterAlt}
            gradient={item.gradient}
            primaryLabel={item.primaryLabel}
            secondaryLabel={item.secondaryLabel}
            typeLabel={item.typeLabel}
            completed={item.completed}
            watchedAt={item.watchedAt}
          />
        ))}
      </div>
    </div>
  )
}
