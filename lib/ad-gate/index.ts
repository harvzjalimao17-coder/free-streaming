import { MockAdProvider } from "./mock-provider"
import type { AdProvider } from "./types"

/**
 * The single place a future stage swaps in a real ad provider — everything
 * that depends on ad-gate behavior (the API routes) only ever imports the
 * `AdProvider` interface and this `adProvider` instance, never the
 * concrete MockAdProvider class directly. Server-only (re-exports the
 * mock provider's implementation) — client code should import from
 * ./types instead.
 */
export const adProvider: AdProvider = new MockAdProvider()

export type {
  AdProvider,
  AdSession,
  AdSessionState,
  ContentType,
  StartSessionInput,
  StartSessionResult,
  VerifyFailureReason,
  VerifySessionInput,
  VerifySessionResult,
} from "./types"
