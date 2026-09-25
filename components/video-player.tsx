"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import type { VideoSource } from "@/lib/types"
import { DEFAULT_PLAYBACK_STATE, type PlaybackState } from "@/lib/playback"
import { PosterArt } from "@/components/poster-art"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  title: string
  gradient: string
  poster?: string
  source?: VideoSource
  playbackState?: PlaybackState
  className?: string
}

type ElementStatus = "idle" | "loading" | "error"

/**
 * Reusable player shell. Renders a real <video>/<iframe>/external link only
 * when handed a usable VideoSource — none of the current demo data sets
 * one, so every title/episode renders the development-preview state below.
 * This is intentional: see lib/playback.ts and lib/types.ts (VideoSource).
 */
export function VideoPlayer({
  title,
  gradient,
  poster,
  source,
  playbackState = DEFAULT_PLAYBACK_STATE,
  className,
}: VideoPlayerProps) {
  const [elementStatus, setElementStatus] = useState<ElementStatus>("idle")

  const hasUsableSource = Boolean(source && source.sourceType !== "unavailable" && source.url)
  const showPlayer = playbackState === "PLAYING" && hasUsableSource
  const showError = playbackState === "ERROR" || elementStatus === "error"

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black",
        className
      )}
    >
      <PosterArt gradient={gradient} className="absolute inset-0" showLabel={false} />

      {showPlayer ? (
        <PlayerElement
          title={title}
          poster={poster}
          source={source as VideoSource}
          onLoadStart={() => setElementStatus("loading")}
          onReady={() => setElementStatus("idle")}
          onError={() => setElementStatus("error")}
        />
      ) : null}

      {!showPlayer && !showError ? <DevelopmentPreviewOverlay title={title} playbackState={playbackState} /> : null}

      {showPlayer && elementStatus === "loading" ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          role="status"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-primary"
          />
          <span className="sr-only">Loading video…</span>
        </div>
      ) : null}

      {showError ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/75 p-6 text-center"
          role="alert"
        >
          <p className="text-sm font-semibold text-destructive">Playback error</p>
          <p className="max-w-xs text-xs text-white/70">
            This video couldn&apos;t be played. Please try again later.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function PlayerElement({
  title,
  poster,
  source,
  onLoadStart,
  onReady,
  onError,
}: {
  title: string
  poster?: string
  source: VideoSource
  onLoadStart: () => void
  onReady: () => void
  onError: () => void
}) {
  if (source.sourceType === "native") {
    return (
      <video
        key={source.url}
        className="absolute inset-0 h-full w-full"
        controls
        preload="metadata"
        poster={poster}
        aria-label={`${title} video player`}
        onLoadStart={onLoadStart}
        onCanPlay={onReady}
        onError={onError}
      >
        <source src={source.url} />
      </video>
    )
  }

  if (source.sourceType === "embed" && source.embedSupported) {
    return (
      <iframe
        key={source.url}
        src={source.url}
        title={`${title} player`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        onLoad={onReady}
      />
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
      <p className="text-sm text-white/80">This title plays on an external site.</p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Open player (opens in a new tab)
      </a>
    </div>
  )
}

function DevelopmentPreviewOverlay({
  title,
  playbackState,
}: {
  title: string
  playbackState: PlaybackState
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 p-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border border-primary/40 bg-black/50">
        <Play className="size-6 text-primary/70" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-white">Development Preview</p>
        <p className="max-w-sm text-sm text-white/70">
          Real content playback for &ldquo;{title}&rdquo; is not connected yet.
        </p>
      </div>
      <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
        {playbackState.replace(/_/g, " ")}
      </span>
    </div>
  )
}
