# 05 — Aesthetic language

Same dark mode + monospace + ascii box-drawings across every UI. Result: SEEME, CI dashboard, Homelab Console feel like one product.

## The palette + typography

Full reference: [`docs/standards/aesthetic-language.md`](../standards/aesthetic-language.md). Quick list:

- Dark background (`#0a0a0a`), card on `#141414`
- Monospace for diagrams, status pills, brand
- Cyan accent (`#5ec8e5`) for actions
- Green (`#6fcf97`) for success, yellow for warnings, red for errors
- Ascii box-and-arrow diagrams everywhere (via [`ascii-flow-diagrams`](../../skills/visual/diagrams/ascii-flow-diagrams/SKILL.md))

## Why

When you ship 5 surfaces in one library, design discipline is the difference between "5 products" and "one product." The user shouldn't have to relearn UI per surface.

## Reuse

Use [`docs/templates/single-page-ui.html.template`](../templates/single-page-ui.html.template) as the starter for any new UI. The CSS variables are pre-set.

## Real examples

- SEEME web UI: [`skills/visual/diagrams/seeme/src/ui.html`](../../skills/visual/diagrams/seeme/src/ui.html)
- CI dashboard: [`skills/infra/self-hosted-git/dashboard/index.html`](../../skills/infra/self-hosted-git/dashboard/index.html)
- Homelab Console: [`skills/infra/console/index.html`](../../skills/infra/console/index.html)

## Exercise

Open all three HTML files in browsers side by side. Note how identical the visual primitives (status pills, service cards, footer) are despite the three serving different content.

## Next

[`06-multi-surface-design.md`](06-multi-surface-design.md).
