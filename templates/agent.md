---
name: <kebab-case-name>
description: >-
  <2-3 sentence summary of what the agent does. Be specific about inputs, outputs, and stop conditions.>
tools: [Read, Write, Edit, Bash, Grep, Glob]
model: opus
---

# Agent: <agent-name>

## Plugin card (mandatory — WordPress-style)

Bishop treats every agent like a **WordPress plugin**. After this file exists, generate:

- **Flat:** `agents/<slug>.plugin.json` + `agents/<slug>.plugin.md` (beside `agents/<slug>.md`)
- **Folder:** `agents/<slug>/agent.plugin.json` + `agent.plugin.md` (beside this `AGENT.md`)

```bash
python3 scripts/generate-agent-plugin-manifests.py
python3 scripts/validate-agent-plugin-manifests.py
```

The agent must appear in [`LIBRARY-PLUGIN-CATALOG.md`](../LIBRARY-PLUGIN-CATALOG.md). Template: [`templates/agent.plugin.json`](../templates/agent.plugin.json).

## Philosophy (mandatory)

> **<One sentence — the agent's north star. Bishop rejects agents without this section.>**

### What this means in practice

- <3–7 bullets: how philosophy changes behavior on the job>

**Canonical example:** [`agents/forensic-case-investigator.md`](../agents/forensic-case-investigator.md) — *ant-in-the-jungle diligence.*

## Mission

<One paragraph stating the agent's purpose and the boundary of what it does vs doesn't do.>

## Commissioned by

This agent is part of **Nephew's** dispatch — it does not commission itself.
Name the dispatch layer: Layer 1 worker, Layer 2 process chair, Layer 3
specialist, or pointer agent.

## Trigger

<Exact trigger phrases, commands, hooks, or runtime conditions that commission this agent.>

## Inputs expected

```yaml
<structured input shape>
```

## Output artifacts

1. <File 1>
2. <File 2>

## Safety guarantees

- <Pre-flight check 1>
- <Pre-flight check 2>
- <Idempotency / safety property>

## Stop conditions

- <When the agent hands back to human>
- <Failure modes that escalate>

## Verification

```bash
<literal command proving the agent contract or implementation works>
```

## Related

- Skill: [`skills/engineering/<skill>`](../skills/engineering/<skill>/SKILL.md)
- Templates: [`templates/<template>`](../templates/<template>)
- Rules: <list relevant rules>
