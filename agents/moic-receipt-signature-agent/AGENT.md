# Agent contract: moic-receipt-signature-agent

## Commissioned by

This agent is part of **Nephew's** dispatch — it does not commission itself.
Invocation flows from [`nephew`](../nephew.md), the Orchestrator Agent by Avery
Goodman, when a task touches MOIC identity, receipt signatures,
`response_signature` metadata, or cross-tool MOIC drift.

Layer: **3 · Specialist**. It owns a narrow, recurring operational job:
keeping MOIC receipt/signature behavior aligned across AISL, Nephew runtime,
Cursor rules, Claude skills, and downstream bridge copies.

## Trigger

Use this agent when the user or another agent says:

- "MOIC receipt"
- "response signature"
- "receipt signature patrol"
- "agent sign-off"
- "make sure Cursor/Claude/AISL learned this"
- "remove or change the visible MOIC"
- "why is the receipt stamp missing"
- "verify the signature output schema"

Planned command surface:

```bash
agents/moic-receipt-signature-agent/check
agents/moic-receipt-signature-agent/apply
```

## Input

```yaml
target_repo: /absolute/path/to/repo
mode: check | apply
expected_entity_id: nephew
receipt_signature_html: "<br><sub><em>Nephew</em></sub>"
receipt_signature_text: "Nephew"
required_metadata:
  - response_signature.entity_id
  - response_signature.moic
  - response_signature.agent_name
  - response_signature.receipt_signature_html
  - response_signature.receipt_signature_text
scan_surfaces:
  - nephew-runtime
  - ai-skills-library
  - cursor-rules
  - cursor-skills
  - claude-skills
  - meta-library
```

## Output

In `check` mode:

- Drift report listing each scanned surface and pass/fail state.
- Missing-record list with exact file paths.
- Compatibility warning if human receipt styling conflicts with machine proof.

In `apply` mode:

- Updated source records, limited to MOIC receipt/signature surfaces.
- Test or verification commands to run.
- PR-ready summary that names before/after/change/next action.

## Side effects

- May update AISL MOIC skill/rule records.
- May update Nephew MOIC docs/tests/runtime records when explicitly scoped to a
  Nephew checkout.
- May update personal Cursor/Claude copies only when the operator asks for local
  propagation.
- Must not alter private keys, witness private material, or unrelated agent
  identity records.

## Safety guarantees

- `response_signature.moic` is never removed.
- Name-only receipts require `expected_entity_id` for validation.
- Unknown, inactive, retired, or revoked entities fail closed.
- Visual receipt formatting is treated as display only; production proof remains
  structured metadata plus signed response envelopes.
- Writes are surgical: the agent touches only the requested MOIC surfaces.
- Repeated runs are idempotent when the requested receipt schema is already
  installed.

## Errors

- Exit 0 on success.
- Exit 1 on hard failure: invalid registry, missing required metadata, broken
  test command, or signature verification failure.
- Exit 2 on soft failure: target path missing, personal copy unavailable, or
  ambiguous receipt schema requiring operator confirmation.

## Stop conditions

- The requested visible receipt would remove machine-verifiable MOIC metadata.
- The expected entity is not in the registry.
- The receipt schema conflicts with a stronger active rule.
- The task requires private key movement or secret exposure.
- The target repo has unrelated dirty changes in the same files and no operator
  direction to combine them.

## Verification

Minimum checks:

```bash
rg "receipt_signature_html|response_signature.moic|moic-response-signatures" .
rg "MOIC: 070195134533 _Nephew_|\"footer\": \"MOIC:" .
```

For Nephew runtime changes:

```bash
node --test test/*.test.js
```

For AISL records:

```bash
python3 scripts/validate-skill-frontmatter.py
```

## Status

Contract active; implementation is currently manual through Nephew/Cursor
tooling. A future executable runner may live beside this contract.

## Related

- Skill: [`skills/methodology/moic-response-signatures/SKILL.md`](../../skills/methodology/moic-response-signatures/SKILL.md)
- Rule: [`rules/library/moic-response-signatures/body.md`](../../rules/library/moic-response-signatures/body.md)
- Standard: [`docs/standards/skill-to-agent-conversion.md`](../../docs/standards/skill-to-agent-conversion.md)
- Runtime: `marvelousempire/nephew` `src/response-signature.js` and
  `src/signature-patrol.js`
