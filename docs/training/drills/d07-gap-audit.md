# Drill d07 — run a gap audit (15 min)

## Starting state
A real skill in this repo (pick SEEME or the Homelab Console). Pretend it just shipped.

## Target state
A filled-in gap-audit at `docs/improvement/audits/<date>-<scope>.md` with:
- 3+ specific gaps (named files, functions, assumptions)
- 3+ specific elevations (named features, "wow" moments)
- Decision (which the user picked)

## Steps

```sh
cp docs/templates/gap-audit.md.template docs/improvement/audits/$(date +%Y-%m-%d)-<scope>.md
# Fill in:
#  - Gaps numbered, with file/function specificity
#  - Elevations lettered, ambitious
#  - Decision: which gaps + elevations to build
#  - Link to plan + session report
```

## Verification

A future agent reads your audit and knows exactly what to work on next. No "could be cleaner" vagueness.

## Solution

[`docs/improvement/audits/2026-05-14-seeme-v1.md`](../../improvement/audits/2026-05-14-seeme-v1.md) — canonical example.
