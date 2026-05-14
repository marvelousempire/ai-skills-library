# Workflow — audit and elevate

Run after every meaningful ship. Codifies the user's global `CLAUDE.md` "after shipping — automatic gap audit + elevation pass" pattern.

## When this fires

A real piece of work has been committed, pushed, or PR'd and the work has reached "we're done with that step."

NOT for typos, doc tweaks, single-line edits.

## 1. Announce the pass

Say plainly:

> "Now I'm going to audit the gaps and propose how to take this further."

Continue — don't wait for permission to do the audit. Permission is required only before implementing the elevations.

## 2. Pass A — Gap audit

List everything that is incomplete, deferred, fragile, or untested:

- Edge cases left unhandled
- Accessibility, error paths, sync/persistence holes
- Interactions with adjacent features not exercised
- Assumptions that weren't verified
- Workarounds with heuristics (e.g. "approx row height = 72") that should be measured properly
- Test coverage skipped

**Be specific** — name the file, function, line, assumption. Vague gaps are not allowed.

## 3. Pass B — Elevation pass

Independently of gaps, ask: *what would the most ambitious version of this feature be?*

- Surpass what the user asked for
- Read intent, not just the literal request
- Aim for the version that would make a user say "wow, I didn't even know I wanted that"
- Pull on project memory (yousirjuan vision, sovereign stack, connection-gated surfaces, witness/scorekeeper signals)

## 4. Present as concrete options

Two lists:

- **Gaps to close** (numbered): each item one sentence on what + one sentence on why it matters
- **Elevations** (lettered): same

Make it easy for the user to say "do 1, 2, 4, A, C, F" — and the agent knows exactly what to build.

## 5. Wait for sign-off

Do NOT implement anything from the audit/elevation list until the user picks. The point is to surface the menu, not to silently expand scope.

## 6. File the audit

```sh
cp docs/templates/gap-audit.md.template docs/improvement/audits/$(date +%Y-%m-%d)-<scope>.md
```

Fill in: gaps (numbered), elevations (lettered), what the user picked.

## 7. Append to the running registries

- Gaps the user deferred → `docs/improvement/gaps-open.md`
- Elevations the user deferred → `docs/improvement/elevations-deferred.md`

## 8. Cross-link

- Link the audit from the session report
- Link the session report from the audit
- Link both from any decision records that came out of the audit

## What this is NOT

- Padding the response — each gap and elevation must be a real, actionable thing
- A way to silently expand scope — the user picks
- A way to defer real work indefinitely — append to `gaps-open.md` so it doesn't evaporate

## Anti-patterns

- Vague gaps ("could be cleaner") — be specific
- Padding lists to look thorough — if there are genuinely no gaps, say so
- Implementing without sign-off
- Forgetting to file the audit — gaps evaporate within hours otherwise
