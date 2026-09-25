import type { Metadata } from "next"
import { Tv } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Series — StreamFree",
}

export default function SeriesPage() {
  return (
    <ComingSoon
      icon={Tv}
      title="Series"
      description="The full series and short-drama catalog with browsing and filters is coming soon. For now, explore the rows on the homepage."
    />
  )
}
