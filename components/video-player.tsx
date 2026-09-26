"use client"

import { useMemo, useState } from "react"
import { Play } from "lucide-react"
import type { VideoSource } from "@/lib/types"
import { DEFAULT_PLAYBACK_STATE, type PlaybackState } from "@/lib/playback"
import { contentSourceProvider } from "@/lib/content-source"
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
 * Reusable player shell. Every source is resolved through
 * contentSourceProvider.resolve() (lib/content-source) before it is ever
 * rendered — this is the app's one centralized validation boundary, so
 * nothing here trusts a `source` prop's shape at face value, even though
 * TypeScript already types it as VideoSource.
 *
 * Nothing is rendered as playable unless playbackState === "PLAYING" —
 * this is the Stage 4 ad-gate boundary's second line of defense: even if
 * a source were somehow present, this component still refuses to reveal
 * any source-specific UI (video, iframe, or the external-watch link)
 * until it is explicitly told the gate has been passed.
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

  const resolution = useMemo(
    () => contentSourceProvider.resolve(source ?? { sourceType: "unavailable" }),
    [source]
  )

  const isPlaying = playbackState === "PLAYING"
  const showError = playbackState === "ERROR" || elementStatus === "error"

  // Narrow directly off the discriminated `resolution` union so each
  // branch below gets a concretely-typed VideoSource, never a "possibly
  // null" value pulled from a separately-computed boolean.
  const nativeSource = isPlaying && resolution.ok && resolution.source.sourceType === "native" ? resolution.source : null
  const embedSource =
    isPlaying && resolution.ok && resolution.source.sourceType === "embed" ? resolution.source : null
  const externalSource =
    isPlaying && resolution.ok && resolution.source.sourceType === "external" ? resolution.source : null
  const unavailable = isPlaying && resolution.ok && resolution.source.sourceType === "unavailable"
  const invalid = isPlaying && !resolution.ok
  const embedRenderable = embedSource !== null && embedSource.embedSupported === true

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black",
        className
      )}
    >
      <PosterArt gradient={gradient} className="absolute inset-0" showLabel={false} />

      {nativeSource ? (
        <video
          key={nativeSource.url}
          className="absolute inset-0 h-full w-full"
          controls
          preload="metadata"
          poster={poster}
          aria-label={`${title} video player`}
          onLoadStart={() => setElementStatus("loading")}
          onCanPlay={() => setElementStatus("idle")}
          onError={() => setElementStatus("error")}
        >
          <source src={nativeSource.url} />
        </video>
      ) : null}

      {embedSource && embedRenderable ? (
        <iframe
          key={embedSource.url}
          src={embedSource.url}
          title={`${title} player`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          onLoad={() => setElementStatus("idle")}
          onError={() => setElementStatus("error")}
        />
      ) : null}

      {!showError && invalid ? <InvalidSourceOverlay /> : null}

      {!showError && unavailable ? <DevelopmentPreviewOverlay title={title} playbackState={playbackState} /> : null}

      {!showError && embedSource && !embedRenderable ? <EmbedNotSupportedOverlay /> : null}

      {!showError && externalSource ? <ExternalWatchOverlay title={title} source={externalSource} /> : null}

      {!showError && !isPlaying ? <DevelopmentPreviewOverlay title={title} playbackState={playbackState} /> : null}

      {(nativeSource || (embedSource && embedRenderable)) && elementStatus === "loading" ? (
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
          <p className="text-sm font-semibold text-destructive">Playback unavailable</p>
          <p className="max-w-xs text-xs text-white/70">
            This video couldn&apos;t be played. Please try again later.
          </p>
        </div>
      ) : null}
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

function InvalidSourceOverlay() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/70 p-6 text-center"
      role="alert"
    >
      <p className="text-sm font-semibold text-destructive">This title can&apos;t be played right now</p>
      <p className="max-w-xs text-xs text-white/70">Please try again later.</p>
    </div>
  )
}

function EmbedNotSupportedOverlay() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/65 p-6 text-center"
      role="status"
    >
      <p className="text-sm font-semibold text-white">Playback unavailable</p>
      <p className="max-w-xs text-xs text-white/70">
        This provider&apos;s embedded player isn&apos;t enabled here.
      </p>
    </div>
  )
}

function ExternalWatchOverlay({ title, source }: { title: string; source: VideoSource }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
      <p className="max-w-xs text-sm text-white/80">
        &ldquo;{title}&rdquo; plays on {source.provider ? source.provider : "an external site"}. You&apos;ll
        leave StreamFree.
      </p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Open on {source.provider ? source.provider : "external site"} (opens in a new tab)
      </a>
    </div>
  )
}
