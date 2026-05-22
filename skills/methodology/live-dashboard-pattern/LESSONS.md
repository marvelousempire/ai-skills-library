# LESSONS — what we learned building this pattern

The live-dashboard-pattern didn't arrive fully-formed. It evolved across 18 hours of operator feedback during the 2026-05-21 → 2026-05-22 cross-stack rollout. This file documents the lessons so the NEXT pattern's evolution can short-circuit our path.

The skill's `SKILL.md` is the contract. `PROMPT.md` is the hand-off. `CHECKLIST.md` is the procedure. **This file is the meta-record of how the contract + hand-off + procedure came to look like they do.**

---

## Lesson 1 — Static-feeling pages ship by default; live-feeling pages need a forcing function

The first native CT card we shipped (DustPan disks, commit 31b36b1) was *correct* — it fetched the data, rendered the meters, looked clean. The operator's reaction:

> "Do those seed pages offer the same real time analytics in animations as a sophisticated dashboard would? Or are they just static they need to be real time animated live moving instances, each item in each graph and each chart."

**Meaning:** "correct rendering" is the floor, not the ceiling, for a dashboard. Without a rule that explicitly says "auto-poll + tween + transition + sparkline + pulse," the natural default is poll-on-click + snap-render + plain numbers. That's "static." It works. It feels dead.

The rule body was authored AFTER this reaction. Going forward, the rule fires up-front so v1 of any dashboard already has motion. The lesson: **make the standard binding before the first shipped surface, not after.**

## Lesson 2 — Zero dependencies is achievable AND worth the discipline

Every primitive in this skill is achievable in <60 lines with React + browser-native APIs + Tailwind. The temptation to reach for `framer-motion` (for tweens), `swr` (for polling), `recharts` (for sparklines) is REAL. Each looks like a 30-second install.

But each install brings:
- 50-200KB to the bundle
- A second source of truth for animation timing / fetch semantics / chart rendering
- A maintenance dependency that breaks on the next major version
- A reason why other operator-built repos can't have the same primitives without the same install

The discipline payoff: **the package this skill defines is 270 LoC and ships in any React + Vite + Tailwind project with no further install.** Worth the discipline.

## Lesson 3 — Files don't travel with features; packages do

V1 of this skill said "copy these files into your target repo from the canonical at `nephew/...`." V2 said the same with a recipe folder. Both versions create drift: the moment the canonical evolves, the copies rot.

V3 (current) makes the primitives an installable workspace package (`@nephew/live-dashboard`). Consumer apps depend via `workspace:*`. Future repos add via published registry. Updates flow via `pnpm update`. **No drift.**

The lesson: when a shared artifact has more than one consumer, packaging it is cheaper than tracking copies across repos. The bootstrap cost (one `pnpm-workspace.yaml` + a `packages/<name>/` folder) is recovered the first time the canonical updates.

## Lesson 4 — Apple's "About This Mac" is the right precedent

When the operator said:

> "we need to have a little in the top left a little indication that says we will macOS … LED that shows the status red yellow green … If I tap that Modell comes up gives us full details about the change lullaby version about this just like the Apple when you choose about this app same thing."

— the design decision was **named, not invented.** Apple's About This Mac panel is 20 years of UX iteration. Replicating its shape (hero + spec table + action row) buys the operator a familiar surface that needs zero training.

The lesson: **precedent citation is design.** Inventing a new pattern when a known good one exists is operator surface debt.

## Lesson 5 — Rules + skills propagate together

When this skill was first authored in AISL alone, the corresponding rule body was added to nephew's `.claude/rules/` but NOT mirrored to dustpan/historia/clinic/automata. Three days later, an AI working in dustpan didn't know the rule existed.

V2 of the propagation discipline says: **skill in AISL + rule body in nephew + cursor mirror + mirrors in every operator-built repo + memory entry, all in ONE rollout.** Otherwise the rule sits in one place and the cross-repo agents stay ignorant.

The lesson: when defining a methodology skill, the propagation isn't optional — it's part of the deliverable.

## Lesson 6 — Version-bump + CHANGELOG must be in the same PR

Two rollouts shipped this session WITHOUT version bumps or CHANGELOG entries. The operator caught it and asked for a rule. The rule got authored. The rule was applied retro-actively to those two rollouts (one PR per repo).

The lesson: **dev-discipline already had this as a session-closer step. The session-closer wasn't enough.** Making it a standalone rule with the operator's verbatim source ("be sure to alwasy version bup and edit chamglog") made it harder to forget.

If a future skill defines a process step, that step probably deserves its own rule body — not just a checklist line.

## Lesson 7 — Sandbox-blocked actions surface a workaround pattern

The Claude Code sandbox blocked `sudo chown`, `git reset --hard`, `git pull -X theirs`, and Claude Desktop config writes — even after the operator approved them via `AskUserQuestion`. Each block forced a workaround:

- `sudo chown` → operator runs it in their terminal
- `git reset --hard` → branch off origin/main directly for the NEXT branch
- Claude Desktop config write → operator runs the merge script

The sandbox was right every time. **The workarounds are strictly better than the original actions** — more reversible, more explicit, more reproducible. The "branch off origin/main" pattern in particular is now the preferred git flow for ANY post-squash work, sandbox or not.

The lesson: sandbox blocks are not bugs to work around. They're constraints that force the agent to find the workflow that doesn't need destructive operations.

---

## How to read this alongside the skill

| File in this folder | Purpose |
|---|---|
| `SKILL.md` | The contract — what the skill IS |
| `README.md` | The skill index — one-paragraph orientation |
| `PROMPT.md` | The hand-off — paste this to any AI |
| `CHECKLIST.md` | The procedure — 6 stages to follow |
| **`LESSONS.md` (this file)** | **The meta-record — how the contract evolved** |
| `starter/` | Primitives templates + install path |
| `examples/` | Two production card copies |

If you're applying the skill to a target repo, read SKILL + CHECKLIST. If you're EVOLVING the skill (adding a 7th primitive, changing a default), read THIS file first to avoid re-relearning the lessons that shaped the current design.

## When to add to this file

Every time the skill's primitives or contract change in response to operator feedback, append a numbered lesson here with:

1. The verbatim trigger (if there was one)
2. What the OLD behavior was
3. What the NEW behavior is
4. The generalizable lesson

This keeps the skill's evolution legible to future sessions.
