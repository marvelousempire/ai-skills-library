# Consuming this library from another private repo

**`marvelousempire/ai-skills-library`** is the **canonical** home for vendored skills, generated external-tool bridge skills, manifests, and the rules codegen pipeline. Other private repos (for example **`marvelousempire/yousirjuan`**, or an application monorepo) should **depend on this repo**—submodule, sibling clone, or CI checkout—not maintain a second copy of `skills/` / `rules/` that will drift.

## Option A — Git submodule (pin a commit)

From the **consumer** repo root:

```bash
git submodule add https://github.com/marvelousempire/ai-skills-library.git vendor/ai-skills-library
git submodule update --init --recursive
```

Point scripts at the submodule path, e.g. `vendor/ai-skills-library`.

**Bump** when the library moves:

```bash
cd vendor/ai-skills-library && git fetch origin && git checkout main && git pull
cd ../..
git add vendor/ai-skills-library
git commit -m "chore: bump ai-skills-library submodule"
```

## Option B — Sibling clone

Keep `~/Developer/ai-skills-library` (or any path) updated with `git pull`, and pass **absolute paths** into the scripts below. No submodule in the consumer repo.

## Scripts to run (from a clone of *this* library)

| Goal | Command |
|------|---------|
| Claude discovers **external bridge** skills globally | `./scripts/link-external-skills-to-claude.sh` |
| Cursor **flat** `.cursor/skills/` in a project | `./scripts/install-repo-skills-to-cursor-project.sh /path/to/consumer-repo` — see [`cursor-project-skills.md`](cursor-project-skills.md) |
| Emit **`.cursor/rules/*.mdc`** + **`.claude/rules/*.md`** into a repo | `./scripts/sync-rules-into-repo.sh /path/to/consumer-repo` — see [`rules-pipeline.md`](rules-pipeline.md) |
| Refresh **vendored** marketing / Cursor / project skills **inside the library** | `./scripts/vendor-skills-from-home.sh` (run on a machine that has `~/` installs; then commit in **this** repo) |

## Infra / personal stacks (e.g. yousirjuan)

Private “AI infrastructure” repos usually still benefit from:

1. **Submodule** (or sibling clone) of this library.
2. **`link-external-skills-to-claude.sh`** so Claude Code sees `skills/external/*` and the rest of the tree you symlink or install separately.
3. **Rules:** only run **`sync-rules-into-repo.sh`** into that repo if you want the same **Red-E Play–style** rule packs; otherwise add a **new pack + profile** under [`rules/packs/`](../rules/packs/) in this library for an “infra-only” set (future work).

## Related

- [`sync.md`](sync.md) — vending *into* this library from `~/`
- [`process.md`](process.md) — ship changes here via **PR** by default
