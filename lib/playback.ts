/**
 * Conceptual playback state machine for the future ad-gated watch flow.
 *
 * Intended future flow (NOT implemented yet — this stage only establishes
 * the types so the next stage can wire up real transitions without
 * redesigning the player or watch pages):
 *
 *   LOCKED -> AD_LOADING -> AD_PLAYING -> AD_COMPLETED -> CONTENT_UNLOCKED -> PLAYING
 *
 * ERROR is reachable from any step. DEVELOPMENT_PREVIEW stands in for the
 * entire flow until there is both a real, authorized content source and a
 * real ad provider — every watch page in this stage renders that state.
 *
 * Client-side state must never be trusted as a real unlock/authorization
 * signal (e.g. a client `adCompleted = true` flag). The next stage's real
 * ad-gate architecture will need to verify unlock server-side before a
 * usable source is ever handed to the player.
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

export const DEFAULT_PLAYBACK_STATE: PlaybackState = "DEVELOPMENT_PREVIEW"

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
