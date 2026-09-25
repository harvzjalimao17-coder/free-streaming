import Link from "next/link"
import type { Genre } from "@/lib/genres"
import { cn } from "@/lib/utils"

interface GenreFilterProps {
  genres: Genre[]
  activeSlug?: string
  basePath: string
}

function pillClasses(active: boolean) {
  return cn(
    "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
    active
      ? "border-primary/40 bg-primary/15 text-primary"
      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
  )
}

export function GenreFilter({ genres, activeSlug, basePath }: GenreFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by genre"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      <Link href={basePath} aria-current={!activeSlug ? "true" : undefined} className={pillClasses(!activeSlug)}>
        All
      </Link>
      {genres.map((genre) => (
        <Link
          key={genre.slug}
          href={`${basePath}?genre=${genre.slug}`}
          aria-current={activeSlug === genre.slug ? "true" : undefined}
          className={pillClasses(activeSlug === genre.slug)}
        >
          {genre.name}
        </Link>
      ))}
    </div>
  )
}
