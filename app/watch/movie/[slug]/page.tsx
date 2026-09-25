import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock3, Star } from "lucide-react"
import { getRelatedTitles, getTitleBySlug, TITLES } from "@/lib/data"
import { DEFAULT_PLAYBACK_STATE } from "@/lib/playback"
import { PosterImage } from "@/components/poster-image"
import { Badge } from "@/components/ui/badge"
import { GenreBadges } from "@/components/genre-badges"
import { PlaybackStatusBadge } from "@/components/playback-status"
import { VideoPlayer } from "@/components/video-player"
import { MovieRow } from "@/components/movie-row"

export function generateStaticParams() {
  return TITLES.filter((item) => item.type === "movie").map((item) => ({ slug: item.slug }))
}

export async function generateMetadata(
  props: PageProps<"/watch/movie/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params
  const item = getTitleBySlug(slug)

  if (!item || item.type !== "movie") {
    return { title: "Title not found — StreamFree" }
  }

  return {
    title: `Watch ${item.title} — StreamFree`,
    description: item.description,
  }
}

export default async function WatchMoviePage(props: PageProps<"/watch/movie/[slug]">) {
  const { slug } = await props.params
  const item = getTitleBySlug(slug)

  if (!item || item.type !== "movie") {
    notFound()
  }

  const relatedTitles = getRelatedTitles(item.slug)

  return (
    <div className="space-y-10 pb-16 sm:space-y-12">
      <div className="mx-auto max-w-screen-xl space-y-4 px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href={`/title/${item.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to details
        </Link>

        <VideoPlayer
          title={item.title}
          gradient={item.gradient}
          poster={item.backdrop}
          source={item.source}
          playbackState={DEFAULT_PLAYBACK_STATE}
        />

        <PlaybackStatusBadge state={DEFAULT_PLAYBACK_STATE} />

        <div className="grid gap-6 pt-2 sm:grid-cols-[120px_1fr]">
          <div className="relative hidden aspect-[2/3] w-full overflow-hidden rounded-xl border border-border shadow-lg sm:block">
            <PosterImage
              src={item.poster}
              alt={`${item.title} poster`}
              gradient={item.gradient}
              className="absolute inset-0"
              sizes="120px"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Badge variant="muted">Movie</Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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

            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{item.description}</p>

            <p className="max-w-xl text-xs text-muted-foreground">
              This is a development preview. Real content playback and the ad-gate flow have not
              been built yet.
            </p>
          </div>
        </div>
      </div>

      {relatedTitles.length > 0 ? <MovieRow title="More Like This" items={relatedTitles} /> : null}
    </div>
  )
}
