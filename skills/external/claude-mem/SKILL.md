---
name: claude-mem
id: SK-0052
keywords: [integrate-claude, check-mem, file-claude]
hash: 731f991
relations: []
before: []
governed_by: [global]
meta: dynamic
description: "claude-mem \u2014 Claude Code plugin that captures session work, compresses it, and injects context into later sessions. Use when the user mentions or needs: long-term memory for Claude Code; claude-mem; remember across Claude sessions; session memory plugin."
---

# claude-mem

| | |
|--|--|
| **Upstream** | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) |
| **Artifact type** | **plugin** (tool / product — not shipped inside this repo) |
| **Skill packaging** | **Generated** in [`skills/external/claude-mem/`](.) — Upstream may publish plugin or skill metadata — prefer upstream for install truth. |
| **Catalog** | [`../SKILL-CATALOG.md`](../SKILL-CATALOG.md) |

## When to use this skill

- long-term memory for Claude Code
- claude-mem
- remember across Claude sessions
- session memory plugin

## Agent playbook

1. **Do not assume the software is installed.** Confirm environment, then give clone/install steps from the upstream README.
2. **Defer API details** (endpoints, env vars, GPU requirements) to upstream docs; link the user there when specifics matter.
3. **Narrow scope:** help with integration planning, architecture, and safe defaults — not a substitute for reading upstream license and ToS.
4. If the user already uses a **native upstream skill** (see table in [`related-github-projects.md`](../../docs/related-github-projects.md)), follow that when it conflicts with this bridge.

## Install / operations

Install as a Claude Code plugin per https://github.com/thedotmack/claude-mem — upstream may ship its own skill or plugin metadata.

## Compliance & safety

- Clarify what is stored locally vs sent to models; follow org policy for code and secrets in memory.

## Related index

Human-readable table with **Tool vs skill** tags: [`../../docs/related-github-projects.md`](../../docs/related-github-projects.md).

Manifest source (edit to add tools): [`../../docs/external-tools.manifest.json`](../../docs/external-tools.manifest.json).
