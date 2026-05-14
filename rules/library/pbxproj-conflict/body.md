---
name: pbxproj-conflict
id: RL-0030
keywords: [enforce-pbxproj, check-conflict, file-pbxproj]
goal: Deliver pbxproj conflict output correctly and completely.
hash: d0f74c9
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# project.pbxproj — rebase and merge conflict resolution

`project.pbxproj` conflicts are the single most common friction point in any
multi-agent monorepo that includes an Xcode project. Two sessions bumping
`MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in parallel will always
conflict on rebase. The resolution is always the same: **take HEAD**.

Never manually edit `project.pbxproj` to resolve conflicts. The file is
machine-generated and whitespace-sensitive. One missed UUID or bracket breaks
the build silently.

---

## The one-command fix

When `git rebase` or `git merge` stops with a conflict in `project.pbxproj`,
run this immediately — no reading, no editing:

```bash
python3 - << 'EOF'
import re
path = "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
with open(path) as f:
    content = f.read()
pattern = re.compile(
    r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n',
    re.DOTALL
)
resolved = pattern.sub(lambda m: m.group(1) + '\n', content)
with open(path, 'w') as f:
    f.write(resolved)
remaining = resolved.count('<<<<<<<')
print(f"resolved. remaining markers: {remaining}")
EOF
```

If `remaining` is 0, proceed:

```bash
git add "Red-E Play/RedEPlay.xcodeproj/project.pbxproj"
GIT_EDITOR=true git rebase --continue
```

If `remaining` > 0, the file has nested or non-standard conflict markers.
Run the script again — it's idempotent — or manually delete each
`<<<<<<< HEAD / ======= / >>>>>>>` block keeping the HEAD (upper) half.

---

## Why HEAD is always right

`MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` are bumped by every PR
that touches the iOS target. When you rebase your branch onto a newer `main`,
the incoming commits have lower version numbers than your branch. **Your
branch's HEAD always has the higher, more current number.** Keeping HEAD
gives you the right version. Keeping the incoming side would regress the
version counter.

UUID entries for new files (PBXBuildFile, PBXFileReference, group children,
Sources build phase) are **additive** — there are no real conflicts, just
context lines that confuse git's diff3. Taking HEAD preserves your new
entries while the auto-resolution discards the phantom "conflicting" lines.

---

## What this is NOT for

- **Duplicate UUIDs** — a real collision between two agents adding different
  files. These won't show as conflict markers; diagnose with:
  ```bash
  grep -E "isa = (PBXBuildFile|PBXFileReference);" \
    "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" \
    | grep -oE '^\s+[0-9A-F]{24}' | sort | uniq -d
  ```
  Empty output = healthy. Non-empty = real duplicate, requires manual fix.

- **Newly removed files** — if your branch deletes a source file and main
  added a new reference to it, HEAD may no longer be correct. Inspect
  the surrounding context before applying the script blindly.

---

## After every rebase touching pbxproj

Verify the version numbers landed correctly:

```bash
grep -E "MARKETING_VERSION =|CURRENT_PROJECT_VERSION = [0-9]+" \
  "Red-E Play/RedEPlay.xcodeproj/project.pbxproj" | sort -u
```

Expected: two unique lines — one for `MARKETING_VERSION`, one for
`CURRENT_PROJECT_VERSION` (the real build number, not the extension `= 1`).
If you see both the old and new numbers, the script missed a conflict block.

---

## Warning: Never apply this script via cross-worktree bypass

The conflict-resolution Python script above is safe ONLY when run inside the
correct worktree. Running it with `CLAUDE_ALLOW_CROSS_WORKTREE_EDIT=1` on a
pbxproj path outside the current worktree consistently corrupts the file.

See `rules/library/never-cross-worktree-pbxproj/body.md` for the full analysis
and recovery protocol.

---

## Warning: UUID regex false positives when auditing chains

When checking whether a `fileRef` UUID has a corresponding `PBXFileReference`,
use a regex that matches the UUID as the PRIMARY KEY, not as a comment:

```python
# CORRECT — UUID as primary key
file_refs = set(re.findall(
    r'([0-9A-F]{24}) /\* [^*]+ \*/ = \{isa = PBXFileReference',
    content
))

# WRONG — UUID can match as a comment inside a PBXBuildFile line
# This produces false positives and reports 0 broken chains when there are 303
bad_pattern = r'\b' + uuid + r'\b[^;]{1,200}isa = PBXFileReference'
```

The false-positive pattern cost hours of lost diagnostic time in the
2026-05-14 repair session before the correct regex was identified.
