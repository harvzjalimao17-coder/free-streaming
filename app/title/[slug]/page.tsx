import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Bookmark, Clock3, Play, Star } from "lucide-react"
import { getRelatedTitles, getTitleBySlug, TITLES } from "@/lib/data"
import { PosterImage } from "@/components/poster-image"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { GenreBadges } from "@/components/genre-badges"
import { MovieRow } from "@/components/movie-row"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return TITLES.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata(
  props: PageProps<"/title/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params
  const item = getTitleBySlug(slug)

  if (!item) {
    return { title: "Title not found — StreamFree" }
  }

  return {
    title: `${item.title} — StreamFree`,
    description: item.description,
  }
}

export default async function TitlePage(props: PageProps<"/title/[slug]">) {
  const { slug } = await props.params
  const item = getTitleBySlug(slug)

  if (!item) {
    notFound()
  }

  const catalogHref = item.type === "series" ? "/series" : "/movies"
  const catalogLabel = item.type === "series" ? "Series" : "Movies"
  const relatedTitles = getRelatedTitles(item.slug)

  return (
    <div className="space-y-10 pb-16 sm:space-y-12">
      <div>
        <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden border-b border-border">
          <PosterImage
            src={item.backdrop}
            alt={`${item.title} backdrop`}
            gradient={item.gradient}
            className="absolute inset-0"
            sizes="100vw"
            preload
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <Link
            href={catalogHref}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:top-6 sm:left-6"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to {catalogLabel}
          </Link>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <div className="relative -mt-20 aspect-[2/3] w-40 overflow-hidden rounded-xl border border-border shadow-xl sm:w-48 lg:-mt-28 lg:w-full">
              <PosterImage
                src={item.poster}
                alt={`${item.title} poster`}
                gradient={item.gradient}
                className="absolute inset-0"
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 192px, 160px"
              />
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Badge variant="muted">{item.type === "series" ? "Series" : "Movie"}</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {item.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Star className="size-3.5 fill-current" aria-hidden="true" />
                    {item.rating.toFixed(1)}
                  </span>
                  <span>{item.year}</span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3.5" aria-hidden="true" />
                    {item.duration}
                  </span>
                </div>
                <GenreBadges genres={item.genres} className="flex flex-wrap gap-1.5 pt-1" />
              </div>

              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {item.type === "movie" ? (
                  <Link
                    href={`/watch/movie/${item.slug}`}
                    className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-6 text-sm")}
                  >
                    <Play className="size-4 fill-current" aria-hidden="true" />
                    Watch Now
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    aria-describedby="series-watch-note"
                    className="h-11 gap-2 px-6 text-sm"
                  >
                    <Play className="size-4 fill-current" aria-hidden="true" />
                    Watch Now
                  </Button>
                )}
                <Button size="lg" variant="outline" disabled className="h-11 gap-2 px-6 text-sm">
                  <Bookmark className="size-4" aria-hidden="true" />
                  Add to Watchlist
                </Button>
              </div>

              <div className="max-w-xl space-y-1">
                {item.type === "series" ? (
                  <p id="series-watch-note" className="text-xs text-muted-foreground">
                    Episode playback will be available when episode sources are configured.
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  This is a development preview detail page for demo/placeholder content only.
                  {item.type === "movie"
                    ? " The ad-gate flow and watchlist persistence have not been built yet."
                    : " Watchlist persistence has not been built yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedTitles.length > 0 ? (
        <MovieRow title="More Like This" items={relatedTitles} />
      ) : null}
    </div>
  )
}
