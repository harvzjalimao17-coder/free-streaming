/**
 * Playback state machine for the ad-gated watch flow, driven by
 * components/watch-gate.tsx:
 *
 *   LOCKED -> AD_LOADING -> AD_PLAYING -> AD_COMPLETED -> CONTENT_UNLOCKED -> PLAYING
 *
 * ERROR is reachable from any step (surfaced today via VideoPlayer's own
 * <video>/<iframe> load-error handling once content is unlocked).
 *
 * The AD_* transitions in this stage are a clearly-labeled development
 * mock — a timed countdown, not a real ad provider — run entirely in the
 * browser. Reaching CONTENT_UNLOCKED is therefore NOT a real
 * authorization/entitlement check; there is no server to verify it
 * against yet. A later stage must replace the mock ad step with a real
 * provider and verify the unlock server-side (once auth exists). Never
 * trust this client state as a substitute for that check.
 *
 * DEVELOPMENT_PREVIEW is kept for backward compatibility with components
 * that render outside the gate flow (or before it starts); it is no
 * longer the active default now that the (mocked) gate exists.
 */
export type PlaybackState =
  | "LOCKED"
  | "AD_LOADING"
  | "AD_PLAYING"
  | "AD_COMPLETED"
  | "CONTENT_UNLOCKED"
  | "PLAYING"
  | "ERROR"
  | "DEVELOPMENT_PREVIEW"

export const DEFAULT_PLAYBACK_STATE: PlaybackState = "LOCKED"

export const PLAYBACK_STATE_LABELS: Record<PlaybackState, string> = {
  LOCKED: "Locked",
  AD_LOADING: "Loading ad",
  AD_PLAYING: "Ad playing",
  AD_COMPLETED: "Ad completed",
  CONTENT_UNLOCKED: "Content unlocked",
  PLAYING: "Playing",
  ERROR: "Playback error",
  DEVELOPMENT_PREVIEW: "Development preview",
}
