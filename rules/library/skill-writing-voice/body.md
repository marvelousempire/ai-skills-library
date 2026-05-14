---
name: skill-writing-voice
id: RL-0044
keywords: [writing, voice, clarity]
---

# Skill writing voice — plain English, CLI clarity, no loose meaning

## When this fires

Any product (skill, rule, agent, template) is being written or revised.
Applies alongside `skill-frontmatter` (RL-0039) — that rule enforces the schema; this rule enforces the voice.

## What it says

Write every skill like a **plain-language command file** — clear orders in plain English that a sharp 12-year-old can understand, but advanced enough that an AI or LLM can execute it reliably. The thinking stays advanced. The language gets clear.

## The voice requirements

**DO:**
- Write in complete, direct sentences that give a clear order
- Use plain words over technical jargon when both are accurate
- Make every step actionable — a reader should know exactly what to do
- Define exactly: when to use it, what input it needs, what output it produces, what rules it follows, what steps to perform, what checks to run, what it must never do, how it confirms work is complete
- Use Boolean logic for decisions — yes/no, pass/fail, present/absent

**DO NOT:**
- Use vague language ("improve this", "make it better", "consider doing X")
- Leave open paths — every instruction must close with a definite outcome
- Use filler phrases ("it's worth noting", "you might want to", "generally speaking")
- Write steps that could be interpreted more than one way
- Leave hallucination paths — if input is missing, the skill must say what to do, not guess

## The Boolean current-state check

For every instruction, rule, or step in a skill — define the gap:

| What it is | What it should be | What it does | What it should do | Boolean decision | Fix |
|---|---|---|---|---|---|
| Vague step | Clear command | Produces variable output | Produces the same output every time | Is this idempotent? Y/N | Rewrite as a direct order |

Use this table format when auditing a skill's instructions for clarity.

## The eight-answer test

Before shipping a skill, every skill must implicitly answer all eight:

1. **When** — when exactly does this apply?
2. **Input** — what does it need to run?
3. **Output** — what does it produce? In what format?
4. **Rules** — what constraints must be respected?
5. **Steps** — what exactly happens, in what order?
6. **Checks** — how does it verify the work is correct?
7. **Never** — what must it never do, even if asked?
8. **Done** — how does it confirm completion?

If any of the eight is missing or vague, the skill is not ready.

## What this sounds like

**Too vague:**
> You might want to check the frontmatter before proceeding with the skill.

**Voice-compliant:**
> Check that all four frontmatter fields are present. If any are missing, stop and run `stamp-product-ids.py`. Do not proceed until `validate-skill-frontmatter.py` returns OK.

**Too vague:**
> Make the description clear and include some trigger phrases.

**Voice-compliant:**
> Write the `description` field as one paragraph. Embed 4–6 exact trigger phrases — the specific words a user would type. Each phrase must be in quotes. Do not use a bulleted list.

## Anti-patterns

- ❌ "Consider using X" — not a command, not actionable
- ❌ "This might help when..." — "might" has no place in a product that must execute reliably
- ❌ Steps that say "and so on" or "etc." — every item must be named explicitly
- ❌ Describing what a skill is without saying what to do — skills are commands, not essays
- ❌ Leaving error paths undefined — if an input is wrong, say exactly what happens next

## Related

- **RL-0039** (`skill-frontmatter`) — enforces the schema structure; this rule enforces the voice
- **SK-0021** (`create-skill`) — the step-by-step authoring guide; use this rule to check the quality of each step written
