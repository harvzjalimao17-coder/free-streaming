import type { SourceType, VideoSource } from "@/lib/types"
import type { SourceValidationErrorReason, VideoSourceResolution } from "./types"

/**
 * Single, centralized structural validator for VideoSource data — the
 * only place this app decides whether a source is safe to render. Every
 * consumer (VideoPlayer today; any future provider adapter) must resolve
 * a raw value through this before treating it as playable.
 *
 * Intentionally structural only: this never confirms a URL actually
 * serves a real, licensed video — it only rejects data that could not be
 * safely rendered at all (wrong shape, wrong protocol, missing fields).
 */

const ALLOWED_PROTOCOLS = new Set(["https:"])
const VALID_SOURCE_TYPES: readonly SourceType[] = ["native", "embed", "external", "unavailable"]

function fail(reason: SourceValidationErrorReason, message: string): VideoSourceResolution {
  return { ok: false, error: { reason, message } }
}

export function validateVideoSource(raw: unknown): VideoSourceResolution {
  if (typeof raw !== "object" || raw === null) {
    return fail("unsupported_source_type", "Source must be an object.")
  }

  const candidate = raw as Record<string, unknown>
  const sourceType = candidate.sourceType

  if (typeof sourceType !== "string" || !VALID_SOURCE_TYPES.includes(sourceType as SourceType)) {
    return fail("unsupported_source_type", "Unrecognized source type.")
  }

  if (sourceType === "unavailable") {
    return { ok: true, source: { sourceType: "unavailable" } }
  }

  const url = candidate.url
  if (typeof url !== "string" || url.trim() === "") {
    return fail("missing_url", "A source URL is required.")
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return fail("malformed_url", "The source URL is not a valid URL.")
  }

  // https-only, structurally — this alone rejects javascript:, data:, file:,
  // and plain http: for every source type without needing a separate check.
  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return fail("unsupported_protocol", `The "${parsed.protocol}" protocol is not allowed.`)
  }

  const provider = candidate.provider
  const requiresProvider = sourceType === "embed" || sourceType === "external"
  if (requiresProvider && (typeof provider !== "string" || provider.trim() === "")) {
    return fail("missing_provider", "A provider label is required for embed and external sources.")
  }

  const embedSupported = candidate.embedSupported
  if (embedSupported !== undefined && typeof embedSupported !== "boolean") {
    return fail("unsupported_source_type", "embedSupported must be a boolean when present.")
  }

  const source: VideoSource = { sourceType: sourceType as SourceType, url: parsed.toString() }
  if (typeof provider === "string") source.provider = provider
  if (typeof embedSupported === "boolean") source.embedSupported = embedSupported

  return { ok: true, source }
}
