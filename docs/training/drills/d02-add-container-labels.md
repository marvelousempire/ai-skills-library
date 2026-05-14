# Drill d02 — apply the label schema (10 min)

## Starting state
A `docker-compose.yml` with services but no labels.

## Target state
Every service carries the full `ai-skills-library.*` schema per [`docs/standards/container-labels.md`](../../standards/container-labels.md).

## Steps

```sh
# 1. Find a compose file (use SEEME's as the reference):
cat skills/visual/diagrams/seeme/docker-compose.yml | grep -A 6 'labels:'

# 2. For each service in a hypothetical new compose, add:
#    org.opencontainers.image.title       — display name
#    org.opencontainers.image.source      — repo URL (always the same)
#    org.opencontainers.image.description — one-line role
#    ai-skills-library.skill              — skill slug
#    ai-skills-library.surface            — surface type
#    ai-skills-library.url                — localhost URL (omit for engine|init)

# 3. Verify
docker compose -f <path>.yml config | grep -c 'ai-skills-library.skill'
```

## Verification (expected output)

```
<number of services>     (matches service count)
```

## Solution

See the SEEME and self-hosted-git compose files for canonical examples.
