# graceful-degradation

When a service is down, show a red pill, not a crash. When a build fails, report it and keep going. When `.env` is missing, skip with a warning. Every component degrades gracefully so the whole system never wedges on one bad link.

See [`SKILL.md`](SKILL.md) for the playbook and Implicit in `skills/infra/console/server.ts` and the Makefile patterns for the canonical reference.
