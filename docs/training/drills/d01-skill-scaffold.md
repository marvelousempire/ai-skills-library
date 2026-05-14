# Drill d01 — scaffold a new skill (15 min)

## Starting state
- You're at the repo root.
- The skill `practice-skill` does not exist.

## Target state
- `skills/methodology/practice-skill/SKILL.md` exists with valid frontmatter
- `skills/methodology/practice-skill/README.md` exists
- `SKILL-INDEX.md` count matches actual

## Steps

```sh
# 1. Scaffold
mkdir -p skills/methodology/practice-skill
cp docs/templates/SKILL.md.template skills/methodology/practice-skill/SKILL.md
touch skills/methodology/practice-skill/README.md

# 2. Edit frontmatter to:
#    name: practice-skill
#    description: <one paragraph with "Triggers on …">

# 3. Update count
# Edit SKILL-INDEX.md and root README.md so both show actual count.

# 4. Verify
bash scripts/check-skill-count.sh
bash scripts/lint-skill-frontmatter.sh
```

## Verification (expected output)

```
✓ all three agree
(no output from frontmatter lint = pass)
```

## Cleanup

```sh
rm -rf skills/methodology/practice-skill
# Restore SKILL-INDEX.md and README.md counts.
```

## Solution

See [`skills/methodology/plan-first/`](../../../skills/methodology/plan-first/) for a real example of the target shape.
