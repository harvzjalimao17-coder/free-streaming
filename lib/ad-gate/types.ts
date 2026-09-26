/**
 * Provider-agnostic ad-gate contract. Both the mock development provider
 * (mock-provider.ts) and any future real provider implement this same
 * interface, so the API routes and WatchGate never need to change when the
 * provider does. Client-safe (types + constants only — no server-only
 * imports) so it can be imported from both Route Handlers and 'use client'
 * components without pulling server code into the browser bundle.
 */

export type ContentType = "movie" | "episode"

/** Minimum seconds the mock ad must have been running before verify() can succeed. */
export const MOCK_AD_DURATION_SECONDS = 5

/** Development session expiration — intentionally short-lived. */
export const MOCK_SESSION_TTL_SECONDS = 600 // 10 minutes

export type AdSessionState = "started" | "verified"

export interface AdSession {
  sessionId: string
  contentType: ContentType
  contentId: string
  provider: string
  state: AdSessionState
  createdAt: number
  expiresAt: number
}

export interface StartSessionInput {
  contentType: ContentType
  contentId: string
}

export interface StartSessionResult {
  sessionId: string
  provider: string
  minAdSeconds: number
  expiresAt: number
}

export interface VerifySessionInput {
  sessionId: string
  contentType: ContentType
  contentId: string
}

export type VerifyFailureReason =
  | "missing_session"
  | "invalid_session"
  | "expired_session"
  | "content_type_mismatch"
  | "content_id_mismatch"
  | "ad_not_completed"

export interface VerifySessionSuccess {
  ok: true
  unlockToken: string
  expiresAt: number
}

export interface VerifySessionFailure {
  ok: false
  reason: VerifyFailureReason
  message: string
}

export type VerifySessionResult = VerifySessionSuccess | VerifySessionFailure

/**
 * Server-side ad provider contract. `startSession`/`verifySession` are the
 * only two operations the rest of the app depends on — swap the exported
 * instance in index.ts to plug in a real provider later.
 */
export interface AdProvider {
  readonly id: string
  startSession(input: StartSessionInput): Promise<StartSessionResult>
  verifySession(input: VerifySessionInput): Promise<VerifySessionResult>
}
