#!/usr/bin/env python3
"""Validate agent.plugin.json + lead sheet beside every agent source file."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AGENTS = ROOT / "agents"
SKIP = {"README.md"}


def main() -> int:
    errors: list[str] = []
    count = 0

    for path in sorted(AGENTS.glob("*.md")):
        if path.name in SKIP or path.name.endswith(".plugin.md"):
            continue
        slug = path.stem
        jp = path.parent / f"{slug}.plugin.json"
        mp = path.parent / f"{slug}.plugin.md"
        if not jp.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing {jp.name}")
        if not mp.exists():
            errors.append(f"{path.relative_to(ROOT)}: missing {mp.name}")
        if jp.exists():
            try:
                data = json.loads(jp.read_text(encoding="utf-8"))
                for key in ("slug", "name", "summary", "description", "artifact_type"):
                    if not data.get(key):
                        errors.append(f"{jp.relative_to(ROOT)}: missing or empty '{key}'")
                if data.get("artifact_type") != "agent":
                    errors.append(f"{jp.relative_to(ROOT)}: artifact_type must be 'agent'")
            except json.JSONDecodeError as e:
                errors.append(f"{jp.relative_to(ROOT)}: invalid JSON ({e})")
        count += 1

    for agent_md in sorted(AGENTS.glob("*/AGENT.md")):
        d = agent_md.parent
        jp = d / "agent.plugin.json"
        mp = d / "agent.plugin.md"
        if not jp.exists():
            errors.append(f"{agent_md.relative_to(ROOT)}: missing agent.plugin.json")
        if not mp.exists():
            errors.append(f"{agent_md.relative_to(ROOT)}: missing agent.plugin.md")
        if jp.exists():
            try:
                data = json.loads(jp.read_text(encoding="utf-8"))
                if data.get("artifact_type") != "agent":
                    errors.append(f"{jp.relative_to(ROOT)}: artifact_type must be 'agent'")
            except json.JSONDecodeError as e:
                errors.append(f"{jp.relative_to(ROOT)}: invalid JSON ({e})")
        count += 1

    if errors:
        print("validate-agent-plugin-manifests: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1

    print(f"validate-agent-plugin-manifests: OK ({count} agents)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
