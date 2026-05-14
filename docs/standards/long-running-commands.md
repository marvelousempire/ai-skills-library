# Standard: long-running commands (timeouts, monitoring, recovery)

Builds, deploys, polls, and other multi-minute commands MUST have explicit timeouts. Hung commands swallow disk, block builds, and corrupt state.

## The rules

1. **Every long-running command has a timeout.** Default ceiling: 10 minutes.
2. **Every backgrounded command is monitored.** Either via `Bash run_in_background` (single-event), Monitor (event stream), or an explicit `until <check>; do sleep 2; done` poll.
3. **Every poll has a hard ceiling.** Never an unbounded `while true`.
4. **Failures are caught + reported.** No silent hangs; the failure mode is explicit.

## Patterns

### Pattern: build with explicit timeout

```sh
docker build -t seeme:latest . &
BUILD_PID=$!
( sleep 600 && kill $BUILD_PID 2>/dev/null ) &
WATCHDOG=$!
wait $BUILD_PID
kill $WATCHDOG 2>/dev/null
```

### Pattern: wait-for-ready with bounded retries

```sh
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 1 http://localhost:7779/api/config >/dev/null 2>&1; then
    echo "ready"; exit 0
  fi
  sleep 1
done
echo "timeout"; exit 1
```

### Pattern: kill hung Docker builds (incident recovery)

```sh
# When a build is genuinely stuck:
pkill -f "buildx build" 2>/dev/null
pkill -f "docker build" 2>/dev/null

# When Docker Desktop itself is wedged:
pkill -9 -f "Docker.app|com.docker" 2>/dev/null
open -a Docker
```

## Incident history

Hung Docker builds caused 3 different stalls in the 2026-05-14 session — each one consumed ~30 min of wall time before kill. After-incident insight: **always pair `docker build` with a watchdog kill.**

See [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md) for the full log.

## Anti-patterns

- Unbounded `while true` polls
- `tail -f` waiting for "Done" with no timeout
- `sleep 9999` style waits
- Multiple concurrent builds without progress monitoring (the buildkit daemon can hang when oversubscribed)

## Tools to prefer

- `node --test` has `--test-timeout` per-test
- `curl --max-time` for every HTTP probe
- `timeout` GNU coreutil if available (`gtimeout` on macOS via Homebrew)
- `setTimeout(promise, 10_000)` style wrappers in Node code we ship
