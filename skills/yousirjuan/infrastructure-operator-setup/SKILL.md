---
name: infrastructure-operator-setup
id: SK-YSJ-0100
domain: yousirjuan
status: Active
description: >
  Agent read order for You-Sir Juan docs/setup — hardware, network, voice,
  RAG, factory, egress; links to Nephew implementation.
---

# Infrastructure Operator Setup

## Read order (mandatory before infra work)

1. YSJ `docs/setup/README.md`
2. Chapters **1–5** — hardware, network, services, repos, Nephew orchestration
3. **15–18** — doors, RAG, agents, WG/Matrix/Gitea
4. **27–29** — Cassette Factory, voice containers, sovereign egress
5. Nephew `docs/sovereign.md` · `docs/product-stack-glossary.md`

## Agent paste bundle

- YSJ `docs/agent-pastes/infrastructure-operator-context.md`
- Nephew `docs/agent-pastes/hardware-sovereign-audit-prompt.md`
- Nephew `docs/agent-pastes/cassette-update-context.md` (cassette work)

## Repo boundaries

| Repo | Owns |
|------|------|
| **yousirjuan** | Public-safe operator manual, hardware mesh, YSJ app |
| **nephew** | Cassettes, factory scripts, tower-api, fleet deploy, make targets |
| **ai-skills-library** | Canonical skills under `skills/yousirjuan/` |

**Never duplicate Nephew scripts into YSJ** — document and link.

## Verification ritual

```bash
# Nephew on Mac or DGX
make sovereign-egress-audit
make nephew-verify          # when shipping Nephew changes
make forge-push             # YSJ doc changes → Gitea master first
```

## Voice + RAG quick map

- Voice: skill `family-office-voice-stack` · ch. 11 + 28
- RAG: skill `sovereign-rag-retrieve` · ch. 6 + 16
- Factory: skill `cassette-factory-brain-proxy` · ch. 27
- Egress: skill `sovereign-egress-default-deny` · ch. 29
