"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Play } from "lucide-react"
import type { VideoSource } from "@/lib/types"
import type { PlaybackState } from "@/lib/playback"
import type { ContentType } from "@/lib/ad-gate/types"
import { MOCK_AD_DURATION_SECONDS } from "@/lib/ad-gate/types"
import { PosterArt } from "@/components/poster-art"
import { VideoPlayer } from "@/components/video-player"
import { PlaybackStatusBadge } from "@/components/playback-status"
import { Button } from "@/components/ui/button"

type GateState = Extract<
  PlaybackState,
  "LOCKED" | "AD_LOADING" | "AD_PLAYING" | "AD_COMPLETED" | "CONTENT_UNLOCKED" | "ERROR"
>

interface WatchGateProps {
  title: string
  gradient: string
  poster?: string
  source?: VideoSource
  contentType: ContentType
  contentId: string
}

interface StartSessionResponse {
  sessionId: string
}

interface VerifyErrorResponse {
  error?: string
}

/**
 * Client-side orchestrator sitting between the Watch button and the player:
 *
 *   Watch button -> WatchGate (LOCKED -> AD_LOADING -> AD_PLAYING ->
 *   AD_COMPLETED[verifying] -> CONTENT_UNLOCKED) -> VideoPlayer (PLAYING)
 *
 * IMPORTANT — the "ad" itself is a clearly-labeled development mock (a
 * countdown, nothing else). But unlocking is NOT decided here: this
 * component calls POST /api/ad-gate/start to create a server-side session,
 * then POST /api/ad-gate/verify once its local countdown ends. The server
 * (lib/ad-gate/mock-provider.ts) independently checks real elapsed time
 * against the session it created — a client claim of "the ad finished" has
 * no effect on its own. Only a successful /verify response moves this
 * component to CONTENT_UNLOCKED. See lib/ad-gate/types.ts for the full
 * provider contract a future real provider would implement instead.
 */
export function WatchGate({ title, gradient, poster, source, contentType, contentId }: WatchGateProps) {
  const [state, setState] = useState<GateState>("LOCKED")
  const [secondsRemaining, setSecondsRemaining] = useState(MOCK_AD_DURATION_SECONDS)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  const startFlow = useCallback(() => {
    setErrorMessage(null)
    setSecondsRemaining(MOCK_AD_DURATION_SECONDS)
    sessionIdRef.current = null
    setState("AD_LOADING")

    fetch("/api/ad-gate/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, contentId }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Couldn't start the ad. Please try again.")
        const data = (await response.json()) as StartSessionResponse
        sessionIdRef.current = data.sessionId
        setState("AD_PLAYING")
      })
      .catch((error: Error) => {
        setErrorMessage(error.message)
        setState("ERROR")
      })
  }, [contentType, contentId])

  const completeAdAndVerify = useCallback(() => {
    setState("AD_COMPLETED")

    const sessionId = sessionIdRef.current
    if (!sessionId) {
      setErrorMessage("The ad session was lost. Please try again.")
      setState("ERROR")
      return
    }

    fetch("/api/ad-gate/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, contentType, contentId }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as VerifyErrorResponse | null
          throw new Error(data?.error ?? "Verification failed. Please try again.")
        }
        setState("CONTENT_UNLOCKED")
      })
      .catch((error: Error) => {
        setErrorMessage(error.message)
        setState("ERROR")
      })
  }, [contentType, contentId])

  // Mock ad countdown — when it reaches zero, hand off to server verification.
  useEffect(() => {
    if (state !== "AD_PLAYING") return

    const interval = setInterval(() => {
      setSecondsRemaining((seconds) => {
        if (seconds <= 1) {
          clearInterval(interval)
          completeAdAndVerify()
          return 0
        }
        return seconds - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [state, completeAdAndVerify])

  if (state === "CONTENT_UNLOCKED") {
    return (
      <div className="space-y-3">
        <VideoPlayer
          title={title}
          gradient={gradient}
          poster={poster}
          source={source}
          playbackState="PLAYING"
          contentType={contentType}
          contentId={contentId}
        />
        <PlaybackStatusBadge state="PLAYING" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
        <PosterArt gradient={gradient} className="absolute inset-0" showLabel={false} />

        {state === "LOCKED" ? <LockedPanel title={title} onStart={startFlow} /> : null}
        {state === "AD_LOADING" ? <AdLoadingPanel /> : null}
        {state === "AD_PLAYING" ? <AdPlayingPanel secondsRemaining={secondsRemaining} /> : null}
        {state === "AD_COMPLETED" ? <VerifyingPanel /> : null}
        {state === "ERROR" ? <ErrorPanel message={errorMessage} onRetry={startFlow} /> : null}
      </div>
      <PlaybackStatusBadge state={state} />
    </div>
  )
}

function LockedPanel({ title, onStart }: { title: string; onStart: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/55 p-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border border-primary/40 bg-black/50">
        <Play className="size-6 text-primary/70" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-white">Locked</p>
        <p className="max-w-sm text-sm text-white/70">
          A short ad plays before &ldquo;{title}&rdquo; unlocks. This is a development placeholder
          ad, verified by the server — not a real ad provider.
        </p>
      </div>
      <Button onClick={onStart} size="lg" className="h-11 gap-2 px-6 text-sm">
        <Play className="size-4 fill-current" aria-hidden="true" />
        Start Watching
      </Button>
    </div>
  )
}

function AdLoadingPanel() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-primary motion-reduce:animate-none"
      />
      <p className="text-sm text-white/70">Preparing ad…</p>
    </div>
  )
}

function AdPlayingPanel({ secondsRemaining }: { secondsRemaining: number }) {
  // Purely a render of the existing secondsRemaining/MOCK_AD_DURATION_SECONDS
  // values already tracked in WatchGate's countdown — no new timing logic.
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, Math.max(0, secondsRemaining / MOCK_AD_DURATION_SECONDS))
  const dashOffset = circumference * (1 - progress)

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-6 text-center">
      <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/60 uppercase">
        Ad — Development Placeholder
      </span>
      <div className="relative flex size-20 items-center justify-center" role="status" aria-live="polite">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="40" r={radius} strokeWidth="4" className="fill-none stroke-white/15" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="fill-none stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear motion-reduce:transition-none"
          />
        </svg>
        <span className="text-2xl font-bold text-primary">{secondsRemaining}</span>
        <span className="sr-only">seconds remaining in the placeholder ad</span>
      </div>
      <p className="max-w-xs text-xs text-white/60">
        This is not a real advertisement. The server independently verifies completion before
        content unlocks.
      </p>
    </div>
  )
}

function VerifyingPanel() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/65"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-primary motion-reduce:animate-none"
      />
      <p className="text-sm text-white/70">Verifying…</p>
    </div>
  )
}

function ErrorPanel({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-6 text-center"
      role="alert"
    >
      <p className="text-sm font-semibold text-destructive">Couldn&apos;t unlock content</p>
      <p className="max-w-xs text-xs text-white/70">
        {message ?? "Something went wrong verifying the ad."}
      </p>
      <Button onClick={onRetry} size="sm" variant="outline" className="gap-1.5 text-xs">
        Retry
      </Button>
    </div>
  )
}
