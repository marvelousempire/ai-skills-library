# Process: bottlenecks we closed + ongoing discipline

This doc captures **failure modes** we already hit and how this library prevents them.

## Ship via pull request (default)

- **Branch:** `git checkout -B feature/short-name origin/main` (never rely on a stale local `main` as the base).
- **Push + PR:** push the branch, then `gh pr create --repo marvelousempire/ai-skills-library` (real or `--draft` if WIP). Merging through a PR keeps the library visible to parallel sessions and preserves review context.
- **Direct to `main`:** only for trivial one-line fixes everyone agrees are safe; everything else should be a PR.

## Bottlenecks (known)

| Problem | Why it hurts | Mitigation |
|--------|----------------|------------|
| **Index drift** | New installs never added to `SKILL-INDEX.md` — you think Cursor “knows” a skill but it isn’t catalogued | After every install, run **`scripts/rescan-skills.sh`** and update the index (or follow **`docs/add-skill.md`**) |
| **`npx` ≠ real npx** | Shell aliases (`npx` → `pnpm dlx`) break installers (`--yes` missing) | Use **`command npx`** and set **`npm_config_cache=$HOME/.npm`** if npm cache path errors |
| **Cursor vs `.agents` vs `.claude`** | `npx skills add` drops files in **`~/.agents/skills`**; Cursor may not scan that path alone | Symlink **`~/.agents/skills/<name>` → `~/.cursor/skills/<name>`** (done once per machine for the marketing bundle) **or** run **`scripts/install-repo-skills-to-cursor-project.sh`** from this repo into the app root for team-parity `.cursor/skills/` |
| **Grouped paths vs Cursor layout** | This repo stores `skills/marketing/<id>/` but Cursor expects **flat** `<project>/.cursor/skills/<id>/` | Use **`docs/cursor-project-skills.md`** + **`install-repo-skills-to-cursor-project.sh`** — do not hand-copy nested folders into `.cursor/skills/marketing/…` |
| **Stale symlinks** | Old links pointed at **`~/Developer/marketingskills`** while upstream moved | Prefer **`~/.agents/skills`** as canonical after `npx skills add`; symlinks from `.claude` / `.cursor` point there |
| **Overlap without precedence** | “Improve this page” triggers **copywriting**, **page-cro**, and **ui-ux-pro-max** | Use **`docs/overlap-rules.md`**; name the primary skill in the prompt |
| **UI vs disk** | Product UI lists skills that aren’t on disk under scanned roots | **`SKILL-INDEX.md` “Coverage”** section — filesystem is source of truth until rescanned |

## Session checklist (30 seconds)

1. New machine: clone this repo → read **`docs/machine-paths.md`** → adjust paths.
2. After installing a skill pack: run **`scripts/rescan-skills.sh`** → commit index changes.
3. After editing any `SKILL.md`: run **`python3 scripts/validate-skill-frontmatter.py`** (also runs in CI).
4. Fuzzy task: open **`SKILL-INDEX.md`** → pick one skill or split into two prompts.

## Upstream marketing bundle

See **`docs/marketingskills.md`** — install with `npx skills add coreyhaines31/marketingskills`, then wire Cursor/Claude paths as documented.
