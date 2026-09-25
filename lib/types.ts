export type MediaType = "movie" | "series"

/**
 * Provider-agnostic playback source abstraction. Nothing in the demo data
 * sets this yet — every title/episode plays in the development-preview
 * state until a real, authorized source is wired up (a later stage).
 *
 * - "native": a direct, playable file URL for the HTML5 <video> element.
 * - "embed": an authorized provider's embeddable player URL (<iframe>).
 * - "external": content that plays on the provider's own site, not ours.
 * - "unavailable": no source configured — the default for all demo data.
 */
export type SourceType = "native" | "embed" | "external" | "unavailable"

export interface VideoSource {
  sourceType: SourceType
  /** Playable/embeddable URL. Omitted (or ignored) when sourceType is "unavailable". */
  url?: string
  /** Free-text provider label (e.g. "meet-makers", "vimeo") — never assumed by the player. */
  provider?: string
  /** Whether an "embed" source may be rendered in an <iframe> on this site. */
  embedSupported?: boolean
}

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
  /** Playback source metadata. Undefined for every demo title — see VideoSource. */
  source?: VideoSource
}

/**
 * Minimal, clearly-labeled development placeholder for series episodes —
 * intentionally NOT a full episode catalog. Exists to prove out the
 * /watch/episode/[id] route architecture before real episode data and
 * sources are connected.
 */
export interface Episode {
  id: string
  /** Title.id of the parent series. */
  seriesId: string
  episodeNumber: number
  title: string
  description: string
  thumbnail?: string
  duration?: string
  source?: VideoSource
}
