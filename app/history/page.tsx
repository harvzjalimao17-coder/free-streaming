import type { Metadata } from "next"
import { HistoryView } from "@/components/history-view"

export const metadata: Metadata = {
  title: "Watch History — StreamFree",
}

export default function HistoryPage() {
  return <HistoryView />
}
