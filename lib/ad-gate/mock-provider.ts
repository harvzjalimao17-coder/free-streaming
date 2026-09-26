import type {
  AdProvider,
  AdSession,
  StartSessionInput,
  StartSessionResult,
  VerifySessionInput,
  VerifySessionResult,
} from "./types"
import { MOCK_AD_DURATION_SECONDS, MOCK_SESSION_TTL_SECONDS } from "./types"

/**
 * Server-only module — import only from Route Handlers (via lib/ad-gate,
 * which instantiates this class). Client code must only ever import
 * *types* from lib/ad-gate/types (via `import type`), never this file.
 *
 * DEVELOPMENT-ONLY in-memory session store.
 *
 * This is explicitly NOT production-grade persistence:
 *  - Lives only in this Node process's memory — lost on every restart,
 *    redeploy, or (in dev) Turbopack module reload.
 *  - Does not work across multiple server instances, or in a serverless/
 *    edge deployment where each invocation may get a fresh process.
 *  - Not encrypted, not rate-limited, no real database behind it.
 *
 * A production provider must replace this with a real shared store (a
 * database, Redis, or the real ad provider's own server-to-server session
 * API) — see the AdProvider interface in types.ts, which this class
 * implements so that swap requires no changes outside lib/ad-gate/index.ts.
 */
const sessions = new Map<string, AdSession>()

function sweepExpired(now: number) {
  for (const [id, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(id)
    }
  }
}

export class MockAdProvider implements AdProvider {
  readonly id = "development-mock"

  async startSession(input: StartSessionInput): Promise<StartSessionResult> {
    const now = Date.now()
    sweepExpired(now)

    const sessionId = crypto.randomUUID()
    const expiresAt = now + MOCK_SESSION_TTL_SECONDS * 1000

    const session: AdSession = {
      sessionId,
      contentType: input.contentType,
      contentId: input.contentId,
      provider: this.id,
      state: "started",
      createdAt: now,
      expiresAt,
    }

    sessions.set(sessionId, session)

    return {
      sessionId,
      provider: this.id,
      minAdSeconds: MOCK_AD_DURATION_SECONDS,
      expiresAt,
    }
  }

  async verifySession(input: VerifySessionInput): Promise<VerifySessionResult> {
    const now = Date.now()
    const session = sessions.get(input.sessionId)

    if (!session) {
      return { ok: false, reason: "missing_session", message: "No ad session found for that ID." }
    }

    if (session.provider !== this.id) {
      return { ok: false, reason: "invalid_session", message: "Session was not issued by this provider." }
    }

    if (session.expiresAt < now) {
      sessions.delete(input.sessionId)
      return { ok: false, reason: "expired_session", message: "This ad session has expired." }
    }

    if (session.contentType !== input.contentType) {
      return {
        ok: false,
        reason: "content_type_mismatch",
        message: "Session does not match the requested content type.",
      }
    }

    if (session.contentId !== input.contentId) {
      return {
        ok: false,
        reason: "content_id_mismatch",
        message: "Session does not match the requested content.",
      }
    }

    // The server — not the client — decides whether the ad "completed", by
    // checking real elapsed wall-clock time against this session's own
    // createdAt. A client claiming `{ adCompleted: true }` has no bearing
    // here at all; only this check does. Idempotent: a session already
    // marked "verified" with matching content skips straight to success.
    if (session.state !== "verified") {
      const elapsedSeconds = (now - session.createdAt) / 1000
      if (elapsedSeconds < MOCK_AD_DURATION_SECONDS) {
        return { ok: false, reason: "ad_not_completed", message: "The ad has not finished playing yet." }
      }
    }

    session.state = "verified"
    sessions.set(input.sessionId, session)

    return { ok: true, unlockToken: crypto.randomUUID(), expiresAt: session.expiresAt }
  }
}
