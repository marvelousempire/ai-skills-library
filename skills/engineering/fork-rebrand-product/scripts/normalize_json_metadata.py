#!/usr/bin/env python3
"""Normalize package/plugin JSON metadata after a fork rebrand."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict[str, Any], dry_run: bool) -> None:
    if not dry_run:
        path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def normalize_package(
    path: Path,
    *,
    new_name: str,
    display_name: str,
    target_repo: str,
    maintainer: str,
    upstream_author: str,
    dry_run: bool,
) -> bool:
    data = load_json(path)
    before = json.dumps(data, sort_keys=True)
    repo_url = f"https://github.com/{target_repo}"

    data["name"] = new_name
    data["description"] = f"{display_name} memory component for a branded AI system"
    data["author"] = maintainer
    data["contributors"] = [{"name": upstream_author}]
    data["repository"] = {"type": "git", "url": f"{repo_url}.git"}
    data["homepage"] = f"{repo_url}#readme"
    data["bugs"] = {"url": f"{repo_url}/issues"}
    if "bin" in data:
        data["bin"] = {new_name: "./dist/npx-cli/index.js"}

    changed = json.dumps(data, sort_keys=True) != before
    if changed:
        write_json(path, data, dry_run)
    return changed


def normalize_plugin(
    path: Path,
    *,
    new_name: str,
    display_name: str,
    target_repo: str,
    maintainer: str,
    dry_run: bool,
) -> bool:
    data = load_json(path)
    before = json.dumps(data, sort_keys=True)
    repo_url = f"https://github.com/{target_repo}"

    data["name"] = new_name
    data["description"] = f"{display_name} memory component for a branded AI system"
    data["author"] = {"name": maintainer}
    data["repository"] = repo_url
    data["homepage"] = f"{repo_url}#readme"
    interface = data.get("interface")
    if isinstance(interface, dict):
        interface["displayName"] = display_name
        interface["shortDescription"] = f"{display_name} memory component."
        interface["longDescription"] = (
            f"{display_name} captures session activity, compresses it into reusable "
            "observations, and injects relevant context into future sessions."
        )
        interface["developerName"] = maintainer
        interface["websiteURL"] = repo_url

    changed = json.dumps(data, sort_keys=True) != before
    if changed:
        write_json(path, data, dry_run)
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, type=Path)
    parser.add_argument("--new-name", required=True)
    parser.add_argument("--display-name", required=True)
    parser.add_argument("--target-repo", required=True)
    parser.add_argument("--maintainer", required=True)
    parser.add_argument("--upstream-author", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    root = args.root.resolve()
    package_paths = [root / "package.json"]
    plugin_paths = [
        root / ".claude-plugin" / "plugin.json",
        root / ".codex-plugin" / "plugin.json",
        root / "plugin" / ".claude-plugin" / "plugin.json",
        root / "plugin" / ".codex-plugin" / "plugin.json",
    ]

    changed: list[Path] = []
    for path in package_paths:
        if path.exists() and normalize_package(
            path,
            new_name=args.new_name,
            display_name=args.display_name,
            target_repo=args.target_repo,
            maintainer=args.maintainer,
            upstream_author=args.upstream_author,
            dry_run=args.dry_run,
        ):
            changed.append(path)
    for path in plugin_paths:
        if path.exists() and normalize_plugin(
            path,
            new_name=args.new_name,
            display_name=args.display_name,
            target_repo=args.target_repo,
            maintainer=args.maintainer,
            dry_run=args.dry_run,
        ):
            changed.append(path)

    for path in changed:
        print(path.relative_to(root))
    print(f"{'would change' if args.dry_run else 'changed'} {len(changed)} JSON files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
