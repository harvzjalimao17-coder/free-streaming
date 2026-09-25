import type { Metadata } from "next"
import { Film } from "lucide-react"
import { getGenresForType, getTitlesByType } from "@/lib/data"
import { getGenreBySlug } from "@/lib/genres"
import { CatalogHeader } from "@/components/catalog-header"
import { GenreFilter } from "@/components/genre-filter"
import { TitleGrid } from "@/components/title-grid"

export const metadata: Metadata = {
  title: "Movies — StreamFree",
  description: "Browse the StreamFree movie catalog by genre.",
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function MoviesPage(props: PageProps<"/movies">) {
  const searchParams = await props.searchParams
  const genreSlug = firstParam(searchParams.genre)
  const activeGenre = genreSlug ? getGenreBySlug(genreSlug) : undefined

  const movies = getTitlesByType("movie", activeGenre?.name)
  const availableGenres = getGenresForType("movie")

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={Film}
        title="Movies"
        description="Feature films across every genre in the catalog — development/demo titles for now."
        count={movies.length}
        countLabel={activeGenre ? `${activeGenre.name} movies` : "movies"}
      />

      <GenreFilter genres={availableGenres} activeSlug={activeGenre?.slug} basePath="/movies" />

      <TitleGrid
        items={movies}
        emptyMessage={
          activeGenre ? `No ${activeGenre.name} movies yet.` : "No movies in the catalog yet."
        }
      />
    </div>
  )
}
