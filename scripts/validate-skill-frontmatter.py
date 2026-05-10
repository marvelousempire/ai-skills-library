#!/usr/bin/env python3
"""Fail if any SKILL.md under skills/ is missing name/description frontmatter."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ROOT / "skills"
MAX_DESC = 1024
MAX_NAME = 64


def parse_frontmatter(text: str) -> dict[str, str] | None:
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    block = text[3:end]
    out: dict[str, str] = {}
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith("'") and val.endswith("'"):
            val = val[1:-1]
        out[key] = val
    return out


def main() -> int:
    errors: list[str] = []
    for path in sorted(SKILLS.rglob("SKILL.md")):
        rel = path.relative_to(ROOT)
        text = path.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        if not fm:
            errors.append(f"{rel}: missing or broken YAML frontmatter (expected --- block)")
            continue
        name = fm.get("name", "").strip()
        desc = fm.get("description", "").strip()
        if not name:
            errors.append(f"{rel}: frontmatter missing 'name'")
        elif len(name) > MAX_NAME:
            errors.append(f"{rel}: name longer than {MAX_NAME} chars")
        elif not re.match(r"^[a-z0-9-]+$", name):
            errors.append(f"{rel}: name should be lowercase letters, digits, hyphens only")
        if not desc:
            errors.append(f"{rel}: frontmatter missing 'description'")
        elif len(desc) > MAX_DESC:
            errors.append(f"{rel}: description longer than {MAX_DESC} chars")

    if errors:
        print("validate-skill-frontmatter: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1
    print(f"validate-skill-frontmatter: OK ({len(list(SKILLS.rglob('SKILL.md')))} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
