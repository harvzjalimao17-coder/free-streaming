import Link from "next/link"
import { Play, Star } from "lucide-react"
import type { Title } from "@/lib/types"
import { PosterImage } from "@/components/poster-image"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  item: Title
  className?: string
  /**
   * Catalog-grid presentation: title/genre/duration (or episode count) and
   * rating render below the poster instead of overlaid on it. Used by the
   * /movies, /series, /genres/[genre], and /search pages. Row usages
   * (MovieRow, Hero) keep the default compact overlay.
   */
  detailed?: boolean
}

export function MovieCard({ item, className, detailed = false }: MovieCardProps) {
  const secondaryMeta =
    item.type === "series" && item.episodes
      ? `${item.episodes} Episodes`
      : item.duration

  return (
    <Link
      href={`/title/${item.slug}`}
      className={cn(
        "group/card block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        detailed ? "w-full" : "w-36 shrink-0 snap-start sm:w-44",
        className
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:border-primary/40 group-hover/card:shadow-lg group-hover/card:shadow-primary/10">
        <PosterImage
          src={item.poster}
          alt={`${item.title} poster`}
          gradient={item.gradient}
          className="absolute inset-0"
          sizes={detailed ? "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" : "(min-width: 640px) 176px, 144px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />

        <span className="absolute top-2 right-2 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/70 uppercase backdrop-blur-sm">
          {item.type === "series" ? "Series" : "Movie"}
        </span>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/40">
            <Play className="size-5 fill-current" />
          </span>
        </div>

        {!detailed ? (
          <div className="absolute inset-x-0 bottom-0 space-y-0.5 p-2.5">
            <p className="line-clamp-1 text-sm font-semibold text-white">{item.title}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-white/70">
              <span>{item.year}</span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-0.5 text-primary">
                <Star className="size-3 fill-current" />
                {item.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {detailed ? (
        <div className="mt-2 space-y-0.5">
          <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover/card:text-primary">
            {item.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-muted-foreground">
            <span>{item.year}</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="truncate">{item.genre}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{secondaryMeta}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Star className="size-3 fill-current" />
            {item.rating.toFixed(1)}
          </span>
        </div>
      ) : null}
    </Link>
  )
}
