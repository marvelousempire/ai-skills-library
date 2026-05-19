# Tech stack — Nephew operator LoRA (local continued pretrain)

**Witness repo:** [marvelousempire/nephew](https://github.com/marvelousempire/nephew)  
**Runbook (canonical):** [`scripts/finetune/README.md`](https://github.com/marvelousempire/nephew/blob/main/scripts/finetune/README.md)  
**Hardware (canonical):** [yousirjuan/docs/hardware-topology.md](https://github.com/marvelousempire/yousirjuan/blob/main/docs/hardware-topology.md)

## Summary

| Step | Command / path |
|------|----------------|
| Export slices | `node scripts/finetune/export-slices.mjs --include-meta` |
| Capture in traces | `NEPHEW_FINETUNE_CAPTURE=1` during inference |
| Train on DGX | `scripts/finetune/train-lora.sh` (Ollama on Spark) |
| Register DSMRP stack | `node scripts/finetune/register-stack.mjs` |
| Registry | `data/tech-stack/registry.json` → `stack_id` with `finetune: true` |

## When to use

- Operator wants **sovereign** Nephew-style routing on **local** tier without cloud frontier cost.
- Witnessed, high-solvency slices exist in `.nephew/runs/` (or meta-library doctrine export).
- DGX Spark (or Mac mini Ollama) is up per You-Sir Juan topology.

## Not in this doc

- DGX rack specs, WireGuard, or `docker-compose` — see **yousirjuan** only (REPOS-CONTRACT).
- Training GPT-class foundation weights — out of scope for Nephew.
