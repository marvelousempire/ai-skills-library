# idempotent-commands

Design Makefile + CLI commands so they're safe to re-run forever. `make ui` boots whatever is down + opens the browser, same result every time. Pre-flight checks, pgrep guards, bounded waits.

See [`SKILL.md`](SKILL.md) for the playbook and `docs/standards/plan-naming.md` and `docs/templates/Makefile.template` for the canonical reference.
