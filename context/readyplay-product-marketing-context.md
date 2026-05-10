# Product Marketing Context — READYPLAY

*Last updated: 2026-05-10 · Auto-drafted from monorepo README, marketing home metadata, and `BrandCopy.swift`. Correct anything that drifts from shipping truth.*

## Product Overview

**One-liner:** READYPLAY is the trust layer for pickup runs — live tap-to-score, peer-reviewed OVR, and a real game record across multiple sports.

**What it does:** Native **iOS / watchOS** pickup platform with organized games, rosters, live scorekeeping, game history, post-game reviews, leaderboards, achievements, and public player cards. **Basketball** is the deepest vertical today; the product is built as a **multi-sport shell** (volleyball, tennis, padel, pickleball, soccer, baseball/softball, flag football, track/run, pool, fishing, etc.) with more surfaces shipping over time. More than scorekeeping: identity-aware play, reviewer accountability, Live Activities, Apple Watch scoring, App Intents, optional verification, and web surfaces (marketing + admin) backed by one **Postgres** + **Node** API.

**Product category:** Recreational sports / pickup / amateur competition platform (consumer app + public web + operator admin).

**Product type:** Consumer mobile app (primary) + companion web (marketing, account, public profiles) + B2B-internal admin dashboard.

**Business model:** **Beta** today — TestFlight / growth focus. **Free core pickup**; long-term vision includes optional paid flows (e.g. StoreKit, marketplace-style fill-ins) only after trust thresholds — do not market as a pay-to-win stat app. Credits / scorekeeper rewards are in-product economy language (see `BrandCopy`).

## Target Audience

**Who (B2C):**

- **Pickup players** who run weekly games at parks/courts and want credit for how they actually play.
- **Organizers / captains** who schedule runs, need RSVPs, and want less chaos in group chats.
- **Scorekeepers** who keep the book and deserve recognition (platform treats this role as “sacred” in narrative).
- **Competitive rec players** who care about matchups, streaks, and peer-reviewed attributes (OVR), not just box scores.

**Primary use case:** Finish a real run with a **verifiable record** everyone agrees on — scores, participants, and reviews attached to identity — instead of arguments lost in iMessage.

**Jobs to be done:**

- “Give my pickup run a **real box score** and history I can show.”
- “**Track how I play** over time with peer signal, not vanity stats.”
- “**Run the run** — create game, invite, score live from phone or Watch.”
- “**See who’s legit** before I run with them” (profiles, OVR, conduct signals — frame carefully; avoid toxic ranking culture in copy).

**Use cases / scenarios:**

- Saturday basketball at a named park; scorekeeper taps fouls and shots; post-game reviews update attributes.
- Spectator follows a friend’s game via Live Activity / web where supported.
- Player shares **public profile** / leaderboard row as social proof.

**Not primary (yet):** Pro leagues, youth travel clubs, full team SaaS — avoid positioning that implies enterprise team licensing unless product actually sells it.

## Personas (consumer / community)

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Player** | Fair record, reputation, fun, streaks | Chat chaos, disputed scores | Structured games + peer-reviewed profile |
| **Organizer** | Attendance, start time, clarity | Coordinating 15 people in SMS | Game creation, invites, roster clarity |
| **Scorekeeper** | Accuracy, respect, low friction | Thankless labor; app clutter | Tap-to-score, role recognition, credits narrative |
| **New invitee** | Trust, low setup | “Another app?” | Fast join, Apple SSO, clear why record matters |
| **Spectator / friend** | Following score without hovering | No visibility | Live Activity / broadcast story (where shipped) |

## Problems & Pain Points

**Core problem:** Pickup **dissolves into group chats** — no single score, no durable reputation, no fair history.

**Why alternatives fall short:**

- **Group chat** — no structured game object, no neutral scorekeeper workflow, no cross-week identity.
- **Generic fitness apps** — steps/calories, not **competition record** with peers who were there.
- **League-only apps** — too heavy for informal runs; high friction for casual pickup.

**What it costs them:** Time arguing scores, **lost bragging rights**, repeated “what was the score?” energy, no proof of improvement.

**Emotional tension:** Want respect and fairness without feeling “tracked” in a creepy way — **peer verification** and opt-in location/health framing matter in copy.

## Competitive Landscape

**Direct:** Other pickup / rec-stat / “run your game” apps (regionals and experiments) — often single-sport or no peer-review depth. Falls short on **trust layer** + multi-sport architecture + Apple-native live stack (where true).

**Secondary:** **iMessage + Notes**, **Excel**, paper — zero structured identity or live scoring; falls short on **finished verifiable games**.

**Indirect:** **Strava** (solo/activity) — different job; good for miles, weak for **who won** and **who guarded whom** in pickup.

**Indirect:** **Fantasy / esports** stats — engagement-optimized algorithms; READYPLAY stresses **peers who were in the game**, not black-box feeds (`BrandCopy`: “Peers, not algorithms”).

## Differentiation

**Key differentiators:**

- **Live tap-to-score** + optional shot/foul nuance (basketball depth first).
- **Peer-reviewed OVR and attributes** tied to real finished games.
- **Identity + verification** story (optional in-person verification when it matters).
- **Multi-sport engine** with basketball as proof — not a one-off toy app.
- **Apple ecosystem depth:** Watch, Live Activities, Health context where appropriate — **honest** about what’s iOS-only vs web.

**How we do it differently:** Neutral scorekeeper spine, cryptographic **game fingerprint** narrative (tamper-evident receipt) — blockchain **ready**, not required (`BrandCopy`).

**Why customers choose us:** “**Real runs. Real record.**” (aligns with marketing hero); trust + fun + exercise-through-play (`platformTagline` below).

## Objections

| Objection | Response |
|-----------|----------|
| “I don’t need another app.” | One run with a finished record + reviews usually flips it — sideline recruitment copy in `BrandCopy.pitchRecruit`. |
| “People will game the ratings.” | Reviews attach to **finished games** and identities; conduct signals; scorekeeper role emphasized. |
| “It’s only basketball.” | Basketball proves the engine; **multi-sport shell** is explicit in README and marketing. |
| “Web can’t do X.” | **Honest surface split** — full live game is iOS; web is profiles, leaderboard, account, marketing (`README` architecture). |

**Anti-persona:** Users who want **anonymous trash talk** with no accountability; people expecting **pro league** white-label without consumer polish — poor fit for beta narrative.

## Switching Dynamics

**Push:** Disputed scores, forgotten runs, no proof of improvement, organizer fatigue.

**Pull:** Single record everyone shares; leaderboard + profile social proof; Watch/lock screen glanceability.

**Habit:** “We always just text” — reduce friction with fast join + Apple SSO + clear scorekeeper path.

**Anxiety:** Privacy, location, health data — emphasize **opt-in**, mutual follows, and **why** data ties to fair play (`BrandCopy` parks/location line).

## Customer Language

**How they describe the problem (use / test in copy):**

- “We never agree on the score the next day.”
- “Group chat is a mess.”
- “I want credit for how I actually play pickup.”

**How they might describe us (target phrasing):**

- “The app that **keeps the record** for our runs.”
- “**Peer-reviewed** stats — people who actually played with you.”

**Words to use:** pickup, run, court, park, scorekeeper, record, verified / verification (where product supports), OVR, peer-reviewed, multi-sport, beta, TestFlight, **READYPLAY** (canonical spelling).

**Words to avoid:** Over-promising **NFT** as speculative hype — use **identity / fingerprint / verifiable record** framing from `BrandCopy` unless marketing explicitly runs a web3 campaign. Avoid “algorithmic feed” vibes.

**Glossary:**

| Term | Meaning |
|------|---------|
| **READYPLAY** | Product name (display: READYPLAY; folder legacy: Red-E Play) |
| **OVR** | Overall rating — peer + algorithm blend in product; explain simply for external copy |
| **Pickup / run** | Informal organized game at a real venue |
| **Trust layer** | Marketing positioning: integrity of game + identity + reviews |
| **Scorekeeper** | Neutral live scorer — narrative “sacred” role |

## Brand Voice

**Tone:** Confident, kinetic, **Apple-adjacent polish** without cold corporate — recreational heart, pro infrastructure (`BrandCopy` “Pro infrastructure, rec heart”).

**Style:** Short clauses; cinematic where appropriate on web; **honest** about beta and platform boundaries (iOS vs web).

**Personality:** Fair, competitive-but-welcoming, **movement / play** (exercise through play), community-grounded.

**Canonical lines (from code — reuse or adapt):**

- **Tagline:** “Exercise through play, structured scoring, verified reputation, and portable records — for every sport you play.”
- **Trust:** “Every result is verified by the people who competed…” (`BrandCopy.pitchTrust`)
- **Web home meta:** “The trust layer for pickup runs” + live tap-to-score / OVR / real game record (`marketing/app/page.tsx` metadata).

## Proof Points

**Metrics:** Use **live** numbers only when verified — beta growth can cite TestFlight / waitlist if approved; otherwise avoid fabricated MAU.

**Customers / logos:** Add when there’s a press kit or named partners; do not invent.

**Testimonials:** Pull from real feedback when available; placeholder: *none shipped in this doc — add quotes with attribution.*

**Value themes:**

| Theme | Proof direction |
|-------|-----------------|
| Trust / fair record | Finished games, scorekeeper workflow, fingerprint story |
| Depth on iOS | Watch, Live Activities, tap-to-score demos on marketing |
| Multi-sport future | Sports strip + README sport list |
| Identity | Public profiles, verification, wallet pass (where shipped) |

## Goals

**Business goal:** Establish READYPLAY as the **default record** for serious pickup — starting basketball-heavy markets; grow verifiable games + quality reviews.

**Conversion actions:**

- **iOS:** TestFlight / App Store install; Sign in with Apple; first game completed.
- **Web:** Waitlist, Sign in with Apple (where enabled), profile share, `/find` discovery.

**Current metrics:** Fill when marketing has approved numbers — *not inserted here to avoid stale data.*

---

## Technical surfaces (for honest marketing)

| Surface | Role |
|---------|------|
| **readyplay.app** | Marketing SSR, leaderboard SSE, public profiles, waitlist, account flows |
| **api.readyplay.app** | Backend API |
| **admin.readyplay.app** | Internal operators |
| **iOS / watchOS** | Primary live game + identity |

## Maintenance

- **Source of truth for code/product:** monorepo `README.md`, `docs/Blueprint.md`, `docs/Feature Ledger.md`, `BrandCopy.swift`.
- **When to update this file:** Positioning change, new primary sport depth, pricing/beta status change, or new conversion funnel.
- **Paths for Agent Skills:** Canonical repo copy: **`.agents/product-marketing-context.md`** (this file). On your Mac, `~/.agents` and `~/.claude` may symlink here so global agents resolve the same document — see `~/Developer/ai-skills-library/docs/marketingskills.md`.
