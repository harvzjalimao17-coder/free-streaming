"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"

interface SearchFormProps {
  initialQuery: string
}

/**
 * Client island for the search box only — the results themselves are
 * rendered server-side by app/search/page.tsx from the `q` search param.
 * Typing debounces a router.replace() so the URL (and therefore a page
 * refresh) always reflects the current query.
 */
export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter()
  const inputId = useId()
  const [value, setValue] = useState(initialQuery)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const trimmed = value.trim()
    const timeout = setTimeout(() => {
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", { scroll: false })
    }, 300)

    return () => clearTimeout(timeout)
  }, [value, router])

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className="relative">
      <label htmlFor={inputId} className="sr-only">
        Search movies and series
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search titles, descriptions, genres…"
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-border bg-card pr-11 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-base [&::-webkit-search-cancel-button]:hidden"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </form>
  )
}
