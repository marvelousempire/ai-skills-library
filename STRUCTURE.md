# Repo Structure — Canonical Map

This document is the authoritative answer to "where does X go in this repo?" Every directory below has a single purpose; new artifacts go in the directory that matches their purpose, not in a new sibling directory.

---

## Top-level directories

| Directory | Purpose | Naming convention |
|---|---|---|
| `skills/` | Agent skills — invokable units of behavior with front-matter | `skills/<category>/<kebab-name>/SKILL.md` |
| `rules/` | Codified one-paragraph rules with `body.md` + `meta.json` | `rules/library/<kebab-name>/{body.md, meta.json}` |
| `agents/` | Subagent specifications — fuller agentic behavior than a skill | `agents/<kebab-name>.md` |
| `templates/` | Reusable scaffolds for plans, migrations, CHANGELOG entries, etc. | `templates/<kebab-name>.{md,sql,json}` |
| `checklists/` | One-screen lists for routine work moments (pre-commit, pre-merge, etc.) | `checklists/<kebab-name>.md` |
| `context/` | Project-specific context files (product, vocabulary, brand) | `context/<project>-<topic>.md` |
| `scripts/` | Helper scripts (sync, generate, validate) | `scripts/<kebab-name>.{sh,py}` |
| `docs/` | Narrative documentation (see breakdown below) | `docs/<topic>.md` |
| `rules/packs/` | Bundles of rule IDs for a project to import | `rules/packs/<project>-<role>.json` |
| `rules/profiles/` | Pre-configured rule profiles | `rules/profiles/<profile>.json` |

## `docs/` subdirectories

| Directory | Purpose |
|---|---|
| `docs/master-reports/` | Per-session retrospectives (e.g. `2026-05-14-trainer-marketplace-session.md`) |
| `docs/pain-journal/` | Per-incident write-ups + format doc + index |
| `docs/playbooks/` | Step-by-step playbooks for routine ops |
| `docs/learning-systems/` | Meta — how the library learns and grows |
| `docs/skill-families/` | Skill family taxonomies |

## Top-level files

| File | Purpose |
|---|---|
| `README.md` | Repo intro + fast nav + skill families overview |
| `SKILL-INDEX.md` | Generated flat index of every skill |
| `AGENTS.md` | Registry of all agents in `agents/` |
| `STRUCTURE.md` | This file |
| `THIRD_PARTY.md` | Licenses for vendored / referenced third-party material |

---

## Naming conventions

- **Skills, rules, agents, templates, checklists**: kebab-case (`feature-id-race-guard`, not `feature_id_race_guard` or `FeatureIdRaceGuard`)
- **SQL migration templates**: snake_case in the filename, lowercase in the content (`seed-migration-plan-registration.sql`)
- **Markdown files**: kebab-case for slugs, Title Case for headings
- **JSON metadata**: kebab-case keys, double-quoted strings (standard JSON)
- **Pain journal entries**: `YYYY-MM-DD-<short-slug>.md`
- **Master reports**: `YYYY-MM-DD-<session-slug>.md`

## Front-matter conventions

Every skill `SKILL.md` and agent `*.md` requires YAML front-matter:

```yaml
---
name: <kebab-case-name>
description: >-
  <2-3 sentence summary>
trigger: >-   # skills only
  <when to invoke>
tools: [Read, Write, Edit, Bash]   # agents only
model: opus   # agents only
---
```

Rule metadata is a separate `meta.json` next to `body.md`:

```json
{
  "id": "<kebab-case-rule-id>",
  "description": "<one sentence>",
  "alwaysApply": true,
  "globs": ["**/migrations/*.sql"]
}
```

## Validation

Before commit:
- `python3 scripts/validate-skill-frontmatter.py` — validates SKILL.md files
- `jq empty rules/library/*/meta.json` — validates rule metadata
- `jq empty rules/packs/*.json` — validates rule packs

## Sync to consumer repos

The library is consumed by other repos (red-e-play, etc.) via:
- `scripts/sync-rules-into-repo.sh` — copies rules to `.cursor/rules/` and `.claude/rules/` in target repo
- `scripts/link-external-skills-to-claude.sh` — symlinks skills into Claude's per-repo skills dir
- `scripts/vendor-skills-from-home.sh` — vendors skills from `~/.cursor/skills`

When you add a new top-level directory (like `templates/` / `checklists/` / `agents/`), update the sync scripts to include it.

## Where to file new things

| If you're adding... | File it in... |
|---|---|
| A skill the agent invokes | `skills/<category>/<name>/SKILL.md` |
| A rule the agent must always remember | `rules/library/<name>/{body.md, meta.json}` |
| A scaffold someone copies + edits | `templates/<name>` |
| A one-screen list for a routine moment | `checklists/<name>.md` |
| A fuller agent spec (multi-tool, agentic) | `agents/<name>.md` |
| A retrospective from a substantive session | `docs/master-reports/YYYY-MM-DD-<slug>.md` |
| A specific incident write-up | `docs/pain-journal/YYYY-MM-DD-<slug>.md` |
| A step-by-step ops guide | `docs/playbooks/<slug>.md` |
| A "how does the library learn" doc | `docs/learning-systems/<slug>.md` |
| Product/brand/voice context for a specific project | `context/<project>-<topic>.md` |
| A helper script | `scripts/<name>.{sh,py}` |

## Anti-patterns (don't do)

- Adding files to the repo root (use a subdirectory)
- Creating new top-level directories without updating this file
- Putting agents under `skills/agents/` (they have their own top-level `agents/`)
- Mixing skill metadata (front-matter) and rule metadata (meta.json) — they're different formats
- Forgetting to update `SKILL-INDEX.md` when adding a new skill (CI should catch but check anyway)

## Origin

This structure was formalized after the 2026-05-14 trainer-marketplace session, which surfaced the need for `templates/`, `checklists/`, `agents/`, `docs/master-reports/`, `docs/pain-journal/`, `docs/playbooks/`, and `docs/learning-systems/` as distinct, first-class directories. See [`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](docs/master-reports/2026-05-14-trainer-marketplace-session.md) Section 4.
