import Link from "next/link"
import { CheckCircle2, Play, X } from "lucide-react"
import { PosterImage } from "@/components/poster-image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface HistoryRowProps {
  href: string
  posterSrc: string
  posterAlt: string
  gradient: string
  /** Movie title, or the parent series title for an episode entry. */
  primaryLabel: string
  /** e.g. "Ep 2: Episode Title" — episode entries only. */
  secondaryLabel?: string
  typeLabel: "Movie" | "Series"
  completed: boolean
  watchedAt: number
  /** Omit to render the row without a remove control. */
  onRemove?: () => void
  className?: string
}

function formatWatchedAt(epochMs: number): string {
  const diffMinutes = Math.round((Date.now() - epochMs) / 60000)
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(epochMs).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * A single watch-history entry. Deliberately not MovieCard/TitleGrid — an
 * episode entry needs a different link target (the specific episode, not
 * the series' title page) and a "Series — Ep N: Title" label MovieCard has
 * no concept of. Built from the same visual tokens as MovieCard (border,
 * rounded-xl, bg-card, the circular primary-colored hover play affordance,
 * the shared Badge component) so it still reads as the same design system.
 */
export function HistoryRow({
  href,
  posterSrc,
  posterAlt,
  gradient,
  primaryLabel,
  secondaryLabel,
  typeLabel,
  completed,
  watchedAt,
  onRemove,
  className,
}: HistoryRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/row flex items-center gap-3 rounded-xl border border-border bg-card p-2 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-4 sm:p-3",
        className
      )}
    >
      <div className="relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-lg border border-border sm:w-20">
        <PosterImage
          src={posterSrc}
          alt={posterAlt}
          gradient={gradient}
          className="absolute inset-0"
          sizes="80px"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover/row:bg-black/40 group-hover/row:opacity-100">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/40">
            <Play className="size-3.5 fill-current" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <Badge variant="muted">{typeLabel}</Badge>
          {completed ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Completed
            </span>
          ) : null}
        </div>
        <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover/row:text-primary sm:text-base">
          {primaryLabel}
        </p>
        {secondaryLabel ? (
          <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">{secondaryLabel}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">Watched {formatWatchedAt(watchedAt)}</p>
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRemove()
          }}
          aria-label={`Remove ${primaryLabel} from history`}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </Link>
  )
}
