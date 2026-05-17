# Agent: moic-receipt-signature-agent

**Trigger:** MOIC receipt/signature changes, missing receipt stamps, signature
schema drift, or requests to propagate MOIC behavior across AISL, Nephew,
Cursor, Claude, and meta-library records.

**Output:** Drift report, exact file list, corrected MOIC receipt/signature
records when in apply mode, and PR-ready verification notes.

## What It Owns

This agent keeps the MOIC response-signature system aligned. It checks the human
receipt signature, structured `response_signature` metadata, MOIC Signature
Patrol expectations, and bridge copies in local tools.

It does not own private keys, witness signing keys, or unrelated agent identity
registries.

## Why This Is an Agent

The MOIC skill teaches the behavior. The MOIC rule makes the behavior always-on.
This agent owns the recurring operational job: verify, propagate, and fail closed
when receipt/signature records drift.

## Current Canonical Receipt

```html
<br><sub><em>Nephew</em></sub>
```

Machine-readable payloads must still include:

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
