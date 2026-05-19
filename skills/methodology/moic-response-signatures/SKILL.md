---
name: moic-response-signatures
description: Enforce Nephew/framework entity response identity with visible receipt signatures, response_signature MOIC metadata, and MOIC Signature Patrol. Use when working on Nephew, CLOAK, framework entities, agent identity, response signing, imposter detection, MCP tool output, Cursor/Claude global rules, or any request mentioning MOIC, Moment of Introduction Code, response signature, or entity sign-off.
---

# MOIC Response Signatures

## Purpose

MOIC means **Moment of Introduction Code**: a 12-digit identity tag in
`MMDDYYHHMMSS` format.

Nephew's initial MOIC is:

```text
070195134533
```

Meaning:

```text
07/01/1995 at 1:45:33 PM
```

## Required Behavior

When acting as Nephew or any registered framework entity:

1. End human-readable substantive responses with the global closeout:

   ```html
   <strong>Before:</strong> <one line describing what was happening><br>
   <strong>After:</strong> <one line describing what is true now><br>
   <strong>Change:</strong> <what changed>; <how it was verified><br>
   <strong>Next action:</strong> <exact command, file, or decision if any><br>
   <sub><em>Nephew</em></sub>
   ```

2. Keep the visible signature name-only and italic. Nephew signs visibly as
   `<sub><em>Nephew</em></sub>` after the `Next action` line break; other registered
   entities use their own display name. Do not add a blank line between `Next action`
   and the receipt signature. Do not show the MOIC number in the human receipt line.

3. For machine-readable JSON payloads, preserve parseability and attach:

   ```json
   {
     "response_signature": {
       "entity_id": "nephew",
       "moic": "070195134533",
       "agent_name": "Nephew",
       "receipt_signature_html": "<sub><em>Nephew</em></sub>",
       "receipt_signature_text": "Nephew"
     }
   }
   ```

4. Treat the visible receipt signature as identity labeling, not cryptographic proof.

5. For proof, use Ed25519 response envelopes where available.

6. Use MOIC Signature Patrol to audit responses or handoffs that must be signed.

## Nephew Runtime Surface

Canonical implementation in the Nephew repo:

- Rule: `docs/rules/response-signature-moic.md`
- Registry: `docs/entities/moic-registry.md`
- Registry JSON: `data/entities/moic-registry.json`
- Footer/signing runtime: `src/response-signature.js`
- Patrol runtime: `src/signature-patrol.js`
- MCP tool: `nephew_signature_check`

## Agent Owner

Use [`moic-receipt-signature-agent`](../../../agents/moic-receipt-signature-agent/)
when this skill needs to become an operational audit: checking drift across
AISL, Nephew runtime, Cursor rules, Claude skills, meta-library records, or PR
receipt copy. The skill teaches the behavior; the agent owns recurring
verification and propagation.

## When Auditing

If the user asks whether MOIC is active, permanent, missing, spoofable, or
global:

1. Check the response surface:
   - chat receipt signature;
   - MCP JSON `response_signature`;
   - entity registry;
   - Cursor/Claude personal skills;
   - global Cursor rules.
2. For Nephew repo payloads, run or recommend:

   ```bash
   node -e "import('./src/signature-patrol.js').then(m => console.log(m.runSignaturePatrol('hello', { requireSignature: true })))"
   ```

3. Missing required signatures are a fail-closed condition:
   - status: `fail`;
   - blocked: `true`;
   - finding code: `missing_moic_footer` or equivalent.

## DRY Rule

Do not copy long MOIC doctrine into every agent prompt. Keep one canonical skill
in AI Skills Library, install it into Cursor/Claude personal skills, and enforce
runtime behavior through Nephew's shared formatter and signature patrol.
