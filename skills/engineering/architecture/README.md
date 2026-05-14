# engineering / architecture

**What belongs here:** Structural design decisions — the load-bearing choices that define how a system, protocol, or product is shaped at scale. How things connect. How safety is enforced. How versions flow. How surfaces attach to engines.

Architecture ≠ cosmetic. Architecture = the bones. If removing it would cause the system to collapse or behave differently, it's architecture.

**What does NOT belong here:** Implementation skills (how to do a specific task), workflow skills (how to run a process), tooling skills (how to configure a tool). Those stay flat in `engineering/`.

## Skills in this folder

| Skill | What it architecturally defines |
|---|---|
| `product-repo-architecture` | git repo structure, auto-release, version tracking, Makefile interface |
| `multi-surface-single-engine` | one engine, multiple surface adapters — never duplicate the logic |
| `three-tier-safety-classification` | safe/probably_safe/caution as a structural code guarantee |
| `streaming-sse-event-vocabulary` | canonical SSE event protocol for AI agent interfaces |
| `avery-goodman-repo-standard` | schema that defines the structural presentation of every repo |
| `secure-data-flow-protocol` | how data moves safely through a system |
| `versioned-pinned-protocol` | how versioning is structured across a project |
| `schema-fk-typecheck` | how data schemas and foreign key relationships are structured |
| `multi-actor-consensus-mechanic` | how agreement is structured across multiple actors |
| `marketplace-with-trust-reserve` | how marketplace trust architecture is built |
