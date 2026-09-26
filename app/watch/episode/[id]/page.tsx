import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock3 } from "lucide-react"
import { getRelatedTitles, getTitleById } from "@/lib/data"
import { EPISODES, getEpisodeById } from "@/lib/episodes"
import { PosterImage } from "@/components/poster-image"
import { Badge } from "@/components/ui/badge"
import { GenreBadges } from "@/components/genre-badges"
import { WatchGate } from "@/components/watch-gate"
import { MovieRow } from "@/components/movie-row"

export function generateStaticParams() {
  return EPISODES.map((episode) => ({ id: episode.id }))
}

export async function generateMetadata(
  props: PageProps<"/watch/episode/[id]">
): Promise<Metadata> {
  const { id } = await props.params
  const episode = getEpisodeById(id)
  const series = episode ? getTitleById(episode.seriesId) : undefined

  if (!episode || !series) {
    return { title: "Episode not found — StreamFree" }
  }

  return {
    title: `Watch ${series.title} — Episode ${episode.episodeNumber}: ${episode.title} — StreamFree`,
    description: episode.description,
  }
}

export default async function WatchEpisodePage(props: PageProps<"/watch/episode/[id]">) {
  const { id } = await props.params
  const episode = getEpisodeById(id)
  const series = episode ? getTitleById(episode.seriesId) : undefined

  if (!episode || !series) {
    notFound()
  }

  const relatedTitles = getRelatedTitles(series.slug)

  return (
    <div className="space-y-10 pb-16 sm:space-y-12">
      <div className="mx-auto max-w-screen-xl space-y-4 px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href={`/title/${series.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to {series.title}
        </Link>

        <WatchGate
          title={`${series.title}: ${episode.title}`}
          gradient={series.gradient}
          poster={series.backdrop}
          source={episode.source}
          contentType="episode"
          contentId={episode.id}
        />

        <div className="grid gap-6 pt-2 sm:grid-cols-[140px_1fr] sm:gap-8 lg:grid-cols-[160px_1fr]">
          <div className="relative hidden aspect-[2/3] w-full overflow-hidden rounded-xl border border-border shadow-lg sm:block">
            <PosterImage
              src={series.poster}
              alt={`${series.title} poster`}
              gradient={series.gradient}
              className="absolute inset-0"
              sizes="(min-width: 1024px) 160px, 140px"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Badge variant="muted">Episode {episode.episodeNumber}</Badge>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {episode.title}
              </h1>
              <p className="text-sm text-muted-foreground">{series.title}</p>
              {episode.duration ? (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock3 className="size-3.5" aria-hidden="true" />
                  {episode.duration}
                </span>
              ) : null}
              <GenreBadges genres={series.genres} className="flex flex-wrap gap-1.5 pt-1" />
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {episode.description}
            </p>

            <p className="max-w-xl text-xs text-muted-foreground">
              This is a development preview. Episode data is a minimal placeholder, not a full
              episode catalog, and the ad step above is a mock placeholder — real episode sources
              have not been connected yet.
            </p>
          </div>
        </div>
      </div>

      {relatedTitles.length > 0 ? <MovieRow title="More Like This" items={relatedTitles} /> : null}
    </div>
  )
}
