# StreamFree — Licensing Outreach Brief

**Purpose of this document:** a factual, non-overstated description of StreamFree for use
when discussing content licensing with a provider. This is a preparation document only —
it does not constitute an offer, and nothing in it should be read as a claim that any
licensing relationship currently exists.

---

## 1. StreamFree Overview

StreamFree is a free, ad-supported movie and short-drama streaming web application. It is
currently in active development. The product concept is a legitimate, ad-supported
streaming destination for movies, independent/short films, and short-drama (vertical
and/or episodic) content.

**No content is currently licensed.** All titles, artwork, and metadata presently in the
application are original, clearly-labeled development/demo placeholders — not real movies
or real provider content.

## 2. Platform Model

StreamFree's intended user flow is:

```
Browse catalog → Title detail page → Watch → Ad gate (server-verified) → Content unlock → Playback
```

This flow is already architected and implemented in development form (see Section 8), with
a mock/development ad provider and no real content source connected yet.

## 3. Operating Base

StreamFree is operated from the **Philippines**. This is relevant to any prospective
licensing partner's own eligibility, entity, tax, and contracting requirements — none of
which have been confirmed with any provider as of this document.

## 4. Web Streaming Model

StreamFree is a **web application** (built on Next.js), not a native iOS/Android app. Some
providers researched to date describe their content distribution in mobile/in-app terms
specifically; whether their rights extend to web delivery has **not** been confirmed with
any provider and must be asked explicitly (see `docs/licensing-provider-questions.md`).

## 5. Ad-Supported Monetization Model

StreamFree's intended monetization model is advertising-supported (AVOD) viewing. As of
this document, **no real advertising network is integrated.** A development-only mock ad
provider exists purely to validate the architecture (see Section 8).

## 6. Proposed Rewarded-Ad-Unlock Model

In addition to general ad-supported viewing, StreamFree's intended model includes a
rewarded-ad mechanic: a user actively chooses to watch an ad in exchange for temporary,
time-limited access to unlock a specific movie or episode. This is a **narrower and more
specific mechanic than general AVOD/advertising**, and prior research (Stage 8) found no
provider whose public materials confirm this specific mechanic is permitted — it must be
asked directly, not assumed.

## 7. Intended Content Categories

- Feature films (contemporary and/or independent)
- Short films
- Short-drama / vertical / episodic short-form series

## 8. Intended Territories

Initial intended focus: the **Philippines** and **Southeast Asia**, with worldwide
availability as a longer-term goal. No provider has confirmed territory availability for
StreamFree specifically — territory must be confirmed per provider (and in several cases
researched so far, per title) before any claim of availability is made.

## 9. Current Technical Architecture (high level)

- Next.js web application with a catalog, search, genre browsing, and per-title detail
  pages, all built on original demo data.
- A provider-agnostic content source abstraction (`ContentSourceProvider` /
  `VideoSource` model) that supports direct video files, official embeds, or
  external-watch links — designed so a real provider can be added without redesigning
  the player.
- A server-verified ad-gate architecture: a client-side mock ad experience whose
  completion is verified against a real server-side session (never trusting a client
  claim of "ad completed"), gating content unlock.
- **No real content provider or real ad network is currently connected.** Both are
  implemented only as clearly-labeled development/mock providers.

## 10. Current Licensing Status

**No content provider is currently approved, licensed, contracted, or integrated.**
Research (Stages 6–8) surveyed potential providers — including Filmhub, Sea Star Film,
5W1H Studios, Vision Films, CatchPlay/Screenworks Asia, and AR Asia Production — and found
that each would require direct discussion to confirm rights relevant to StreamFree's model;
none has confirmed terms in writing, and none has been contacted.

## 11. Content Licensing vs. Advertising Monetization — Explicit Distinction

These are **two separate, independently-required tracks**, confirmed via official Google
documentation during this project's research: approval to run advertising (e.g. via Google
Ad Manager) does **not** grant, imply, or substitute for any content licensing right, and
vice versa. A future advertising-platform approval must never be treated as evidence that
content rights exist, and a content license must never be assumed to cover any specific
advertising/monetization mechanic beyond what it explicitly states.

## 12. Statement of Current Status

As of this document: **no provider has been contacted, no licensing agreement has been
signed or offered, no content has been licensed, and no real content or advertising
integration exists in the StreamFree application.** This document exists to prepare for
future outreach, not to represent that outreach has occurred or succeeded.
