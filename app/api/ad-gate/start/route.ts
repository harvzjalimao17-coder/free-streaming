import { adProvider } from "@/lib/ad-gate"
import type { ContentType } from "@/lib/ad-gate/types"

const VALID_CONTENT_TYPES: ContentType[] = ["movie", "episode"]

/**
 * Creates a server-side development ad session and returns only what the
 * client needs to run the mock ad UI and later call /verify. No client
 * input is ever trusted as proof of ad completion — see verify/route.ts.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "contentType and contentId are required." }, { status: 400 })
  }

  const { contentType, contentId } = body as Record<string, unknown>

  if (typeof contentType !== "string" || !VALID_CONTENT_TYPES.includes(contentType as ContentType)) {
    return Response.json({ error: 'contentType must be "movie" or "episode".' }, { status: 400 })
  }

  if (typeof contentId !== "string" || contentId.trim() === "") {
    return Response.json({ error: "contentId is required." }, { status: 400 })
  }

  const result = await adProvider.startSession({
    contentType: contentType as ContentType,
    contentId,
  })

  return Response.json(result, { status: 201 })
}
