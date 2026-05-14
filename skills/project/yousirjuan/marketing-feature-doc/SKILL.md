---
name: marketing-feature-doc
id: SK-0129
keywords: [write-marketing, check-feature, build-doc]
hash: 1aa97d5
relations: []
before: []
governed_by: [global]
meta: dynamic
domain: project/yousirjuan
status: Active
tool: Claude Code
description: >
  Write a docs/marketing/NN-feature-name.md file for a shipped You-Sir Juan OS feature.
  Standard structure: tagline, what it is, why it matters, how it works, who it's for.
---

# Marketing Feature Doc

## When to use

Any time a feature ships — even an MVP of it. The doc becomes the source of truth for website copy, App Store descriptions, pitch decks, and sales conversations.

## Output location

```
docs/marketing/NN-feature-name.md
```

`NN` = next available two-digit sequence number. Check existing files to find it.

## Required structure

```markdown
# Feature Name

**Tagline:** [One sentence. Present tense. Active voice. The emotional hook.]

---

## What it is
[2-3 sentences. Plain language. What this feature is, in terms a non-technical family member understands.]

---

## Why it matters
[The world without this feature. The problem. Why existing alternatives fail. Make it real — reference actual pain, not abstract product language.]

---

## How it works
[Mechanism. Step-by-step if needed. Enough technical credibility to be believed, not so much that it loses non-developers. Bold the key terms.]

---

## Who it's for
[Be specific. Not "anyone" — name the person. "Households with elderly members." "Family office principals." "Technically-capable households." The more specific, the better it converts.]
```

## Voice rules

- Present tense: "The system identifies the member" not "The system will identify the member"
- Active voice: "Face recognition fires" not "The member is recognized by face recognition"
- No jargon without explanation: "RealityKit 4" needs a parenthetical for non-developers
- Short paragraphs: 2-4 sentences max per paragraph
- The word "butler" does not appear anywhere

## Example taglines from existing docs

- `01`: "The AI that belongs to your family — and only your family."
- `03`: "Walk up. Be recognized. Step in. No passwords, ever."
- `06`: "Your Associate never forgets. And only your family can teach it."
- `10`: "Your AI lives on your hardware. Full stop."

Note the pattern: short, declarative, present tense, specific.

## Checklist before publishing

```
[ ] Tagline: one sentence, present tense, active voice
[ ] "What it is": plain language, no unexplained jargon
[ ] "Why it matters": names a real problem, names a real failure of alternatives
[ ] "How it works": enough mechanism to be credible
[ ] "Who it's for": specific person, not "anyone"
[ ] No "butler" anywhere
[ ] Added to docs/marketing/README.md index table
```

## Template

See: `skills/templates/marketing-feature/TEMPLATE.md`
