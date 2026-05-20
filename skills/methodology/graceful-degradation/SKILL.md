---
name: graceful-degradation
id: SK-0114
keywords: [degrade-gracefully, handle-failure, fallback-safely]
goal: Deliver graceful degradation output correctly and completely.
hash: 75e9eca
relations: []
before: []
governed_by: [global]
meta: dynamic
description: When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every component degrades gracefully so the whole system never wedges on one bad link. Triggers on "graceful degradation", "fail soft", "don't crash on missing X". See `docs/standards/` and `docs/improvement/recurring-wins.md` for context. Pairs with the canonical reference: Implicit in `skills/infra/console/server.ts` and the Makefile patterns.
---

# graceful-degradation — methodology skill

When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every component degrades gracefully so the whole system never wedges on one bad link.

## When to use

Triggers: "graceful degradation", "fail soft", "don't crash on missing X".

## How

See the canonical reference: Implicit in `skills/infra/console/server.ts` and the Makefile patterns.

## Why this exists

Codified from the 2026-05-14 sovereign-stack session. Used repeatedly across SEEME, self-hosted-git, Homelab Console, and Dockyard integration. Logged in [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Pairing

- **Standard:** Implicit in `skills/infra/console/server.ts` and the Makefile patterns
- **Template (if applicable):** see `docs/templates/`
- **Checklist (if applicable):** see `docs/checklists/`
- **Drill (if applicable):** see `docs/training/drills/`

## SRIC decline (stack-bound agents)

When an agent is bound to a tech stack bible, use the **Strict Registered Intent & Capabilities** decline shape instead of silent failure or improvisation:

- Canonical spec: [`skills/engineering/tech-stacks/cinematic-reality-ui/SRIC.md`](../../engineering/tech-stacks/cinematic-reality-ui/SRIC.md)
- Required fields: `status: declined`, `reason`, `missing_resources[]`, `in_scope_alternatives[]`
- Bishop-born agents: generic copy in `bishop/agents/manifests/_template/AI_AGENT_RULES/SRIC.md`

Do not duplicate the full template here—link and follow SRIC at decline time.

## Status

Stub. Body to be fleshed out as patterns are exercised in future sessions. Frontmatter is authoritative for agent triggering.
