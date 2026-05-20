# SRIC — Strict Registered Intent & Capabilities

**Stack:** Cinematic Reality UI (`cinematic-reality-ui`)  
**Constitution:** [`stack.ledger.yaml`](stack.ledger.yaml) → [`ledger/`](ledger/)  
**Capabilities:** [`ledger/capabilities.yaml`](ledger/capabilities.yaml)

The **ledger is supreme law**; capabilities are operational slices. Dependencies, UI kits, and payloads must all be on the ledger before use.

## Registered intent

Teach, audit, and implement **cinematic reality UI** on web (WebGPU + ACES + screen-space fluid) and document the native **Cinematic Broadcast Arena** bridge—always grounded in files in this tech-stack tree. Never invent shaders, tokens, APIs, packages, or “shipped” state without file evidence.

## Rules (non-negotiable)

1. **Ledger only** — Dependencies from `ledger/dependencies.yaml`; UI from `ledger/ui-kits.yaml`; outputs from `ledger/payloads.yaml`.
2. **Capabilities ⊆ ledger** — Work only on ids in `ledger/capabilities.yaml` (each links a `payload_id`).
3. **Validate before act** — Cite bible section + relative file path before recommending code changes.
4. **No hallucination** — If a token, shader, package, or API is not on the ledger or in doctrine, do not claim it exists.
5. **Graceful decline** — Off-ledger or missing resources → decline block below; alternatives from ledger only.
6. **Closed policy** — No new npm/UI framework without ledger PR (`policy: closed`).

## Validation gate (before implementation advice)

- [ ] Request maps to one `ledger/capabilities.yaml` entry.
- [ ] Proposed packages ⊆ `ledger/dependencies.yaml` `allow_packages` / `allow_dev_packages`.
- [ ] Proposed UI frameworks not in `forbidden_patterns` or `forbidden_ui_frameworks`.
- [ ] Required files from that capability exist (or decline: `missing_resources`).
- [ ] Visual change respects [`doctrine/docs/quality/bible/hard-rules.md`](doctrine/docs/quality/bible/hard-rules.md).

## Graceful decline template

```yaml
status: declined
reason: <one sentence — off-ledger, forbidden pattern, or blocked>
missing_resources:
  - <path, tool, package, or capability not available>
in_scope_alternatives:
  - <capability id or payload from ledger only>
citation: <bible/PRD path if partial match>
ledger: ledger/dependencies.yaml | ledger/ui-kits.yaml
```

## Anti-patterns (forbidden)

- Adding `next`, `tailwindcss`, or any `forbidden_patterns` package.
- Building Unreal/Unity fluid when ledger registers WebGPU + screen-space fluid.
- Claiming iOS ship without a registered `ios_build` payload.
- “It should work” without cited file diff or `make ui-local` on reference app.

## Related

- Guardian: [`agents/cinematic-reality-ui-guardian.md`](../../../agents/cinematic-reality-ui-guardian.md)
- Depository: [`../DEPOSITORY.md`](../DEPOSITORY.md)
- Plugin card: [`stack.plugin.json`](stack.plugin.json)
- Bishop generic SRIC: `bishop/agents/manifests/_template/AI_AGENT_RULES/SRIC.md`
