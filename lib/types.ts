export type MediaType = "movie" | "series"

export interface Title {
  id: string
  slug: string
  title: string
  type: MediaType
  description: string
  /** Demo data field — real poster art will replace this once licensed sources are wired up. */
  poster: string
  /** Demo data field — real backdrop art will replace this once licensed sources are wired up. */
  backdrop: string
  genre: string
  genres: string[]
  year: number
  duration: string
  /** Series only — number of seasons released, when known. */
  seasons?: number
  /** Series only — total episode count, when known. */
  episodes?: number
  rating: number
  featured: boolean
  trending: boolean
  addedAt: string
  /** Tailwind gradient stop classes used to render the local placeholder art. */
  gradient: string
}
