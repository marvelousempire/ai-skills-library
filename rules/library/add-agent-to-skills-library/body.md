---
name: add-agent-to-skills-library
id: RL-0046
keywords: [enforce-agent, check-skills, build-library]
goal: When an agent (or any standalone product repo) is added to ai-skills-library, register it as a POINTER, never as a copy. The library catalogues; the upstream repo engines.
hash: 730fd56
relations: [cross-reference-on-skill-add]
before: []
governed_by: [global]
meta: dynamic
---

# Add an agent to ai-skills-library as a pointer, not a replica

## When this fires

A standalone product repo (an agent, an MCP server, a CLI tool, any GitHub product that lives in its own repository) is being added to ai-skills-library so the library and downstream consumers can find it, describe it, and invoke it by name.

Use this rule whenever a teammate (or future you) opens a "let's add X to the skills library" turn. **Even once.** The library is the DRY-method factory; the wrong pattern here propagates wrongness to every consuming repo.

## What it says

**The library carries pointers, not copies. The upstream repo engines; the library catalogues.**

When you add an agent (or any standalone product repo), the library MUST do five things and MUST NOT do one thing.

### MUST do

1. **Write a subagent spec file at `agents/<kebab-name>.md`** with YAML frontmatter matching `templates/agent.md` (4 fields: `name`, `description`, `tools`, `model`). The body documents:
   - **Mission** — the boundary of what this agent does vs doesn't do.
   - **Source of truth** — the upstream repo URL, the current release tag, the trust root (if any), the canonical runbook location in a consuming repo.
   - **Inputs expected** — every invocation pattern, named explicitly. At minimum: `@<namespace>:<agent>` inside Claude Code AND any shell-side CLI verbs.
   - **Output artifacts** — every file the agent writes, with its purpose and where it lands.
   - **Safety guarantees** — pre-flight checks, idempotency claims, blast-radius statement.
   - **Stop conditions** — when the agent escalates to a human; when it refuses.
   - **CI integration** — any GitHub Actions workflows the upstream ships for adopters.
   - **Related** — sibling agents in this library that fire near this one.
2. **Add a registry row to `AGENTS.md`** — one line in the registry table naming the agent and its purpose.
3. **Add a manifest entry to `docs/external-tools.manifest.json`** — `id`, `display_name`, `repo`, `section`, `artifact_type`, `summary`, 3-7 `triggers` (the exact words a user or AI would say that should load this agent), `install_pointer`, and `compliance_notes`. Place the new entry under the section that matches its category (e.g. "Agents, memory & orchestration") next to its closest sibling.
4. **Run `python3 scripts/generate-external-tool-skills.py`** to regenerate `skills/external/<id>/SKILL.md` and `docs/related-github-projects.md` and bump the count in `SKILL-INDEX.md`. Never hand-edit the generated files; edit the manifest and re-run.
5. **Commit surgically.** Stage only: `agents/<name>.md`, `AGENTS.md`, `docs/external-tools.manifest.json`, the generated `skills/external/<id>/SKILL.md`, the generated `docs/related-github-projects.md` row, and the generated `SKILL-INDEX.md` count bump. Use `git add <path>` per file — never `git add -A` (it sweeps up unrelated working-tree noise and trips the count-keeper hook).

### MUST NOT do

1. **Do not copy the upstream repo's code, tests, schemas, or marketing docs into the library.** No vendoring. No tree mirror. No "let's also pull in their README." The upstream repo evolves on its own cadence; the pointer auto-resolves to the latest version every time a consumer invokes it.

   The single legitimate exception is the **public half of a signing key** when the agent ships a cryptographic trust root that consumers need to verify. That copy is a public-key file only, never private material, and lives in each *consumer* of the agent — not in the library.

## The pattern in words

The library is a **registry**, the way npm or PyPI is a registry — except the "package" is an agent (or any standalone product) and the "tarball" is the live GitHub repo. The five files above are the registry entry; together they make the agent discoverable, describable, and invocable by name from any downstream repo that has the library installed.

Three repos with three jobs:

```
upstream product repo          ← engine (code, tests, schemas, releases)
       │
       ▼
ai-skills-library              ← catalogue (pointers, descriptions, contracts)
       │
       ▼
consuming product repo         ← adoption (.mcp.json, runbook, trust copy)
```

High-frequency changes (code, tests, releases) live only upstream. Low-frequency changes (identity, registration, discoverability) live in the library. Neither side has to know when the other ships.

## Examples

### ✓ Compliant

**nephew, 2026-05-14** ([PR #27](https://github.com/marvelousempire/ai-skills-library/pull/27))

Added to the library as 5 staged files: `agents/nephew.md` (subagent spec, 112 lines), `AGENTS.md` (one row), `docs/external-tools.manifest.json` (new item inserted after `ruflo` to keep the section grouped), `skills/external/nephew/SKILL.md` (generated), `docs/related-github-projects.md` (generated). Zero lines of Nephew's actual code, tests, or marketing docs were copied. When Nephew v0.3.0 ships, no change in the library is required — consumers picking up `…@latest` get the new version automatically.

### ✗ Violation

- Library committed a copy of an upstream repo's `src/`, `test/`, or `package.json`. **Why this fails:** consumers now disagree about which version is canonical; updates require a re-vendor PR every time the upstream ships; the library starts carrying engine bugs.
- `agents/<name>.md` references the upstream README inline ("see attached") instead of providing a self-contained contract. **Why this fails:** downstream consumers can't invoke the agent without fetching the upstream — defeats the whole "single source of truth for invocation" purpose.
- `docs/external-tools.manifest.json` edited but `python3 scripts/generate-external-tool-skills.py` not re-run. **Why this fails:** the bridge skill drifts from the manifest; SKILL count parity hook blocks the next push.
- Used `git add -A` instead of staging files surgically. **Why this fails:** sweeps embedded worktree pointers, regenerated files for unrelated tools, and ambient working-tree noise into the commit. The count-keeper hook catches it, but the cleanup is manual.

## Why

The ai-skills-library is the **DRY-method factory** for the Avery Gooman stack. Every reusable behaviour belongs in one place; every consuming repo reaches for that one place. The moment the library starts carrying duplicated upstream code, the DRY promise breaks: now two repos have the agent, and "where is the canonical version?" becomes a question every consumer has to answer.

Codified from the 2026-05-14 nephew-registration session ([PR #27](https://github.com/marvelousempire/ai-skills-library/pull/27)). The walk-through that produced this rule established the metaphor: **the library entry is a symlink with metadata, not an rsync target.** Tracking how this rule was derived: see the nephew agent's `Related` section in [`agents/nephew.md`](../../../agents/nephew.md) and the manifest entry in [`docs/external-tools.manifest.json`](../../../docs/external-tools.manifest.json).

## Related

- **Rule:** [`cross-reference-on-skill-add`](../cross-reference-on-skill-add/body.md) — RL-0009, the analogue for skills (not agents).
- **Template:** [`templates/agent.md`](../../../templates/agent.md) — the frontmatter shape every agent spec file uses.
- **Generator:** [`scripts/generate-external-tool-skills.py`](../../../scripts/generate-external-tool-skills.py) — the script that regenerates the bridge skill + related-projects row from the manifest.
- **Registry:** [`AGENTS.md`](../../../AGENTS.md) — the human-readable agent registry table this rule keeps current.
- **Standard:** [`STRUCTURE.md`](../../../STRUCTURE.md) — the canonical "where does X go in this repo?" reference.
- **Manifest:** [`docs/external-tools.manifest.json`](../../../docs/external-tools.manifest.json) — the source of truth for the bridge-skill generator.
