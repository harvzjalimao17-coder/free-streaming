import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  icon?: LucideIcon
  actionHref?: string
  actionLabel?: string
  className?: string
}

export function SectionHeading({
  title,
  description,
  icon: Icon,
  actionHref,
  actionLabel = "See all",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0 space-y-1">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-balance text-foreground sm:text-2xl">
          {Icon ? <Icon className="size-5 shrink-0 text-primary" strokeWidth={2} /> : null}
          {title}
        </h2>
        {description ? (
          <p className="line-clamp-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actionHref ? (
        <Link
          href={actionHref}
          className="group inline-flex shrink-0 items-center gap-0.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {actionLabel}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  )
}
