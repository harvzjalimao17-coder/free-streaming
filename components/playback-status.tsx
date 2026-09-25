import { PLAYBACK_STATE_LABELS, type PlaybackState } from "@/lib/playback"
import { cn } from "@/lib/utils"

/** Small status readout for the current conceptual PlaybackState. Purely informational in this stage. */
export function PlaybackStatusBadge({ state, className }: { state: PlaybackState; className?: string }) {
  const isError = state === "ERROR"

  return (
    <p
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        isError
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-border bg-card text-muted-foreground",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", isError ? "bg-destructive" : "bg-primary")}
      />
      Status: {PLAYBACK_STATE_LABELS[state]}
    </p>
  )
}
