import type { Metadata } from "next"
import { Search as SearchIcon } from "lucide-react"
import { searchTitles } from "@/lib/data"
import { CatalogHeader } from "@/components/catalog-header"
import { SearchForm } from "@/components/search-form"
import { TitleGrid } from "@/components/title-grid"

export const metadata: Metadata = {
  title: "Search — StreamFree",
  description: "Search the StreamFree catalog by title, description, or genre.",
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams
  const query = (firstParam(searchParams.q) ?? "").trim()
  const results = query ? searchTitles(query) : []

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <CatalogHeader
        icon={SearchIcon}
        title="Search"
        description="Find movies and series by title, description, or genre."
      />

      <SearchForm key={query} initialQuery={query} />

      {query ? (
        <>
          <p className="text-sm text-muted-foreground" role="status">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
          </p>
          <TitleGrid
            items={results}
            emptyMessage={`Nothing matched "${query}". Try a different title, genre, or keyword.`}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
          <SearchIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Start typing to search titles, descriptions, and genres.
          </p>
        </div>
      )}
    </div>
  )
}
