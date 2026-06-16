---
name: sovereign-rag-retrieve
id: SK-YSJ-0202
domain: yousirjuan
status: Active
description: >
  Fleet RAG — bge-m3 embeddings, Qdrant Brain A, bge-reranker-v2-m3,
  tower-api /api/v1/retrieve, nephew_corpus_retrieve MCP tool.
---

# Sovereign RAG Retrieve

## When to use

Retrieval, corpus, Qdrant, embeddings, reranker, Brain A vs Brain B, eval harness.

## Fleet path (only)

```text
query → bge-m3 (:9200) → Qdrant (:6333) → bge-reranker-v2-m3 (:9201) → tower-api retrieve (:8088)
```

Agents: **`nephew_corpus_retrieve`** — not Open WebUI chromadb for fleet knowledge.

## Collections (Brain A)

`nephew-rules`, `nephew-memory`, `nephew-identity`, `nephew-financial`, `nephew-legal`, `nephew-family`, `nephew-general`, `nephew-vault`

Re-index: `node scripts/index-corpus.mjs` (Nephew repo on DGX).

## Eval gate

```bash
make evals-retrieval
node evals/retrieval/run.mjs --label bge-m3-rerank --rerank
```

No retrieval change ships without eval delta (Plan 0098).

## Docs

- YSJ `docs/setup/06-retrieval-and-memory.md` · `16-knowledge-fabric-rag-quantization.md`
- Nephew `docs/infrastructure/dgx-rag-and-fleet-state.md`
- Nephew `docs/fleet-integration-contract.md` — rule 2: fleet RAG → doc-rag + retrieve only

## Odysseus personal RAG

Separate Chroma for uploads — overlay env in `deploy/odysseus/nephew-dgx.env.example` points embed/rerank to DGX sovereign endpoints.
