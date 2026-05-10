# Agent notes (this repository)

This repo is a **skills library**, not a shipped application.

- **Browse:** start at [`README.md`](README.md) and [`skills/README.md`](skills/README.md).
- **Use skills inside another repo (Cursor):** run [`scripts/install-repo-skills-to-cursor-project.sh`](scripts/install-repo-skills-to-cursor-project.sh) — see [`docs/cursor-project-skills.md`](docs/cursor-project-skills.md).
- **Refresh vendored copies from a dev machine:** [`scripts/vendor-skills-from-home.sh`](scripts/vendor-skills-from-home.sh) then regenerate catalogs (the script runs the Python generators).
- **Add or index a skill:** [`docs/add-skill.md`](docs/add-skill.md).

Do not create new skills under `~/.cursor/skills-cursor/` (reserved for Cursor-built-in skills); author project or personal skills per Cursor **create-skill** in [`skills/ide/cursor/create-skill/SKILL.md`](skills/ide/cursor/create-skill/SKILL.md).
