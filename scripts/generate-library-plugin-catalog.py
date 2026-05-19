#!/usr/bin/env python3
"""Unified WordPress-style catalog: all skills + agents in one grid (LIBRARY-PLUGIN-CATALOG.md)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
AGENTS = ROOT / "agents"
CATALOG_MD = ROOT / "LIBRARY-PLUGIN-CATALOG.md"


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def collect_skills() -> list[dict]:
    items: list[dict] = []
    for skill_md in sorted(SKILLS.rglob("SKILL.md")):
        d = skill_md.parent
        m = load_json(d / "skill.plugin.json")
        if m:
            m["_catalog_kind"] = "skill"
            m["_lead_path"] = f"{m['skill_path']}/{m.get('lead_sheet_md', 'skill.plugin.md')}"
            items.append(m)
    return items


def collect_agents() -> list[dict]:
    items: list[dict] = []
    for p in sorted(AGENTS.glob("*.plugin.json")):
        m = load_json(p)
        if m and m.get("artifact_type") == "agent":
            m["_catalog_kind"] = "agent"
            m["_lead_path"] = f"{m['agent_dir']}/{m.get('lead_sheet_md', p.name.replace('.json', '.md'))}"
            items.append(m)
    for p in sorted(AGENTS.glob("*/agent.plugin.json")):
        m = load_json(p)
        if m:
            m["_catalog_kind"] = "agent"
            m["_lead_path"] = f"{m['agent_dir']}/{m.get('lead_sheet_md', 'agent.plugin.md')}"
            items.append(m)
    return items


def main() -> int:
    skills = collect_skills()
    agents = collect_agents()
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines = [
        "# AI Skills Library — Plugin catalog",
        "",
        "Like the **WordPress Plugins** screen: every **skill** and **agent** is a plugin with",
        "`*.plugin.json` (machine card) + `*.plugin.md` (human lead sheet).",
        "",
        "| Kind | Count | Directory |",
        "|------|-------|-----------|",
        f"| **Skills** | {len(skills)} | [`SKILLS-PLUGIN-DIRECTORY.md`](SKILLS-PLUGIN-DIRECTORY.md) |",
        f"| **Agents** | {len(agents)} | [`AGENTS-PLUGIN-DIRECTORY.md`](AGENTS-PLUGIN-DIRECTORY.md) |",
        f"| **Total** | {len(skills) + len(agents)} | this file |",
        "",
        f"**Generated:** {now}",
        "",
        "Regenerate everything:",
        "",
        "```bash",
        "python3 scripts/generate-skill-plugin-manifests.py",
        "python3 scripts/generate-agent-plugin-manifests.py",
        "python3 scripts/generate-library-plugin-catalog.py",
        "```",
        "",
        "---",
        "",
        "## All plugins (unified grid)",
        "",
        "| Kind | Name | Pack / Team | Ver | Status | Summary | Card |",
        "|------|------|-------------|-----|--------|---------|------|",
    ]

    all_items = [{"sort": f"0-{m['slug']}", **m} for m in skills] + [{"sort": f"1-{m['slug']}", **m} for m in agents]
    for m in sorted(all_items, key=lambda x: (x["_catalog_kind"], x.get("pack") or x.get("team", ""), x["slug"])):
        kind = m["_catalog_kind"]
        group = m.get("pack_label") or m.get("team_label") or "—"
        phil = ""
        if kind == "agent":
            phil = " · Phil: ✓" if m.get("philosophy") else " · Phil: —"
        lines.append(
            f"| {kind} | **{m['name']}** | {group} | {m['version']} | {m['status']} "
            f"| {m['summary']}{phil} | [{m['slug']}]({m['_lead_path']}) |"
        )

    lines.extend(
        [
            "",
            "---",
            "",
            "## Bishop factory gate",
            "",
            "When Bishop **creates or registers** an agent, the deliverable is a WordPress-style plugin:",
            "",
            "1. `agents/<slug>.md` or `agents/<slug>/AGENT.md` with mandatory `## Philosophy`",
            "2. `*.plugin.json` + `*.plugin.md` beside the agent source (run generators)",
            "3. Optional `bridge.manifest.json` when the agent pairs with a skill pack",
            "",
            "See [`agents/bishop.md`](agents/bishop.md) and [`docs/library-plugin-catalog.md`](docs/library-plugin-catalog.md).",
            "",
        ]
    )

    CATALOG_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"generate-library-plugin-catalog: OK ({len(skills)} skills + {len(agents)} agents)")
    print(f"  catalog: {CATALOG_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
