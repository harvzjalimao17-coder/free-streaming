import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Clock3, Play, Star } from "lucide-react"
import { getTitleBySlug, TITLES } from "@/lib/data"
import { PosterArt } from "@/components/poster-art"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

  return (
    <div>
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden border-b border-border">
        <PosterArt gradient={item.gradient} className="absolute inset-0" showLabel={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="relative -mt-20 aspect-[2/3] w-40 overflow-hidden rounded-xl border border-border shadow-xl sm:w-48 lg:-mt-28 lg:w-full">
            <PosterArt gradient={item.gradient} className="absolute inset-0" />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Badge variant="muted">{item.type === "series" ? "Series" : "Movie"}</Badge>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-primary">
                  <Star className="size-3.5 fill-current" />
                  {item.rating.toFixed(1)}
                </span>
                <span>{item.year}</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3.5" />
                  {item.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.genres.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {item.description}
            </p>

            <Button size="lg" disabled className="h-11 gap-2 px-6 text-sm">
              <Play className="size-4 fill-current" />
              Playback coming soon
            </Button>

            <p className="max-w-xl text-xs text-muted-foreground">
              This is a development preview detail page for demo/placeholder content only.
              Playback, the ad-gate flow, and real catalog sources have not been built yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
