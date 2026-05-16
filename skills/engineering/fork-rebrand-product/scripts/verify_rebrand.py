#!/usr/bin/env python3
"""Verify that old rebrand tokens only remain in allowed files."""
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


def iter_text_files(root: Path) -> list[Path]:
    return [
        path
        for path in root.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and path.suffix.lower() in TEXT_EXTS
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--old-name", required=True)
    parser.add_argument("--new-name", required=True)
    parser.add_argument("--allowed-old-path", action="append", default=[])
    parser.add_argument("--require-path", action="append", default=[])
    args = parser.parse_args()

    root = args.root.resolve()
    allowed = {Path(p) for p in args.allowed_old_path}
    errors: list[str] = []
    old_tokens = {args.old_name, args.old_name.replace("-", "_"), args.old_name.upper().replace("-", "_")}

    for required in args.require_path:
        if not (root / required).exists():
            errors.append(f"required path missing: {required}")

    for path in iter_text_files(root):
        rel = path.relative_to(root)
        text = path.read_text(encoding="utf-8", errors="ignore")
        if args.new_name in text:
            continue
        if rel == Path("NOTICE.md"):
            continue
        # No-op; new name is not required in every file.

    for path in iter_text_files(root):
        rel = path.relative_to(root)
        text = path.read_text(encoding="utf-8", errors="ignore")
        if any(token in text for token in old_tokens) and rel not in allowed:
            errors.append(f"old token remains outside allowlist: {rel}")

    if errors:
        print("verify_rebrand: FAILED")
        for error in errors:
            print(f"  {error}")
        return 1

    print("verify_rebrand: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
