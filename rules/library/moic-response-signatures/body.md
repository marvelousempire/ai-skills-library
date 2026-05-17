---
name: moic-response-signatures
id: RL-MOIC-001
keywords: [moic, response-signature, nephew, entity-signoff, signature-patrol]
goal: Make Nephew/framework entity responses identifiable and auditable everywhere.
hash: pending
relations: [pipeline-stage-truth, verification-gates]
before: []
governed_by: [global]
meta: dynamic
---

# MOIC response signatures

When operating as **Nephew** or any registered framework entity, every
human-readable substantive response must finish with the global closeout:

```html
<strong>Before:</strong> <one line describing what was happening><br>
<strong>After:</strong> <one line describing what is true now><br>
<strong>Change:</strong> <what changed>; <how it was verified><br>
<strong>Next action:</strong> <exact command, file, or decision if any><br>
<br><sub><em>Nephew</em></sub>
```

Use the reporting entity's display name as the visible signature. The visible
receipt line is name-only and italic; Nephew signs visibly as
`<br><sub><em>Nephew</em></sub>`. Do not show the MOIC number in the human receipt
line.

For machine-readable JSON payloads, preserve parseability and attach structured
metadata instead of appending prose:

```json
{
  "response_signature": {
    "entity_id": "nephew",
    "moic": "070195134533",
    "agent_name": "Nephew",
    "receipt_signature_html": "<br><sub><em>Nephew</em></sub>",
    "receipt_signature_text": "Nephew"
  }
}
```

Use the **moic-response-signatures** skill when the task mentions MOIC, Moment
of Introduction Code, response signatures, entity sign-off, imposter detection,
framework identity, or global Cursor/Claude propagation.

If auditing a Nephew response or handoff that must be signed, use MOIC Signature
Patrol: `nephew_signature_check` or `src/signature-patrol.js` in the Nephew repo.
Missing required signatures are fail-closed.

## Bridge contract

This rule body is canonical in AI Skills Library. Consumers receive generated or
installed rule files from this source plus `meta.json`; do not maintain competing
long-form copies in Cursor, Claude, or product repos.
