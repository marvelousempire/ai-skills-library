# 04 — Verification gates

Green checks required before any commit lands on `main`. Each gate prevents a specific recurring failure.

## The seven gates

| # | Gate | Script |
|---|---|---|
| 1 | SKILL count consistency (`find` == SKILL-INDEX == README) | `scripts/check-skill-count.sh` |
| 2 | Frontmatter on every skill (`name:` matches folder, `description:` has triggers) | `scripts/lint-skill-frontmatter.sh` |
| 3 | Compose file labels (for infra skills) | `docker compose -f <path> config \| grep -c ai-skills-library.skill` |
| 4 | Shell scripts parse | `bash -n <script>` |
| 5 | No broken relative links | `scripts/check-cross-references.sh` |
| 6 | Branch state confirmed (`main` before merge) | `git branch --show-current` |
| 7 | Worktree synced to origin | `git rev-parse HEAD` == `@{u}` |

Full doc: [`docs/standards/verification-gates.md`](../standards/verification-gates.md).

## Why each exists

Each gate has a corresponding incident logged in [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md). Reading that file once costs ~5 minutes and saves hours of future debugging.

## Exercise

From the repo root:

```sh
bash scripts/check-skill-count.sh
bash scripts/lint-skill-frontmatter.sh
bash scripts/check-cross-references.sh
```

All three must exit 0.

## Next

[`05-aesthetic-language.md`](05-aesthetic-language.md).
