---
name: feature-marketing-md
id: SK-0082
keywords: [feature, marketing]
description: >-
  Write one Markdown file per shipped feature, in a `docs/marketing/` folder
  inside the product repo, using a strict eight-section template. Each MD is
  self-contained: any future blog post, launch tweet, Show HN comment, or
  contributor brief can be sourced from one file without hunting through
  README + CHANGELOG + PR history. Comes with paste-ready channel copy
  variants per platform. Triggers on "marketing folder", "feature MD",
  "docs/marketing/", "self-contained feature brief", "channel copy variants",
  "paste-ready Reddit / Show HN / LinkedIn / Tweet", "marketing library for
  this product", "one file per feature".
---

# Feature marketing MD — one file per shipped feature, self-contained

The problem: marketing material for a product gets fragmented. Some lives in the README, some in the CHANGELOG, some in PR bodies, some in Notion. When you go to launch a feature, you reassemble it from four places. When a contributor joins, they have to do the same.

The fix: **one Markdown file per shipped feature, in a `docs/marketing/` folder inside the product repo, using a strict eight-section template**. Each file is self-contained — the problem, the solution, mockups, paste-ready channel copy in 3–4 variants, FAQ, and a "what it took to ship" section. A future launch, blog post, or contributor brief is one open + read away.

## When to use this skill

- Building or auditing the marketing library for a product
- After shipping a substantive feature (not for typo fixes)
- The user says "where should the marketing copy live" / "we keep losing it"
- Designing the launch material for a new feature
- The user wants to spin up a marketing-skill agent that can read individual feature briefs without cross-references

## The eight-section template (canonical)

Every file follows this shape. Skim one to learn the rest — voice is plain English, short paragraphs, specific numbers, no hype.

```markdown
# [Feature title]

**Tagline:** one-line elevator pitch
**Version:** vX.Y.Z (where it shipped)
**Plan:** [link to plans/NNNN-…md if applicable]
**Surface:** "Sidebar tab `🚨 Emergency Rescue`" / "CLI command" / "etc."
**Backend / Frontend:** file paths

## The problem in plain English

What was broken before this feature existed. Use real scenarios. Specific friction. No marketing language.

## How DustPan solves it
[or "How [Product] solves it"]

The actual mechanism. Concrete. Reference code paths.

## What it looks like

An ASCII mockup of the UI or terminal output. Saves a thousand words.

## The technical story

For HN / engineering blog posts. The interesting architectural choices, design rationale, what was hard.

## Paste-ready channel copy

Pre-baked variants for the channels you'll actually use. Per-feature, each MD ships:

### Tweet (280 chars)
[copy]

### LinkedIn (3-5 paragraphs)
[copy]

### Reddit r/[subreddit]
**Title:**
[copy]
**Body:**
[copy]

### Show HN first comment
[copy]

## FAQ

The honest answers to common skeptical questions. Each Q in bold, each A direct.

## What it took to ship

Number of PRs, line counts, design tradeoffs. Then a "Things we deliberately chose not to do" list with reasons. This section briefs future maintainers on the *non-goals*.
```

## The library README

The folder's own `README.md` is an **index + style guide + when-to-add rules**. Concise:

```markdown
# [Product] marketing — feature-by-feature

This folder holds one Markdown file per shipped feature. Each file is self-contained marketing material.

## Files in this folder

| File | Feature | Version | Plan |
|---|---|---|---|
| [chat-with-sadpa.md](./chat-with-sadpa.md) | 💬 Conversational AI agent | v0.23.0–v0.25.0 | 0023 |
| …

## How to use these files

**To write a blog post:** open the file, use Story arc as your outline, adapt the channel copy.
**To launch on a channel:** the channel-copy section has variants per platform; adapt, don't copy verbatim.
**To answer a user question:** the FAQ section has honest answers.
**To brief a new contributor:** start them with "What it took to ship."

## Style guide

[The eight-section template, repeated]

## When to add a new file

Three criteria:
1. Substantive — at least a full PR's worth, ideally a version bump
2. User-facing — visible in the product
3. Stand-alone marketable — you'd write a tweet about it
```

## The hard rules

1. **One file per feature.** Not one file per release, not one file per category. Each shipped pillar gets its own.
2. **No marketing language.** "Removes unnecessary files" is banned. "One slower Xcode build. That's it." is the voice.
3. **Paste-ready, not literal.** The channel copy is starter material — adapt it. Don't post tweets verbatim from the repo.
4. **The "Things we chose NOT to do" section is required.** It tells future maintainers what's already been considered and rejected, with reasons.
5. **Mockups beat prose.** An ASCII screenshot of the UI is worth more than 200 words of description.
6. **Every section in every file.** No skipping. If a section doesn't apply, write one sentence saying why.

## Two-track channel copy (for products with multiple audiences)

If your product has multiple target audiences (e.g. iOS developers + general Mac power users + AI early adopters), the channel-copy section can split into **Track A / Track B**, each with its own positioning. Each track has its own Tweet / LinkedIn / Reddit / Show HN variants.

This was the v0.25.1 elevation for DustPan: the original "Xcode cleanup" pitch became Track B (proven baseline for r/iOSProgramming), the new "local AI agent with tool-calling + locked-space recovery" pitch became Track A (HN front page, r/LocalLLaMA, r/MacOS).

## Anti-patterns

- ❌ Marketing copy scattered across README + CHANGELOG + PR bodies. Friction at launch time, friction at contributor onboarding.
- ❌ Tweets / posts written ad-hoc without curated copy in source. You re-do the work every launch.
- ❌ Self-congratulatory tone ("revolutionary feature that empowers users…"). The voice the skill enforces is matter-of-fact: "When the disk hits zero, this panel opens automatically and 5 commands recover 8–13 GB in under 60 seconds."
- ❌ One giant marketing.md file with sections. Splitting saves grep-time and lets marketing-skill agents read just what they need.
- ❌ FAQ that ducks hard questions ("Is this safe?" → "Yes!"). The honest FAQ answers the SKEPTICAL version of each question.

## Invocation

- "Use **feature-marketing-md**."
- "Set up the docs/marketing/ folder for this product."
- "Write the feature MD for [new feature we just shipped]."
- "Audit our marketing copy — where does each piece live?"
- "Generate the paste-ready channel copy for this feature."

## Reference implementation

DustPan's [`docs/marketing/`](https://github.com/marvelousempire/dustpan/tree/main/docs/marketing) folder. Eight files, 1,788 lines total. The flagship example is [`chat-with-sadpa.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/chat-with-sadpa.md) (284 lines) — full implementation of all eight sections plus the two-track channel copy split.

The index README at [`docs/marketing/README.md`](https://github.com/marvelousempire/dustpan/blob/main/docs/marketing/README.md) is the canonical "set up your marketing folder" template.

Pairs with: `cost-annotation-discipline` (sets the voice for "what does this cost" copy across all surfaces).
