# doctor-script-pattern

Every infra skill ships a doctor (`make doctor` or `scripts/doctor.sh`) that runs read-only health probes with color-coded output. Disk + Docker + engine + per-service. Exit codes: 0 green, 1 red, 2 yellow.

See [`SKILL.md`](SKILL.md) for the playbook and `docs/standards/doctor-script.md` and `docs/templates/doctor.sh.template` for the canonical reference.
