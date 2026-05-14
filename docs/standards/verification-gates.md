# Standard: verification gates (green before ship)

No commit hits `main` without passing every gate below. Together they prevent the recurring failures we've hit (count drift, label gaps, frontmatter drift, branch confusion).

## The gates

### Gate 1 — SKILL count consistency

`actual == SKILL-INDEX == README` for the SKILL.md count.

```sh
bash scripts/check-skill-count.sh
# expected: "✓ all three agree" (exit 0)
```

### Gate 2 — Frontmatter on every skill

Every `SKILL.md` has `name:` (matches folder) and `description:` (with triggers).

```sh
bash scripts/lint-skill-frontmatter.sh
# expected: silent (exit 0)
```

### Gate 3 — Compose file labels (for new infra skills)

Every service in a labeled compose file carries the `ai-skills-library.*` schema.

```sh
# Run this for every compose file that should be labeled:
docker compose -f <path> config | grep -c 'ai-skills-library.skill'
# expected: >= number of services
```

### Gate 4 — Script syntax

Every shell script in `scripts/` and `skills/**/templates/*.sh` parses cleanly.

```sh
for s in $(find scripts skills -name '*.sh'); do bash -n "$s" || exit 1; done
# expected: silent (exit 0)
```

### Gate 5 — No broken relative links (sanity)

Markdown link sanity for new docs (basic regex check).

```sh
bash scripts/check-cross-references.sh
# expected: exit 0
```

### Gate 6 — Branch state (pre-merge only)

Parent repo is on `main` (or the intended branch) before merging.

```sh
git -C /Users/nivram/Developer/ai-skills-library branch --show-current
# expected: "main"
```

### Gate 7 — Worktree branch synced to origin

The worktree branch matches origin so nothing is lost on force-with-lease pushes.

```sh
git rev-parse HEAD
git rev-parse @{u}
# expected: equal
```

## Running every gate

```sh
make -C scripts gates    # planned target — runs every gate above
```

Until the `make gates` target exists, run them manually before each commit.

## When a gate fails

| Failure | Fix |
|---|---|
| Count mismatch | Update the lower number to match the higher; verify the higher is correct |
| Frontmatter missing | Add full YAML frontmatter per [`frontmatter.md`](frontmatter.md) |
| Compose labels missing | Add per [`container-labels.md`](container-labels.md) |
| Script syntax error | Fix the syntax; `bash -n <script>` to validate |
| Broken link | Either fix the path or remove the link |
| Wrong branch | `git checkout main` before merging |
| Worktree out of sync | `git pull --rebase origin <branch>` |

## Why these gates exist (incidents)

| Incident | Date | Gate that prevents it |
|---|---|---|
| SKILL count drifted to 73 vs actual 76 | 2026-05-14 | Gate 1 |
| Frontmatter missing trigger phrase | (historical) | Gate 2 |
| Container missing labels | (caught manually) | Gate 3 |
| Hung install.sh due to syntax | (caught manually) | Gate 4 |
| Cross-ref missing on skill add | 2026-05-14 | Gate 5 |
| Merged to wrong branch | 2026-05-14 | Gate 6 |

See [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md) for the full incident log.
