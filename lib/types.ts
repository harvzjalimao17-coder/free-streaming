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
  rating: number
  featured: boolean
  trending: boolean
  addedAt: string
  /** Tailwind gradient stop classes used to render the local placeholder art. */
  gradient: string
}
