---
name: sovereign-egress-default-deny
id: SK-YSJ-0231
domain: yousirjuan
status: Active
description: >
  Default deny cloud LLM/telemetry egress — factory gate, assembly line,
  make sovereign-egress-audit; ONLY PRIVATE fleet rule.
---

# Sovereign Egress — Default Deny

## The rule

> If it phones home to external LLM or telemetry APIs — **block** or **move to Family Office hardware**.

## Enforcement

| Gate | Command / location |
|------|-------------------|
| Policy | Nephew `data/sovereign-egress-policy.json` |
| Fleet audit | `make sovereign-egress-audit` |
| Per tool | `node scripts/audit-fleet-egress.mjs --tool=odysseus` |
| Factory install | brain merge egress scan |
| Assembly line | `make cassette-line CHECK=web-odysseus` |

## Audit order

1. Odysseus overlays (`deploy/odysseus/nephew*.env.example`)
2. OpenClaw — routes to tower/Hermes only
3. Ollama — local inference; pre-cache model pulls on DGX
4. Hermes / tower-api / RAG — no cloud keys in committed env

## Allowed hosts (summary)

`127.0.0.1`, `10.1.0.*`, `192.168.10.*`, `git.jailynmarvin.com`, in-cluster service names.

## Blocked (summary)

`api.openai.com`, `api.anthropic.com`, `openrouter.ai`, analytics/telemetry hosts, live `OPENAI_API_KEY` in compose.

## Docs

- YSJ `docs/setup/29-sovereign-egress-default-deny.md`
- Nephew `docs/pockit/Sovereign-Egress-Gate.md`
- Nephew `docs/sovereign.md`

## Upstream note

Odysseus vendor source may reference cloud provider URLs — **Nephew deploy overlays override at runtime**. Use `--strict-vendor` only for hardening patch work.
