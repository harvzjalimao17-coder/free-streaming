import { Clapperboard, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PosterArtProps {
  gradient: string
  icon?: LucideIcon
  className?: string
  showLabel?: boolean
}

/**
 * Local, network-free placeholder artwork. Stands in for real poster/backdrop
 * images until the app is wired up to a licensed content source.
 */
export function PosterArt({
  gradient,
  icon: Icon = Clapperboard,
  className,
  showLabel = true,
}: PosterArtProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <Icon className="size-10 text-white/15" strokeWidth={1.25} />
      {showLabel ? (
        <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-white/50 uppercase backdrop-blur-sm">
          Demo
        </span>
      ) : null}
    </div>
  )
}
