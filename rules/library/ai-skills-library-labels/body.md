---
name: ai-skills-library-labels
id: RL-0001
keywords: [enforce-skills, check-library, build-labels]
goal: Deliver ai skills library labels output correctly and completely.
hash: 1eb870d
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Every container ships the ai-skills-library label schema

## When this fires

Any new `docker-compose.yml` is being authored or a new service is being added to an existing one.

## What it says

Every service MUST carry the OCI + `ai-skills-library.*` label set: `org.opencontainers.image.title`, `.source`, `.description`, `ai-skills-library.skill`, `ai-skills-library.surface`, `ai-skills-library.url` (omit url for engine|init|ci-runner).

## Examples

### ✓ Compliant

See `skills/visual/diagrams/seeme/docker-compose.yml` — every service carries all 6 labels.

### ✗ Violation

Compose service with only `image:` and `ports:` — no labels.

## Why

Codified from the 2026-05-14 sovereign-stack session. Tracking how this rule was derived: [`docs/improvement/recurring-failures.md`](../../../docs/improvement/recurring-failures.md) and [`docs/improvement/recurring-wins.md`](../../../docs/improvement/recurring-wins.md).

## Related

- **Standard:** [`docs/standards/container-labels.md`](../../../docs/standards/container-labels.md) and the canonical [`skills/infra/dockyard/templates/labels-reference.md`](../../../skills/infra/dockyard/templates/labels-reference.md)
- **Checklist:** see `docs/checklists/`
- **Script:** see `scripts/`
