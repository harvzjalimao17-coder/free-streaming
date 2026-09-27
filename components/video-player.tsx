"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { PictureInPicture, Play } from "lucide-react"
import type { VideoSource } from "@/lib/types"
import { DEFAULT_PLAYBACK_STATE, type PlaybackState } from "@/lib/playback"
import { contentSourceProvider } from "@/lib/content-source"
import { PosterArt } from "@/components/poster-art"
import { Button } from "@/components/ui/button"
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

// MediaError.code values (no DOM lib enum for these) mapped to plain-language
// messages — purely cosmetic error copy, does not change error *handling*.
const MEDIA_ERROR_MESSAGES: Record<number, string> = {
  1: "Playback was interrupted before it could finish loading.",
  2: "A network problem interrupted playback. Check your connection and try again.",
  3: "This video couldn't be decoded — it may be corrupted or use an unsupported format.",
  4: "This video's format isn't supported by your browser.",
}
const DEFAULT_PLAYBACK_ERROR_MESSAGE = "This video couldn't be played. Please try again later."

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
  // Set only by the native <video>'s own onWaiting/onPlaying events — a
  // stall that happens *after* playback has already started, distinct
  // from the initial "loading" status above.
  const [isBuffering, setIsBuffering] = useState(false)
  // Bumped on Retry to force a fresh <video> element (new `key`), which
  // restarts loading of the same source without a page reload.
  const [reloadKey, setReloadKey] = useState(0)
  // Purely cosmetic UX state below — none of it affects the ad-gate,
  // content-source resolution, or the conditions under which a source is
  // considered playable.
  const [hasStarted, setHasStarted] = useState(false)
  // Browser capability, not runtime state — a lazy initializer avoids
  // needing an effect (and matches SSR, where `document` is undefined).
  const [pipSupported] = useState(
    () => typeof document !== "undefined" && document.pictureInPictureEnabled === true
  )
  const [playbackErrorMessage, setPlaybackErrorMessage] = useState<string | null>(null)
  const [trackedSourceUrl, setTrackedSourceUrl] = useState<string | undefined>(undefined)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const resolution = useMemo(
    () => contentSourceProvider.resolve(source ?? { sourceType: "unavailable" }),
    [source]
  )

  const nativeSourceUrl =
    resolution.ok && resolution.source.sourceType === "native" ? resolution.source.url : undefined

  // A fresh source (a different title) should get its own "not started yet"
  // affordance again, not inherit the previous title's played state. Adjusted
  // during render (React's recommended pattern for resetting state when a
  // prop changes) rather than in an effect.
  if (nativeSourceUrl !== trackedSourceUrl) {
    setTrackedSourceUrl(nativeSourceUrl)
    setHasStarted(false)
  }

  const handleRetry = useCallback(() => {
    setElementStatus("idle")
    setIsBuffering(false)
    setPlaybackErrorMessage(null)
    setReloadKey((key) => key + 1)
  }, [])

  const handlePlayClick = useCallback(() => {
    videoRef.current?.play().catch(() => {
      // Autoplay/policy rejection — the video's own controls remain the
      // fallback; no state change needed here.
    })
  }, [])

  const handlePipToggle = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (document.pictureInPictureElement === video) {
      document.exitPictureInPicture().catch(() => {})
    } else {
      video.requestPictureInPicture().catch(() => {})
    }
  }, [])

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
  const showLoadingIndicator =
    (nativeSource !== null || (embedSource !== null && embedRenderable)) &&
    !showError &&
    (elementStatus === "loading" || isBuffering)
  const showInitialPlayAffordance =
    nativeSource !== null && !showError && !hasStarted && elementStatus !== "loading"
  // Gated on hasStarted so this never overlaps/competes with the
  // full-frame initial-play button below for the same click.
  const showPipButton = nativeSource !== null && pipSupported && !showError && hasStarted

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
          key={`${nativeSource.url}-${reloadKey}`}
          ref={videoRef}
          className="absolute inset-0 h-full w-full"
          controls
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`${title} video player`}
          onLoadStart={() => {
            setElementStatus("loading")
            setIsBuffering(false)
          }}
          onCanPlay={() => setElementStatus("idle")}
          onPlaying={() => setIsBuffering(false)}
          onWaiting={() => setIsBuffering(true)}
          onPlay={() => setHasStarted(true)}
          onError={(event) => {
            const mediaError = event.currentTarget.error
            setElementStatus("error")
            setIsBuffering(false)
            setPlaybackErrorMessage(mediaError ? (MEDIA_ERROR_MESSAGES[mediaError.code] ?? null) : null)
          }}
        >
          <source src={nativeSource.url} />
        </video>
      ) : null}

      {showPipButton ? (
        <button
          type="button"
          onClick={handlePipToggle}
          aria-label="Picture in picture"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <PictureInPicture className="size-4" aria-hidden="true" />
        </button>
      ) : null}

      {showInitialPlayAffordance ? (
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/35 focus-visible:outline-none"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/40 transition-transform group-hover:scale-105 group-focus-visible:ring-3 group-focus-visible:ring-ring/50 motion-reduce:transition-none">
            <Play className="size-7 fill-current" aria-hidden="true" />
          </span>
        </button>
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

      {showLoadingIndicator ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          role="status"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-primary motion-reduce:animate-none"
          />
          <span className="sr-only">{elementStatus === "loading" ? "Loading video…" : "Buffering…"}</span>
        </div>
      ) : null}

      {showError ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/75 p-6 text-center"
          role="alert"
        >
          <p className="text-sm font-semibold text-destructive">Playback unavailable</p>
          <p className="max-w-xs text-xs text-white/70">
            {nativeSource ? playbackErrorMessage ?? DEFAULT_PLAYBACK_ERROR_MESSAGE : DEFAULT_PLAYBACK_ERROR_MESSAGE}
          </p>
          {nativeSource ? (
            <Button onClick={handleRetry} size="sm" variant="outline" className="gap-1.5 text-xs">
              Retry
            </Button>
          ) : null}
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
