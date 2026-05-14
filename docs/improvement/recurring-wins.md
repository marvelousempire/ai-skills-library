# Recurring wins — what keeps working

Patterns from this session that proved their value. Build more like this.

## 1. Plan-first for substantive work

Every multi-file change started with `~/.claude/plans/<title>.md`. Result: every commit landed cleanly, with verifiable scope, with a recovery plan.

**Codified in:** [`docs/standards/plan-naming.md`](../standards/plan-naming.md), `rules/library/plan-first-for-substantive/`, [`skills/methodology/plan-first/`](../../skills/methodology/plan-first/).

## 2. After-ship gap audit + elevation pass

Every meaningful ship → audit. 5 audits in one session. Each one surfaced ~3–8 gaps + 4–8 elevations. The user could pick exactly what to build next without re-deriving.

**Codified in:** [`docs/checklists/after-ship-audit.md`](../checklists/after-ship-audit.md), [`docs/workflows/audit-and-elevate.md`](../workflows/audit-and-elevate.md), [`skills/methodology/gap-audit-and-elevation/`](../../skills/methodology/gap-audit-and-elevation/), `docs/improvement/audits/`.

## 3. Skill scaffolding pattern (`SKILL.md` + `README` + `templates/` + `references/`)

Every new skill followed the same shape. Result: any skill is legible to any agent in 30 seconds.

**Codified in:** [`docs/standards/skill-anatomy.md`](../standards/skill-anatomy.md), [`docs/templates/SKILL.md.template`](../templates/SKILL.md.template), [`docs/checklists/new-skill.md`](../checklists/new-skill.md).

## 4. Label schema as contract

`ai-skills-library.*` labels on every container. Result: Dockyard renders the entire library stack with names + roles + URLs out of the box.

**Codified in:** [`docs/standards/container-labels.md`](../standards/container-labels.md), [`skills/infra/dockyard/templates/labels-reference.md`](../../skills/infra/dockyard/templates/labels-reference.md), `rules/library/ai-skills-library-labels/`.

## 5. Idempotent `make ui` one-command UX

`make ui` boots whatever is down + opens the browser. Same command every time. Forever.

**Codified in:** [`docs/templates/Makefile.template`](../templates/Makefile.template), [`skills/methodology/idempotent-commands/`](../../skills/methodology/idempotent-commands/), real example in [`skills/infra/console/Makefile`](../../skills/infra/console/Makefile).

## 6. Multi-surface engine design

SEEME ships as CLI + MCP + Web UI + Docker + Refine + Chain — six surfaces, one engine. Every entry point lands on the same `generate()` function.

**Codified in:** [`docs/workflows/multi-surface-build.md`](../workflows/multi-surface-build.md), [`skills/methodology/multi-surface-design/`](../../skills/methodology/multi-surface-design/), real example in [`skills/visual/diagrams/seeme/`](../../skills/visual/diagrams/seeme/).

## 7. Aesthetic consistency

Same dark mode + monospace + ascii box-drawings across SEEME, CI dashboard, Homelab Console. Feels like one product.

**Codified in:** [`docs/standards/aesthetic-language.md`](../standards/aesthetic-language.md), [`docs/templates/single-page-ui.html.template`](../templates/single-page-ui.html.template).

## 8. Doctor scripts

`make doctor` in the Homelab Console reads disk + Docker + engine + every service in one screen. Red is red, green is green, fixes are inline.

**Codified in:** [`docs/standards/doctor-script.md`](../standards/doctor-script.md), [`docs/templates/doctor.sh.template`](../templates/doctor.sh.template), [`docs/checklists/doctor.md`](../checklists/doctor.md).

## 9. Graceful degradation

When a service is down, the console shows a red pill, not a crash. When a build fails, `make start` reports the failure and keeps going for the other services. When `.env` is missing, the make target skips with a warning, not an error.

**Codified in:** [`skills/methodology/graceful-degradation/`](../../skills/methodology/graceful-degradation/).

## 10. Cross-reference discipline

Every new skill triggered updates to SKILL-INDEX, root README, family README, yousirjuan docs, integration checklists. Drift caught early.

**Codified in:** [`docs/standards/cross-references.md`](../standards/cross-references.md), [`docs/checklists/cross-reference.md`](../checklists/cross-reference.md), `rules/library/cross-reference-on-skill-add/`.

## 11. Recovery tags before substantive change

Every major delivery → `pre-<name>-<date>` tag. Reversible with one `git reset --hard`.

**Codified in:** [`docs/checklists/ship.md`](../checklists/ship.md) (Pre-push section).

## 12. Color-coded terminal output

Cyan = action. Green = success. Yellow = warning. Red = error. Same convention across every script + Makefile.

**Codified in:** [`docs/standards/color-codes.md`](../standards/color-codes.md).

## Pattern

When something works repeatedly, codify it: standard + template + checklist + skill + rule. The repo accumulates more knowledge than any single agent can hold.
