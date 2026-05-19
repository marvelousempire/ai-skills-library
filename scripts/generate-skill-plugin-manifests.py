#!/usr/bin/env python3
"""Generate skill.plugin.json + skill.plugin.md beside every skills/**/SKILL.md.

WordPress-plugin-style metadata for the skills directory grid.
Preserves manual fields in existing manifests: icon, featured, homepage, repository, overlap.
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
DIRECTORY_MD = ROOT / "SKILLS-PLUGIN-DIRECTORY.md"
PRESERVE_KEYS = ("icon", "featured", "homepage", "repository", "overlap", "author", "license", "requires", "tools")

PACK_LABELS = {
    "marketing": "Marketing",
    "engineering": "Engineering",
    "engineering/architecture": "Engineering · Architecture",
    "methodology": "Methodology",
    "external": "External bridge",
    "ide/cursor": "Cursor IDE",
    "project/red-e-play": "Red-E Play",
    "project/brokerage-prototype": "Brokerage prototype",
    "project/yousirjuan": "You-Sir Juan",
    "mobile/ios": "iOS",
    "visual/design/ui-ux-pro-max": "Design / UI",
}


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    out: dict[str, str] = {}
    lines = block.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not m:
            i += 1
            continue
        key, val = m.group(1), m.group(2).strip()
        if val in (">-", ">", "|", "|-"):
            folded: list[str] = []
            i += 1
            while i < len(lines) and lines[i].startswith("  "):
                folded.append(lines[i].strip())
                i += 1
            out[key] = " ".join(folded)
            continue
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith("'") and val.endswith("'"):
            val = val[1:-1]
        out[key] = val
        i += 1
    return out


def body_summary(text: str) -> str:
    if not text.startswith("---"):
        return ""
    end = text.find("\n---", 3)
    if end == -1:
        return ""
    rest = text[end + 4 :].lstrip()
    for para in re.split(r"\n\s*\n", rest):
        para = re.sub(r"^#+\s*", "", para.strip())
        para = re.sub(r"\s+", " ", para).strip()
        if len(para) > 40:
            return para
    return ""


def parse_list_field(fm: dict[str, str], key: str) -> list[str]:
    raw = fm.get(key, "").strip()
    if not raw:
        return []
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1]
        parts = [p.strip().strip("'\"") for p in inner.split(",") if p.strip()]
        return [p for p in parts if p]
    return [raw]


def infer_pack(skill_dir: Path) -> tuple[str, str]:
    rel = skill_dir.relative_to(SKILLS)
    parts = rel.parts
    if len(parts) >= 3 and parts[0] == "visual" and parts[1] == "design":
        pack = "visual/design/ui-ux-pro-max"
    elif len(parts) >= 3 and parts[0] == "engineering" and parts[1] == "architecture":
        pack = "engineering/architecture"
    elif len(parts) >= 2 and parts[0] == "project":
        pack = f"project/{parts[1]}"
    elif len(parts) >= 2 and parts[0] == "ide":
        pack = f"ide/{parts[1]}"
    elif len(parts) >= 2 and parts[0] == "mobile":
        pack = f"mobile/{parts[1]}"
    else:
        pack = parts[0] if parts else "unknown"
    label = PACK_LABELS.get(pack, pack.replace("/", " · ").title())
    return pack, label


def first_sentence(desc: str, max_len: int = 160) -> str:
    desc = re.sub(r"\s+", " ", desc).strip()
    if len(desc) <= max_len:
        return desc
    cut = desc[: max_len - 1].rsplit(" ", 1)[0]
    return cut + "…"


def slug_to_title(slug: str) -> str:
    return " ".join(w.capitalize() for w in slug.split("-"))


def build_manifest(skill_dir: Path, existing: dict | None) -> dict:
    skill_md = skill_dir / "SKILL.md"
    text = skill_md.read_text(encoding="utf-8")
    fm = parse_frontmatter(text)
    slug = fm.get("name") or skill_dir.name
    pack, pack_label = infer_pack(skill_dir)
    rel_path = skill_dir.relative_to(ROOT).as_posix()
    desc = fm.get("description", "").strip() or body_summary(text)
    if not desc:
        desc = (fm.get("goal") or f"Skill plugin: {slug_to_title(slug)}.").strip()

    version = "1.0.0"
    meta_block = re.search(r"^\s*version:\s*([^\n]+)", text[3 : text.find("\n---", 3)] if text.startswith("---") else text, re.M)
    if meta_block:
        version = meta_block.group(1).strip().strip("'\"")
    elif "metadata:" in text:
        m = re.search(r"version:\s*([0-9.]+)", text)
        if m:
            version = m.group(1)

    artifact_type = "bridge" if pack == "external" else "skill"
    status = "bridge" if pack == "external" else ("stub" if "stub" in desc.lower()[:80] else "stable")

    manifest = {
        "schema_version": "1.0.0",
        "slug": slug,
        "name": slug_to_title(slug),
        "pack": pack,
        "pack_label": pack_label,
        "version": version,
        "status": status,
        "artifact_type": artifact_type,
        "summary": first_sentence(desc),
        "description": desc,
        "skill_id": fm.get("id") or None,
        "skill_path": rel_path,
        "skill_md": "SKILL.md",
        "lead_sheet_md": "skill.plugin.md",
        "author": "marvelousempire",
        "author_uri": "https://github.com/marvelousempire",
        "license": "MIT",
        "repository": None,
        "homepage": None,
        "requires": parse_list_field(fm, "before"),
        "tools": ["cursor", "claude"],
        "triggers": parse_list_field(fm, "keywords")[:12] or [f"Use {slug}"],
        "keywords": parse_list_field(fm, "keywords"),
        "overlap": [],
        "relations": parse_list_field(fm, "relations"),
        "governed_by": parse_list_field(fm, "governed_by"),
        "philosophy": fm.get("philosophy") or None,
        "philosophy_tagline": fm.get("philosophy_tagline") or None,
        "invoke": f"Use **{slug}**.",
        "icon": None,
        "featured": False,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "hash": fm.get("hash") or None,
        "goal": fm.get("goal") or None,
    }

    if existing:
        for key in PRESERVE_KEYS:
            if key in existing and existing[key] is not None:
                manifest[key] = existing[key]

    return manifest


def render_lead_sheet(m: dict) -> str:
    triggers = ", ".join(f"`{t}`" for t in m["triggers"][:8]) or "—"
    requires = ", ".join(f"`{r}`" for r in m["requires"]) or "—"
    overlap = ", ".join(f"`{o}`" for o in m["overlap"]) or "—"
    philosophy = m.get("philosophy") or "—"

    return f"""---
# Lead sheet — auto-generated from SKILL.md. Edit skill.plugin.json for card/grid metadata.
skill_slug: {m["slug"]}
generated_at: {m["generated_at"]}
---

<!--
Skill Name:       {m["name"]}
Slug:              {m["slug"]}
Pack:              {m["pack_label"]} ({m["pack"]})
Version:           {m["version"]}
Status:            {m["status"]}
Artifact type:     {m["artifact_type"]}
Skill ID:          {m.get("skill_id") or "—"}
Summary:           {m["summary"]}
Author:            {m["author"]}
License:           {m["license"]}
Requires:          {requires}
Invoke:            {m["invoke"]}
-->

# {m["name"]}

| | |
|---|---|
| **Slug** | `{m["slug"]}` |
| **Pack** | {m["pack_label"]} |
| **Version** | {m["version"]} |
| **Status** | {m["status"]} |
| **Type** | {m["artifact_type"]} |
| **Skill ID** | {m.get("skill_id") or "—"} |
| **Path** | `{m["skill_path"]}` |

## Summary

{m["summary"]}

## Description

{m["description"]}

## Invoke

{m["invoke"]}

## Triggers / keywords

{triggers}

## Requires (run first)

{requires}

## Overlap (related skills)

{overlap}

## Philosophy

{philosophy}

## Files

- [`SKILL.md`](SKILL.md) — agent instructions
- [`skill.plugin.json`](skill.plugin.json) — machine manifest (directory grid)
- This file — human lead sheet (WordPress-style header)

"""


def write_directory(manifests: list[dict]) -> None:
    by_pack: dict[str, list[dict]] = {}
    for m in manifests:
        by_pack.setdefault(m["pack"], []).append(m)

    lines = [
        "# Skills plugin directory",
        "",
        "WordPress-style plugin cards for every skill in this library. Each folder under `skills/` has:",
        "",
        "- `SKILL.md` — agent playbook",
        "- `skill.plugin.json` — machine manifest (grid UIs, Bishop audits)",
        "- `skill.plugin.md` — human lead sheet",
        "",
        f"**Total plugins:** {len(manifests)} · **Generated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "Regenerate: `python3 scripts/generate-skill-plugin-manifests.py`",
        "",
    ]

    for pack in sorted(by_pack.keys(), key=lambda p: PACK_LABELS.get(p, p)):
        items = sorted(by_pack[pack], key=lambda x: x["slug"])
        label = items[0]["pack_label"] if items else pack
        lines.append(f"## {label} ({len(items)})")
        lines.append("")
        lines.append("| Plugin | Ver | Status | Summary | Invoke |")
        lines.append("|--------|-----|--------|---------|--------|")
        for m in items:
            slug = m["slug"]
            path = m["skill_path"]
            lines.append(
                f"| [**{m['name']}**]({path}/skill.plugin.md) "
                f"| {m['version']} | {m['status']} "
                f"| {m['summary']} | {m['invoke']} |"
            )
        lines.append("")

    DIRECTORY_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    manifests: list[dict] = []
    for skill_md in sorted(SKILLS.rglob("SKILL.md")):
        skill_dir = skill_md.parent
        json_path = skill_dir / "skill.plugin.json"
        existing = None
        if json_path.exists():
            try:
                existing = json.loads(json_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                existing = None
        manifest = build_manifest(skill_dir, existing)
        json_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        (skill_dir / "skill.plugin.md").write_text(render_lead_sheet(manifest), encoding="utf-8")
        manifests.append(manifest)

    write_directory(manifests)
    print(f"generate-skill-plugin-manifests: OK ({len(manifests)} plugins)")
    print(f"  directory: {DIRECTORY_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
