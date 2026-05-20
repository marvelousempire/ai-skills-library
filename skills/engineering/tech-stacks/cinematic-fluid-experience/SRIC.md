# SRIC — Strict Registered Intent & Capabilities

**Stack:** Cinematic Fluid Experience  
**Registry:** [`capabilities.registry.yaml`](capabilities.registry.yaml)

## Registered intent

Teach, audit, and implement **cinematic interactive fluid experiences** on the web (WebGPU + ACES + screen-space fluid) and document the native **Cinematic Broadcast Arena** bridge—always grounded in files in this tech-stack tree. Never invent shaders, tokens, APIs, or “shipped” state without file evidence.

## Rules (non-negotiable)

1. **Allowlist only** — Work only on capabilities listed in `capabilities.registry.yaml`.
2. **Validate before act** — Cite bible section + relative file path before recommending code changes.
3. **No hallucination** — If a token, shader, or API is not in `doctrine/docs/quality/` or reference apps, do not claim it exists.
4. **Graceful decline** — If the request is out of scope or resources are missing, emit the decline block below; do not improvise substitutes outside the registry.
5. **Honest resources** — WebGPU, repo checkout, and bible files are prerequisites for implementation capabilities.

## Validation gate (before implementation advice)

- [ ] Request maps to exactly one `capabilities.registry.yaml` entry.
- [ ] Required files from that entry exist on disk (or decline: `missing_resources`).
- [ ] Visual change respects [`doctrine/docs/quality/bible/hard-rules.md`](doctrine/docs/quality/bible/hard-rules.md).
- [ ] Tokens match [`doctrine/docs/quality/bible/design-tokens.md`](doctrine/docs/quality/bible/design-tokens.md) or `decanter/apps/cinematic-fluid-hero/src/tokens.ts`.

## Graceful decline template

Use this shape verbatim when declining:

```yaml
status: declined
reason: <one sentence — why this is out of SRIC or blocked>
missing_resources:
  - <path, tool, or capability not available>
in_scope_alternatives:
  - <what you CAN do under SRIC, with doc path>
citation: <optional bible/PRD path if partial match>
```

## Anti-patterns (forbidden)

- Building Unreal/Unity fluid sims when only WebGPU stack is registered.
- Claiming iOS arena implementation without RealityKit project in scope.
- “It should work” without `make ui-local` or cited file diff.
- Forking long bible checklists into consumer repos without linking here.

## Related

- Guardian: [`agents/cinematic-fluid-stack-guardian.md`](../../../agents/cinematic-fluid-stack-guardian.md)
- Methodology pointer: [`skills/methodology/graceful-degradation/SKILL.md`](../../../methodology/graceful-degradation/SKILL.md)
- Bishop generic SRIC: `bishop/agents/manifests/_template/AI_AGENT_RULES/SRIC.md`
