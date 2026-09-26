import type { VideoSource } from "@/lib/types"

/**
 * Structural validation failure reasons — never shown to users verbatim
 * (see components/video-player.tsx, which maps all of these to one
 * generic "invalid source" message so nothing internal leaks to the UI).
 */
export type SourceValidationErrorReason =
  | "missing_url"
  | "malformed_url"
  | "unsupported_protocol"
  | "unsupported_source_type"
  | "missing_provider"

export interface SourceValidationError {
  reason: SourceValidationErrorReason
  message: string
}

export type VideoSourceResolution =
  | { ok: true; source: VideoSource }
  | { ok: false; error: SourceValidationError }

/**
 * Adapter contract a future real content provider implements — mirrors
 * lib/ad-gate's AdProvider pattern (a swappable interface, never a
 * concrete class, consumed directly by the rest of the app).
 */
export interface ContentSourceProvider {
  readonly id: string
  /** Structural check only — never confirms the URL actually serves playable media. */
  canPlay(source: VideoSource): boolean
  /** Validates/normalizes an arbitrary raw value into a trusted VideoSource, or a typed failure. */
  resolve(raw: unknown): VideoSourceResolution
}
