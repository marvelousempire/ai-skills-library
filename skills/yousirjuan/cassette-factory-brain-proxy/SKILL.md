---
name: cassette-factory-brain-proxy
id: SK-YSJ-0230
domain: yousirjuan
status: Active
description: >
  Cassette Factory one-tap ingest — GitHub URL to door/app/bootstrap;
  NEPHEW_BRAIN_PROXY required; brain merge on every install.
---

# Cassette Factory + Brain Proxy

## When to use

"Install from GitHub", Cassette Factory wizard, forge mirror, new cassette, brain merge.

## One pipeline

```bash
make cassette-from URL=https://github.com/OWNER/REPO
# or Cassette Factory.app → Install & Boot
```

Stages: mirror → classify → factory → brain merge → bootstrap → cassette-line.

## Required env (every overlay)

```bash
NEPHEW_BRAIN_PROXY=http://10.1.0.5:8088
NEPHEW_EGRESS_DENY=1
```

Factory **fails** vendor compose with standalone Ollama/vLLM and no brain proxy.

## Fleet blocklist (do not re-factory)

Hermes, tower-api, doc-rag, OpenClaw, Ollama, Qdrant — already L1/L5 fleet.

## Docs

- YSJ `docs/setup/27-cassette-factory-and-brain-proxy.md`
- Nephew `docs/pockit/Cassette-Factory-Pipeline.md`
- Nephew `docs/sop/github-link-to-cassette.md`
- Plan 0230

## Verify

```bash
make cassette-line CHECK=<tape-id>
make sovereign-egress-audit
```
