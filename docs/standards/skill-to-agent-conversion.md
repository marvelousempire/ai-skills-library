# Skill-to-Agent Conversion Standard

This standard decides when a simple skill becomes a Nephew-quality agent, and
what has to exist before that agent is allowed into the AI Skills Library.

## Decision Test

Keep the product as a **skill** when it is an invocable procedure: a human or
agent calls it, follows the steps, and produces an artifact.

Keep the product as a **rule** when it is an always-on policy: it fires because a
condition is true, not because someone asked for it.

Promote the product to a **library-native agent** when it needs an autonomous
owner with a trigger, structured inputs, structured outputs, safety guarantees,
stop conditions, and repeatable verification. The agent must be commissioned by
Nephew; it does not commission itself.

Register the product as a **pointer agent** when the runtime engine lives in a
separate upstream repo. In that case, follow
[`rules/library/add-agent-to-skills-library/body.md`](../../rules/library/add-agent-to-skills-library/body.md)
and never copy upstream source code into this library.

## Nephew-Quality Bar

A promoted agent must have:

- **Mission** — what it owns and what it does not own.
- **Commissioned by** — Nephew dispatch path and layer.
- **Trigger** — exact phrases, hooks, or commands that call it.
- **Inputs expected** — a concrete schema, even if early versions are markdown.
- **Output artifacts** — files, reports, diffs, PR text, or machine payloads.
- **Safety guarantees** — idempotency, fail-closed conditions, and data limits.
- **Stop conditions** — when the agent refuses or escalates.
- **Verification** — commands or checks proving the agent did its job.
- **Related products** — skills, rules, templates, docs, and sibling agents.

An agent is not just a bigger skill. A skill teaches a procedure; an agent owns a
recurring responsibility.

## Conversion Workflow

1. Identify the current product and its source of truth.
2. Decide whether the work is skill, rule, library-native agent, or pointer
   agent.
3. Copy the agent shape from [`templates/agent.md`](../../templates/agent.md)
   or the folder contract used by nearby specialist agents.
4. Write the agent contract under `agents/<slug>/AGENT.md` or
   `agents/<slug>.md`, matching local registry style.
5. Add a human `README.md` for folder-based agents.
6. Register the agent in [`AGENTS.md`](../../AGENTS.md), [`agents/README.md`](../../agents/README.md),
   and any standard that lists the relevant dispatch layer.
7. Cross-link the existing skill/rule to the agent instead of duplicating the
   skill body inside the agent.
8. Run validation and drift checks before shipping.

## MOIC Worked Example

`moic-response-signatures` stays as a skill and rule because it defines the
operator behavior and always-on policy. The promoted agent is
`moic-receipt-signature-agent`, a Nephew-commissioned specialist that owns drift
checking, bridge propagation, metadata compatibility, and fail-closed receipt
audits.

The agent must never remove `response_signature.moic`. Human receipts may hide
the MOIC number for readability, but machine-readable proof keeps the MOIC and
response envelope.

## Anti-Patterns

- Copying the full skill text into the agent instead of linking to the skill.
- Creating an agent with no input schema or stop conditions.
- Adding an agent file without updating the registries.
- Treating a pointer agent as permission to vendor upstream source.
- Letting a visual receipt change remove machine-verifiable MOIC metadata.
