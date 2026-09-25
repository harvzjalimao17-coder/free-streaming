import type { Metadata } from "next"
import { LayoutGrid } from "lucide-react"
import { getTitlesByGenreName } from "@/lib/data"
import { GENRES } from "@/lib/genres"
import { CatalogHeader } from "@/components/catalog-header"
import { GenreCard } from "@/components/genre-card"

export const metadata: Metadata = {
  title: "Genres — StreamFree",
  description: "Browse the StreamFree catalog by genre.",
}

export default function GenresPage() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={LayoutGrid}
        title="Genres"
        description="Find something new by mood or category."
        count={GENRES.length}
        countLabel="genres"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {GENRES.map((genre) => (
          <div key={genre.slug} className="space-y-1.5">
            <GenreCard genre={genre} />
            <p className="text-center text-xs text-muted-foreground">
              {getTitlesByGenreName(genre.name).length} titles
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
