# Cursor project skills (monorepo / app repo)

Cursor loads **project** skills from:

`<project-root>/.cursor/skills/<skill-id>/SKILL.md`

Each skill is a **directory** with that exact layout. This library keeps skills **grouped** under `skills/marketing/`, `skills/ide/cursor/`, etc., for browsing on GitHub — those paths are **not** what Cursor reads inside an application repo.

## Install from this repo into a project (recommended)

From **this library’s** root, after `git pull`:

```bash
./scripts/install-repo-skills-to-cursor-project.sh /path/to/your-monorepo
```

That creates `/path/to/your-monorepo/.cursor/skills/` and **symlinks** each skill folder into a **flat** list. Packs include **marketing**, **engineering**, **methodology**, **ide/cursor**, **`yousirjuan`** (six platform skills), **red-e-play**, **external**, and **ui-ux-pro-max**. Re-run after you refresh `skills/` from `vendor-skills-from-home.sh`.

**You-Sir Juan monorepo:** run against the repo root so all six `skills/yousirjuan/*` skills link into `.cursor/skills/`. Library path is `skills/yousirjuan/` — never `skills/project/yousirjuan/`.

- **Collisions** (same skill id from two packs) abort the script; resolve manually.
- The script **does not** delete unrelated folders already in `.cursor/skills/` — only adds or refreshes symlinks for ids in this repo.

## Monorepo layout (one shared `.cursor/skills`)

Many teams keep a **single** `.cursor/skills` at the monorepo root and point sub-apps at it:

```bash
mkdir -p apps/web/.cursor
ln -sfn ../../.cursor/skills apps/web/.cursor/skills
```

Adjust relative depth to match your tree. The agent’s workspace root should be the folder Cursor opens; if you open `apps/web` only, put or symlink `.cursor/skills` **there** (or open the repo root).

## Global install vs project install

| Mechanism | Path | Use case |
|-----------|------|----------|
| `npx skills add …` + symlinks | `~/.cursor/skills/` | Personal machine; all projects |
| This repo’s install script | `<project>/.cursor/skills/` | **Team parity**: same skills as GitHub library, reproducible from clone |

You can use **both**; project skills override / merge per Cursor’s rules. Avoid maintaining two divergent copies — either vendor into this repo and install from here, or symlink project `.cursor/skills` entries to `~/.agents/skills/<id>` as in [`marketingskills.md`](marketingskills.md).

## Product marketing context (foundation)

Marketing skills expect **`product-marketing-context`** material on disk (see upstream Corey Haines docs). For READYPLAY, symlink the canonical file as described in [`marketingskills.md`](marketingskills.md) and keep [`../context/readyplay-product-marketing-context.md`](../context/readyplay-product-marketing-context.md) updated when you vendor.

## Authoring conventions

When adding or editing `SKILL.md` files, follow Cursor’s **create-skill** guidance (frontmatter `name` + `description`, concise body, optional `reference.md` / `scripts/` beside `SKILL.md`). See vendored [`skills/ide/cursor/create-skill/SKILL.md`](../skills/ide/cursor/create-skill/SKILL.md).

## Validation

Optional check that every `SKILL.md` has parseable frontmatter:

```bash
python3 scripts/validate-skill-frontmatter.py
```
