---
name: session-retrospective
id: SK-0042
keywords: [extract-lessons, file-skill, update-library]
hash: 6f5034e
relations: []
before: []
governed_by: [global]
meta: dynamic
description: "Run a structured retrospective on a completed work session to extract rules, skills, docs, context files, and workflow improvements that should be filed into the AI skills library. Use when the user asks to 'read backward through the conversation,' 'what did we learn,' 'file everything we learned,' 'what can we extract from this session,' 'grow the skills library from this,' 'add to the library from our work,' or 'what rules or skills did this session produce.' Use proactively at the end of any session that hit a meaningful bug, made a non-obvious architectural decision, introduced new vocabulary or copy standards, or had to navigate a multi-step debugging arc. This is the meta-skill that keeps the library growing — every session that doesn't produce at least one library artifact is a session whose lessons evaporate."
metadata:
  version: 1.0.0
---

# Session Retrospective

You are extracting permanent, reusable knowledge from a work session and
filing it into the AI skills library. The goal is to make the next session
faster, cheaper, and smarter than this one — and to do it systematically,
not by memory.

---

## Before you start

**Check for product marketing context:**
If `.agents/product-marketing-context.md` exists, read it for brand and
product context relevant to any copy or marketing findings.

**Read the library first:**
Scan `vendor/ai-skills-library/rules/library/` and `vendor/ai-skills-library/skills/`
to know what already exists. Don't file duplicates.

---

## Step 1 — Full backward read

Read every message in the session from the most recent backward to the first.
For each user message and each substantive AI action, ask:

- **What problem was being solved?**
- **What was tried first? Did it work?**
- **What was the real cause / real answer?**
- **What decision was made, and why?**
- **What would have saved time if known upfront?**

---

## Step 2 — Classify every finding

Use this taxonomy:

### Rules (behavior enforcement — fire automatically)
Patterns that, if violated, always cause bugs, rework, or wasted time.
Examples: "don't use CSS transform classes on framer-motion elements",
"check live version before debugging", "redirect signed-in users at page level."

**File if:** the pattern is repeatable across sessions and its absence would
reliably cause a problem.

### Skills (actionable procedures — invoked by name)
Step-by-step workflows a human or agent can execute. Examples: debugging a
CSS positioning bug, auditing copy for binding language, running a session
retrospective.

**File if:** the procedure is structured enough to follow as a checklist and
would save meaningful time by being written down.

### Docs (reference knowledge — read for understanding)
Technical explanations, architecture notes, vocabulary tables, historical
incident records. Examples: how framer-motion composites transforms, why
CSS inline styles override classes, cost tables for different failure modes.

**File if:** the information is non-obvious and not easily found by searching,
and future sessions will need it to reason correctly.

### Context files (product-specific permanent decisions)
Word-choice standards, approved vocabulary, brand voice rulings, architectural
decisions that must persist. Examples: "accommodate" not "integrate" for
READYPLAY, which pages redirect signed-in users, which surface owns what.

**File if:** a decision was made that future sessions need to know about
to avoid undoing it or contradicting it.

### Updates to existing artifacts
Sometimes the right action is to extend an existing rule, skill, or doc
rather than create a new one. Examples: adding a "confirm version after deploy"
step to `go-live-path`, adding a new vocabulary entry to the copy standards.

**File if:** the existing artifact is 80% right but missing something this
session revealed.

---

## Step 3 — Write the artifacts

For each finding, create the appropriate artifact:

**Rules:** `rules/library/<id>/meta.json` + `body.md`
```json
// meta.json
{
  "id": "kebab-case-id",
  "description": "One sentence: what this prevents and when it fires.",
  "alwaysApply": true,  // or false if scoped to specific file patterns
  "globs": []           // file patterns if alwaysApply is false
}
```
Body format:
- H2: The Rule (the mandate, 2-3 sentences)
- H2: The Wrong Pattern (concrete code or copy example)
- H2: The Right Pattern (concrete fix)
- H2: Detection (how to find violations)
- H2: Why This Matters (cost of ignoring)
- H2: Related Rules (links to adjacent rules)

**Skills:** `skills/<category>/<id>/SKILL.md`
```yaml
---
name: skill-id
description: "When the user asks for X, Y, or Z. Also use when... Trigger phrases..."
metadata:
  version: 1.0.0
---
```
Body format:
- H2: Before You Start (prerequisites, context to gather)
- H2: Framework/Process (numbered steps)
- H2: Best Practices (do/don't tables)
- H2: Output Format (what the user receives)
- H2: Related Skills

**Docs:** `docs/<descriptive-name>.md`
Free-form reference material. Include:
- The key concept / mechanism
- Why it matters
- How to use the knowledge
- Historical incident (if applicable) — name the date, PR number, time cost
- Links to related rules/skills

**Context files:** `context/<product>-<topic>.md`
Decisions and standards. Include:
- The principle / rule
- A table of approved vs avoided language/patterns
- What is NOT subject to this rule (scope boundaries)
- Change log (date, what changed, PR)

---

## Step 4 — Update the pack

After writing new rules, add them to the appropriate pack in
`rules/packs/`. For `red-e-play-app`, that's `rules/packs/red-e-play-core.json`.

---

## Step 5 — Update indexes

- Add new skills to `SKILL-INDEX.md` (one row in the table)
- Add to `skills/marketing/SKILL-CATALOG.md` (or relevant category catalog)

---

## Step 6 — Sync into the repo

```bash
# From inside vendor/ai-skills-library:
git add -A
git commit -m "feat: <what was extracted from what session>"
git push origin main

# From the main repo root:
git add vendor/ai-skills-library
bash vendor/ai-skills-library/scripts/sync-rules-into-repo.sh .
git add .claude/rules/ .cursor/rules/
git commit -m "chore(skills): bump submodule + sync rules"
git push origin HEAD
gh pr create ... && gh pr merge ... --squash
```

---

## Minimum bar for any session

Every session that involved a meaningful bug, architectural decision, or
new copy/vocabulary standard should produce **at least one artifact**. The
artifact doesn't have to be perfect — a 20-line rule body that captures the
core lesson is worth more than no artifact at all.

Sessions that produce zero artifacts are sessions whose lessons live only
in the chat transcript, which is forgotten or inaccessible to the next agent
that encounters the same problem.

---

## Priority order for filing

When time is limited, file in this order:

1. **Bugs that took > 1 deploy cycle to fix** → Rule (prevents recurrence)
2. **Architectural decisions that must not be undone** → Rule or Context file
3. **Copy/vocabulary decisions** → Context file
4. **Debugging procedures that saved significant time** → Skill or Doc
5. **Reference knowledge that accelerated understanding** → Doc
6. **Workflow improvements** → Update existing rule or new skill

---

## Related skills

- **create-rule**: Cursor skill for authoring a single rule in isolation
- **create-skill**: Cursor skill for authoring a single skill in isolation
- **verify-ship**: Confirms what is deployed; useful for the "live version before debug" pattern
- **copy-language-audit**: Marketing copy audit extracted from a real session retrospective
