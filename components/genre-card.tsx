import Link from "next/link"
import type { Genre } from "@/lib/genres"
import { cn } from "@/lib/utils"

export function GenreCard({ genre }: { genre: Genre }) {
  const Icon = genre.icon

  return (
    <Link
      href="/genres"
      className={cn(
        "group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
        genre.gradient
      )}
    >
      <Icon
        className="absolute -bottom-3 -right-3 size-16 text-white/10 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.25}
      />
      <span className="relative text-base font-semibold text-white sm:text-lg">{genre.name}</span>
    </Link>
  )
}
