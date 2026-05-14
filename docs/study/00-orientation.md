# 00 — Orientation

You're looking at a repository that does double duty: it ships real tools (SEEME, GitLab CE, Homelab Console, Dockyard integration) AND it ships the *method* behind how those tools get built.

## Five mental models

```text
   1. master report system   — every session writes one report
   2. study system           — this curriculum
   3. training system        — drills with green-checks
   4. improvement system     — open gaps, deferred elevations, recurring failures
   5. filing system          — every artifact has a canonical home
```

## The shape

```text
   ai-skills-library/
   ├── skills/         — what we build (the products)
   ├── rules/          — what we enforce (the contracts)
   ├── docs/           — what we know (the method)
   │   ├── standards/        — the contracts in prose
   │   ├── checklists/       — operator-facing one-page lists
   │   ├── templates/        — copy-and-fill starters
   │   ├── workflows/        — end-to-end recipes
   │   ├── study/            — this curriculum
   │   ├── training/         — drills
   │   ├── reports/          — session reports
   │   ├── improvement/      — gaps, elevations, audits, recurring failures + wins
   │   └── master-plans/     — long-horizon plans
   ├── agents/         — operational agents (automation)
   ├── scripts/        — helper shell scripts
   └── context/        — project-marketing context (not a skill folder)
```

## Three rules to follow always

1. **Plan first** for substantive work. ([`02-plan-first.md`](02-plan-first.md))
2. **Cross-reference** when adding anything. ([`03-cross-reference-rippling.md`](03-cross-reference-rippling.md))
3. **Verify green** before commit. ([`04-verification-gates.md`](04-verification-gates.md))

## Next

[`01-skill-anatomy.md`](01-skill-anatomy.md).
