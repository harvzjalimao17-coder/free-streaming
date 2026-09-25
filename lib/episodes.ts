import type { Episode } from "@/lib/types"

/**
 * Minimal development placeholder episodes — intentionally NOT a full
 * episode catalog. These exist only to exercise the /watch/episode/[id]
 * route architecture before real episode data/sources are connected.
 * Tied to "Deep Current" (Title id "t10"). No `source` is set for either
 * entry — episode playback is not connected yet.
 */
export const EPISODES: Episode[] = [
  {
    id: "deep-current-s1e1",
    seriesId: "t10",
    episodeNumber: 1,
    title: "Signal Depth",
    description:
      "The salvage crew boards the sunken research vessel and hears the decade-old warning broadcast for the first time.",
    duration: "42m",
  },
  {
    id: "deep-current-s1e2",
    seriesId: "t10",
    episodeNumber: 2,
    title: "Static Pressure",
    description:
      "As the hull begins to fail, the crew realizes the ship's AI has been counting down to something.",
    duration: "39m",
  },
]

export function getEpisodeById(id: string): Episode | undefined {
  return EPISODES.find((episode) => episode.id === id)
}
