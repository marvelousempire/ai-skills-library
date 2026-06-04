---
name: fleet-doc-rag
id: SK-0131
keywords: [hybrid-rag, domain-collections, qdrant-ingest, doc-search]
goal: Stand up a domain-aware document-RAG service that a chat app retrieves from, hybrid.
hash: f1eed0c
relations: []
before: []
governed_by: [global]
meta: dynamic
description: A FastAPI document-RAG over Qdrant + local Ollama embeddings that ingests raw-docs/{financial,legal,family,general}/ → chunk (700/80) → embed → per-domain collections with domain/doc_type/priority metadata, and serves POST /search {query,domain,k}. A chat app's SmartRetriever combines this DOCUMENT brain with its own CHAT brain and reranks the union — the "hybrid" split: chat cassette owns conversations, fleet owns documents. Built to graceful-degradation (every dep failure → []), idempotent-commands (ingest upserts by content hash), doctor-script-pattern (GET /doctor + doctor.sh). Triggers on "domain RAG", "document brain", "hybrid retrieval", "Qdrant ingest service". Reference impl: search-my-engine deploy/fleet/doc-rag/ (Plan 0052, ServerC blueprint).
---

# fleet-doc-rag — infra skill

## When to use
A chat/archive app already does RAG over its own data, and you want to ADD a
document brain (PDFs/statements/notes) without bolting ingestion onto the app.
Split it: the app keeps its retrieval; a small fleet service owns documents; the
app's SmartRetriever queries BOTH and reranks the union ("hybrid").

## The shape
1. **Vector store** — Qdrant, one collection per domain (`<domain>_collection`).
2. **Embeddings** — local Ollama (`mxbai-embed-large`, 1024-d) so nothing leaves the box.
3. **Service** — FastAPI:
   - `POST /search {query, domain, k}` → embed query → Qdrant search → results.
   - `POST /ingest` → walk `raw-docs/{domain}/`, read `.txt/.md/.pdf`, chunk
     (~700 tok / 80 overlap), embed, **upsert by content-hash id** (idempotent).
   - `GET /doctor` → probe Qdrant + Ollama + per-collection counts.
4. **App bridge** — the app holds a `FLEET_RAG_URL` setting; a `fleetDocSearch()`
   POSTs to `/search` and **fails open to `[]`** when the service is down.

## Patterns enforced
- **graceful-degradation** — embedder/Qdrant/collection down → `{results:[]}`, never a crash; the app degrades to local-only.
- **idempotent-commands** — point id = `sha1(path:idx:head)`, so re-ingest is a no-op/refresh.
- **doctor-script-pattern** — `doctor.sh` (exit 0 green / 1 red / 2 yellow) + `GET /doctor`.

## Verify
- `doctor.sh` → `HEALTHY {qdrant:ok, ollama:ok}`.
- Drop a `.txt` in `raw-docs/general/` → `POST /ingest` → `general_collection` count > 0.
- `POST /search {query, domain:"general"}` → returns the chunk.
- App with `FLEET_RAG_URL` set → its hybrid retriever includes the document.
