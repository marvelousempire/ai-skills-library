#!/usr/bin/env python3
"""
Emit Cursor (.mdc) and/or Claude Code (.md) rules from rules/library into a target repo.

Canonical bodies use __DOCS__ for the path prefix from the rules file to the repo's docs/ folder.

Example:
  python3 scripts/generate-agent-rules.py \\
    --pack rules/packs/red-e-play-core.json \\
    --repo-root ~/Developer/red-e-play-app

  python3 scripts/generate-agent-rules.py --pack rules/packs/red-e-play-core.json \\
    --repo-root ~/Developer/red-e-play-app --claude-only
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def render_frontmatter(meta: dict) -> str:
    desc = meta["description"]
    if any(ch in desc for ch in "\n:\""):
        desc_yaml = json.dumps(desc)
    else:
        desc_yaml = desc
    lines = [
        "---",
        f"description: {desc_yaml}",
        f"alwaysApply: {str(meta.get('alwaysApply', False)).lower()}",
    ]
    globs = meta.get("globs") or []
    if globs:
        lines.append("globs:")
        for g in globs:
            lines.append(f"  - {g}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def expand_body(body: str, *, docs_prefix: str, mdc_to_md_links: bool) -> str:
    text = body.replace("__DOCS__", docs_prefix)
    if mdc_to_md_links:
        text = re.sub(r"\(([\w-]+)\.mdc\)", r"(\1.md)", text)
    return text


def write_if_changed(path: Path, content: str, dry_run: bool) -> bool:
    if dry_run:
        print(f"--- would write {path} ({len(content)} bytes)")
        return True
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_file() and path.read_text(encoding="utf-8") == content:
        return False
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description="Generate Cursor + Claude rules from rules/library")
    ap.add_argument("--pack", type=Path, required=True, help="Pack JSON under rules/packs/")
    ap.add_argument("--repo-root", type=Path, required=True, help="Target repository root")
    ap.add_argument("--cursor-only", action="store_true")
    ap.add_argument("--claude-only", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    pack_path = args.pack if args.pack.is_absolute() else ROOT / args.pack
    pack = load_json(pack_path)
    profile_id = pack.get("profile") or "default-monorepo"
    prof_path = ROOT / "rules" / "profiles" / f"{profile_id}.json"
    if not prof_path.is_file():
        print(f"Profile not found: {prof_path}", file=sys.stderr)
        return 1
    profile = load_json(prof_path)

    emit_cursor = not args.claude_only
    emit_claude = not args.cursor_only
    if args.cursor_only and args.claude_only:
        print("Cannot pass both --cursor-only and --claude-only", file=sys.stderr)
        return 1

    repo = args.repo_root.expanduser().resolve()
    cursor_dir = repo / ".cursor" / "rules"
    claude_dir = repo / ".claude" / "rules"

    changed = 0
    for rid in pack["rules"]:
        lib = ROOT / "rules" / "library" / rid
        meta_path = lib / "meta.json"
        body_path = lib / "body.md"
        if not meta_path.is_file() or not body_path.is_file():
            print(f"Missing rule library folder: {lib}", file=sys.stderr)
            return 1
        meta = load_json(meta_path)
        body_raw = body_path.read_text(encoding="utf-8")

        if emit_cursor:
            docs = profile["docs_path_from_cursor_rules"]
            body = expand_body(body_raw, docs_prefix=docs, mdc_to_md_links=False)
            out = render_frontmatter(meta) + "\n" + body
            target = cursor_dir / f"{rid}.mdc"
            if write_if_changed(target, out, args.dry_run):
                changed += 1

        if emit_claude:
            docs = profile["docs_path_from_claude_rules"]
            body = expand_body(body_raw, docs_prefix=docs, mdc_to_md_links=True)
            out = render_frontmatter(meta) + "\n" + body
            target = claude_dir / f"{rid}.md"
            if write_if_changed(target, out, args.dry_run):
                changed += 1

    if args.dry_run:
        print(f"Dry run complete ({len(pack['rules'])} rules × emitters).")
    else:
        print(f"Emitted rules into {repo} (updated ~{changed} file(s)).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
