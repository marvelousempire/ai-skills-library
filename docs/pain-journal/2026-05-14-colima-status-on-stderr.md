# `colima status` writes "running" to stderr, not stdout — diagnostic scripts miss it

**First seen:** 2026-05-14 (Dockyard's `make doctor` reported Colima not running while it was)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** colima / shell / stdio

## Symptom

`colima status` clearly displays `colima is running using macOS Virtualization.Framework`. But a script doing `colima status 2>/dev/null | grep -qi "running"` returns 1 (no match). Doctor scripts report "Colima not running."

## Diagnose (30 seconds)

```bash
colima status 2>/dev/null | head -3        # likely empty
colima status 2>&1 1>/dev/null | head -3   # the "running" message — on stderr
```

If status info is on stderr → script is stripping the channel it needs.

## Fix

In any script that checks Colima status, capture stderr or use `2>&1`:

```bash
# Wrong:
if colima status 2>/dev/null | grep -qi "running"; then ...

# Right:
if colima status 2>&1 | grep -qi "running"; then ...

# Or socket-based (more reliable):
if (echo "GET /_ping HTTP/1.0"; echo "") | nc -U -w 2 ~/.colima/default/docker.sock | grep -q "200"; then ...
```

## Root cause

colima v0.10.x uses logrus for output and emits all status info at `info` level → stderr. The `status` subcommand has no JSON / quiet stdout mode. Tooling that expects "running" on stdout silently misses it.

## Prevention

- For external probes of Colima state, hit the socket's `/_ping` endpoint instead of parsing CLI output.
- Submit a PR to dockyard's `scripts/doctor.sh` (the original case here) to use `2>&1`.
- Document the channel for every external tool's status output in `context/<tool>-context.md`.

## Related

- DR: [`docs/improvement/decision-records/0002-colima-over-docker-desktop.md`](../improvement/decision-records/0002-colima-over-docker-desktop.md)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
