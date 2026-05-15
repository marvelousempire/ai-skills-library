# Chain of Command — the four-seat operational standard

Every substantive change passes through four chairs before it becomes the project's official truth. The chairs are agentic seats with explicit responsibilities, authority, and tooling — each captured in `agents/chain-*.md`. The Orchestrator (`agents/nephew.md`) commissions chairs based on the change's blast radius.

## The four chairs

| Chair | Crown (authority) | Hands work to | Returns work to |
|---|---|---|---|
| **Employee** ([`agents/chain-employee.md`](../../agents/chain-employee.md)) | *Propose completion* | Assistant Manager | — (does the work; never approves) |
| **Assistant Manager** ([`agents/chain-assistant-manager.md`](../../agents/chain-assistant-manager.md)) | *Return for rework* | Manager | Employee |
| **Manager** ([`agents/chain-manager.md`](../../agents/chain-manager.md)) | *Ship-ready authority* | Director | Employee OR Asst Mgr |
| **Director** ([`agents/chain-director.md`](../../agents/chain-director.md)) | *Authoritative sign-off + standards admission* | (no one — final) | Manager (or further down for rare cases) |

## The signature rule

**No task is complete without:** proof → review → correction → re-validation → approval.

If any of those five steps is skipped, the work is "committed," not "shipped." The recurring-failure pattern that motivated this chain is captured in [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md) §"Code shipped ≠ feature shipped."

## When to commission which chair (blast radius → chairs)

| Change blast radius | Chairs commissioned |
|---|---|
| Typo, README fix, single-line doc edit | **Employee only** — author commits without review (still records proof) |
| Single-file bug fix, non-shared scope | **Employee → Asst Mgr** — quick review, no operational gate |
| Multi-file feature, new component, schema change | **Employee → Asst Mgr → Manager** — full audit, lead sheet, ship via `ship-flow-runner` |
| New standard, new top-level dir, deploy pipeline change, cross-installation change | **Employee → Asst Mgr → Manager → Director** — decision record required, `STRUCTURE.md` updates only by Director |
| Policy / pricing / external commitment change | **Manager escalates directly to Director** — even with a green audit |

## The "crown" and the "jewels" framing

Each chair has a **crown** — one specific authority it owns and the chair below it does not. The crown is the verb in the chair's job description.

- Employee: *propose*
- Asst Mgr: *return*
- Manager: *ship*
- Director: *admit / authorize*

Each chair's **jewels** are the existing library artifacts (skills, rules, agents, checklists, templates) it draws on. The jewels are listed inside each chair's agent spec — `chain-<role>.md` has a table.

## How the AI Orchestrator (`nephew`) commissions chairs

`nephew` is the dispatcher. It reads the task and the blast-radius table above, then opens a session with the chair(s) needed. Each chair's `description` frontmatter is the dispatch signal — `nephew` matches the task's intent to the chair's crown.

```
nephew sees: "Add a Makefile to brokerage-prototype"
            ↓
blast radius: multi-file feature (Makefile + README + STACK.md row + Claude Preview config)
            ↓
chairs needed: Employee → Asst Mgr → Manager
            ↓
nephew commissions chain-employee with the task brief
            ↓
chain-employee produces work record + acceptance proof
            ↓
chain-assistant-manager reviews + produces gap+elevation lists
            ↓
chain-manager runs failure-proof-audit + lead sheet
            ↓
nephew presents the dossier to the human Director for final approval
```

## Origin

Codified 2026-05-14 in the brokerage-make-shim-docker-colima session. The need surfaced because four features in that session shipped with bugs only caught when run live — proof that "code shipped ≠ feature shipped" is the project's most common failure mode. The chain of command exists to make that failure mode harder.

## Related

- Skill: [`skills/methodology/failure-proof-audit/SKILL.md`](../../skills/methodology/failure-proof-audit/SKILL.md) §"chain-of-command review structure"
- Skill: [`skills/methodology/gap-audit-and-elevation/SKILL.md`](../../skills/methodology/gap-audit-and-elevation/SKILL.md)
- Skill: [`skills/methodology/decision-records/SKILL.md`](../../skills/methodology/decision-records/SKILL.md)
- Checklist: [`checklists/post-ship-live-verification.md`](../../checklists/post-ship-live-verification.md)
- Recurring failure log: [`docs/improvement/recurring-failures.md`](../improvement/recurring-failures.md)
- Orchestrator agent: [`agents/nephew.md`](../../agents/nephew.md)
