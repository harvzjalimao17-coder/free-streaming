import { Compass } from "lucide-react"
import { ComingSoon } from "@/components/coming-soon"

export default function GenreNotFound() {
  return (
    <ComingSoon
      icon={Compass}
      title="Genre not found"
      description="We couldn't find a genre by that name. Browse the full genre list instead."
      backHref="/genres"
      backLabel="Browse all genres"
    />
  )
}
