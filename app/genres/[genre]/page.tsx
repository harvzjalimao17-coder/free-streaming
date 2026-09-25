import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTitlesByGenreName } from "@/lib/data"
import { GENRES, getGenreBySlug } from "@/lib/genres"
import { CatalogHeader } from "@/components/catalog-header"
import { TitleGrid } from "@/components/title-grid"

export function generateStaticParams() {
  return GENRES.map((genre) => ({ genre: genre.slug }))
}

export async function generateMetadata(
  props: PageProps<"/genres/[genre]">
): Promise<Metadata> {
  const { genre: genreSlug } = await props.params
  const genre = getGenreBySlug(genreSlug)

  if (!genre) {
    return { title: "Genre not found — StreamFree" }
  }

  return {
    title: `${genre.name} — StreamFree`,
    description: `Movies and series in the ${genre.name} genre on StreamFree.`,
  }
}

export default async function GenrePage(props: PageProps<"/genres/[genre]">) {
  const { genre: genreSlug } = await props.params
  const genre = getGenreBySlug(genreSlug)

  if (!genre) {
    notFound()
  }

  const titles = getTitlesByGenreName(genre.name)

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/genres"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All genres
      </Link>

      <CatalogHeader
        icon={genre.icon}
        eyebrow="Genre"
        title={genre.name}
        description={`Movies and series tagged ${genre.name}.`}
        count={titles.length}
        countLabel="titles"
      />

      <TitleGrid items={titles} emptyMessage={`No titles in ${genre.name} yet — check back soon.`} />
    </div>
  )
}
