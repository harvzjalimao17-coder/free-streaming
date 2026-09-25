import type { Metadata } from "next"
import { Bookmark } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Watchlist — StreamFree",
}

export default function WatchlistPage() {
  return (
    <ComingSoon
      icon={Bookmark}
      title="Your Watchlist"
      description="Saving titles to a personal watchlist is coming soon, once accounts are wired up. This is a placeholder for that feature."
    />
  )
}
