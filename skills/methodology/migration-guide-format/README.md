# migration-guide-format

When swapping one tool for another (Docker Desktop → Colima, Forgejo → GitLab CE), write a step-by-step migration guide at `skills/<family>/<slug>/references/switching-from-<old>.md` covering: preserve vs migrate, pre-flight, backup, install new, switch, verify, reclaim space, rollback.

See [`SKILL.md`](SKILL.md) for the playbook and `docs/templates/migration-guide.md.template` and `docs/workflows/rip-and-replace-a-tool.md` for the canonical reference.
