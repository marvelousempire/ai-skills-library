# Consumer bridge (red-e-play-app and other repos)

**All skills, agents, plugin manifests, and catalogs live in this repository.** Consumer repos (e.g. `red-e-play-app`) do **not** own the library — they **bridge** it with symlinks.

## Canonical checkout (author here)

```bash
git clone ssh://git@10.1.0.5:2424/marvelousempire/ai-skills-library.git ~/Developer/ai-skills-library
cd ~/Developer/ai-skills-library
bash scripts/install-hooks.sh
# Optional offsite mirror remote:
git remote add github git@github.com:marvelousempire/ai-skills-library.git 2>/dev/null || true
```

**Sovereign git:** Gitea on DGX (`origin`) is canonical; GitHub (`github`) is mirror only — Plan 0041.

```bash
./scripts/push-all-remotes.sh   # Gitea first, then github mirror (+ optional gitlab)
```

## What consumers do

| Action | Where | Command |
|--------|-------|---------|
| Author skill/agent | **This repo** | edit `skills/` / `agents/`, run generators |
| Browse catalog | **This repo** | [`LIBRARY-PLUGIN-CATALOG.md`](../LIBRARY-PLUGIN-CATALOG.md) |
| Use in Cursor (project) | Consumer repo | `bash scripts/either-host/bridge-ai-skills-library.sh` |
| Publish + push | **This repo** | `./scripts/vendor-skills-from-home.sh` + validators + `git push` |
| Optional pin | Consumer `vendor/ai-skills-library` | git submodule — **read-only pin**, not the authoring surface |

## Bridge resolution order

Consumer scripts (`bridge-ai-skills-library.sh`, `sync-ai-skills-library.sh`) resolve the library path as:

1. `AI_SKILLS_LIBRARY_ROOT` (explicit)
2. `~/Developer/ai-skills-library` (standalone clone — **preferred**)
3. `<consumer>/vendor/ai-skills-library` (submodule fallback)

## Do not

- Commit skill/agent bodies into consumer monorepos
- Treat `vendor/ai-skills-library` as the place to edit skills (it's a bridge pin only)
- Bump consumer submodule for every library ship unless CI needs a pinned SHA

## Bishop / plugin cards

New agents and skills ship **here** with `*.plugin.json` + lead sheet. Bishop rejects registration unless the item appears in [`LIBRARY-PLUGIN-CATALOG.md`](../LIBRARY-PLUGIN-CATALOG.md).
