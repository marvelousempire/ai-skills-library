# 0001 — Use launchd (not MCP scheduled tasks) for autonomous shell-script schedules

**Date:** 2026-05-14
**Status:** Accepted
**Context:** brokerage-prototype session — weekly port-drift report

## Decision

For autonomous schedules that run pure shell scripts (no LLM invocation per run), use macOS `launchd` (per-user `~/Library/LaunchAgents/`) over `mcp__scheduled-tasks__create_scheduled_task`.

## Rationale

- **Zero token cost per run.** MCP scheduled tasks start a Claude session every fire; launchd just runs a script. For weekly drift reports with mostly-quiet weeks, token cost compounds to ~zero with launchd vs ~thousands/year with MCP.
- **Sandbox refused MCP cron** for autonomous cross-repo git operations on first attempt — "establishes unauthorized persistence beyond the current session." launchd doesn't trigger that classifier because it's user-level OS scheduling, not Claude-runtime persistence.
- **State tracking is simpler** in a sourceable `.env` file (`~/.claude/state/port-drift-last.env`) than in MCP task memory.
- **macOS notifications via `osascript`** are reliable for non-quiet-week alerts.

## When to use MCP scheduled tasks instead

- Schedules that genuinely need LLM reasoning each run (e.g., "summarize the PRs that landed this week and suggest priorities")
- Schedules with state too complex for a sourceable env file
- Schedules that need cross-platform support (launchd is macOS-only)

## Gotchas captured

- `launchctl bootstrap` returns "Input/output error" on this machine — must use legacy `launchctl unload`/`load -w`. (See `docs/pain-journal/2026-05-14-launchctl-bootstrap-io-error.md`.)
- macOS TCC blocks terminal reads of `~/Documents/`. Output paths should be under `~/.claude/state/` or similar. (See `docs/pain-journal/2026-05-14-macos-tcc-blocks-documents.md`.)
- plist files hardcode absolute paths — render with `$HOME` at install time for portability.

## Reference implementation

`brokerage-prototype/scripts/com.brokerage.port-drift.plist` + `install-port-drift-schedule.sh`.
