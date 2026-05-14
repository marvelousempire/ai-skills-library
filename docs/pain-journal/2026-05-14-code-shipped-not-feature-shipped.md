# "Code shipped" treated as "feature shipped" — recurring pattern that lets bugs through

**First seen:** 2026-05-14 (brokerage-prototype, 4 occurrences in one session)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** process / quality-bar

## Symptom

Commits + merges + claims of "shipped" — but at least one of the following turns out to be true on first live execution:
- The script silently produces wrong output (parser missing edge case)
- The build fails (missing file, wrong path, missing dependency)
- The UI bug isn't caught (modal close button doesn't close)
- The autonomous schedule outputs to a path the user can't read (TCC)

User notices: "I don't see this in my Docker at all." Or: "Did the modal close work?"

## Diagnose (30 seconds)

After any meaningful ship, ask the four-row table:

```
| Feature      | Did I run it end-to-end? | Did the user see the output? | If no — why not?           |
|--------------|--------------------------|------------------------------|----------------------------|
| <feature 1>  | yes/no                   | yes/no                       | <reason>                   |
```

If ANY row has "no" in column 1 → feature is not shipped, just committed.

## Fix

Adopt [`checklists/post-ship-live-verification.md`](../../checklists/post-ship-live-verification.md). Before claiming a feature is shipped:

1. Execute the feature in its real environment (script run, build run, button clicked)
2. Verify the observable side-effect matches intent (file present + readable + content correct, UI state reached, etc.)
3. If observable side-effect can't be reached from the current shell/environment → note it as a CAVEAT in the report, not as "done"

## Root cause

Code-correctness gates (typecheck, lint, syntax) fire before commit; behavior-correctness gates require running the feature. Easy to satisfy the former without the latter, especially when the runtime is broken (Docker Desktop wedged), the path is restricted (TCC), or the bug is framework-specific (AnimatePresence + portal).

## Prevention

- **Checklist:** [`checklists/post-ship-live-verification.md`](../../checklists/post-ship-live-verification.md) — every meaningful ship
- **Rule (deferred):** `rules/library/probe-tool-before-assume/` — verify tooling before relying on it
- **Recurring failures log:** [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md) — pattern logged so future-us treats it as a class

## Related

- Recurring failure: this is THE recurring failure of the 2026-05-14 brokerage session — 4 separate occurrences
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md) Section "Patterns that failed"
