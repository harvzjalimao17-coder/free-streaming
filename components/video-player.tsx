"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { PictureInPicture, Play } from "lucide-react"
import type { VideoSource } from "@/lib/types"
import { DEFAULT_PLAYBACK_STATE, type PlaybackState } from "@/lib/playback"
import { contentSourceProvider } from "@/lib/content-source"
import { type HistoryContentType, recordWatchCompleted, recordWatchStarted } from "@/lib/history"
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
  /**
   * Identifies this content for watch-history (lib/history.ts) and, when
   * present, is also preferred as the resume-playback identity (see
   * deriveResumeKey below) so two titles sharing the same dev-source URL
   * never share resume progress. Omit both to opt out of history recording;
   * resume then falls back to keying off the source URL alone.
   */
  contentType?: HistoryContentType
  contentId?: string
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

// --- Resume playback (localStorage only, keyed by a stable per-title
// identity when available — falls back to the source URL otherwise) ------
// A minimal, isolated convenience feature: best-effort, never required for
// playback to work, and never trusted for anything beyond "where did this
// browser last leave off." Failures (storage disabled/full/private mode)
// are swallowed — resume simply doesn't offer itself, nothing else breaks.
const RESUME_STORAGE_PREFIX = "streamfree:resume:"
const RESUME_MIN_SECONDS = 5
const RESUME_END_THRESHOLD_SECONDS = 15
const RESUME_SAVE_INTERVAL_MS = 5000

/**
 * Resume identity: prefers `${contentType}:${contentId}` — the same stable
 * identifiers lib/history.ts already uses — so two catalog titles that
 * happen to share the same underlying dev-source URL never share resume
 * progress. Falls back to the raw source URL only when contentType/
 * contentId aren't supplied.
 */
function deriveResumeKey(
  contentType: HistoryContentType | undefined,
  contentId: string | undefined,
  url: string | undefined
): string | undefined {
  if (contentType && contentId) return `${contentType}:${contentId}`
  return url
}

function readResumeTime(key: string | undefined): number | null {
  if (!key || typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(RESUME_STORAGE_PREFIX + key)
    if (!raw) return null
    const value = Number(raw)
    return Number.isFinite(value) && value > 0 ? value : null
  } catch {
    return null
  }
}

function writeResumeTime(key: string | undefined, time: number) {
  if (!key || typeof window === "undefined") return
  try {
    window.localStorage.setItem(RESUME_STORAGE_PREFIX + key, String(Math.floor(time)))
  } catch {
    // Best-effort only.
  }
}

function clearResumeTime(key: string | undefined) {
  if (!key || typeof window === "undefined") return
  try {
    window.localStorage.removeItem(RESUME_STORAGE_PREFIX + key)
  } catch {
    // Best-effort only.
  }
}

function formatResumeLabel(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (value: number) => String(value).padStart(2, "0")
  return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${mins}:${pad(secs)}`
}

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
  contentType,
  contentId,
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
  const [trackedResumeKey, setTrackedResumeKey] = useState<string | undefined>(undefined)
  // Resume-playback state — see the localStorage helpers above.
  const [duration, setDuration] = useState<number | null>(null)
  const [savedResumeTime, setSavedResumeTime] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastResumeSaveAtRef = useRef(0)

  const resolution = useMemo(
    () => contentSourceProvider.resolve(source ?? { sourceType: "unavailable" }),
    [source]
  )

  const nativeSourceUrl =
    resolution.ok && resolution.source.sourceType === "native" ? resolution.source.url : undefined
  // Prefers the stable contentType/contentId identity over the raw URL, so
  // two titles sharing the same dev-source URL never share resume state.
  const resumeKey = deriveResumeKey(contentType, contentId, nativeSourceUrl)

  // A fresh title (a different resume identity) should get its own "not
  // started yet" affordance again, not inherit a previous title's
  // played/resume state. Adjusted during render (React's recommended
  // pattern for resetting state when a prop changes) rather than in an
  // effect.
  if (resumeKey !== trackedResumeKey) {
    setTrackedResumeKey(resumeKey)
    setHasStarted(false)
    setDuration(null)
    setSavedResumeTime(resumeKey ? readResumeTime(resumeKey) : null)
  }

  // Only a real, meaningfully-incomplete saved position is ever offered —
  // requires knowing the real duration (from onLoadedMetadata) first, so
  // this stays null until metadata has loaded.
  const resumeOfferSeconds =
    savedResumeTime !== null &&
    savedResumeTime >= RESUME_MIN_SECONDS &&
    duration !== null &&
    duration - savedResumeTime > RESUME_END_THRESHOLD_SECONDS
      ? savedResumeTime
      : null

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

  const handleResumeFromSaved = useCallback(() => {
    const video = videoRef.current
    if (video && resumeOfferSeconds !== null) {
      video.currentTime = resumeOfferSeconds
    }
    handlePlayClick()
  }, [resumeOfferSeconds, handlePlayClick])

  const handleStartOver = useCallback(() => {
    handlePlayClick()
  }, [handlePlayClick])

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
  const showResumePrompt =
    nativeSource !== null &&
    !showError &&
    !hasStarted &&
    elementStatus !== "loading" &&
    resumeOfferSeconds !== null
  const showInitialPlayAffordance =
    nativeSource !== null &&
    !showError &&
    !hasStarted &&
    elementStatus !== "loading" &&
    !showResumePrompt
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
          onPlay={() => {
            setHasStarted(true)
            if (contentType && contentId) recordWatchStarted(contentType, contentId)
          }}
          onLoadedMetadata={(event) => {
            const videoDuration = event.currentTarget.duration
            setDuration(Number.isFinite(videoDuration) ? videoDuration : null)
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget
            if (video.paused || video.seeking) return
            const now = Date.now()
            if (now - lastResumeSaveAtRef.current < RESUME_SAVE_INTERVAL_MS) return
            lastResumeSaveAtRef.current = now
            writeResumeTime(resumeKey, video.currentTime)
            if (contentType && contentId) recordWatchStarted(contentType, contentId)
          }}
          onPause={(event) => {
            if (!event.currentTarget.ended) {
              writeResumeTime(resumeKey, event.currentTarget.currentTime)
            }
          }}
          onEnded={() => {
            clearResumeTime(resumeKey)
            if (contentType && contentId) recordWatchCompleted(contentType, contentId)
          }}
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

      {showResumePrompt ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-6 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Play className="size-7 fill-current" aria-hidden="true" />
          </span>
          <p className="text-sm text-white/80">
            Resume from{" "}
            <span className="font-semibold text-white">{formatResumeLabel(resumeOfferSeconds ?? 0)}</span>?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={handleResumeFromSaved} size="sm" className="gap-1.5 text-xs">
              Resume
            </Button>
            <Button onClick={handleStartOver} size="sm" variant="outline" className="gap-1.5 text-xs">
              Start Over
            </Button>
          </div>
        </div>
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
