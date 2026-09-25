import { Clock, Sparkles, TrendingUp, Tv } from "lucide-react"
import {
  getFeaturedTitle,
  getPopularSeries,
  getRecentlyAdded,
  getTrendingTitles,
} from "@/lib/data"
import { GENRES } from "@/lib/genres"
import { Hero } from "@/components/hero"
import { MovieRow } from "@/components/movie-row"
import { GenreCard } from "@/components/genre-card"
import { SectionHeading } from "@/components/section-heading"

export default function Home() {
  const featured = getFeaturedTitle()
  const trending = getTrendingTitles()
  const recentlyAdded = getRecentlyAdded()
  const popularSeries = getPopularSeries()

  return (
    <div className="space-y-10 pb-16 sm:space-y-12">
      <Hero item={featured} />

      <div className="space-y-10 sm:space-y-12">
        <MovieRow
          title="Trending Now"
          description="What everyone's watching this week"
          icon={TrendingUp}
          items={trending}
          actionHref="/movies"
        />

        <MovieRow
          title="Recently Added"
          description="Fresh to the catalog"
          icon={Clock}
          items={recentlyAdded}
          actionHref="/movies"
        />

        <MovieRow
          title="Popular Series"
          description="Binge-worthy seasons and short dramas"
          icon={Tv}
          items={popularSeries}
          actionHref="/series"
        />

        <section className="space-y-4">
          <SectionHeading
            title="Browse by Genre"
            description="Find something new by mood or category"
            icon={Sparkles}
            actionHref="/genres"
            className="px-4 sm:px-6 lg:px-8"
          />
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8">
            {GENRES.map((genre) => (
              <GenreCard key={genre.slug} genre={genre} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
