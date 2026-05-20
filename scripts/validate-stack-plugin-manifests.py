#!/usr/bin/env python3
"""Validate stack.plugin.json + icon for each sealed tech stack."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TECH_STACKS = ROOT / "skills" / "engineering" / "tech-stacks"
REQUIRED = (
    "artifact_type",
    "slug",
    "name",
    "version",
    "status",
    "summary",
    "stack_path",
    "ledger_path",
    "icon",
)


def main() -> int:
    errors: list[str] = []
    found = 0
    for stack_dir in sorted(TECH_STACKS.iterdir()):
        plugin = stack_dir / "stack.plugin.json"
        if not plugin.exists():
            continue
        found += 1
        try:
            data = json.loads(plugin.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errors.append(f"{stack_dir.name}: invalid JSON: {e}")
            continue
        if data.get("artifact_type") != "tech_stack":
            errors.append(f"{stack_dir.name}: artifact_type must be tech_stack")
        for key in REQUIRED:
            if not data.get(key):
                errors.append(f"{stack_dir.name}: missing {key}")
        icon_rel = data.get("icon")
        if icon_rel and not (stack_dir / icon_rel).exists():
            errors.append(f"{stack_dir.name}: icon missing: {icon_rel}")
        ledger_rel = data.get("ledger_path")
        if ledger_rel and not (stack_dir / ledger_rel).exists():
            errors.append(f"{stack_dir.name}: ledger_path missing: {ledger_rel}")
        lead = stack_dir / "stack.plugin.md"
        if not lead.exists():
            errors.append(f"{stack_dir.name}: missing stack.plugin.md")

    if found == 0:
        print("validate-stack-plugin-manifests: no stacks with stack.plugin.json")
        return 0

    if errors:
        for e in errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 1

    print(f"validate-stack-plugin-manifests: OK ({found} stack(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
