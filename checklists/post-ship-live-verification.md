# Post-Ship Live Verification Checklist

Run this for every meaningful ship BEFORE claiming a feature is "done." Catches the "code shipped ≠ feature shipped" recurring failure ([`pain-journal/2026-05-14-code-shipped-not-feature-shipped.md`](../docs/pain-journal/2026-05-14-code-shipped-not-feature-shipped.md)).

## The 4-row test

For every feature in the ship, fill in this table. Any "no" in column 1 = feature is committed, not shipped.

```
| Feature | Did I run it end-to-end? | Did the observable side-effect match intent? | If no — why not? |
|---------|--------------------------|----------------------------------------------|------------------|
|         | yes / no                 | yes / no                                     |                  |
```

## What "ran end-to-end" means by feature class

| Class | "Ran end-to-end" means |
|---|---|
| Script | Executed in target env; output observed; state file written if applicable |
| Build target | `make <target>` ran; product exists; product runs |
| Docker image | `docker build` + `docker run` + `curl <port>` returns expected response |
| Launchd / cron | Installed; `launchctl kickstart` (or `cron -f` log); output file appears at expected path; readable |
| UI component | Rendered in target browser; user-input flow exercised (button click, ESC, backdrop click); state correct after each |
| Cross-repo change | Pull / merge / verify on the consuming repo too |
| API endpoint | `curl` with expected payload returns expected status + shape |

## Pre-flight

- [ ] Local tests pass (typecheck, lint, unit tests if any)
- [ ] Diff reviewed
- [ ] Commit message accurately describes scope

## In-flight (the verification itself)

- [ ] Each feature in the ship has a row in the 4-row table
- [ ] Every "yes" in column 1 has concrete evidence (command output, screenshot, file path + size)
- [ ] Every "yes" in column 2 confirms the observable side-effect (the file exists AND is readable; the button click closes the modal AND the dialog unmounts; the launchd job runs AND notifies)
- [ ] Every "no" in column 3 has a CAVEAT explicitly logged in the ship report — not buried

## If a feature can't be verified live

If the runtime is broken, the path is TCC-restricted, or the bug surfaces only in production:

- [ ] Surface this honestly in the ship report ("DID NOT verify live because X")
- [ ] Add a row to [`docs/improvement/gaps-open.md`](../docs/improvement/gaps-open.md) — "live-verify X next session"
- [ ] Do NOT say "shipped" — say "shipped to main, live-verification pending"

## Sign-off

- [ ] Employee (you): all rows filled; no false "yes"
- [ ] Director (user): reviewed table before approving merge

## Origin

Drawn from the recurring failure of the 2026-05-14 brokerage session — 4 features (port-drift, launchd, Stack-badge close, Docker) shipped with bugs that only surfaced when actually run.
