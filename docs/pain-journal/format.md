# Pain Journal entry format

Use this format for every `docs/pain-journal/YYYY-MM-DD-<slug>.md` file.

## Required sections

```markdown
# <Incident title>

**First seen:** YYYY-MM-DD (PR #NNN, SHA <short>)
**Session:** <session slug from master-reports>
**Category:** <build / deploy / git / schema / coordination / etc.>

## Symptom

<What it looks like in logs / UI / git output. The smell.>

## Diagnose (30 seconds)

<Commands that confirm in under 30 seconds. If you can't write a 30-second confirmation, the entry isn't ripe yet.>

```bash
# concrete commands
```

## Fix

<Concrete steps. Cite the canonical file paths.>

## Root cause

<One sentence on why it happens.>

## Prevention

<Link to rules / skills / checklists that prevent recurrence.>

## Related

- Rule: [`rules/library/<name>`](../../rules/library/<name>/body.md)
- Master Report: [`docs/master-reports/YYYY-MM-DD-<session>.md`](../master-reports/YYYY-MM-DD-<session>.md) Section N
```

## Style guidelines

- Each entry is one screen — under 30 lines if possible
- Diagnose section MUST have a 30-second confirmation
- Fix section MUST cite file paths
- Prevention section MUST link to library artifacts

## When to write an entry

- An incident took >15 minutes to diagnose
- The same class of issue could plausibly bite again
- The lesson is structural, not a one-off

## When NOT to write an entry

- One-off bugs with no pattern
- Fixed by a known process (don't re-document)
- Trivial fixes

## Index

The directory's `README.md` (this file) IS the index. Entries are listed by date in reverse chronological order.

## Origin

Adapted from red-e-play's CLAUDE.md "Pain Journal" section, generalized for the AI Skills Library.
