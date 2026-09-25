import type { Metadata } from "next"
import { LayoutGrid } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Genres — StreamFree",
}

export default function GenresPage() {
  return (
    <ComingSoon
      icon={LayoutGrid}
      title="Genres"
      description="Dedicated genre browsing pages are coming soon. For now, check out the genre grid on the homepage."
    />
  )
}
