"use client"

import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleWatchlist, useWatchlistSlugs } from "@/lib/watchlist"

interface WatchlistButtonProps {
  slug: string
  className?: string
}

export function WatchlistButton({ slug, className }: WatchlistButtonProps) {
  const slugs = useWatchlistSlugs()
  const inWatchlist = slugs.includes(slug)

  return (
    <Button
      size="lg"
      variant={inWatchlist ? "default" : "outline"}
      onClick={() => toggleWatchlist(slug)}
      aria-pressed={inWatchlist}
      className={className}
    >
      {inWatchlist ? (
        <BookmarkCheck className="size-4" aria-hidden="true" />
      ) : (
        <Bookmark className="size-4" aria-hidden="true" />
      )}
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  )
}
