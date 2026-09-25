import type { Metadata } from "next"
import { Tv } from "lucide-react"
import { getGenresForType, getTitlesByType } from "@/lib/data"
import { getGenreBySlug } from "@/lib/genres"
import { CatalogHeader } from "@/components/catalog-header"
import { GenreFilter } from "@/components/genre-filter"
import { TitleGrid } from "@/components/title-grid"

export const metadata: Metadata = {
  title: "Series — StreamFree",
  description: "Browse the StreamFree series and short-drama catalog by genre.",
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SeriesPage(props: PageProps<"/series">) {
  const searchParams = await props.searchParams
  const genreSlug = firstParam(searchParams.genre)
  const activeGenre = genreSlug ? getGenreBySlug(genreSlug) : undefined

  const series = getTitlesByType("series", activeGenre?.name)
  const availableGenres = getGenresForType("series")

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={Tv}
        title="Series"
        description="Full seasons and short dramas — development/demo titles for now."
        count={series.length}
        countLabel={activeGenre ? `${activeGenre.name} series` : "series"}
      />

      <GenreFilter genres={availableGenres} activeSlug={activeGenre?.slug} basePath="/series" />

      <TitleGrid
        items={series}
        emptyMessage={
          activeGenre ? `No ${activeGenre.name} series yet.` : "No series in the catalog yet."
        }
      />
    </div>
  )
}
