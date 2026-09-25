import type { Metadata } from "next"
import { Search } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Search — StreamFree",
}

export default function SearchPage() {
  return (
    <ComingSoon
      icon={Search}
      title="Search"
      description="Catalog search is coming soon. For now, browse trending, recently added, and popular series on the homepage."
    />
  )
}
