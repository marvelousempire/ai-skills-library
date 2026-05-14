---
name: skill-writing-voice
id: RL-0044
keywords: [enforce-voice, check-clarity, validate-steps]
goal: Every product is written with CLI clarity — no vague language, no open paths, no hallucination routes.
hash: 4d7e2f1
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Skill writing voice — enforced by SK-0021 (create-skill)

## When this fires

Any product (skill, rule, agent, template) is being written or revised.
Applies alongside `skill-frontmatter` (RL-0039) — that rule enforces the schema structure; this rule enforces the writing voice.

## What it says

Follow the complete authoring standard in **SK-0021** (`create-skill`). That skill defines both the schema structure AND the full writing voice in one place. This rule fires to ensure the voice standard is always in context when a product is being written.

## Enforces (from SK-0021 Step 4)

- Plain English with CLI clarity — clear orders, no vague language
- The eight-answer test — When, Input, Output, Rules, Steps, Checks, Never, Done
- Boolean current-state check table — every instruction is idempotent and testable
- DO / DO NOT voice rules — no "might", "consider", "generally speaking"
- Every error path is defined — never leave a hallucination path open

## Reference

**SK-0021** (`create-skill`) — the complete unified authoring guide. Start there.
