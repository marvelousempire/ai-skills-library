# Understandings Library

**Capture the explanation before it disappears.**

When a conversation produces a clear mental model, decision, visual map, or plain-language breakthrough, this skill files it beside the README it clarifies.

## What It Does

The Understandings Library creates README-local `understandings/` folders with numbered explanation entries.

It is for durable comprehension:

- future AIs
- new collaborators
- non-technical readers
- returning maintainers
- anyone reading the README who needs the "why" behind the spec

## Quick Start

When the user says "put that understanding in a markdown file," choose the README that owns the idea.

```text
If it explains the whole app:
  understandings/

If it explains Make-Sense:
  docs/make-sense-protocol/understandings/

If it explains SceneScout:
  agents/sceneskout-employee/understandings/
```

Then create:

```text
understandings/
  README.md
  0001-short-title.md
```

## Entry Shape

Every understanding should be easy to read fast:

1. Plain-language explanation.
2. Visual map.
3. Concrete example.
4. Canonical links.

## Example

```text
README.md
understandings/
  README.md
  0001-bash-sense-make-sense-sidecar.md
```

The entry explains that Bash Sense is not replacing Make-Sense. It is a sidecar proof process that runs in parallel while Make-Sense continues its normal reasoning and routing.

## Why This Exists

Specs tell people what is canonical. Understandings tell people how to think about the spec.

Both matter.

## Status

Ready for use as a methodology skill.
