#!/usr/bin/env python3
"""Apply a controlled text rebrand across a repository.

This script is intentionally simple: it only edits known text extensions, skips
.git, prints every changed path, and supports --dry-run.
"""
from __future__ import annotations

import argparse
from pathlib import Path

TEXT_EXTS = {
    ".md",
    ".json",
    ".ts",
    ".tsx",
    ".js",
    ".cjs",
    ".mjs",
    ".sh",
    ".yml",
    ".yaml",
    ".toml",
    ".txt",
    ".css",
    ".html",
}


def build_replacements(
    old_name: str,
    new_name: str,
    display_name: str,
    old_env_prefix: str | None,
    new_env_prefix: str | None,
    old_python_name: str | None,
    new_python_name: str | None,
) -> list[tuple[str, str]]:
    old_words_title = old_name.replace("-", " ").title()
    old_title_hyphen = old_words_title.replace(" ", "-")
    old_capitalized = old_name[:1].upper() + old_name[1:]
    replacements = [
        (old_name.upper().replace("-", "_"), new_name.upper().replace("-", "_")),
        (old_name.replace("-", "_"), new_name.replace("-", "_")),
        (old_title_hyphen, display_name),
        (old_words_title, display_name),
        (old_capitalized, display_name),
        (old_name, new_name),
    ]
    if old_env_prefix and new_env_prefix:
        replacements.insert(0, (old_env_prefix, new_env_prefix))
    if old_python_name and new_python_name:
        replacements.insert(1, (old_python_name, new_python_name))
    return replacements


def iter_text_files(root: Path) -> list[Path]:
    return [
        path
        for path in root.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and path.suffix.lower() in TEXT_EXTS
    ]


def apply_rebrand(root: Path, replacements: list[tuple[str, str]], dry_run: bool) -> list[Path]:
    changed: list[Path] = []
    for path in iter_text_files(root):
        text = path.read_text(encoding="utf-8", errors="ignore")
        new_text = text
        for old, new in replacements:
            new_text = new_text.replace(old, new)
        if new_text != text:
            changed.append(path)
            if not dry_run:
                path.write_text(new_text, encoding="utf-8")
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--old-name", required=True)
    parser.add_argument("--new-name", required=True)
    parser.add_argument("--display-name", required=True)
    parser.add_argument("--old-env-prefix")
    parser.add_argument("--new-env-prefix")
    parser.add_argument("--old-python-name")
    parser.add_argument("--new-python-name")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = args.root.resolve()
    if not root.exists():
        raise SystemExit(f"root does not exist: {root}")

    replacements = build_replacements(
        args.old_name,
        args.new_name,
        args.display_name,
        args.old_env_prefix,
        args.new_env_prefix,
        args.old_python_name,
        args.new_python_name,
    )
    changed = apply_rebrand(root, replacements, args.dry_run)
    for path in changed:
        print(path.relative_to(root))
    print(f"{'would change' if args.dry_run else 'changed'} {len(changed)} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
