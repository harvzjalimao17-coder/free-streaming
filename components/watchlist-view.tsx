"use client"

import { Bookmark } from "lucide-react"
import { getTitleBySlug } from "@/lib/data"
import type { Title } from "@/lib/types"
import { useWatchlistSlugs } from "@/lib/watchlist"
import { CatalogHeader } from "@/components/catalog-header"
import { TitleGrid } from "@/components/title-grid"
import { ComingSoon } from "@/components/coming-soon"

export function WatchlistView() {
  const slugs = useWatchlistSlugs()
  // Resolve stored slugs against the current catalog, dropping any slug
  // that no longer matches a real title (stale/malformed data fails safe).
  const items: Title[] = slugs
    .map((slug) => getTitleBySlug(slug))
    .filter((title): title is Title => title !== undefined)

  if (items.length === 0) {
    return (
      <ComingSoon
        icon={Bookmark}
        title="Your watchlist is empty"
        description="Save movies and series from their detail page to watch later — they'll show up here."
        backHref="/"
        backLabel="Browse StreamFree"
      />
    )
  }

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={Bookmark}
        title="Your Watchlist"
        description="Titles you've saved to watch later."
        count={items.length}
        countLabel="saved titles"
      />
      <TitleGrid items={items} />
    </div>
  )
}
