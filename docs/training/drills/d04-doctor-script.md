# Drill d04 — write a doctor script (20 min)

## Starting state
A new infra skill needs a doctor script.

## Target state
A working `scripts/doctor.sh` that:
- Reports disk space
- Checks Docker daemon
- Probes 2+ service endpoints
- Uses color codes per [`docs/standards/color-codes.md`](../../standards/color-codes.md)
- Exit 0 if all green, 1 if any red, 2 if any yellow

## Steps

```sh
cp docs/templates/doctor.sh.template skills/<family>/<slug>/scripts/doctor.sh
chmod +x skills/<family>/<slug>/scripts/doctor.sh
# Edit: replace <skill-slug>, add real probes
bash -n skills/<family>/<slug>/scripts/doctor.sh   # syntax check
bash skills/<family>/<slug>/scripts/doctor.sh      # run it
echo "exit: $?"
```

## Verification

Script runs without errors. Output uses color when in a TTY. Exit code matches green/yellow/red status.

## Solution

`skills/infra/console/Makefile` `make doctor` target — the canonical example in this repo.
