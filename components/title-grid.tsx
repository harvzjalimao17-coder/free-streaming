import type { Title } from "@/lib/types"
import { MovieCard } from "@/components/movie-card"

interface TitleGridProps {
  items: Title[]
  emptyMessage?: string
}

export function TitleGrid({ items, emptyMessage = "No titles found." }: TitleGridProps) {
  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground" role="status">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <MovieCard key={item.id} item={item} detailed />
      ))}
    </div>
  )
}
