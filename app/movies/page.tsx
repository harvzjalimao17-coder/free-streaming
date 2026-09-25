import type { Metadata } from "next"
import { Film } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Movies — StreamFree",
}

export default function MoviesPage() {
  return (
    <ComingSoon
      icon={Film}
      title="Movies"
      description="The full movie catalog with browsing and filters is coming soon. For now, explore the rows on the homepage."
    />
  )
}
