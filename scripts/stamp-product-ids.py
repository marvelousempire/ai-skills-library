#!/usr/bin/env python3
"""
stamp-product-ids.py — add id + keywords to every product in the AI Skills Library.

Products:
  SKILL.md files → id: SK-XXXX
  rules/library/*/body.md → id: RL-XXXX
  agents/**/*.md → id: AG-XXXX (future)
  templates/**/*.md → id: TM-XXXX (future)

Keywords are auto-derived from the product name (max 3 meaningful tokens).
Run again safely — idempotent (skips products that already have an id).
"""
from __future__ import annotations
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Words too generic to be useful keywords
STOPS = {
    "and","or","the","a","an","for","with","via","to","in",
    "of","from","by","as","its","that","this","on","at","not",
    "has","how","use","make","add","run","get","set","all",
    "any","new","pro","max","one","two","per","pre","post",
    "non","auto","self","sub","mid","off","out","up","re",
}

def derive_keywords(name: str) -> list[str]:
    """Split skill name on hyphens/underscores, remove stops, take top 3."""
    parts = re.split(r"[-_]", name.lower())
    filtered = [p for p in parts if p not in STOPS and len(p) > 2]
    return filtered[:3]

def has_field(content: str, field: str) -> bool:
    """Check if a YAML frontmatter field already exists."""
    in_fm = False
    for line in content.splitlines():
        if line.strip() == "---":
            in_fm = not in_fm
            continue
        if in_fm and line.startswith(f"{field}:"):
            return True
    return False

def insert_after_name(content: str, new_fields: str) -> str:
    """Insert new_fields immediately after the `name:` line in frontmatter."""
    lines = content.splitlines(keepends=True)
    in_fm = False
    fm_open = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped == "---":
            if not fm_open:
                fm_open = True
                in_fm = True
            else:
                in_fm = False
            continue
        if in_fm and stripped.startswith("name:"):
            # Insert after this line
            lines.insert(i + 1, new_fields)
            return "".join(lines)
    return content  # no frontmatter found — return unchanged

def ensure_frontmatter(content: str, name: str, pid: str, kws: list) -> str:
    """If no frontmatter at all, prepend it."""
    if content.startswith("---"):
        return content
    kw_str = ", ".join(kws)
    fm = f"---\nname: {name}\nid: {pid}\nkeywords: [{kw_str}]\n---\n\n"
    return fm + content

def stamp(path: str, pid: str, dry_run: bool = False) -> str:
    """Add id + keywords to a single product file. Returns status string."""
    try:
        content = open(path).read()
    except Exception as e:
        return f"  ERROR reading {path}: {e}"

    already_has_id = has_field(content, "id")
    already_has_kw = has_field(content, "keywords")

    if already_has_id and already_has_kw:
        return f"  SKIP  {path} (already stamped)"

    # Derive name from the existing frontmatter or from the directory name
    name = ""
    in_fm = False
    fm_open = False
    for line in content.splitlines():
        stripped = line.strip()
        if stripped == "---":
            if not fm_open:
                fm_open = True
                in_fm = True
            else:
                in_fm = False
        if in_fm and stripped.startswith("name:"):
            name = stripped[5:].strip().strip('"\'')
            break
    if not name:
        name = os.path.basename(os.path.dirname(path))

    kws = derive_keywords(name)
    kw_str = ", ".join(kws)

    if not content.startswith("---"):
        # No frontmatter — add it
        new_content = ensure_frontmatter(content, name, pid, kws)
    else:
        new_fields = ""
        if not already_has_id:
            new_fields += f"id: {pid}\n"
        if not already_has_kw:
            new_fields += f"keywords: [{kw_str}]\n"
        new_content = insert_after_name(content, new_fields)

    if not dry_run:
        open(path, "w").write(new_content)

    action = []
    if not already_has_id: action.append(f"id={pid}")
    if not already_has_kw: action.append(f"kw=[{kw_str}]")
    return f"  +{' +'.join(action)}  {path}"

def main():
    dry_run = "--dry-run" in sys.argv

    # Collect skills (SKILL.md files), sorted for stable IDs
    skills = sorted(glob.glob(f"{ROOT}/skills/**/*.md", recursive=True))
    skills = [f for f in skills if os.path.basename(f) == "SKILL.md"]

    # Collect rules (body.md files in rules/library/)
    rules = sorted(glob.glob(f"{ROOT}/rules/library/*/body.md"))

    print(f"Found {len(skills)} skills, {len(rules)} rules")
    print(f"Mode: {'DRY RUN' if dry_run else 'WRITE'}")
    print()

    print("=== SKILLS (SK-XXXX) ===")
    for i, path in enumerate(skills):
        pid = f"SK-{i+1:04d}"
        print(stamp(path, pid, dry_run))

    print()
    print("=== RULES (RL-XXXX) ===")
    for i, path in enumerate(rules):
        pid = f"RL-{i+1:04d}"
        print(stamp(path, pid, dry_run))

    print()
    print("Done.")

if __name__ == "__main__":
    main()
