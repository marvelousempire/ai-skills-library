# Standard: aesthetic language (dark + mono + ascii)

Every UI shipped from this repo follows the same design language. Result: SEEME, the CI dashboard, and the Homelab Console feel like one product even though they're three independent tools.

## The palette (CSS)

```css
:root {
  --bg:         #0a0a0a;   /* page background */
  --bg-1:       #141414;   /* card background */
  --bg-2:       #1c1c1c;   /* hover / inner card */
  --bg-3:       #232323;   /* depth-3 / button-hover */
  --border:     #2a2a2a;
  --text:       #e8e8e8;
  --text-dim:   #8a8a8a;
  --text-faint: #5a5a5a;
  --cyan:       #5ec8e5;   /* primary accent / actions */
  --green:      #6fcf97;   /* success / up */
  --yellow:     #f2c14e;   /* warning */
  --red:        #ef6f6c;   /* error / down */
  --blue:       #7baaf7;   /* secondary accent (OrbStack, manual jobs) */
  --purple:     #b58ce5;   /* tertiary accent (scheduled jobs) */
}
```

## Typography

```css
--mono: 'SF Mono', Menlo, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
--sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

- **Monospace** for diagrams, code, status pills, header brand
- **Sans-serif** for UI chrome (body text, button labels)
- Cyan brand prefix uses `▣ ` glyph
- Status dots use `●` (filled) and `○` (hollow)

## Layout primitives

- **Status pills** — `● up` / `○ down` with background + border
- **Service cards** — small grid, each card has name + status pill + detail line + action links
- **Tables** — monospace data, dim secondary text
- **Footer** — engine badge + cheat-sheet of `make` commands

## Diagrams (always ASCII)

Every UI's documentation + on-screen diagrams use the [`ascii-flow-diagrams`](../../skills/visual/diagrams/ascii-flow-diagrams/SKILL.md) style — Unicode box-and-arrow inside fenced `text` blocks. Renders cleanly in browsers, terminals, markdown previewers, IDEs, and copy-paste anywhere.

## Real examples

| UI | File | Pattern |
|---|---|---|
| SEEME web UI | [`skills/visual/diagrams/seeme/src/ui.html`](../../skills/visual/diagrams/seeme/src/ui.html) | Single-page, split pane, streaming preview |
| CI dashboard | [`skills/infra/self-hosted-git/dashboard/index.html`](../../skills/infra/self-hosted-git/dashboard/index.html) | Cross-project pipeline overview |
| Homelab Console | [`skills/infra/console/index.html`](../../skills/infra/console/index.html) | Service grid + footer engine badge |

## Starter template

[`docs/templates/single-page-ui.html.template`](../templates/single-page-ui.html.template) is the canonical starter for any new UI in this repo. Use it.

## Anti-patterns

- Light mode by default — boxes pop on dark
- Mixing serif + sans within UI chrome
- Color outside the palette
- Different status-pill shapes per UI
- Custom diagram syntax (mermaid, graphviz) for in-repo docs — always use ascii-flow-diagrams
