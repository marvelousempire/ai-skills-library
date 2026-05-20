#!/usr/bin/env python3
"""Refresh generated_at on stack.plugin.json; ensure TECH-STACKS-PLUGIN-DIRECTORY.md."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TECH_STACKS = ROOT / "skills" / "engineering" / "tech-stacks"
DIRECTORY_MD = TECH_STACKS / "TECH-STACKS-PLUGIN-DIRECTORY.md"


def main() -> int:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    stacks: list[dict] = []

    for stack_dir in sorted(TECH_STACKS.iterdir()):
        plugin_path = stack_dir / "stack.plugin.json"
        if not plugin_path.exists():
            continue
        data = json.loads(plugin_path.read_text(encoding="utf-8"))
        data["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        plugin_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")
        data["_lead"] = f"{data['stack_path']}/stack.plugin.md"
        stacks.append(data)

    lines = [
        "# Tech stacks — Plugin directory",
        "",
        "Sealed construction kits with **stack.plugin.json** (catalog) + **stack.ledger.yaml** (constitution).",
        "",
        f"**Generated:** {now}",
        "",
        "| Stack | Mood | Surfaces | Ver | Summary | Card |",
        "|-------|------|----------|-----|---------|------|",
    ]
    for m in stacks:
        mood = ", ".join((m.get("mood") or [])[:3]) or "—"
        surfaces = ", ".join(m.get("surfaces") or []) or "—"
        lines.append(
            f"| **{m['name']}** | {mood} | {surfaces} | {m['version']} "
            f"| {m['summary']} | [{m['slug']}]({m['_lead']}) |"
        )

    lines.extend(
        [
            "",
            "Regenerate:",
            "",
            "```bash",
            "python3 scripts/generate-stack-plugin-manifests.py",
            "python3 scripts/validate-stack-plugin-manifests.py",
            "python3 scripts/validate-stack-ledger.py",
            "python3 scripts/generate-library-plugin-catalog.py",
            "```",
            "",
            "Convention: [`DEPOSITORY.md`](./DEPOSITORY.md)",
            "",
        ]
    )

    DIRECTORY_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"generate-stack-plugin-manifests: OK ({len(stacks)} stack(s))")
    print(f"  directory: {DIRECTORY_MD.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
