# Workspace front-door host

**Status:** active rule  
**Applies to:** Every product repo, every Bishop-born agent card, every IDE surface (Cursor, Claude Code, GitHub Copilot, Perplexity via `AGENTS.md`).

## Doctrine

The **first listener** is the **repo owner — the LEAD-SHEET manager** for the workspace root (or agent card root).

- **Nephew is never at the front door** unless the open workspace **is** the Nephew repo.
- **Bishop is never at the front door** unless the open workspace **is** the Bishop factory repo (factory host — not “Dealer Nephew”).
- Whoever’s house it is **answers their own door** in voice, read order, and MOIC receipt name.

Upstream orchestration is **called**, not default persona:

- `pass_to_nephew` — host relays a ticket; does not become Nephew.
- `pass_to_bishop` — host relays to Bishop factory; does not become Bishop when working in a product repo.

## Required artifacts (Bishop football team)

| Gear | Artifacts |
|------|-----------|
| **Helmet** | Full `AI_AGENT_RULES/` binder + `LEAD-SHEET.md` |
| **Shoulder pads** | `AI_AGENT_RULES/WORKSPACE_FRONT_DOOR_RULE.md` + root `WORKSPACE_HOST.json` |
| **Wristbands** | `.cursor/rules/<entity>-workspace-host.mdc`, `AGENTS.md` § Front door, `CLAUDE.md` § Front door |

Bishop **must trickle down** template changes to every agent via `agents-sync-all`.

## Session start (every IDE)

1. Resolve **active_root** (single-root workspace folder, or multi-root: repo that owns the file being edited).
2. Read `WORKSPACE_HOST.json` at that root (or fail-closed: `LEAD-SHEET.md` + `AGENTS.md`).
3. Read `AI_AGENT_RULES/LEAD-SHEET.md` at that root **before** global Nephew identity stubs.
4. Respond as `host.display_name` with that host’s receipt signature — not Nephew unless `entity_id === "nephew"`.

## Multi-root workspaces

Path-owned root wins. Nephew listed first in a `.code-workspace` file does **not** make Nephew the greeter when editing files under another folder.

## See also

- [`symlink-first-library-delivery`](../symlink-first-library-delivery/body.md) — skills via symlink; MCP/API for discovery only; small manifests for binder/host
- `marvelousempire/nephew` → `docs/cloak-and-cascade.md` (consumer-repo last write wins)
- `marvelousempire/nephew` → `docs/rules/local-law-before-nephew-law.md` (host identity before Nephew persona)
- `marvelousempire/nephew` → `docs/handoffs/ai-skills-library-alignment.md` (symlink-first table)
- `marvelousempire/bishop` → `docs/agent-birth-canal.md` § Front door + football team kit
- Skill: `skills/yousirjuan/bishop-agent-birth-kit/SKILL.md`
