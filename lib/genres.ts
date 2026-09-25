import {
  Camera,
  Drama,
  Flame,
  Ghost,
  Heart,
  Laugh,
  MonitorPlay,
  Palette,
  Rocket,
  Shield,
  Wand2,
  type LucideIcon,
} from "lucide-react"

export interface Genre {
  name: string
  slug: string
  icon: LucideIcon
  gradient: string
}

export const GENRES: Genre[] = [
  { name: "Action", slug: "action", icon: Flame, gradient: "from-orange-900 via-neutral-900 to-black" },
  { name: "Sci-Fi", slug: "sci-fi", icon: Rocket, gradient: "from-indigo-950 via-slate-900 to-black" },
  { name: "Drama", slug: "drama", icon: Drama, gradient: "from-amber-950 via-neutral-900 to-black" },
  { name: "Thriller", slug: "thriller", icon: Shield, gradient: "from-slate-900 via-neutral-900 to-black" },
  { name: "Romance", slug: "romance", icon: Heart, gradient: "from-rose-950 via-neutral-900 to-black" },
  { name: "Horror", slug: "horror", icon: Ghost, gradient: "from-red-950 via-neutral-950 to-black" },
  { name: "Comedy", slug: "comedy", icon: Laugh, gradient: "from-yellow-900 via-neutral-900 to-black" },
  { name: "Fantasy", slug: "fantasy", icon: Wand2, gradient: "from-violet-950 via-neutral-900 to-black" },
  { name: "Crime", slug: "crime", icon: Shield, gradient: "from-blue-950 via-neutral-900 to-black" },
  { name: "Documentary", slug: "documentary", icon: Camera, gradient: "from-emerald-950 via-neutral-900 to-black" },
  { name: "Animation", slug: "animation", icon: Palette, gradient: "from-purple-950 via-neutral-900 to-black" },
  { name: "Short Drama", slug: "short-drama", icon: MonitorPlay, gradient: "from-teal-950 via-neutral-900 to-black" },
]

export function getGenreBySlug(slug: string): Genre | undefined {
  return GENRES.find((genre) => genre.slug === slug)
}

export function getGenreByName(name: string): Genre | undefined {
  return GENRES.find((genre) => genre.name === name)
}
