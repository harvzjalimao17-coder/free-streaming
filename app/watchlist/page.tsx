import type { Metadata } from "next"
import { WatchlistView } from "@/components/watchlist-view"

export const metadata: Metadata = {
  title: "Watchlist — StreamFree",
}

export default function WatchlistPage() {
  return <WatchlistView />
}
