# Checklist — after-ship gap audit + elevation pass

Run after every meaningful ship. Mirrors the discipline from the user's global `CLAUDE.md` "after shipping — automatic gap audit + elevation pass."

## When this fires

The moment a real piece of work has been committed, pushed, or PR'd and the work has implicitly or explicitly reached "we're done with that step." NOT for typos, doc tweaks, or one-line edits.

## The two passes

### Pass A — Gap audit

List everything that is **incomplete, deferred, fragile, or untested** in what just shipped:

- [ ] Edge cases left unhandled
- [ ] Accessibility / error paths / persistence holes
- [ ] Interactions with adjacent features not exercised
- [ ] Assumptions that weren't verified
- [ ] Workarounds with heuristics (e.g. "approx row height = 72") that should be measured
- [ ] Test coverage skipped

Be **specific** — name the file, function, line, or assumption. Vague gaps are not allowed.

### Pass B — Elevation pass

Independently of gaps, ask: *what would the most ambitious version of this feature be?* Surpass what was asked for. Read intent, not just the literal request.

- [ ] What would make this "wow, I didn't even know I wanted that"?
- [ ] What pulls on broader project memory (connection-gated surfaces, backend sync, witness/scorekeeper signals)?
- [ ] What aligns with the broader product vision?

## Present as concrete options

Two lists:

- **Gaps to close** (numbered): each item one sentence + why it matters
- **Elevations** (lettered): same

User picks: "do 1, 2, 4, A, C, F" — and the agent knows exactly what to build.

## File the audit

- [ ] `docs/improvement/audits/<date>-<scope>.md` (use [`_template.md`](../improvement/audits/_template.md))
- [ ] Append gaps to [`docs/improvement/gaps-open.md`](../improvement/gaps-open.md) (with a back-link to the audit)
- [ ] Append elevations to [`docs/improvement/elevations-deferred.md`](../improvement/elevations-deferred.md)
- [ ] Reference in this session's report at [`docs/reports/`](../reports/)

## Anti-patterns

- Padding the lists to look thorough — if there are genuinely no gaps, say so
- Vague gaps ("could be cleaner") — be specific
- Elevations that ignore the project vision — every elevation must serve a real direction
- Implementing without sign-off — the audit surfaces the menu, the user picks
