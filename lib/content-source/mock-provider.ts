import type { VideoSource } from "@/lib/types"
import type { ContentSourceProvider, VideoSourceResolution } from "./types"
import { validateVideoSource } from "./validate"

/**
 * Development/demo provider — demonstrates the ContentSourceProvider
 * contract without any real external integration. It validates and
 * passes through already-VideoSource-shaped data (our own demo data's
 * shape) rather than adapting a real third party's response format.
 *
 * A future real provider (an authorized licensor's API, for example)
 * implements this same interface instead, translating its own response
 * shape into VideoSource inside resolve() — everything else in the app
 * (VideoPlayer, watch pages) depends only on ContentSourceProvider and
 * never needs to change when that swap happens.
 */
export class DevelopmentSourceProvider implements ContentSourceProvider {
  readonly id = "development-mock"

  canPlay(source: VideoSource): boolean {
    return source.sourceType !== "unavailable"
  }

  resolve(raw: unknown): VideoSourceResolution {
    return validateVideoSource(raw)
  }
}
