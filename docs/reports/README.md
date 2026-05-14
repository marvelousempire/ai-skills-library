# Reports

Every working session produces one written report. Future-you (or any agent) reads the report and reconstructs exactly what happened, why, and what's open.

## How to write a session report

```sh
cp docs/templates/session-report.md.template docs/reports/$(date +%Y-%m-%d)-<topic>.md
```

Fill in: intent, what shipped, what was learned (patterns + failures), decisions, gaps left open, elevations deferred, audits filed, recovery tags, next-session entry point.

## Index

[`INDEX.md`](INDEX.md) — chronological, newest first.

## Why this exists

```text
   Without a session report, every session re-derives last session's context.
   With one, the next agent reads the report and starts at session-N's baseline.
```
