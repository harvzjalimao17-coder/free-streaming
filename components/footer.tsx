import Link from "next/link"
import { Clapperboard } from "lucide-react"

const FOOTER_LINKS = [
  { href: "/movies", label: "Movies" },
  { href: "/series", label: "Series" },
  { href: "/genres", label: "Genres" },
  { href: "/watchlist", label: "Watchlist" },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2">
            <Clapperboard className="size-5 text-primary" strokeWidth={2.25} />
            <span className="text-base font-bold tracking-tight text-foreground">StreamFree</span>
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Free, ad-supported streaming. This build is a development preview — every title is
            placeholder demo content, not a real release.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} StreamFree. Development build.
      </div>
    </footer>
  )
}
