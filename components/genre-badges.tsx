import Link from "next/link"
import { getGenreByName } from "@/lib/genres"
import { Badge } from "@/components/ui/badge"

/** Genre chips that link to /genres/[slug] when a matching genre exists, plain text badges otherwise. */
export function GenreBadges({ genres, className }: { genres: string[]; className?: string }) {
  return (
    <div className={className ?? "flex flex-wrap gap-1.5"}>
      {genres.map((genre) => {
        const match = getGenreByName(genre)
        return match ? (
          <Link
            key={genre}
            href={`/genres/${match.slug}`}
            className="rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Badge variant="outline" className="transition-colors hover:border-primary/40 hover:text-primary">
              {genre}
            </Badge>
          </Link>
        ) : (
          <Badge key={genre} variant="outline">
            {genre}
          </Badge>
        )
      })}
    </div>
  )
}
