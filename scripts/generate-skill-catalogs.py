#!/usr/bin/env python3
"""Regenerate SKILL-CATALOG.md under skills/marketing and skills/ide/cursor."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def catalog_root(rel: str) -> Path:
    """rel: 'marketing' or 'ide/cursor' (slash-separated)."""
    return ROOT.joinpath("skills", *rel.split("/"))


def write_catalog(rel: str, title: str, upstream_line: str) -> None:
    root = catalog_root(rel)
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
    if rel == "marketing":
        lines.append(
            "**Foundation:** [`../../context/readyplay-product-marketing-context.md`](../../context/readyplay-product-marketing-context.md)"
        )
        lines.append(
            "**By category:** [`CATEGORIES.md`](CATEGORIES.md) (SEO, CRO, copy, …)"
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
        "ide/cursor",
        "Cursor skills-cursor pack",
        "Vendored from `~/.cursor/skills-cursor/`.",
    )


if __name__ == "__main__":
    main()
