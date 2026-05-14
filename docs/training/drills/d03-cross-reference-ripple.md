# Drill d03 — cross-reference rippling (10 min)

## Starting state
You've just added `skills/methodology/practice-skill/SKILL.md` from d01.

## Target state
- `SKILL-INDEX.md` has a new row + bumped count
- Root `README.md` has a row in Fast Navigation + AI Routing Cheat Sheet (if action-y) + bumped count
- `skills/methodology/README.md` (if exists) updated
- `bash scripts/check-cross-references.sh` exits 0

## Steps

```sh
# 1. Read the checklist
cat docs/checklists/cross-reference.md

# 2. Apply each row (skill version)

# 3. Verify
bash scripts/check-skill-count.sh
bash scripts/check-cross-references.sh
```

## Verification

Both scripts exit 0.

## Solution

See the seeme and dockyard commits — both demonstrate full cross-reference rippling.
