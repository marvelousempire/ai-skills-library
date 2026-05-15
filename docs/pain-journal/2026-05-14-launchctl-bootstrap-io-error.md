# `launchctl bootstrap` returns "Input/output error" on macOS Tahoe

**First seen:** 2026-05-14 (port-drift launchd install)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** macos / launchd / system

## Symptom

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/<label>.plist
# Bootstrap failed: 5: Input/output error
# Try re-running the command as root for richer errors.
```

Even running as root produces no richer error. `launchctl bootout` also returns I/O error 5 on the same label. Yet `launchctl list | grep <label>` shows the job IS loaded.

## Diagnose (30 seconds)

```bash
launchctl bootstrap gui/$(id -u) <plist> 2>&1 | head -3   # "5: Input/output error"
launchctl unload <plist> 2>&1                              # legacy syntax; usually succeeds
launchctl list | grep <label>                              # is it loaded?
```

## Fix

Use legacy `launchctl unload` + `load -w` syntax instead of modern `bootstrap` / `bootout`:

```bash
launchctl unload ~/Library/LaunchAgents/<label>.plist 2>/dev/null || true
cp <source.plist> ~/Library/LaunchAgents/<label>.plist
launchctl load -w ~/Library/LaunchAgents/<label>.plist
```

The `-w` flag persists across reboots.

## Root cause

macOS Tahoe (26.x) has a known issue where `launchctl bootstrap` returns `5: Input/output error` when launchd's cache has stale references to the label being bootstrapped — even if `bootout` was just called. Legacy `unload`/`load -w` use a different code path that's been more stable across macOS versions.

## Prevention

- Default to legacy syntax in installer scripts targeting macOS Tahoe.
- Add a probe at install time: try `bootstrap`, fall back to `unload`/`load -w` on I/O error 5.
- Document the swap in any launchd-installing playbook.

## Related

- DR: [`docs/improvement/decision-records/0001-launchd-over-mcp-for-cron.md`](../improvement/decision-records/0001-launchd-over-mcp-for-cron.md)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
