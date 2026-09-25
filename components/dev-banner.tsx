import { Info } from "lucide-react"

export function DevBanner() {
  return (
    <div className="border-b border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-center text-xs text-primary/80 sm:px-6">
      <p className="mx-auto flex max-w-screen-2xl items-center justify-center gap-1.5">
        <Info className="size-3.5 shrink-0" />
        <span className="truncate">
          Development preview — all titles shown are placeholder demo content, not real releases.
        </span>
      </p>
    </div>
  )
}
