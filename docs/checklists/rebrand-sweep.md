# Checklist — rebrand / rename sweep

Run this whenever you rename: a file, an env var prefix, a package name, a CLI command name, or a product brand string.

The lesson: the v0.21.0 DustPan rebrand (`xcode-cleanup.applescript → dustpan.applescript`, `XCODE_CLEANUP_* → DUSTPAN_*`) took 30 minutes to rename. Finding and fixing all consumers took **65 days** because there was no checklist.

---

## Before renaming

- [ ] List every consumer of the old name: `grep -rn "<old-name>" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.sh" --include="Makefile" --exclude-dir=node_modules --exclude-dir=.git`
- [ ] Classify each hit: **active consumer** (must update) vs **historical reference** (CHANGELOG, plan files, GitHub URLs — leave alone)
- [ ] For each active consumer, note the file + line number

## After renaming

### Files + source code
- [ ] The old filename no longer exists (`ls <old-path>` → not found)
- [ ] The new filename exists and is correct
- [ ] Every grepped consumer has been updated to the new name
- [ ] Env var names updated in: shell scripts, AppleScripts, Makefiles, `.env.example`, docs

### Makefile targets
- [ ] Every `make <target>` in the Makefile that references the renamed thing points to the new name
- [ ] Running `make <most-used-target>` doesn't say "Nothing to be done" (which means the target body is missing)
- [ ] `make help` still shows all expected targets

### CI assertions (add NEW assertions to prevent this class of regression)
- [ ] Add a `make check` assertion that greps for the NEW name in any consumer script:
  ```sh
  grep -q '<new-name>' path/to/consumer-script \
    || { echo "✗ consumer-script has stale references" >&2; exit 1; }
  ```
- [ ] Run `make check` and confirm all assertions pass

### Package names (if applicable)
- [ ] `package.json` `name` field updated in root + all workspace packages
- [ ] `pnpm` workspace references updated
- [ ] Import paths in TypeScript/JavaScript files updated

### Docs + README
- [ ] README's "Quick start" section uses the new name
- [ ] README's "Every command explained" section updated
- [ ] CHANGELOG entry noting the rename (for users who will be confused)

### CLI wrappers
- [ ] CLI wrapper script (e.g. `bin/xcc`) references the new script name
- [ ] CLI wrapper script uses the new env var prefix
- [ ] `xcc --version` (or equivalent) returns the correct version

## Final verification

- [ ] `make check` passes all assertions (includes the new consumer-script grep)
- [ ] `pnpm tsc --noEmit` clean (if TypeScript project)
- [ ] `pnpm build` succeeds
- [ ] Run the primary user workflow end-to-end (e.g. `make ui` + open the dashboard)
- [ ] Commit all changes in a single "rebrand sweep" commit with a detailed message naming every file changed
