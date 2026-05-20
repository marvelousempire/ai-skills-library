# Cinematic Reality UI — sealed tech stack

**Stack id:** `cinematic-reality-ui`  
**Catalog:** [`stack.plugin.md`](stack.plugin.md) · [`stack.plugin.json`](stack.plugin.json)  
**Ledger:** [`stack.ledger.yaml`](stack.ledger.yaml)

Immersive cinematic **reality UI** — WebGPU fluid + ACES on web, RealityKit 4 doctrine on iOS. Reference apps in `decanter/` are examples; the product is **mood + doctrine + sealed ledger**.

## Quick links

| | |
|---|---|
| SRIC | [`SRIC.md`](SRIC.md) |
| Dependencies | [`ledger/dependencies.yaml`](ledger/dependencies.yaml) |
| Capabilities | [`ledger/capabilities.yaml`](ledger/capabilities.yaml) |
| Bible | [`doctrine/docs/quality/master-cinematic-quality-bible.md`](doctrine/docs/quality/master-cinematic-quality-bible.md) |
| Hero app | [`decanter/apps/cinematic-fluid-hero/`](decanter/apps/cinematic-fluid-hero/) |
| Guardian | [`agents/cinematic-reality-ui-guardian.md`](../../../agents/cinematic-reality-ui-guardian.md) |

## Run reference hero

```sh
cd decanter/apps/cinematic-fluid-hero && pnpm install && make ui-local
```

## Depository

This kit follows [`../DEPOSITORY.md`](../DEPOSITORY.md). Off-ledger packages and UI frameworks are declined, not substituted.
