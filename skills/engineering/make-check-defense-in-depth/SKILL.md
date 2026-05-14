---
name: make-check-defense-in-depth
id: SK-0025
keywords: [run-check, verify-references, catch-regression]
hash: 8dd3416
relations: [confirm-ship-clearly, make-update-make-doctor]
before: [plan-first-substantive-changes]
governed_by: [RL-0039, RL-0043, global]
meta: dynamic
description: >-
  Extend `make check` (or any CI gate) so it catches silent-regression bugs
  beyond just "does the code parse." Verify every file referenced by docs/
  Makefile actually exists; verify renamed strings have updated consumers (the
  v0.21.0-class regression); verify Python modules import; verify every script
  in your library still compiles. Anti-pattern: a `make check` that just runs
  syntax. Triggers on "make check", "CI gate", "silent regression", "rebrand
  broke things", "renamed file but didn't update consumers", "test that the
  install works", "string rename audit", "broken references after refactor".
---

# make check defense in depth — catch silent regressions, not just syntax errors

The lesson from DustPan v0.21 → v0.25.4: a rebrand renamed `xcode-cleanup.applescript` → `dustpan.applescript`. The rename was applied to the file system and the README. **The consumer scripts (`bin/xcc`, `make ui`) were not updated.** `make ui` became a no-op. `bin/xcc` failed with "file not found." Both bugs lived for **66 days** before being noticed — because `make check` only validated AppleScript syntax.

A `make check` that only verifies syntax is a `make check` that lets silent regressions ship.

## When to use this skill

- Extending CI for a tool that has multiple consumers of canonical strings (filenames, env var names, package names)
- After completing a rename / refactor / rebrand
- Designing the CI gate for a tool with bash scripts, Makefile targets, AppleScripts, Python — anything where "the path changed" can break consumers
- Auditing a project that "compiles fine" but has runtime regressions
- The user says "why didn't CI catch that?"

## What `make check` (or equivalent) should verify

### Tier 1 — syntax (you probably already have this)
- AppleScript: `osacompile -o /tmp/check.scpt foo.applescript`
- Python: `python3 -c "import server, …"` (catches import errors + syntax errors in module load)
- TypeScript: `tsc --noEmit`
- Shell: `bash -n script.sh` and/or `shellcheck script.sh`

### Tier 2 — referenced files exist
Walk the Makefile, README, and docs. Every referenced file path must exist on disk:

```sh
for f in $(SCRIPT) launchd/com.example.foo.plist swiftbar/foo.sh scripts/report.py bin/foo; do
    if [ ! -e "$$f" ]; then echo "✗ Missing referenced file: $$f" >&2; exit 1; fi
done
```

If a Makefile target references `dustpan.applescript` and the file was renamed, this catches it.

### Tier 3 — renamed strings have updated consumers
This is the v0.21.0-class bug. After a rename, consumers may still reference the old name. Add an assertion that **the consumer script references the current canonical name**:

```sh
# bin/xcc must reference the current AppleScript name and the current env-var prefix
grep -q 'dustpan.applescript' bin/xcc && grep -q 'DUSTPAN_DRY_RUN' bin/xcc \
    || { echo "✗ bin/xcc has stale rebrand references" >&2; exit 1; }
echo "✓ bin/xcc references look correct"
```

The grep is dumb but reliable. If a future rename happens, this fails loudly.

### Tier 4 — every library script in a curated library still compiles
For DustPan's AppleScript library, every `applescripts/*.applescript` must compile. The library grew via AI proposals, so the gate has to verify *all* of it on every commit:

```sh
if [ -d applescripts ]; then
    ok=1
    for f in applescripts/*.applescript; do
        if [ -f "$$f" ]; then
            osacompile -o /tmp/check.scpt "$$f" 2>/dev/null \
                && rm -f /tmp/check.scpt \
                || { echo "✗ AppleScript fails to compile: $$f" >&2; ok=0; }
        fi
    done
    if [ "$$ok" = "1" ]; then echo "✓ AppleScript library compiles"; else exit 1; fi
fi
```

## The full DustPan `make check` (canonical reference)

```makefile
check: ## Verify AppleScript, bin/xcc, Python imports, and that every Makefile-referenced file exists
    @osacompile -o /tmp/dustpan-check.scpt $(SCRIPT) \
        && rm /tmp/dustpan-check.scpt \
        && echo "✓ AppleScript syntax OK"
    @# Guard against the v0.21.0-style regression where bin/xcc pointed to a
    @# renamed file. If any of these references break, the rebrand sweep missed
    @# something — surface it loudly in CI.
    @for f in $(SCRIPT) launchd/com.marvelousempire.dustpan.plist swiftbar/dustpan.30m.sh scripts/report.py scripts/remote-cleanup.sh bin/xcc; do \
        if [ ! -e "$$f" ]; then echo "✗ Missing referenced file: $$f" >&2; exit 1; fi; \
    done
    @grep -q 'dustpan.applescript' bin/xcc && grep -q 'DUSTPAN_DRY_RUN' bin/xcc \
        || { echo "✗ bin/xcc has stale rebrand references" >&2; exit 1; }
    @echo "✓ bin/xcc references look correct"
    @cd web && python3 -c "import server, cleaners, ai, agent, agent_tools, agent_chat, proposals_store" \
        && echo "✓ Python modules import cleanly"
    @if [ -d applescripts ]; then \
        ok=1; \
        for f in applescripts/*.applescript; do \
            if [ -f "$$f" ]; then \
                osacompile -o /tmp/dustpan-asc-check.scpt "$$f" 2>/dev/null \
                    && rm -f /tmp/dustpan-asc-check.scpt \
                    || { echo "✗ AppleScript fails to compile: $$f" >&2; ok=0; }; \
            fi; \
        done; \
        if [ "$$ok" = "1" ]; then echo "✓ AppleScript library compiles"; else exit 1; fi; \
    fi
```

Output when green:

```
✓ AppleScript syntax OK
✓ bin/xcc references look correct
✓ Python modules import cleanly
✓ AppleScript library compiles
```

## The "rebrand sweep" lesson, formalized

When you rename anything — a file, an env var prefix, a package name, a brand string — the rename is the easy 10% of the work. The hard 90% is finding every consumer that referenced the old name.

**Process:**

1. `grep -rn "<old-name>" --include="*.py" --include="*.ts" --include="Makefile" --exclude-dir=node_modules --exclude-dir=.git`
2. For each hit: is this a literal name that needs updating, or a historical reference (CHANGELOG, plan files, GitHub URL that wasn't renamed)?
3. Update the active literals. Leave the historical references alone.
4. **Add a `make check` assertion** that pins the consumer to the new name. So next time the consumer breaks, CI catches it within seconds.

The DustPan PR `v0.25.4-rebrand-sweep` is the worked example.

## When `make check` should fail the build

- Any referenced file missing
- Consumer script doesn't grep-match the current canonical name
- AppleScript / Python / TS doesn't compile
- A new library entry was added without its doc

When green is when the project is shippable.

## Invocation

- "Use **make-check-defense-in-depth**."
- "Extend `make check` so it catches the v0.21.0-style silent regression class."
- "Audit this Makefile for missing CI assertions."
- "Why is our CI green when the install is broken?"

## Reference implementation

DustPan's [`Makefile`](https://github.com/marvelousempire/dustpan/blob/main/Makefile) `check` target. Original bug discovery in [`v0.25.4-rebrand-sweep`](https://github.com/marvelousempire/dustpan/pull/61). The lesson distilled in the PR body and the commit message.
