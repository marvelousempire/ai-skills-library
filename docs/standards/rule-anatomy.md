# Standard: rule anatomy

Every rule lives at `rules/library/<slug>/` and contains:

| File | Purpose |
|---|---|
| `body.md` | The rule itself. Plain markdown. What the rule says + when it fires + examples + anti-patterns. |
| `meta.json` | Machine-readable metadata for the rule pipeline. |

## `meta.json` schema

```json
{
  "id": "<slug>",
  "alwaysApply": true,
  "globs": ["**/*"],
  "category": "global-communication | repo-discipline | …"
}
```

| Field | Purpose |
|---|---|
| `id` | Matches the folder name |
| `alwaysApply` | `true` for global rules; `false` for context-triggered |
| `globs` | File patterns the rule applies to |
| `category` | Groups rules in `rules/RULES-CATALOG.md` |

## `body.md` structure

```markdown
# <Rule title>

## When this fires
<one paragraph>

## What it says
<the rule itself, in plain language>

## Examples
- ✓ Compliant: <…>
- ✗ Violation: <…>

## Why
<the rationale — incident history, design goal>

## Related
- Skills: <links>
- Standards: <links>
- Checklists: <links>
```

## Examples in this repo

- [`rules/library/ascii-flow-diagrams/`](../../rules/library/ascii-flow-diagrams/) — alwaysApply visualization rule
- [`rules/library/skill-frontmatter/`](../../rules/library/skill-frontmatter/) — frontmatter contract (new in this commit)
- [`rules/library/cross-reference-on-skill-add/`](../../rules/library/cross-reference-on-skill-add/) — cross-ref discipline (new in this commit)

## Cross-references when adding a rule

See [`cross-references.md`](cross-references.md). Specifically:

- Add `body.md` + `meta.json`
- Update `rules/RULES-CATALOG.md`
- If pipeline-relevant, update `docs/rules-pipeline.md`
