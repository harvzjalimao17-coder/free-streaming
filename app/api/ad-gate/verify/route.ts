import { adProvider } from "@/lib/ad-gate"
import type { ContentType, VerifyFailureReason } from "@/lib/ad-gate/types"

const VALID_CONTENT_TYPES: ContentType[] = ["movie", "episode"]

const STATUS_BY_REASON: Record<VerifyFailureReason, number> = {
  missing_session: 404,
  invalid_session: 404,
  expired_session: 410,
  content_type_mismatch: 409,
  content_id_mismatch: 409,
  ad_not_completed: 425, // Too Early — RFC 8470
}

/**
 * Verifies a server-created ad session. This endpoint — not the client —
 * decides whether the ad actually completed (see MockAdProvider), so a
 * request body of `{ adCompleted: true }` has no effect here: only a
 * valid, non-expired, content-matching sessionId that has genuinely aged
 * past the minimum ad duration can succeed.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return Response.json(
      { error: "sessionId, contentType, and contentId are required." },
      { status: 400 }
    )
  }

  const { sessionId, contentType, contentId } = body as Record<string, unknown>

  if (typeof sessionId !== "string" || sessionId.trim() === "") {
    return Response.json({ error: "sessionId is required." }, { status: 400 })
  }

  if (typeof contentType !== "string" || !VALID_CONTENT_TYPES.includes(contentType as ContentType)) {
    return Response.json({ error: 'contentType must be "movie" or "episode".' }, { status: 400 })
  }

  if (typeof contentId !== "string" || contentId.trim() === "") {
    return Response.json({ error: "contentId is required." }, { status: 400 })
  }

  const result = await adProvider.verifySession({
    sessionId,
    contentType: contentType as ContentType,
    contentId,
  })

  if (!result.ok) {
    return Response.json(
      { ok: false, reason: result.reason, error: result.message },
      { status: STATUS_BY_REASON[result.reason] }
    )
  }

  return Response.json(result, { status: 200 })
}
