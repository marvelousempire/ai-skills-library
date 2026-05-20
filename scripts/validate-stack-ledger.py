#!/usr/bin/env python3
"""Validate sealed tech-stack ledgers: reference package.json deps ⊆ dependencies.yaml."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

ROOT = Path(__file__).resolve().parents[1]
TECH_STACKS = ROOT / "skills" / "engineering" / "tech-stacks"


def load_yaml(path: Path) -> dict:
    if yaml is None:
        print("validate-stack-ledger: PyYAML required (pip install pyyaml)", file=sys.stderr)
        sys.exit(2)
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {}


def pkg_names(pkg_json: Path) -> set[str]:
    data = json.loads(pkg_json.read_text(encoding="utf-8"))
    names: set[str] = set()
    for key in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
        block = data.get(key) or {}
        names.update(block.keys())
    return names


def validate_stack(stack_dir: Path) -> list[str]:
    errors: list[str] = []
    stack_id = stack_dir.name
    ledger_index = stack_dir / "stack.ledger.yaml"
    if not ledger_index.exists():
        return [f"{stack_id}: missing stack.ledger.yaml"]

    index = load_yaml(ledger_index)
    deps_rel = (index.get("ledger_files") or {}).get("dependencies", "ledger/dependencies.yaml")
    deps_path = stack_dir / deps_rel
    if not deps_path.exists():
        return [f"{stack_id}: missing {deps_rel}"]

    deps_doc = load_yaml(deps_path)
    allow = set(deps_doc.get("allow_packages") or [])
    allow_dev = set(deps_doc.get("allow_dev_packages") or [])
    allowed = allow | allow_dev
    forbidden = deps_doc.get("forbidden_patterns") or []

    for rel in deps_doc.get("reference_lockfiles") or []:
        lock = stack_dir / rel
        if not lock.exists():
            errors.append(f"{stack_id}: reference_lockfile missing: {rel}")
            continue
        for name in sorted(pkg_names(lock)):
            for pat in forbidden:
                if pat.endswith("*") and name.startswith(pat[:-1]):
                    errors.append(f"{stack_id}: forbidden package {name!r} in {rel} (pattern {pat})")
                elif name == pat or name.startswith(pat + "/"):
                    errors.append(f"{stack_id}: forbidden package {name!r} in {rel}")
            if name not in allowed:
                errors.append(
                    f"{stack_id}: package {name!r} in {rel} not in ledger allow_packages/allow_dev_packages"
                )

    cap_path = stack_dir / (index.get("ledger_files") or {}).get("capabilities", "ledger/capabilities.yaml")
    if cap_path.exists():
        cap = load_yaml(cap_path)
        if cap.get("stack_id") and cap["stack_id"] != stack_id:
            errors.append(f"{stack_id}: capabilities stack_id mismatch {cap['stack_id']}")
    else:
        errors.append(f"{stack_id}: missing capabilities ledger file")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate tech-stack sealed ledgers")
    parser.add_argument("--stack", help="Single stack id folder name")
    args = parser.parse_args()

    if args.stack:
        stacks = [TECH_STACKS / args.stack]
    else:
        stacks = [
            p
            for p in sorted(TECH_STACKS.iterdir())
            if p.is_dir() and (p / "stack.ledger.yaml").exists()
        ]

    if not stacks:
        print("validate-stack-ledger: no stacks with stack.ledger.yaml found")
        return 0

    all_errors: list[str] = []
    for stack_dir in stacks:
        all_errors.extend(validate_stack(stack_dir))

    if all_errors:
        for e in all_errors:
            print(f"ERROR: {e}", file=sys.stderr)
        print(f"validate-stack-ledger: FAIL ({len(all_errors)} errors)", file=sys.stderr)
        return 1

    print(f"validate-stack-ledger: OK ({len(stacks)} stack(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
