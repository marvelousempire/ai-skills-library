---
name: port-drift-detector
description: >-
  Cross-repo drift detection between paired implementations (e.g.,
  prototype + canonical). Reads a markdown ledger (PORTING_NOTES.md or
  similar) + recent git history of both repos. Pure git + awk + bash, no
  LLM cost. Three states: quiet, capture-needed (new commits not in
  ledger), backlog-growing (pending count went up). Pairs with a weekly
  launchd job for autonomous reporting.
trigger: >-
  Use when (a) a project has a paired implementation in another repo, (b)
  there's a markdown ledger between them tracking which features have been
  ported, (c) you want autonomous weekly reporting of drift. Triggers on
  "set up port drift detection", "check what hasn't been ported", "weekly
  drift report".
---

# /port-drift-detector

## What this skill does

1. **Probe the ledger format first** — `grep`, `awk`, `wc -l` to count rows + status icons before writing the parser
2. **Write `scripts/port-drift.sh`** — pure bash, takes `PROTOTYPE_DIR` + `CANONICAL_DIR` env vars
3. **Parse pending items** from the ledger's Flow 1 (or equivalent) section
4. **Compare to recent commits** since the ledger's last entry date
5. **State tracking** in `~/.claude/state/<project>-drift-last.env` — sourceable bash env file (no jq)
6. **Three output states:**
   - `quiet` — no new commits, pending count unchanged. Silent.
   - `capture-needed` — new commits on origin/main since last ledger date. macOS notification.
   - `backlog-growing` — pending count increased. macOS notification.
7. **Optional launchd weekly schedule** — Mondays 9am local, writes report to `~/.claude/state/<project>-drift-latest.md`

## How to invoke

```
/port-drift-detector
```

Or naturally:

> "Set up drift detection between brokerage-prototype and the canonical."

## Inputs / outputs

- **Inputs:** path to two paired repos + path to ledger markdown file
- **Outputs:** `scripts/port-drift.sh`, optional launchd plist + install script, optional `make port-drift` target, weekly autonomous report at `~/.claude/state/<project>-drift-latest.md`

## Anti-patterns this skill blocks

- Writing the parser before probing what the ledger actually looks like
- Using `jq` in state files (creates a hard dependency for a one-line state)
- Writing report output to `~/Documents/` (TCC blocks terminal reads — see pain journal)
- Hardcoding absolute paths in plist files (won't port between users)
- Triggering macOS notifications on quiet weeks (noise → ignored)

## When NOT to use this skill

- Single-repo project — nothing to detect drift against
- No markdown ledger between the repos — would need to build one first
- The two repos are kept in sync by a build step, not by hand — drift detection isn't the bottleneck

## Related

- Decision: [`docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md`](../../../docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md)
- Skill: [`launcher-makefile-shim`](../launcher-makefile-shim/SKILL.md) (provides the `make port-drift` target idiom)
- Pain: [`docs/pain-journal/2026-05-14-macos-tcc-blocks-documents.md`](../../../docs/pain-journal/2026-05-14-macos-tcc-blocks-documents.md)
- Pain: [`docs/pain-journal/2026-05-14-launchctl-bootstrap-io-error.md`](../../../docs/pain-journal/2026-05-14-launchctl-bootstrap-io-error.md)

## Origin

Built 2026-05-14 in `marvelousempire/brokerage-prototype` as the first Tier-1 autonomous-agent script. Designed to make `PORTING_NOTES.md` self-monitoring without an LLM in the loop. Plan was 5 Tier-1 scripts following this template; port-drift was the first.

## Reference structure

```
scripts/port-drift.sh                   # the detector (158 lines, bash + awk)
scripts/com.brokerage.port-drift.plist  # launchd Mon-9am
scripts/install-port-drift-schedule.sh  # legacy `launchctl unload/load -w`
Makefile targets:                       # make port-drift / schedule-port-drift
~/.claude/state/port-drift-last.env     # last_pending + last_ledger_date
~/.claude/state/port-drift-latest.md    # latest report (TCC-safe path)
```

## V2 elevations (deferred)

- File-existence probe: for each pending Flow 1 row, check if target path exists in canonical → auto-suggest ✅
- Parameterize plist with `$HOME` at install time (portable across users)
- Test fixtures (PORTING_NOTES.md with known state → expected output) so the parser doesn't silently rot
