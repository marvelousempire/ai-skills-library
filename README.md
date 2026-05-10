# AI Skills Library (private)

## Repository status

- **Remote:** private GitHub — `https://github.com/marvelousempire/ai-skills-library` (created 2026-05-10; adjust if you rename or move).
- **Local clone:** `~/Developer/ai-skills-library`
- **Scope:** catalog + docs only unless you add `vendor/` (see [`docs/sync.md`](docs/sync.md)).

The `gh repo create …` block below is kept for **new machines** or if you re-create the remote.

A **catalog + operating manual** for skills installed on your machines. This repo does **not** have to duplicate every skill’s files; it tracks **what you have**, **when to use it**, and **how to avoid collisions** when several skills match the same request.

## What lives here

| File / folder | Purpose |
|---------------|---------|
| [`SKILL-INDEX.md`](SKILL-INDEX.md) | Master table — tool, path, triggers, overlap notes |
| [`docs/overlap-rules.md`](docs/overlap-rules.md) | Precedence when multiple skills fit one prompt |
| [`docs/add-skill.md`](docs/add-skill.md) | Checklist when installing or authoring a skill |
| [`docs/machine-paths.md`](docs/machine-paths.md) | Where skills sit on disk (this Mac) |
| [`docs/process.md`](docs/process.md) | Known bottlenecks + session checklist |
| [`docs/marketingskills.md`](docs/marketingskills.md) | Marketing bundle install + symlink + skill list |
| [`scripts/rescan-skills.sh`](scripts/rescan-skills.sh) | Print all SKILL.md paths for drift checks |

## Quick use

1. Before a fuzzy task (“improve this page”), open **`SKILL-INDEX.md`** and pick **one primary skill** (or split into two prompts).
2. In chat, say explicitly: **“Use the &lt;skill-name&gt; skill for …”** when overlap is likely.
3. After installing something new (CLI, copy-paste, marketplace), run through **`docs/add-skill.md`** and update **`SKILL-INDEX.md`**.

## Optional: vendor copies

If you want the repo to **own** skill sources (portable across machines), add a `vendor/` folder and copy or submodule skills there — then document the sync command in `docs/sync.md`. Default setup is **index-only** so you are not committing huge generated assets unless you choose to.

## Git remote

Create a **private** GitHub repo and push:

```bash
cd ~/Developer/ai-skills-library
gh repo create ai-skills-library --private --source=. --remote=origin --push
```

Or create an empty private repo in the GitHub UI, then:

```bash
git remote add origin git@github.com:YOUR_USER/ai-skills-library.git
git push -u origin main
```
