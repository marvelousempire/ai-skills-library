# 08 — Idempotent commands

One command. Same every time. Safe to re-run. The user types `make ui` after lunch, after a reboot, after a coffee break — same predictable result.

## The pattern

```makefile
.PHONY: ui
ui: _check-docker start-deps start-app _wait _open
	@echo "✓ up"
```

Each step is idempotent:

- `_check-docker` → bails clearly if Docker is down
- `start-deps` → `docker compose up -d` (no-op if already up)
- `start-app` → guarded by `pgrep` (no double-starts)
- `_wait` → polls with bounded retries
- `_open` → opens browser (always opens a tab, harmless)

## Where it lives

[`skills/infra/console/Makefile`](../../skills/infra/console/Makefile) — the canonical `make ui` in this repo.

## Why

The single biggest UX improvement in this repo. The user doesn't have to remember 5 commands; they remember 1.

## Template

[`docs/templates/Makefile.template`](../templates/Makefile.template) — starter for any new skill that wants the `make ui` pattern.

## Exercise

```sh
cd skills/infra/console
make help    # confirm "make ui" is the top-of-screen recommendation
make -n ui   # dry-run shows every step
```

## Next

[`09-yousirjuan-alignment.md`](09-yousirjuan-alignment.md).
