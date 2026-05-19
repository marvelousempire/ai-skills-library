#!/usr/bin/env python3
"""Every skills/**/SKILL.md folder must have skill.plugin.json + skill.plugin.md."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
REQUIRED_JSON_KEYS = (
    "schema_version",
    "slug",
    "name",
    "pack",
    "version",
    "status",
    "summary",
    "description",
    "skill_path",
)


def parse_frontmatter_name(text: str) -> str | None:
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    for line in text[3:end].splitlines():
        m = re.match(r"^name:\s*(.+)$", line)
        if m:
            return m.group(1).strip().strip("'\"")
    return None


def main() -> int:
    errors: list[str] = []
    count = 0
    for skill_md in sorted(SKILLS.rglob("SKILL.md")):
        count += 1
        rel = skill_md.relative_to(ROOT)
        skill_dir = skill_md.parent
        json_path = skill_dir / "skill.plugin.json"
        md_path = skill_dir / "skill.plugin.md"

        if not json_path.is_file():
            errors.append(f"{rel.parent}/: missing skill.plugin.json")
            continue
        if not md_path.is_file():
            errors.append(f"{rel.parent}/: missing skill.plugin.md")

        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errors.append(f"{json_path.relative_to(ROOT)}: invalid JSON — {e}")
            continue

        for key in REQUIRED_JSON_KEYS:
            if not data.get(key):
                errors.append(f"{json_path.relative_to(ROOT)}: missing or empty '{key}'")

        fm_name = parse_frontmatter_name(skill_md.read_text(encoding="utf-8"))
        if fm_name and data.get("slug") and fm_name != data["slug"]:
            errors.append(
                f"{json_path.relative_to(ROOT)}: slug '{data['slug']}' != SKILL.md name '{fm_name}'"
            )

    if errors:
        print("validate-skill-plugin-manifests: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1

    print(f"validate-skill-plugin-manifests: OK ({count} plugins)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
