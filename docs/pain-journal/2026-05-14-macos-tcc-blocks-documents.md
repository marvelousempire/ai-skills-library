# macOS TCC blocks terminal reads of `~/Documents/` even when launchd just wrote there

**First seen:** 2026-05-14 (brokerage-prototype launchd port-drift install)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** macos / tcc / launchd / paths

## Symptom

launchd job wrote `~/Documents/port-drift-latest.md` successfully (file exists, correct size). `cat ~/Documents/port-drift-latest.md` or `head` from terminal: `Operation not permitted`. `ls -la` shows the file with normal perms.

## Diagnose (30 seconds)

```bash
ls -la ~/Documents/<file>           # file exists, perms look normal
head ~/Documents/<file>             # "Operation not permitted"
```

If yes to both → macOS TCC (Transparency, Consent, Control) blocking terminal/shell access to `~/Documents/`.

## Fix

Move output to a path NOT protected by TCC:

```bash
# Recommended: under ~/.claude/state/ (which we already use)
sed -i '' 's|/Users/.*/Documents/|/Users/.../.claude/state/|' install-script.sh
```

Re-install the launchd job.

## Root cause

macOS Mojave+ protects `~/Documents/`, `~/Desktop/`, `~/Downloads/`, iCloud Drive, and some app dirs behind TCC. The writing process (launchd, running as the user) has access via the user's TCC grants. The reading process (bash spawned from terminal) may not — terminal apps need their own TCC grants.

## Prevention

- Never use `~/Documents/`, `~/Desktop/`, `~/Downloads/` as scheduled-job output destinations.
- Default scheduled-job output to `~/.claude/state/<task>-latest.<ext>` or similar XDG-style path.

## Related

- DR: [`docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md`](../improvement/decision-records/0001-launchd-over-mcp-for-cron.md) (gotcha section)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
