# Session retrospective template

Use this format for every `docs/master-reports/YYYY-MM-DD-<slug>.md` file.

## Required sections (in order)

1. **Header block**
   - Session: <name>
   - Repo of work: <repo>
   - PRs landed: list of #NNN with one-line each
   - Outcome: 1-2 sentences on the actual result
   - Total live changes: enumeration of what's on prod now
   - Safety backup: tag name

2. **Why this report exists** — 1 paragraph explaining the scope of the session and why the lessons are durable

3. **Executive summary — N high-leverage findings** — ranked table:
   - # | What happened | Filed as | (link to artifacts)

4. **Timeline of the session** — chronological narrative:
   - Phase A: ...
   - Phase B: ...

5. **Lessons extracted** — every lesson gets a numbered subsection with `→ Filed as:` rows

6. **Repo cleanup + new structure** — if structural changes were made

7. **Action plan** — every file the same PR ships, in a flat index

8. **Elevations folded in** — the "extras you'd normally get after the task"

9. **Verification before this PR ships** — concrete checks
   - Front-matter validation
   - JSON syntax
   - Cross-ref accuracy

10. **How to use this report** — for the human, for a future agent, for the lesson-extraction pipeline

11. **What's intentionally NOT shipped (and why)** — honest scope reply applied to this report's own PR

12. **Final delivery confirmation** — checkboxes confirming each artifact shipped

## Style guidelines

- Tables over walls of prose
- Concrete file paths with backticks
- Cross-links between sections (`Section 5.1 ↔ rules/library/X`)
- Eastern timestamps with seconds
- "filed as" / "→" arrows pointing at artifacts
- Honest framing of what's in scope vs deferred

## Canonical example

[`docs/master-reports/2026-05-14-trainer-marketplace-session.md`](../master-reports/2026-05-14-trainer-marketplace-session.md)
