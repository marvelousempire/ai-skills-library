#!/usr/bin/env python3
"""Regenerate skills/marketing/SKILL-CATALOG.md and skills/cursor/SKILL-CATALOG.md."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def write_catalog(subdir: str, title: str, upstream_line: str) -> None:
    root = ROOT / "skills" / subdir
    dirs = sorted(p for p in root.iterdir() if p.is_dir() and (p / "SKILL.md").exists())
    lines = [
        f"# {title}",
        "",
        upstream_line,
        "",
        "| Skill | SKILL.md |",
        "|-------|----------|",
    ]
    for p in dirs:
        name = p.name
        lines.append(f"| **{name}** | [{name}/SKILL.md]({name}/SKILL.md) |")
    lines.append("")
    if subdir == "marketing":
        lines.append(
            "**Foundation:** [`../../context/readyplay-product-marketing-context.md`](../../context/readyplay-product-marketing-context.md)"
        )
        lines.append("")
    (root / "SKILL-CATALOG.md").write_text("\n".join(lines))


def main() -> None:
    write_catalog(
        "marketing",
        "Marketing skills — catalog",
        "Upstream: [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT).",
    )
    write_catalog(
        "cursor",
        "Cursor skills-cursor pack",
        "Vendored from `~/.cursor/skills-cursor/`.",
    )


if __name__ == "__main__":
    main()
