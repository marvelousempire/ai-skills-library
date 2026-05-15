# Stock macOS doesn't ship `timeout` — polling loops silently fail

**First seen:** 2026-05-14 (Docker daemon polling)
**Session:** [`2026-05-14-brokerage-make-shim-docker-colima`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
**Category:** macos / coreutils / shell

## Symptom

Polling loop written as `until timeout 2 docker info >/dev/null 2>&1; do sleep 2; done` fails immediately on every iteration. Eventually hits the loop's ceiling and reports "daemon never came up" even though daemon is up.

## Diagnose (30 seconds)

```bash
command -v timeout            # if empty: not installed
which gtimeout                # GNU coreutils version; usually via brew
```

If `timeout` returns nothing and `gtimeout` exists → coreutils only installed under GNU prefix.

## Fix

Three options:
1. Use `gtimeout` if you've `brew install coreutils`:
   ```bash
   until gtimeout 2 docker info >/dev/null 2>&1; do sleep 2; done
   ```
2. Drop the bounded-execution helper, just call the command directly (most commands have their own timeouts):
   ```bash
   until docker info --format '{{.ServerVersion}}' >/dev/null 2>&1; do sleep 2; done
   ```
3. Bash-built-in equivalent via `&` + `kill`:
   ```bash
   docker info >/dev/null 2>&1 & p=$!; (sleep 2; kill $p 2>/dev/null) & wait $p
   ```

## Root cause

`timeout` is GNU coreutils. macOS ships BSD userland; coreutils is brew-only. Scripts that assume Linux-like `timeout` silently fail on macOS.

## Prevention

- Default to dropping `timeout`. Most commands have built-in connection timeouts.
- If you need bounded execution, prefer Bash kill-after-N seconds pattern.
- If your script MUST use `timeout`, check `command -v timeout` at script start and exit with a clear error.

## Related

- DR: [`docs/improvement/decision-records/0002-colima-over-docker-desktop.md`](../improvement/decision-records/0002-colima-over-docker-desktop.md) (gotcha section)
- Master Report: [`2026-05-14-brokerage-make-shim-docker-colima.md`](../reports/2026-05-14-brokerage-make-shim-docker-colima.md)
