import type { LucideIcon } from "lucide-react"
import type { Title } from "@/lib/types"
import { MovieCard } from "@/components/movie-card"
import { SectionHeading } from "@/components/section-heading"

interface MovieRowProps {
  title: string
  description?: string
  icon?: LucideIcon
  items: Title[]
  actionHref?: string
}

export function MovieRow({ title, description, icon, items, actionHref }: MovieRowProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <SectionHeading
        title={title}
        description={description}
        icon={icon}
        actionHref={actionHref}
        className="px-4 sm:px-6 lg:px-8"
      />
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:gap-4 sm:px-6 lg:px-8">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
