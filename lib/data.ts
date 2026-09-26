import type { MediaType, Title } from "@/lib/types"
import { GENRES, type Genre } from "@/lib/genres"

/**
 * Development/demo catalog only. These are original, fictional placeholder
 * records used to build and test the UI — not real titles, and not sourced
 * from any provider. Replace with real, licensed catalog data before launch.
 */
export const TITLES: Title[] = [
  {
    id: "t01",
    slug: "inferno-protocol",
    title: "Inferno Protocol",
    type: "movie",
    description:
      "A disavowed intelligence officer has eleven hours to stop a rogue algorithm from triggering a blackout across three continents.",
    poster: "/posters/inferno-protocol.svg",
    backdrop: "/backdrops/inferno-protocol.svg",
    genre: "Action",
    genres: ["Action", "Thriller"],
    year: 2026,
    duration: "2h 14m",
    rating: 8.1,
    featured: true,
    trending: true,
    addedAt: "2026-09-20",
    gradient: "from-orange-900 via-neutral-900 to-black",
  },
  {
    id: "t02",
    slug: "the-last-signal",
    title: "The Last Signal",
    type: "movie",
    description:
      "When Earth receives a single, decaying transmission from a colony ship presumed lost, a skeleton crew races to decode it before the signal — and the ship — disappear forever.",
    poster: "/posters/the-last-signal.svg",
    backdrop: "/backdrops/the-last-signal.svg",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Drama"],
    year: 2025,
    duration: "2h 6m",
    rating: 8.6,
    featured: false,
    trending: true,
    addedAt: "2026-09-10",
    gradient: "from-indigo-950 via-slate-900 to-black",
    // Development test source only — an openly-licensed film (CC BY-ND 4.0,
    // Blender Foundation), not a real release of "The Last Signal". Verified
    // reachable over HTTPS; see docs/licensing-response-tracker.md context.
    source: {
      sourceType: "native",
      url: "https://archive.org/download/big-buck-bunny-1440p-60-fps-vp-8/Big%20Buck%20Bunny%20360p%2030FPS.mp4",
      provider: "Blender Foundation — Big Buck Bunny (CC BY-ND 4.0, via Internet Archive)",
    },
  },
  {
    id: "t03",
    slug: "glass-horizon",
    title: "Glass Horizon",
    type: "movie",
    description:
      "Two estranged sisters inherit their late father's vineyard and are forced to confront the decisions that split their family apart twenty years ago.",
    poster: "/posters/glass-horizon.svg",
    backdrop: "/backdrops/glass-horizon.svg",
    genre: "Drama",
    genres: ["Drama"],
    year: 2024,
    duration: "1h 58m",
    rating: 7.9,
    featured: false,
    trending: false,
    addedAt: "2026-08-02",
    gradient: "from-amber-950 via-neutral-900 to-black",
  },
  {
    id: "t04",
    slug: "midnight-ledger",
    title: "Midnight Ledger",
    type: "movie",
    description:
      "A forensic accountant uncovers a decades-old fraud that reaches the top of her own firm — and realizes the paper trail was left for her to find.",
    poster: "/posters/midnight-ledger.svg",
    backdrop: "/backdrops/midnight-ledger.svg",
    genre: "Crime",
    genres: ["Crime", "Thriller"],
    year: 2025,
    duration: "2h 2m",
    rating: 8.3,
    featured: false,
    trending: true,
    addedAt: "2026-09-18",
    gradient: "from-blue-950 via-neutral-900 to-black",
  },
  {
    id: "t05",
    slug: "paper-hearts",
    title: "Paper Hearts",
    type: "movie",
    description:
      "A rival greeting-card writer and illustrator are forced to co-author the company's biggest holiday campaign — and slowly fall for each other's terrible jokes.",
    poster: "/posters/paper-hearts.svg",
    backdrop: "/backdrops/paper-hearts.svg",
    genre: "Romance",
    genres: ["Romance", "Comedy"],
    year: 2023,
    duration: "1h 45m",
    rating: 7.2,
    featured: false,
    trending: false,
    addedAt: "2026-07-14",
    gradient: "from-rose-950 via-neutral-900 to-black",
  },
  {
    id: "t06",
    slug: "hollow-chapel",
    title: "Hollow Chapel",
    type: "movie",
    description:
      "A restoration crew reopens a flooded chapel sealed for sixty years and discovers the congregation never actually left.",
    poster: "/posters/hollow-chapel.svg",
    backdrop: "/backdrops/hollow-chapel.svg",
    genre: "Horror",
    genres: ["Horror"],
    year: 2025,
    duration: "1h 39m",
    rating: 7.5,
    featured: false,
    trending: true,
    addedAt: "2026-09-05",
    gradient: "from-red-950 via-neutral-950 to-black",
  },
  {
    id: "t07",
    slug: "static-bloom",
    title: "Static Bloom",
    type: "movie",
    description:
      "In a near-future city where memories can be traded like currency, a grief-stricken archivist buys back a stranger's happiest day — and finds it isn't a stranger's at all.",
    poster: "/posters/static-bloom.svg",
    backdrop: "/backdrops/static-bloom.svg",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Drama"],
    year: 2026,
    duration: "2h 20m",
    rating: 8.8,
    featured: false,
    trending: true,
    addedAt: "2026-09-22",
    gradient: "from-purple-950 via-neutral-900 to-black",
  },
  {
    id: "t08",
    slug: "the-cartographers-oath",
    title: "The Cartographer's Oath",
    type: "movie",
    description:
      "An apprentice mapmaker is sent to chart a kingdom that erases itself from every map drawn of it — and finds the only way out is to finish the job.",
    poster: "/posters/the-cartographers-oath.svg",
    backdrop: "/backdrops/the-cartographers-oath.svg",
    genre: "Fantasy",
    genres: ["Fantasy", "Adventure"],
    year: 2024,
    duration: "2h 11m",
    rating: 7.8,
    featured: false,
    trending: false,
    addedAt: "2026-06-28",
    gradient: "from-violet-950 via-neutral-900 to-black",
  },
  {
    id: "t09",
    slug: "the-back-row",
    title: "The Back Row",
    type: "movie",
    description:
      "A failing small-town cinema gets one last chance to save itself: a talent show judged by the only critic who ever gave it a good review.",
    poster: "/posters/the-back-row.svg",
    backdrop: "/backdrops/the-back-row.svg",
    genre: "Comedy",
    genres: ["Comedy", "Drama"],
    year: 2023,
    duration: "1h 51m",
    rating: 7.4,
    featured: false,
    trending: false,
    addedAt: "2026-05-11",
    gradient: "from-yellow-900 via-neutral-900 to-black",
  },
  {
    id: "t10",
    slug: "deep-current",
    title: "Deep Current",
    type: "series",
    description:
      "A marine salvage crew hired to raise a sunken research vessel discovers the ship's AI has been broadcasting a warning for a decade — and it's addressed to them.",
    poster: "/posters/deep-current.svg",
    backdrop: "/backdrops/deep-current.svg",
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Thriller"],
    year: 2026,
    duration: "2 Seasons · 16 Episodes",
    seasons: 2,
    episodes: 16,
    rating: 8.5,
    featured: false,
    trending: true,
    addedAt: "2026-09-15",
    gradient: "from-cyan-950 via-slate-900 to-black",
  },
  {
    id: "t11",
    slug: "the-cul-de-sac",
    title: "The Cul-de-Sac",
    type: "series",
    description:
      "Six neighboring families, one HOA scandal, and a security-camera archive that remembers everything they'd rather forget.",
    poster: "/posters/the-cul-de-sac.svg",
    backdrop: "/backdrops/the-cul-de-sac.svg",
    genre: "Comedy",
    genres: ["Comedy", "Drama"],
    year: 2025,
    duration: "1 Season · 10 Episodes",
    seasons: 1,
    episodes: 10,
    rating: 7.6,
    featured: false,
    trending: false,
    addedAt: "2026-08-20",
    gradient: "from-yellow-900 via-neutral-900 to-black",
  },
  {
    id: "t12",
    slug: "borrowed-crown",
    title: "Borrowed Crown",
    type: "series",
    description:
      "A palace understudy trained to stand in for a reclusive queen at ceremonial events has to actually rule when the queen vanishes days before a succession vote.",
    poster: "/posters/borrowed-crown.svg",
    backdrop: "/backdrops/borrowed-crown.svg",
    genre: "Drama",
    genres: ["Drama", "Fantasy"],
    year: 2025,
    duration: "3 Seasons · 27 Episodes",
    seasons: 3,
    episodes: 27,
    rating: 8.4,
    featured: false,
    trending: true,
    addedAt: "2026-09-01",
    gradient: "from-amber-950 via-neutral-900 to-black",
  },
  {
    id: "t13",
    slug: "precinct-9",
    title: "Precinct 9",
    type: "series",
    description:
      "The most understaffed police precinct in the city closes almost none of its cases — and solves almost all of them anyway, just not on paper.",
    poster: "/posters/precinct-9.svg",
    backdrop: "/backdrops/precinct-9.svg",
    genre: "Crime",
    genres: ["Crime", "Comedy"],
    year: 2024,
    duration: "4 Seasons · 48 Episodes",
    seasons: 4,
    episodes: 48,
    rating: 8.0,
    featured: false,
    trending: false,
    addedAt: "2026-04-19",
    gradient: "from-blue-950 via-neutral-900 to-black",
  },
  {
    id: "t14",
    slug: "still-water",
    title: "Still Water",
    type: "series",
    description:
      "A crisis negotiator relocates to a quiet lake town for a slower life and quietly becomes the person everyone in town calls when things go wrong.",
    poster: "/posters/still-water.svg",
    backdrop: "/backdrops/still-water.svg",
    genre: "Thriller",
    genres: ["Thriller", "Drama"],
    year: 2026,
    duration: "1 Season · 8 Episodes",
    seasons: 1,
    episodes: 8,
    rating: 8.2,
    featured: false,
    trending: true,
    addedAt: "2026-09-23",
    gradient: "from-slate-900 via-neutral-900 to-black",
  },
  {
    id: "t15",
    slug: "after-hours-kitchen",
    title: "After Hours Kitchen",
    type: "series",
    description:
      "Four chefs who lost their restaurants during the same bad year pool their savings to run a single pop-up stall — one night, one city block, one shot each week.",
    poster: "/posters/after-hours-kitchen.svg",
    backdrop: "/backdrops/after-hours-kitchen.svg",
    genre: "Documentary",
    genres: ["Documentary"],
    year: 2025,
    duration: "1 Season · 12 Episodes",
    seasons: 1,
    episodes: 12,
    rating: 7.7,
    featured: false,
    trending: false,
    addedAt: "2026-07-30",
    gradient: "from-emerald-950 via-neutral-900 to-black",
  },
  {
    id: "t16",
    slug: "nine-minute-city",
    title: "Nine Minute City",
    type: "series",
    description:
      "Short-drama series: a courier navigating a city where every district runs on its own clock delivers one impossible package a night, in real time.",
    poster: "/posters/nine-minute-city.svg",
    backdrop: "/backdrops/nine-minute-city.svg",
    genre: "Short Drama",
    genres: ["Short Drama", "Thriller"],
    year: 2026,
    duration: "24 Episodes · ~9m each",
    episodes: 24,
    rating: 8.0,
    featured: false,
    trending: true,
    addedAt: "2026-09-19",
    gradient: "from-teal-950 via-neutral-900 to-black",
  },
  {
    id: "t17",
    slug: "office-hours",
    title: "Office Hours",
    type: "series",
    description:
      "Short-drama series: a first-year professor and her most persistent student trade increasingly elaborate excuses across a single semester of ten-minute episodes.",
    poster: "/posters/office-hours.svg",
    backdrop: "/backdrops/office-hours.svg",
    genre: "Short Drama",
    genres: ["Short Drama", "Romance", "Comedy"],
    year: 2026,
    duration: "18 Episodes · ~11m each",
    episodes: 18,
    rating: 7.6,
    featured: false,
    trending: false,
    addedAt: "2026-09-12",
    gradient: "from-teal-950 via-neutral-900 to-black",
  },
  {
    id: "t18",
    slug: "the-migration",
    title: "The Migration",
    type: "series",
    description:
      "An animated anthology following one flock of birds across a changing world, told from a different traveler's point of view each episode.",
    poster: "/posters/the-migration.svg",
    backdrop: "/backdrops/the-migration.svg",
    genre: "Animation",
    genres: ["Animation", "Documentary"],
    year: 2025,
    duration: "1 Season · 6 Episodes",
    seasons: 1,
    episodes: 6,
    rating: 8.7,
    featured: false,
    trending: false,
    addedAt: "2026-08-15",
    gradient: "from-purple-950 via-neutral-900 to-black",
  },
]

export function getFeaturedTitle(): Title {
  return TITLES.find((title) => title.featured) ?? TITLES[0]
}

export function getTrendingTitles(limit = 10): Title[] {
  return TITLES.filter((title) => title.trending).slice(0, limit)
}

export function getRecentlyAdded(limit = 10): Title[] {
  return [...TITLES]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, limit)
}

export function getPopularSeries(limit = 10): Title[] {
  return [...TITLES]
    .filter((title) => title.type === "series")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getShortDramas(limit = 10): Title[] {
  return TITLES.filter((title) => title.genres.includes("Short Drama")).slice(0, limit)
}

export function getTitleBySlug(slug: string): Title | undefined {
  return TITLES.find((title) => title.slug === slug)
}

export function getTitleById(id: string): Title | undefined {
  return TITLES.find((title) => title.id === id)
}

function sortCatalog(items: Title[]): Title[] {
  return [...items].sort((a, b) => b.rating - a.rating || a.title.localeCompare(b.title))
}

/** All movies or all series, optionally narrowed to one genre. Sorted rating desc, title asc. */
export function getTitlesByType(type: MediaType, genreName?: string): Title[] {
  return sortCatalog(
    TITLES.filter((title) => title.type === type && (!genreName || title.genres.includes(genreName)))
  )
}

/** Movies and series that carry the given genre name (exact match against Title.genres). */
export function getTitlesByGenreName(genreName: string): Title[] {
  return sortCatalog(TITLES.filter((title) => title.genres.includes(genreName)))
}

/** Only the genres that have at least one title of the given media type — keeps genre filter pills from linking to guaranteed-empty results. */
export function getGenresForType(type: MediaType): Genre[] {
  const present = new Set(TITLES.filter((title) => title.type === type).flatMap((title) => title.genres))
  return GENRES.filter((genre) => present.has(genre.name))
}

/**
 * Client-side search over title, description, and genre(s). Case-insensitive
 * substring match. Empty/whitespace query returns no results (callers should
 * treat an empty query as "no search performed yet", not "zero matches").
 */
export function searchTitles(query: string): Title[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return TITLES.filter(
    (title) =>
      title.title.toLowerCase().includes(q) ||
      title.description.toLowerCase().includes(q) ||
      title.genre.toLowerCase().includes(q) ||
      title.genres.some((genre) => genre.toLowerCase().includes(q))
  )
}

/**
 * Related titles ranked by: (1) same primary genre, (2) shared secondary
 * genre(s), (3) same media type. Never random — ties break by rating desc,
 * then title asc, so results are stable across renders.
 */
export function getRelatedTitles(slug: string, limit = 6): Title[] {
  const current = getTitleBySlug(slug)
  if (!current) return []

  return TITLES.filter((title) => title.slug !== current.slug)
    .map((title) => {
      const primaryMatch = title.genre === current.genre
      const sharedSecondary = title.genres.filter(
        (genre) => genre !== current.genre && current.genres.includes(genre)
      ).length
      const sameType = title.type === current.type

      const score = (primaryMatch ? 100 : 0) + sharedSecondary * 10 + (sameType ? 1 : 0)
      return { title, score }
    })
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.title.rating - a.title.rating || a.title.title.localeCompare(b.title.title)
    )
    .slice(0, limit)
    .map((entry) => entry.title)
}
