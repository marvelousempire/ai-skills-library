# Checklist — writing a doctor script

Mirrors [`docs/standards/doctor-script.md`](../standards/doctor-script.md). Use when adding a new infra skill that needs health probes.

## Required checks

- [ ] Disk space (warns at 90%+, errors at 95%+)
- [ ] Docker daemon up
- [ ] Docker engine name (Colima / OrbStack / Docker Desktop / unknown)
- [ ] Each service in the stack — `curl --max-time 2` probe against a known endpoint
- [ ] Each background process — `pgrep -f` check

## Conventions

- [ ] Read-only — no `start`, no `stop`, no `rm`
- [ ] Fast — total runtime < 30 s (each probe ≤ 2 s)
- [ ] Single screen of output
- [ ] Color codes per [`color-codes.md`](../standards/color-codes.md)
- [ ] Exit codes: 0 all green, 1 any red, 2 any yellow
- [ ] Print fix commands when a check fails ("To start Colima: `colima start`")
- [ ] Graceful TTY detection (color off when piped)

## Starter

[`docs/templates/doctor.sh.template`](../templates/doctor.sh.template)

## Examples

- `skills/infra/console/Makefile` `make doctor` target (the canonical one in this repo)
- `skills/infra/dockyard/scripts/doctor.sh` (upstream pattern)

## Anti-patterns

- A doctor that mutates state — move that to `make repair` or per-service targets
- A doctor that returns before checking everything (no early `exit 1`)
- A doctor that runs slow probes (`docker pull`, full filesystem scans)
- A doctor without graceful TTY handling (escape codes bleed into log files)
