# Rebase CHANGELOG conflicts — keep both sides

When a rebase conflict occurs in `CHANGELOG.md`, the resolution must keep
BOTH sides: the incoming new entry AND the base branch's existing entries.

---

## Why the standard HEAD-only script fails here

The standard automated conflict resolver (used for `project.pbxproj` and
other machine-generated files) always takes HEAD and discards the incoming
side:

```python
pattern = re.compile(
    r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n',
    re.DOTALL
)
resolved = pattern.sub(lambda m: m.group(1) + '\n', content)
```

In a `git rebase`, the direction is:

- **HEAD** = the base branch being replayed onto (e.g. `origin/main`)
- **Incoming** = your commit being replayed

Applying HEAD-only to `CHANGELOG.md` keeps the base branch's existing
entries and silently drops YOUR new CHANGELOG entry — the one you just wrote
for the feature you're about to merge.

---

## The rule

For `CHANGELOG.md` conflicts: **keep both sides** — your new entry (incoming)
prepended above the base branch's entries (HEAD).

---

## Correct resolution script for CHANGELOG.md

```python
import re

path = "docs/CHANGELOG.md"
with open(path) as f:
    content = f.read()

def resolve_changelog_conflict(match):
    head_side = match.group(1)      # base branch — existing entries
    incoming_side = match.group(2)  # your branch — new entry
    # Prepend the new entry above the existing entries
    return incoming_side + '\n' + head_side + '\n'

pattern = re.compile(
    r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]+\n',
    re.DOTALL
)
resolved = pattern.sub(resolve_changelog_conflict, content)

with open(path, 'w') as f:
    f.write(resolved)

remaining = resolved.count('<<<<<<<')
print(f"resolved. remaining markers: {remaining}")
```

After running:

```bash
git add docs/CHANGELOG.md
GIT_EDITOR=true git rebase --continue
```

---

## Verify after resolution

The resolved file should have:
1. Your new version heading (`## [X.Y.Z]`) at the top
2. All previous entries below it
3. No conflict markers

```bash
grep "^## \[" docs/CHANGELOG.md | head -5
# Should show your new version first, then older versions below
```

---

## See also

[`pbxproj-conflict`](../pbxproj-conflict/body.md) — the complementary rule
for `project.pbxproj` conflicts (take HEAD only — the opposite resolution).

---

## First seen

Red-E Play, 2026-05-14. The automated conflict resolution script was applied
to both `project.pbxproj` AND `CHANGELOG.md` during a rebase. The pbxproj
resolution was correct (HEAD wins). The CHANGELOG resolution dropped the new
version entry, leaving the shipped code with no changelog record.
