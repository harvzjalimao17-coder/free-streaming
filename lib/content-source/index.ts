import { DevelopmentSourceProvider } from "./mock-provider"
import type { ContentSourceProvider } from "./types"

/**
 * The single place a future stage swaps in a real content provider —
 * VideoPlayer and everything else depends only on the ContentSourceProvider
 * interface and this instance, never the concrete class directly.
 */
export const contentSourceProvider: ContentSourceProvider = new DevelopmentSourceProvider()

export { validateVideoSource } from "./validate"
export type {
  ContentSourceProvider,
  SourceValidationError,
  SourceValidationErrorReason,
  VideoSourceResolution,
} from "./types"
