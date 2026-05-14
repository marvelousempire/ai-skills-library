# Drill d05 — build a `make ui` Makefile (20 min)

## Starting state
A new skill that ships containers but has no Makefile.

## Target state
A Makefile with:
- `make ui` as the default one-command (idempotent)
- `make stop`, `make doctor`, `make status` supporting targets
- Pre-flight Docker check
- Help screen leads with `make ui`

## Steps

```sh
cp docs/templates/Makefile.template skills/<family>/<slug>/Makefile
# Edit: replace <skill-slug>, set PORT, customize start/stop
make -C skills/<family>/<slug> -n ui     # dry-run shows the recipe
make -C skills/<family>/<slug> help       # confirm make ui is at the top
```

## Verification

`make help` shows `make ui` as the ONE COMMAND. `make -n ui` parses cleanly.

## Solution

[`skills/infra/console/Makefile`](../../../skills/infra/console/Makefile) — the canonical `make ui` in this repo.
