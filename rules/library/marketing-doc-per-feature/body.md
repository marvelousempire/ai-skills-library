---
name: marketing-doc-per-feature
id: RL-0024
keywords: [enforce-marketing, check-doc, build-feature]
hash: cd52004
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Marketing Doc Per Feature

Every shipped feature gets its own markdown file in `docs/marketing/`. This is the single source of truth for how that feature is described everywhere — website, App Store, pitch deck, sales calls.

## File format

```
docs/marketing/NN-feature-name.md
```

Where `NN` is a zero-padded sequence number. Features are numbered in the order they were documented, not in order of importance.

## Required structure in every file

```markdown
# Feature Name

**Tagline:** One sentence. Present tense. Active voice.

---

## What it is
[2-3 sentences. Plain language. No jargon.]

## Why it matters
[The problem it solves. The world without it vs with it.]

## How it works
[Mechanistic description. Enough detail to be credible without requiring a developer to understand it.]

## Who it's for
[The specific human who benefits most. Be specific — not "anyone" but "family offices" or "households with elderly members".]
```

## Why this rule exists

Without this rule, feature descriptions live in: the README (technical), the code (nonexistent), the developer's head (inaccessible), or a Google Doc (lost). When a marketer needs copy for the website, or a salesperson needs to explain a feature on a call, or an AI agent needs to write an App Store description — they have nothing to work from.

With this rule: one file per feature, structured, authoritative, always current.

## When to add a file

- When a feature ships (even if just an MVP of it)
- When a feature's description changes significantly
- When a feature is renamed or repositioned

## Current You-Sir Juan features documented

`01` yours-to-train · `02` associate-agents · `03` biometric-auth · `04` your-world-your-lens · `05` voice-first · `06` private-memory · `07` realitykit-interface · `08` hardware-skus · `09` installation-service · `10` private-by-design · `11` homekit-integration · `12` train-your-associate · `13` visionary-interface
