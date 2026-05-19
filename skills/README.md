# Skills (vendored + generated)

Most folders are **copies** for backup and GitHub browsing. **External bridge skills** are generated from a manifest (not vendored upstream code).  
**Upstream / licenses:** see [`../THIRD_PARTY.md`](../THIRD_PARTY.md).

## Taxonomy

| Category | Path | Count | Notes |
|----------|------|------:|-------|
| **Marketing** (Corey Haines) | [`marketing/`](marketing/) | 41 | CRO, SEO, copy, ads, ASO, … — [flat catalog](marketing/SKILL-CATALOG.md) · [by category](marketing/CATEGORIES.md) |
| **Visual → Design** | [`visual/design/ui-ux-pro-max/`](visual/design/ui-ux-pro-max/) | 1 | Design system / UX (`uipro-cli`) |
| **IDE → Cursor** | [`ide/cursor/`](ide/cursor/) | 13 | babysit, canvas, create-skill, sdk, … — [catalog](ide/cursor/SKILL-CATALOG.md) |
| **Project → Red-E Play** | [`project/red-e-play/`](project/red-e-play/) | 2 | `verify-ship`, `generate-weather-plates` |
| **You-Sir Juan** (agent-managed) | [`yousirjuan/`](yousirjuan/) | 6 | Platform pack — see [`yousirjuan/README.md`](yousirjuan/README.md); **not** under `project/` |
| **External tools** (bridge) | [`external/`](external/) | 11 | Generated `SKILL.md` per upstream repo — [catalog](external/SKILL-CATALOG.md) · [manifest](../docs/external-tools.manifest.json) |

**Total:** 68 `SKILL.md` files (57 vendored + 11 generated bridges).

**Path rule:** You-Sir Juan skills live only at `skills/yousirjuan/`. The retired path `skills/project/yousirjuan/` must never be recreated. Enforced by [`rules/library/yousirjuan-skills-pack-path/`](../rules/library/yousirjuan-skills-pack-path/body.md).

**Cursor (flat project layout):** use [`../scripts/install-repo-skills-to-cursor-project.sh`](../scripts/install-repo-skills-to-cursor-project.sh) — see [`../docs/cursor-project-skills.md`](../docs/cursor-project-skills.md).

## Browse on GitHub

- Marketing (flat): **[marketing/SKILL-CATALOG.md](marketing/SKILL-CATALOG.md)**  
- Marketing (grouped): **[marketing/CATEGORIES.md](marketing/CATEGORIES.md)**  
- External tools (tagged index): **[../docs/related-github-projects.md](../docs/related-github-projects.md)**
