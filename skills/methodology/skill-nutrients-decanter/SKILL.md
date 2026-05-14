---
name: skill-nutrients-decanter
description: >-
  A "Skill Nutrient" is a learning moment that is critically vital and net
  positive — a plus, not a minus or zero. The Decanter is the process that
  scrapes, filters, and compounds only those nutrients from any conversation,
  session, or project arc into permanent repo improvements. Not everything
  extracted from a session is a nutrient — only what genuinely adds strength,
  clarity, reusability, or safety. This skill defines both the concept (what
  counts as a nutrient) and the decanting process (how to extract, filter, and
  file them). Triggers on "skill nutrients", "decant the lessons", "what are
  the nutrients from this session", "only keep what's a plus", "compound
  the learning", "filter what's worth filing", "nutrient extraction",
  "what genuinely adds value here", "Skill Nutrients Decanter".
---

# Skill Nutrients Decanter — extract only what's a plus, compound it, file it

A "Skill Nutrient" is the user's coined term for a learning moment that is:
- **Critically vital** to the life of an idea or system
- **Net positive** — a plus, not a minus or zero
- **Worth compounding** — filing it makes the next session better

The Decanter is the tool that separates nutrients from noise. Not every lesson from a session is a nutrient. Bad patterns, failures without generalizable fixes, project-specific details — those get noted but don't get filed globally. Only what's genuinely a plus gets extracted and compounded.

## The "is this a nutrient?" test

Before filing anything from a session, apply this filter:

| Question | Plus (nutrient) | Minus (noise) | Zero (irrelevant) |
|---|---|---|---|
| Does it make the next session better? | ✅ File it | ❌ Note but don't file | — Skip |
| Does it apply beyond this project? | ✅ File globally | ❌ File in project docs | — Skip |
| Can it prevent a class of future mistakes? | ✅ File as rule/checklist | ❌ Narrow one-off | — Skip |
| Does it compound? (filing it now saves N hours later) | ✅ High priority | — Lower priority | — Skip |
| Is it net positive or just interesting? | ✅ Nutrient | ❌ Observation | — Skip |

A genuine nutrient passes at least three of these. Something that's only interesting isn't a nutrient — it's noise wearing good clothes.

## The decanting process (six steps)

### Step 1 — SCRAPE
Read the full session backward. Collect every candidate: every fix, every friction point, every repeated step, every "I'll remember this next time," every thing that worked, every thing that failed.

Don't filter yet. Just collect.

### Step 2 — FILTER
Apply the nutrient test to each candidate. Separate:
- **Nutrients** (clear plus) → go through the decanter
- **Observations** (interesting but zero) → note in the session report, don't file globally
- **Anti-patterns** (minus) → file only if there's a corresponding fix; bare anti-patterns without a solution are noise

### Step 3 — CLASSIFY
For every confirmed nutrient, pick the right vessel:

| Type of nutrient | Where it goes |
|---|---|
| Reusable process with trigger phrases | `skills/<category>/<name>/SKILL.md` |
| Always-on behavior | `rules/library/<name>/` |
| Product positioning reference | `context/<product>-context.md` |
| Step-by-step verification | `docs/checklists/<name>.md` |
| Starter file for repeated structures | `templates/<category>/<name>/` |
| Process guide / lesson learned | `docs/<name>.md` |

### Step 4 — DECANT
Write the filing. For skills, use the eight-section template from `templates/engineering/skill-md/SKILL.template.md`. For docs, use the plain format.

Every filing must include:
- The **origin moment** — what specific event proved this was a nutrient
- **Concrete code or steps** — no vague principles
- The **anti-pattern** — what the wrong version looks like so it's avoidable

### Step 5 — COMPOUND
File it. Run `python3 scripts/validate-skill-frontmatter.py`. Run `./scripts/finalize-skills-index.sh`. Commit. The nutrient is now part of the permanent compound — the next session inherits it automatically.

### Step 6 — CONFIRM
Every filed nutrient goes in the session's master report under "What was extracted." The report lives at `docs/<session-date>-report.md`. This closes the loop: what went in, what came out, what's better now.

---

## The 18 best practice domains (what nutrients can come from)

Every session has nutrients hiding in these areas. Use this as a checklist when scraping:

1. **Code** — modularity, DRY, clear naming, rollback safety, config over hardcode
2. **Design** — clarity first, consistent spacing/color/type, obvious primary actions
3. **Writing** — plain language, strong titles, clear next actions, no vague wording
4. **Repo** — every file has a clear home, no loose files, naming standards, README where needed
5. **Git safety** — branch first, diff before commit, clear messages, rollback possible
6. **Audit** — verified facts, findings separate from opinion, risks visible, fixes traceable
7. **Investigation** — reproduce → inspect → isolate → fix → validate (never patch blindly)
8. **Problem-solving** — root causes not symptoms, fix repeat causes, build reusable solutions
9. **Automation** — automate repeated work, config-driven, dry-run modes, errors visible
10. **AI skills** — one skill one responsibility, clear trigger, defined output, validation included
11. **Documentation** — purpose + location + examples + validation + recovery in every doc
12. **Workflow** — intake → goals → inputs → stages → validate each → file outputs → lessons
13. **Decisions** — record why, record rejected options, make decisions reviewable later
14. **Quality** — check missing parts, duplication, unclear language, broken paths before shipping
15. **Filing** — by purpose, drafts separate from finals, clear folder names, easy to locate
16. **Learning** — capture what worked AND what failed, convert to rules/templates/automation
17. **Safety** — never destroy working systems, never skip backups, always maintain recovery paths
18. **Elevation** — don't only complete the task; also find missing systems, hidden risks, reusable upgrades

---

## What makes a nutrient vs what makes noise

| Nutrient | Noise |
|---|---|
| "The v0.21.0 rebrand broke bin/xcc for 65 days because `make check` only validated syntax — add consumer-string assertions" | "We should test more" |
| "EventSource is GET-only; for POST+SSE use fetch + ReadableStream (80-line pattern)" | "Streaming is tricky" |
| "Write the cost annotation BEFORE setting the safety tier — the annotation catches misclassification bugs" | "Always annotate your code" |
| The specific bug that taught the lesson, named precisely | Generic advice that could apply to anything |
| Something that, filed today, saves 2 hours next month | Something that feels like a lesson but has no specific application |

---

## The compound effect

A single session produces ~5–15 nutrients. Each nutrient filed makes every future session slightly better. Over 10 sessions that's 50–150 permanent improvements to the system. The compound matters because the early nutrients (proper repo structure, plan-first, make check) unlock the later nutrients (AI agent skills, AppleScript library, proposal inbox) — each one builds on the last.

The Decanter is how the compound grows.

---

## Repo safety requirements (pre-decanting checklist)

Before any session's nutrients are filed into a repo:

- [ ] Check repo status (`git status`) — no unknown uncommitted changes
- [ ] Create a working branch — never file directly to main
- [ ] Validate before commit (`python3 scripts/validate-skill-frontmatter.py`)
- [ ] Review the diff before pushing (`git diff --stat HEAD`)
- [ ] Confirm rollback is possible (the branch can be deleted if something went wrong)
- [ ] After merging: confirm with `confirm-ship-clearly` — tag, PR state, commit, version

---

## Anti-patterns

- ❌ Filing everything without the nutrient filter — the library becomes noise
- ❌ Filing "interesting" observations that aren't net positive — they dilute the compound
- ❌ Vague nutrients without origin stories — "test more" is not a nutrient
- ❌ Skipping the compound step — collecting lessons but never filing them breaks the loop
- ❌ Filing the minus (the failure) without the plus (the fix) — anti-patterns without solutions are noise
- ❌ Treating every session identically — a 30-minute bug fix has 1-2 nutrients; a 200-message arc has 15-20

---

## Invocation

- "Use **skill-nutrients-decanter**."
- "Decant the nutrients from this session."
- "What are the skill nutrients here?"
- "Run the decanter on this conversation."
- "Filter what's genuinely worth filing."

## Relationship to other skills

- `conversation-retrospective-extraction` — the broader extraction process (extracts everything, classifies it). The Decanter is the quality filter WITHIN that process — it's how you decide what from the extraction is a nutrient worth filing.
- `post-ship-elevation-pass` — the elevation pass surfaces CANDIDATES for nutrients after each ship. The Decanter is how you decide which candidates are genuine nutrients.
- `what-makes-a-good-skill` — the four-gate filter for skills is one implementation of the nutrient test for the specific case of skill-filing.

## Reference implementation

The DustPan v0.21–v0.27 arc is the canonical example of the Decanter running at scale. 200+ messages → ~20 genuine nutrients extracted → 22 skills filed → every future session in the AVERY GOODMAN portfolio inherits those nutrients automatically. The nutrients are in `docs/dustpan-arc-master-report.md`.

The concept originated from the user's recognition that not all extracted lessons are worth filing — only what's a "plus, not a minus or a zero" earns its place in the compound.
