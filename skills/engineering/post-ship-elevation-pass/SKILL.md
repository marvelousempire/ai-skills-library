---
name: post-ship-elevation-pass
description: >-
  After every substantive ship, immediately run two passes before closing the
  session: (1) GAP AUDIT — list everything incomplete, deferred, fragile, or
  untested with the file and function name; (2) ELEVATION PASS — read the
  user's intent, not just the literal request, and propose the most ambitious
  version of the feature. Present as two labeled lists. Wait for sign-off
  before implementing elevations. Triggers on "gap audit", "elevation pass",
  "what's left after this", "what would the most ambitious version be",
  "are there gaps", "what did we miss", "elevate this", "what else should
  we do after shipping".
---

# Post-ship elevation pass — gap audit + ambitious elevation after every ship

The mistake: ship a feature and immediately move to the next user message. The pattern: ship a feature, then immediately run two non-optional passes before the session ends.

This is the compounding behavior. Each elevation becomes the baseline for the next session.

## When to use this skill

- After any substantive commit, PR merge, or feature delivery
- The user says "what's left", "are there gaps", "what else", "what would make this better"
- The end of any build session where the feature is "done but not great"
- When you notice you've been working around a constraint rather than solving it

## The two mandatory passes

### Pass 1 — Gap audit (what's incomplete right now)

List every known deficiency in what just shipped. Be specific — name the file, function, assumption, or edge case.

Categories to cover:
- **Edge cases not handled** — what input breaks this?
- **Accessibility + error paths** — what happens when X fails?
- **Sync/persistence holes** — what gets lost on reload?
- **Adjacent features not touched** — what did the new code break in neighbors?
- **Assumptions not verified** — what did we hardcode that should be measured?
- **Test coverage skipped** — what did we ship untested?
- **Heuristics that should be real measurements** — any "approx row height = 72" that should be `offsetHeight`?

Example format:
```
**Gaps to close:**
1. `EmergencyPanel.tsx:148` — setTimeout(1500) fakes completion; wire to SSE done event instead
2. `server.py:_stream_survey` — discover_worktrees() doesn't cross-ref git merge status
3. `bin/xcc` — env vars still use XCODE_CLEANUP_* prefix after rebrand
```

### Pass 2 — Elevation pass (what the most ambitious version would be)

Read the user's intent, not just the literal request. If they asked for "drag-and-drop reorder," think: live previews, cross-list drag, real-time sync, accessibility, undo, connection-aware visuals. If they asked for "a disk cleanup tool," think: conversational AI agent with tool-calling, foreign-ownership recovery, native AppleScript library.

Pull on project context: what does the product roadmap suggest? What adjacent feature would this unlock? What would make a user say "I didn't even know I wanted that"?

Example format:
```
**Elevations:**
A. [Emergency Rescue] Real-time freed-GB counter per card from kernel delta, not timer
B. [Space Survey] Per-worktree git merge status via `git branch -r --merged`
C. [Chat with SADPA] Token-by-token streaming via _post_streaming() SSE helper
```

## The rules

1. **Run both passes after every substantive ship.** Not optional. Not just when the user asks.
2. **Gap audit first, elevation second.** Gaps are current debt; elevations are future ambition. Don't mix them.
3. **Wait for sign-off before implementing elevations.** Present the menu, don't order for them. The user says "do 1, 2, A, C" and you build.
4. **Be specific.** File + function + assumption. Not "make it better." Not "there are probably edge cases."
5. **If the work is genuinely done with no meaningful gaps, say so.** Don't invent items to look thorough.

## What this is NOT

This is not a retrospective. It runs immediately after shipping, while the context is hot. Retrospectives happen at the end of a multi-week arc. This happens after every PR.

## Anti-patterns

- ❌ Gap audit that lists only the obvious things. "We could add more tests." is not specific.
- ❌ Elevation pass that just restates what was shipped. Elevations must go BEYOND the ask.
- ❌ Implementing elevations without waiting for sign-off. The user picks from the menu.
- ❌ Skipping the gap audit because the feature "feels complete." The best moment to catch gaps is immediately after shipping while the code is still in working memory.

## Invocation

- "Use **post-ship-elevation-pass**."
- The session should run this automatically after every substantive ship without being asked.
- "Run the gap audit on what we just built."
- "What would the most ambitious version of this be?"

## Reference implementation

The user's global `~/.claude/CLAUDE.md` contains this as a standing rule for all sessions. The DustPan arc is the reference implementation — after each PR (Emergency Rescue, Space Survey, SADPA agent, AppleScript library), the gap audit caught: the `setTimeout(1500)` fake completion bug, the missing per-worktree merge status, the missing `not_worth_it` section, the stale `bin/xcc` references. Each gap became the next PR's first fix.
