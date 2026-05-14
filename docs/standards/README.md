# Standards — the contracts

Every artifact in this repo conforms to a small number of contracts. They're documented here so future-me + every agent has one place to look.

| Standard | What it constrains |
|---|---|
| [`skill-anatomy.md`](skill-anatomy.md) | What a `skills/<…>/<slug>/` folder must contain |
| [`rule-anatomy.md`](rule-anatomy.md) | What a `rules/library/<slug>/` folder must contain |
| [`frontmatter.md`](frontmatter.md) | The `SKILL.md` frontmatter contract (name, description, triggers) |
| [`container-labels.md`](container-labels.md) | The OCI + `ai-skills-library.*` label schema for every container we ship |
| [`cross-references.md`](cross-references.md) | What to update when adding a new skill, rule, or family |
| [`verification-gates.md`](verification-gates.md) | Green-check requirements before any commit hits `main` |
| [`color-codes.md`](color-codes.md) | The cyan/green/yellow/red `printf` convention in bash + UI |
| [`aesthetic-language.md`](aesthetic-language.md) | Dark mode + monospace + ascii-flow-diagrams across UIs |
| [`plan-naming.md`](plan-naming.md) | Plan-file naming convention in `~/.claude/plans/` and `docs/master-plans/` |
| [`doctor-script.md`](doctor-script.md) | What every infra skill's doctor script must check |
| [`long-running-commands.md`](long-running-commands.md) | Timeout + monitoring policy for builds, deploys, polls |

These are **enforced by rules** under `rules/library/` and **automated by checks** under `scripts/`. Adding a new artifact type → add a new standard here + a rule that enforces it + a script that lints it.
