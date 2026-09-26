# StreamFree — Content Provider Requirements

**Status:** Internal reference document. Documentation only — establishes what must be
verified before any movie, short-film, or episodic content provider is integrated into
StreamFree. No provider is recommended, ranked, contacted, or integrated by this document.

**Context:** StreamFree's `ContentSourceProvider` abstraction (`lib/content-source`) and
`VideoSource` model (`lib/types.ts`) are architecturally ready to accept a real provider.
Prior research (Meet Makers, Internet Archive, modern AVOD/licensing aggregators) found no
provider yet cleared against the requirements below. This document defines what "cleared"
means so that determination can be made consistently for any future candidate.

---

## 1. Content Licensing

| Requirement | Classification | Notes |
|---|---|---|
| Commercial use explicitly permitted | **REQUIRED** | Must be stated in the license/contract itself, not inferred from public availability or an uploader's description. |
| Ad-supported use explicitly permitted | **REQUIRED** | Commercial use and ad-supported use are not always the same grant — some licenses (e.g. certain Creative Commons variants, some AVOD deals) permit one without the other. Both must be confirmed independently. |
| Streaming/public performance rights | **REQUIRED** | The right to transmit the content to end users on demand, distinct from a right to merely host or store it. |
| Embedding rights (if using an embed/iframe mechanism) | **REQUIRED if `sourceType: "embed"` is used** | Not applicable if the delivery method is `native`/direct file or `external`/outbound link only. |
| Territory rights | **REQUIRED** | Must state which countries/regions are covered. A worldwide default with per-title opt-outs (as seen with some aggregators) still requires a per-title check, not a blanket assumption. |
| Duration of license (start/end dates) | **REQUIRED** | Content must not be served past a license's expiration; the system must know the exact end date to enforce this. |
| Sublicensing restrictions | **REQUIRED** | Determines whether StreamFree may permit any downstream use (e.g. syndication, embeds by others) — absent explicit permission, assume none. |
| Takedown requirements | **REQUIRED** | The provider's contractual right to demand removal, and the required response time, must be known and operationally supported before launch. |

**BLOCKER:** Any one of the above being undocumented, contradictory, or unconfirmed for a given title/catalog is a blocker for that content — not a soft "proceed with caution."

---

## 2. Monetization

| Requirement | Classification | Notes |
|---|---|---|
| Third-party advertising permitted around the content | **REQUIRED** | Some licenses explicitly prohibit advertising alongside the content (see: Internet Archive's non-commercial restriction explicitly naming "ad-supported distribution"). Must be an affirmative grant, not silence. |
| Rewarded advertising to unlock content permitted | **REQUIRED** | A stricter, more specific case than general advertising — gating access behind an ad view is a distinct monetization mechanic and should be separately confirmed, not assumed to be covered by a general "advertising permitted" clause. |
| Provider revenue share | **REQUIRED to know, not necessarily zero** | Must be documented in the agreement even if 0% — silence is not the same as confirmation of no revenue share. |
| Minimum guarantees, fees, or other commercial terms | **REQUIRED to know, not necessarily absent** | Includes minimum payments, flat fees, CPM floors, or other financial commitments — must be understood before committing to any volume of usage. |

**BLOCKER:** Advertising-around-content and rewarded-ad-unlock are each independently a blocker if not explicitly permitted — do not treat one as implying the other.

---

## 3. Technical Integration

| Requirement | Classification | Notes |
|---|---|---|
| API availability | **OPTIONAL** | Many legitimate providers (per this project's research) operate via negotiated delivery, not a public API. Absence of an API is not itself a rights problem. |
| Playback URLs (direct media / signed URLs) | **REQUIRED** (one delivery mechanism must exist) | Maps to `sourceType: "native"` in the existing `VideoSource` model. |
| Official embed/player mechanism | **REQUIRED if this is the chosen delivery mechanism** | Maps to `sourceType: "embed"`; must have `embedSupported` confirmed per the provider's own terms, not assumed. |
| Authentication requirements (for API/delivery access) | **REQUIRED to document** | Whatever the mechanism (API key, OAuth, signed requests), must be known and securely handled — never hardcoded or committed. |
| Signed URLs / expiring playback tokens | **OPTIONAL** (provider-dependent) | If used, StreamFree's server (not the client) must be the only party capable of obtaining/refreshing them, consistent with the existing ad-gate's "never trust the client" principle. |
| Webhooks (e.g. for rights changes, takedown notices, catalog updates) | **OPTIONAL** | Valuable for automation but not a precondition for a manual/lower-volume integration. |
| Metadata API (title, description, year, genre, etc.) | **OPTIONAL** | Absence means metadata must be entered/maintained manually — an operational cost, not a rights blocker. |
| Artwork (poster/backdrop) rights | **REQUIRED** | Artwork usage rights are sometimes licensed separately from the underlying video — must be confirmed independently, not assumed bundled. |
| Subtitles/captions availability and rights | **OPTIONAL**, but **REQUIRED** if accessibility commitments depend on them | If StreamFree represents captions as available, their licensing must be confirmed like any other asset. |
| Episode metadata (season/episode numbers, episode-level rights) | **REQUIRED for episodic content** | Rights, territory, and license dates can vary per episode, not just per series — must not be assumed uniform across a season. |
| Geographic restrictions (technical enforcement) | **REQUIRED if the license is territory-limited** | A territory restriction in the contract is not self-enforcing — StreamFree must have a technical means (even a basic one) of respecting it before launch, or the license terms are being violated in practice regardless of paperwork. |

---

## 4. Rights Verification

Before any title or catalog is treated as usable, the following must exist **in writing**, not inferred from a platform's UI, an uploader's note, or general reputation:

| Item | Classification |
|---|---|
| Executed contract or license document | **REQUIRED** |
| Identified rights holder (name, legal entity) | **REQUIRED** |
| Territory covered | **REQUIRED** |
| License start date | **REQUIRED** |
| License end date (or explicit statement of "no end date"/perpetual) | **REQUIRED** |
| Permitted platforms (does the license name StreamFree, or web platforms generally, or is it silent?) | **REQUIRED** |
| Permitted monetization models (ad-supported, subscription, transactional — as explicitly listed as permitted) | **REQUIRED** |

**BLOCKER:** Proceeding without a written answer to every row above, for the specific content in question, is not acceptable regardless of how confident an informal source (forum post, general reputation, "everyone knows this is public domain") seems. This project's own research already demonstrated why: two titles with identical-looking public-domain tags on the same platform had materially different real legal situations (one clean, one under active dispute).

---

## 5. StreamFree Approval Checklist

Use this checklist for **every** candidate provider or licensed catalog before any integration work begins.

### REQUIRED (integration cannot proceed without these)
- [ ] Commercial use confirmed in writing
- [ ] Ad-supported use confirmed in writing (separate from commercial use)
- [ ] Rewarded-ad-unlock mechanic confirmed in writing (separate from general advertising)
- [ ] Streaming/public performance rights confirmed
- [ ] Territory rights confirmed and technically enforceable
- [ ] License start and end dates known and enforceable
- [ ] Rights holder identified
- [ ] Sublicensing position understood (even if the answer is "not permitted")
- [ ] Takedown process and response-time obligations understood
- [ ] Artwork usage rights confirmed (not assumed bundled with video rights)
- [ ] At least one playback delivery mechanism confirmed (`native` file, or `embed` with `embedSupported` confirmed)
- [ ] Revenue share / fees / minimum guarantees known (even if zero)
- [ ] For episodic content: rights confirmed per episode, not assumed uniform per series

### OPTIONAL (valuable, not blocking)
- [ ] Public API availability
- [ ] Webhooks for catalog/rights changes
- [ ] Metadata API
- [ ] Subtitle/caption availability

### BLOCKER (any one of these halts integration entirely, regardless of other progress)
- Any REQUIRED item above that is undocumented, contradictory, or unconfirmed
- Any indication of a disputed or contested ownership claim
- Any territory StreamFree operates in that is excluded or unaddressed by the license
- Any monetization model StreamFree intends to use (general advertising, or rewarded-ad-unlock specifically) that is not explicitly permitted
- Reliance on a platform's "public domain" tag, community reputation, or an individual uploader's claim as the sole evidence, with no independent corroboration
- Google Ad Manager (or any ad platform) approval being treated as if it also grants content rights — **it does not**; these are separate, independently-required tracks

---

## Filmhub Research Findings

**Status of this section:** Factual research findings only. Filmhub is **not** approved,
licensed, cleared, recommended, or selected for StreamFree by this section or any other
part of this document. Nothing here changes the REQUIRED / OPTIONAL / BLOCKER checklist
above — Filmhub, like any provider, must still clear every item in that checklist before
integration.

### VERIFIED FROM FILMHUB (official sources)

The following is stated directly in Filmhub's own published materials:

- The standard rights grant covers use on an **"Ad-Supported, Subscription, and/or Transactional basis"**.
- Rights are granted **"by any and all means and media"**.
- The distribution agreement is **non-exclusive**.
- Territory defaults to **worldwide**.
- Territory can be **narrowed by the filmmaker** on a per-title opt-out basis (a filmmaker-side control, not a buyer-side one).
- Filmhub **"makes no guarantees"** that any specific title will be distributed to any specific channel.
- Buyer-facing content categories listed: **narrative films, series, documentary, shorts, animation**.
- The buyer licensing pathway is a **contact form to Filmhub's licensing team** — there is no public self-serve signup or published buyer eligibility criteria.

Sources: [filmhub.com/terms](https://filmhub.com/terms) (Standard Distribution Deal), [filmhub.com/buyers](https://filmhub.com/buyers) (buyer-facing page).

### UNKNOWN / REQUIRES DIRECT CONFIRMATION

None of the following are confirmed by any official Filmhub source found in this investigation, and none should be assumed permitted or true merely because the items above are confirmed:

- Whether a new, independent platform like StreamFree can become a buyer at all
- Whether a Philippines-based company is eligible to become a buyer
- Whether worldwide distribution is available to a Philippines-based platform specifically
- Whether third-party advertising is permitted in StreamFree's exact implementation
- Whether rewarded ads specifically (as opposed to ad-supported viewing generally) may be used as the monetization mechanism
- Whether a "Watch Ad → Unlock → Playback" access model specifically is permitted
- Whether Google Ad Manager specifically may be used as the ad platform
- Whether DRM is required by Filmhub or any of its channel partners
- Whether StreamFree would receive/host media files directly, versus delivery through some other mechanism
- Whether metadata (title, description, etc.) and artwork (poster/backdrop) are provided by Filmhub or must be sourced separately
- Whether subtitles/captions are included
- Buyer-side pricing
- Buyer-side revenue share (the only published revenue-share figure — 20% — is what Filmhub retains from the *filmmaker's* earnings, and is unrelated to buyer-side terms)
- Minimum guarantees
- Minimum catalog commitments
- Contract duration
- Exclusivity at the buyer-deal level (non-exclusivity is confirmed only at the filmmaker-to-Filmhub level, above)
- Reporting requirements
- Geo-restriction enforcement mechanics (as distinct from the territory *policy* confirmed above)
- Takedown requirements

**Secondary-source information** (third-party reporting, not Filmhub's own materials) — included only as context, and explicitly **not** treated as proof of any licensing right: some industry coverage states Filmhub has distributed "more than 17,000 movies since January 2020" and supplies "as much as 15 percent" of one AVOD platform's library. This describes Filmhub's general scale and activity; it does not establish any of the unknowns listed above.

*This section does not conclude that Filmhub is usable by StreamFree. Every item in the Section 5 checklist above still applies before any integration decision.*

---

*This document does not recommend or rank any provider. It defines the bar every candidate must clear.*
