#!/usr/bin/env python3
"""Regenerate SKILL-CATALOG.md under skills/marketing, skills/ide/cursor, skills/external."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def catalog_root(rel: str) -> Path:
    """rel: 'marketing' or 'ide/cursor' (slash-separated)."""
    return ROOT.joinpath("skills", *rel.split("/"))


def write_catalog(rel: str, title: str, upstream_line: str) -> None:
    root = catalog_root(rel)
    if not root.exists():
        print(f"skip missing catalog root: {root.relative_to(ROOT)}")
        return
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
    if rel == "external":
        lines.append(
            "**Source:** [`../../docs/external-tools.manifest.json`](../../docs/external-tools.manifest.json) — run `python3 scripts/generate-external-tool-skills.py` after edits."
        )
        lines.append(
            "**Human index:** [`../../docs/related-github-projects.md`](../../docs/related-github-projects.md)"
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
    write_catalog(
        "external",
        "External tools — generated bridge skills",
        "Each `SKILL.md` is **generated** from the manifest (bridge docs; upstream repos are the real products).",
    )


if __name__ == "__main__":
    main()
