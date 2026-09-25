import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
  backHref?: string
  backLabel?: string
}

export function ComingSoon({
  icon: Icon,
  title,
  description,
  backHref = "/",
  backLabel = "Back to home",
}: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
        <Icon className="size-7 text-primary" strokeWidth={1.75} />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">{description}</p>
      <Link
        href={backHref}
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>
    </div>
  )
}
