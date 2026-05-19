# doctrine-decanter-sorting-agent

**Methodology skill** — full documentation sort: re-number IDs, de-duplicate (canonical top / duplicates bottom with spacing), explode into `docs/` tree, preserve `archive/`.

| File | Purpose |
|------|---------|
| [`SKILL.md`](SKILL.md) | Six-phase agent workflow |
| [`reference.md`](reference.md) | Worked example (`cinematic_fluid_experience`) |

## Invoke

```text
Use doctrine-decanter-sorting-agent on <path-to-messy-folder>
```

Cursor: `@doctrine-decanter-sorting-agent` (also vendored under `~/.cursor/skills/` on dev machines).

## Overlap

| Skill | When to use instead |
|-------|---------------------|
| [`prd-journal-page-splitter`](../prd-journal-page-splitter/) | Split only — no renumber/dedupe pass |
| [`skill-nutrients-decanter`](../skill-nutrients-decanter/) | Extract session *lessons* into library — not folder structure |
| [`automata-reconstructor`](../automata-reconstructor/) | Rebuild belief/intent chains — not PRD file layout |
