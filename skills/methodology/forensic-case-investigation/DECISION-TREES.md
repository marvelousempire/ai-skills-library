# Forensic Case Investigation — Decision Trees (IFTTT)

Reference by id in transaction metadata `failure_branch`. Do not improvise branches —
spawn a child transaction with Intent/Product copied from the tree.

---

## DT-MASTER-01 — Surface A has data, surface B does not

```text
IF symptom = "A shows data, B does not"
  THEN M1 = version truth on BOTH surfaces
  IF versions differ
    THEN classify B6 → DT-DEPLOY-01
  IF versions match
    THEN M4 = API for specimen on B
    IF API empty AND A has local-only data
      THEN classify B1 → DT-SYNC-01
    IF API has data AND UI empty
      THEN classify B5 → DT-UI-01
    IF API partial (field missing)
      THEN classify B4 → DT-READER-01
    IF operator: row in DB, API 404
      THEN classify B3 → DT-FILTER-01
```

---

## DT-VALIDATION-01 — Transaction fail (transient)

```text
IF validation_result = fail
  IF error class IN (timeout, 5xx, rate_limit, ECONNRESET)
    THEN child transaction: SAME intent + product, retry once
    IF second fail → validation_result = blocked → DT-VALIDATION-03
```

---

## DT-VALIDATION-02 — Transaction fail (permanent)

```text
IF validation_result = fail
  IF error class IN (404, 0 rows, schema mismatch, empty array)
    THEN do NOT mark hypothesis ruled_out
    THEN spawn child per DT-MASTER-01 or domain-specific DT-*-NN
```

---

## DT-VALIDATION-03 — Blocked (access / ops)

```text
IF validation_result = blocked
  IF cause IN (SSH banner timeout, GHA billing, missing specimen, no prod access)
    THEN log blocker in ## Blockers
    THEN next_action = human ops step OR alternate local verify
    THEN do NOT advance mission checklist step
```

---

## DT-SYNC-01 — Never persisted

```text
IF classify B1
  THEN Intent = trace client write path for specimen id
  THEN Product = named push method + endpoint + last success timestamp OR proof never called
  THEN check: status gate (.ended?), pushed-id set, initial sync vs incremental
  IF push never called → recommend wire or backfill
  IF push failed → exhibit HTTP status + body
```

---

## DT-DEPLOY-01 — Deploy drift

```text
IF classify B6
  THEN Intent = prove live version ≠ expected commit
  THEN Product = curl BUILD_ID / grep version + gh run id + deploy workflow name
  THEN next = run deploy OR build off-box per repo Pain Journal
```

---

## DT-READER-01 — Reader asymmetry

```text
IF classify B4
  THEN Intent = compare serializers for same column
  THEN Product = diff rowToX vs formatPlayer vs rowToPublicProfile for field
  THEN fix = same PR updates all readers (Rule 2.8 Secure Data Flow)
```

---

## DT-UI-01 — UI wiring

```text
IF classify B5
  THEN Intent = trace UI prop from API response to component
  THEN Product = file:line showing drop OR wrong key OR empty fallback
```

---

## DT-FILTER-01 — Persisted but filtered

```text
IF classify B3
  THEN Intent = run same id through public vs admin vs raw SQL predicate
  THEN Product = which predicate excluded row (hidden, guest, affects_permanent_profile, status)
```

---

## DT-HYPOTHESIS-01 — All hypotheses ruled out, symptom remains

```text
IF all H# = ruled_out AND symptom persists
  THEN add H-new with status open
  IF 3 consecutive FAIL on same M#
    THEN blocked → escalate: charter scope or specimen wrong
```

---

## DT-CLOSE-01 — Case close gate

```text
IF mechanism sentence passes Two-Question Test
  AND primary bucket IN B1..B8 (not B9)
  AND retrograde T000n→T0001 documented
  THEN phase = close transaction
  ELSE remain in investigate
```
