# Drill d08 — write a decision record (15 min)

## Starting state
You're picking between two real options (e.g. Postgres vs SQLite for a new skill).

## Target state
A decision record at `skills/<family>/<slug>/references/<X>-vs-<Y>.md` with:
- Both options with real pros / cons
- The decision + the rationale
- Trigger for revisiting
- Cost of being wrong
- Indexed in `docs/improvement/decision-records/INDEX.md`

## Steps

```sh
cp docs/templates/decision-record.md.template skills/<family>/<slug>/references/<X>-vs-<Y>.md
# Fill in
# Add a row to docs/improvement/decision-records/INDEX.md
```

## Verification

A future agent reads your record and doesn't re-litigate the decision in the next session.

## Solution

[`skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md`](../../../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md) — canonical example.
