---
name: understandings-library
description: Create README-local understandings folders with numbered explanation entries. Use when the user asks to capture an understanding, save an explanation, create an understandings folder, preserve a chat explanation, or make README-local knowledge easy for future AIs and humans to read.
---

# Understandings Library

Use this skill to capture important app understanding outside chat in a numbered `understandings/` folder beside the README it clarifies.

## When To Use

Use when the user says things like:

- "put that understanding in a markdown file"
- "create an understandings folder"
- "save this so the next AI understands"
- "this explanation should live beside the README"
- "make this a reusable understanding"

## Core Rule

Understandings are README-local.

If the understanding explains:

- the whole app, put it in `understandings/` beside the root `README.md`
- a protocol folder, put it in that folder's `understandings/`
- an agent folder, put it in that agent folder's `understandings/`
- a feature folder, put it in that feature folder's `understandings/`

Do not put every understanding in one global folder unless the understanding is truly global.

## Output Shape

```text
<folder-with-README>/
  README.md
  understandings/
    README.md
    0001-short-title.md
    0002-next-title.md
```

## Entry Rules

1. Use four-digit numbering.
2. Preserve exact wording when the user asks for exact wording.
3. Keep one understanding per file.
4. Start with plain language.
5. Add a visual map when it improves comprehension.
6. Add examples next to abstract concepts.
7. Link to canonical docs instead of duplicating runtime contracts.
8. Update the local `understandings/README.md` index.
9. Update the parent `README.md` with a short `Understandings` pointer if missing.

## Entry Template

```markdown
# <Understanding Title>

**Status:** canonical | draft  
**Source:** <conversation, plan, file, or date>  
**Applies to:** <folder/protocol/agent/feature>

<plain-language explanation>

## Visual Map

```text
<simple diagram>
```

## Example

<concrete example>

## Canonical Links

- [`../README.md`](../README.md)
```

## DRY Note

Understandings explain why and how to apply a concept. Canonical specs remain in their source docs. Link to specs rather than copying them wholesale.
