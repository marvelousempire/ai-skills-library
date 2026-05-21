# Symlink-first library delivery

**Status:** active rule  
**Applies to:** Nephew, Bishop, product repos, and any consumer of `marvelousempire/ai-skills-library`.

## Doctrine

> **Canonical prose lives in AISL once.** Consumers **symlink** skills into `.cursor/skills/`, **sync** (or selectively symlink) shared rules into IDE rule folders, and keep **small manifests** only for binder validation and workspace host identity. **MCP and API** are discovery and operations layers; they never replace on-disk law or skill paths for Cursor.

Library entries for upstream tools are **pointers with metadata, not rsync targets** — see [`add-agent-to-skills-library`](../add-agent-to-skills-library/body.md).

## Layered delivery

| Layer | Mechanism | Why |
|-------|-----------|-----|
| Shared skills | Symlink via `scripts/install-repo-skills-to-cursor-project.sh` | Cursor loads `.cursor/skills/<id>/SKILL.md` at session start |
| Shared discipline rules | `rules/library/<id>/body.md` + `rules/packs/*.json` + `sync-rules-into-repo.sh` | Pack JSON is an **index**; generated `.mdc` / `.md` can be committed for teammates without AISL path |
| Repo-local law + front door | `AI_AGENT_RULES/manifest.json`, `WORKSPACE_HOST.json`, committed commandments | Fail-closed validation; host identity — not a skill catalog |
| Live discovery | MCP `search_library`, `get_product` | When intent is ambiguous or catalog browse is needed |
| Nephew CLOAK | `nephew-cloak` MCP | Session load, witness, archive — not skill installation |
| Remote fallback | GitHub API (library-bridge Path 4) | No local AISL clone |

## Required commands (consumer repos)

From AISL root:

```bash
./scripts/install-repo-skills-to-cursor-project.sh /path/to/consumer-repo
```

Optional discipline sync (Nephew pack example):

```bash
PACK=rules/packs/nephew-brain-core.json ./scripts/sync-rules-into-repo.sh /path/to/nephew
```

Re-run after `git pull` in AISL (install script relinks stale symlinks).

## Anti-patterns

- Treating `AI_AGENT_RULES/manifest.json` or passports as the way to load 100+ skills into Cursor.
- Using MCP or API as the **only** path for always-on discipline (MOIC, dev-discipline, workspace host).
- Copying full `SKILL.md` bodies into product repos when a symlink to AISL suffices.
- Duplicating upstream agent code into AISL (violates add-agent-to-skills-library).

## Decision matrix

| Need | Use |
|------|-----|
| Same skills in Cursor after clone | Symlink install (+ document `make cursor-skills-link` on Nephew) |
| MOIC / host / repo commandments | Committed `AI_AGENT_RULES/` + `WORKSPACE_HOST.json` |
| Promote rule to many repos | `rules/library/` + pack JSON + sync-rules |
| “What skill fits this request?” | MCP `search_library` |
| Web-only agent | GitHub API |
| Nephew session / CLOAK | nephew MCP |

## See also

- [`docs/cursor-project-skills.md`](../../docs/cursor-project-skills.md)
- [`docs/rules-pipeline.md`](../../docs/rules-pipeline.md)
- [`skills/engineering/library-bridge/SKILL.md`](../../skills/engineering/library-bridge/SKILL.md)
- [`workspace-front-door-host`](../workspace-front-door-host/body.md) — host identity vs skill delivery
