import type { LucideIcon } from "lucide-react"

interface CatalogHeaderProps {
  icon: LucideIcon
  eyebrow?: string
  title: string
  description: string
  count?: number
  countLabel?: string
}

export function CatalogHeader({
  icon: Icon,
  eyebrow = "Catalog",
  title,
  description,
  count,
  countLabel = "titles",
}: CatalogHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-primary">
        <Icon className="size-4" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-wider uppercase">{eyebrow}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
      {typeof count === "number" ? (
        <p className="text-xs text-muted-foreground">
          {count} {countLabel}
        </p>
      ) : null}
    </div>
  )
}
