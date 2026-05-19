#!/usr/bin/env python3
"""Generate agent.plugin.json + agent.plugin.md for every agent in agents/.

WordPress-plugin-style metadata — same catalog model as skills.
Flat agents: agents/<slug>.md → agents/<slug>.plugin.json + .plugin.md
Folder agents: agents/<slug>/AGENT.md → agents/<slug>/agent.plugin.json + .plugin.md
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENTS = ROOT / "agents"
DIRECTORY_MD = ROOT / "AGENTS-PLUGIN-DIRECTORY.md"
PRESERVE_KEYS = ("icon", "featured", "homepage", "repository", "overlap", "author", "license", "team", "layer")

sys.path.insert(0, str(Path(__file__).resolve().parent))
from plugin_manifest_utils import (  # noqa: E402
    body_summary,
    extract_philosophy_blockquote,
    first_sentence,
    infer_slug_from_heading,
    parse_frontmatter,
    parse_list_field,
    slug_to_title,
)

TEAM_LABELS = {
    "orchestration": "Orchestration",
    "investigation": "Investigation",
    "factory": "Factory",
    "compliance": "Compliance",
    "utility": "Utility",
    "process": "Process chain",
}

SKIP_FILES = {"README.md"}


def infer_team(slug: str, desc: str) -> tuple[str, str]:
    s = f"{slug} {desc}".lower()
    if slug.startswith("chain-") or slug in ("nephew", "bishop"):
        return "orchestration", TEAM_LABELS["orchestration"]
    if "forensic" in s or "investigation" in s or "case" in slug:
        return "investigation", TEAM_LABELS["investigation"]
    if "scaffold" in s or "ripple" in s or "count-keeper" in s:
        return "factory", TEAM_LABELS["factory"]
    if "moic" in s or "signature" in s or "receipt" in s:
        return "compliance", TEAM_LABELS["compliance"]
    if slug.startswith("chain-"):
        return "process", TEAM_LABELS["process"]
    return "utility", TEAM_LABELS["utility"]


def infer_layer(slug: str) -> str | None:
    if slug == "nephew":
        return "0 · Front door"
    if slug.startswith("chain-"):
        return "2 · Process"
    if slug in ("bishop", "forensic-case-investigator"):
        return "2 · Gate / investigation"
    return "3 · Specialist"


def discover_agents() -> list[tuple[str, Path]]:
    found: list[tuple[str, Path]] = []
    for path in sorted(AGENTS.glob("*.md")):
        if path.name in SKIP_FILES or path.name.endswith(".plugin.md"):
            continue
        found.append(("flat", path))
    for path in sorted(AGENTS.glob("*/AGENT.md")):
        found.append(("folder", path))
    return found


def plugin_paths(layout: str, agent_path: Path, slug: str) -> tuple[Path, Path, str, str]:
    if layout == "flat":
        base = agent_path.parent / slug
        return base.with_suffix(".plugin.json"), base.with_suffix(".plugin.md"), f"{slug}.md", f"{slug}.plugin.md"
    parent = agent_path.parent
    return parent / "agent.plugin.json", parent / "agent.plugin.md", "AGENT.md", "agent.plugin.md"


def build_manifest(layout: str, agent_path: Path, existing: dict | None) -> dict:
    text = agent_path.read_text(encoding="utf-8")
    fm = parse_frontmatter(text)
    slug = fm.get("name") or infer_slug_from_heading(text, agent_path.parent.name if layout == "folder" else agent_path.stem)
    rel_path = agent_path.relative_to(ROOT).as_posix()
    agent_dir = agent_path.parent.relative_to(ROOT).as_posix()
    desc = fm.get("description", "").strip() or body_summary(text)
    if not desc:
        desc = f"Agent plugin: {slug_to_title(slug)}."

    philosophy = fm.get("philosophy") or extract_philosophy_blockquote(text)
    team, team_label = infer_team(slug, desc)
    if existing and existing.get("team"):
        team = existing["team"]
        team_label = TEAM_LABELS.get(team, team.replace("-", " ").title())

    status = "stub" if "stub" in desc.lower()[:120] or "deferred" in text.lower()[:500] else "stable"
    if not philosophy and slug not in ("nephew",):
        status = "needs_philosophy" if status == "stable" else status

    _, _, agent_md_name, lead_name = plugin_paths(layout, agent_path, slug)

    manifest = {
        "schema_version": "1.0.0",
        "slug": slug,
        "name": slug_to_title(slug),
        "team": team,
        "team_label": team_label,
        "layer": infer_layer(slug),
        "version": "1.0.0",
        "status": status,
        "artifact_type": "agent",
        "summary": first_sentence(desc),
        "description": desc,
        "agent_path": rel_path,
        "agent_dir": agent_dir,
        "agent_md": agent_md_name,
        "lead_sheet_md": lead_name,
        "layout": layout,
        "author": "marvelousempire",
        "author_uri": "https://github.com/marvelousempire",
        "license": "MIT",
        "repository": None,
        "homepage": None,
        "model": fm.get("model") or None,
        "tools": parse_list_field(fm, "tools") or [],
        "triggers": [],
        "philosophy": philosophy,
        "philosophy_required": True,
        "philosophy_tagline": fm.get("philosophy_tagline") or None,
        "invoke": f"Commission **{slug}** via Nephew dispatch.",
        "commissioned_by": "nephew",
        "icon": None,
        "featured": slug in ("nephew", "bishop", "forensic-case-investigator"),
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    if existing:
        for key in PRESERVE_KEYS:
            if key in existing and existing[key] is not None:
                manifest[key] = existing[key]

    return manifest


def render_lead_sheet(m: dict, json_name: str) -> str:
    tools = ", ".join(f"`{t}`" for t in m.get("tools", [])[:8]) or "—"
    philosophy = m.get("philosophy") or "— *(Bishop requires Philosophy on every new agent)*"

    return f"""---
# Lead sheet — auto-generated from agent source. Edit {json_name} for card/grid metadata.
agent_slug: {m["slug"]}
generated_at: {m["generated_at"]}
---

<!--
Agent Name:       {m["name"]}
Slug:              {m["slug"]}
Team:              {m["team_label"]} ({m["team"]})
Layer:             {m.get("layer") or "—"}
Version:           {m["version"]}
Status:            {m["status"]}
Artifact type:     agent
Summary:           {m["summary"]}
Philosophy:        {philosophy}
Invoke:            {m["invoke"]}
-->

# {m["name"]}

| | |
|---|---|
| **Slug** | `{m["slug"]}` |
| **Team** | {m["team_label"]} |
| **Layer** | {m.get("layer") or "—"} |
| **Version** | {m["version"]} |
| **Status** | {m["status"]} |
| **Type** | agent (WordPress-style plugin) |
| **Path** | `{m["agent_dir"]}` |

## Summary

{m["summary"]}

## Description

{m["description"]}

## Invoke

{m["invoke"]}

## Tools

{tools}

## Philosophy

{philosophy}

## Files

- [`{m["agent_md"]}`]({m["agent_md"]}) — agent contract
- [`{json_name}`]({json_name}) — machine manifest (library catalog grid)
- This file — human lead sheet

"""


def write_directory(manifests: list[dict]) -> None:
    by_team: dict[str, list[dict]] = {}
    for m in manifests:
        by_team.setdefault(m["team"], []).append(m)

    lines = [
        "# Agents plugin directory",
        "",
        "WordPress-style plugin cards for every **agent** in this library (same model as skills).",
        "",
        "| Layout | Source | Plugin manifest |",
        "|--------|--------|-----------------|",
        "| Flat | `agents/<slug>.md` | `agents/<slug>.plugin.json` + `.plugin.md` |",
        "| Folder | `agents/<slug>/AGENT.md` | `agents/<slug>/agent.plugin.json` + `.plugin.md` |",
        "",
        "**Unified catalog (skills + agents):** [`LIBRARY-PLUGIN-CATALOG.md`](LIBRARY-PLUGIN-CATALOG.md)",
        "",
        f"**Total agent plugins:** {len(manifests)} · **Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "Regenerate: `python3 scripts/generate-agent-plugin-manifests.py`",
        "",
        "**Bishop gate:** new agents must include `## Philosophy` and both plugin files before registration.",
        "",
    ]

    for team in sorted(by_team.keys(), key=lambda t: TEAM_LABELS.get(t, t)):
        items = sorted(by_team[team], key=lambda x: x["slug"])
        label = items[0]["team_label"] if items else team
        lines.append(f"## {label} ({len(items)})")
        lines.append("")
        lines.append("| Agent | Ver | Status | Philosophy | Summary | Invoke |")
        lines.append("|-------|-----|--------|------------|---------|--------|")
        for m in items:
            path = m["agent_dir"]
            lead = m["lead_sheet_md"]
            phil = "✓" if m.get("philosophy") else "—"
            lines.append(
                f"| [**{m['name']}**]({path}/{lead}) "
                f"| {m['version']} | {m['status']} | {phil} "
                f"| {m['summary']} | {m['invoke']} |"
            )
        lines.append("")

    DIRECTORY_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    manifests: list[dict] = []
    for layout, agent_path in discover_agents():
        slug = agent_path.stem if layout == "flat" else agent_path.parent.name
        json_path, md_path, agent_md_name, lead_name = plugin_paths(layout, agent_path, slug)
        existing = None
        if json_path.exists():
            try:
                existing = json.loads(json_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                existing = None
        manifest = build_manifest(layout, agent_path, existing)
        json_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        md_path.write_text(render_lead_sheet(manifest, json_path.name), encoding="utf-8")
        manifests.append(manifest)

    write_directory(manifests)
    print(f"generate-agent-plugin-manifests: OK ({len(manifests)} agent plugins)")
    print(f"  directory: {DIRECTORY_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
