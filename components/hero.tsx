import Link from "next/link"
import { Bookmark, Info, Play, Sparkles, Star } from "lucide-react"
import type { Title } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { PosterImage } from "@/components/poster-image"
import { cn } from "@/lib/utils"

export function Hero({ item }: { item: Title }) {
  return (
    <section className="relative isolate flex min-h-[max(380px,45vh)] w-full items-end overflow-hidden border-b border-border sm:min-h-[max(420px,48vh)] lg:min-h-[max(460px,52vh)]">
      <PosterImage
        src={item.backdrop}
        alt={`${item.title} backdrop`}
        gradient={item.gradient}
        className="absolute inset-0"
        sizes="100vw"
        preload
      />
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/30 to-transparent" />

      <div className="relative w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="max-w-xl space-y-4 sm:space-y-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <Sparkles className="size-3.5" />
            Featured {item.type === "series" ? "Series" : "Movie"}
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-primary">
              <Star className="size-3.5 fill-current" />
              {item.rating.toFixed(1)}
            </span>
            <span>{item.year}</span>
            <span>{item.duration}</span>
            <Badge variant="outline">{item.genre}</Badge>
          </div>

          <p className="line-clamp-3 text-sm text-muted-foreground sm:text-base">
            {item.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={item.type === "movie" ? `/watch/movie/${item.slug}` : `/title/${item.slug}`}
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-6 text-sm")}
            >
              <Play className="size-4 fill-current" />
              Watch Now
            </Link>
            <Link
              href={`/title/${item.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 gap-2 px-6 text-sm")}
            >
              <Info className="size-4" />
              More Info
            </Link>
            <Link
              href={`/title/${item.slug}`}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-11 gap-2 px-4 text-sm")}
            >
              <Bookmark className="size-4" />
              Watchlist
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
