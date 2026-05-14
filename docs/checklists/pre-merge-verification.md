# Checklist — pre-merge verification

Run before every `gh pr merge`. Everything here must be green before the squash lands on main.

---

## TypeScript (if applicable)
- [ ] `pnpm tsc --noEmit` → no output (clean)
- [ ] No `any` types added without justification

## Build
- [ ] `pnpm --filter @[package]/web build` → `✓ built in X.XXs`
- [ ] Bundle size didn't jump unexpectedly (check gzip output)

## Quality gate
- [ ] `make check` → all assertions pass:
  - `✓ AppleScript syntax OK`
  - `✓ CLI references correct`
  - `✓ Python modules import cleanly`
  - `✓ AppleScript library compiles`

## Python (if server changed)
- [ ] `cd web && python3 -c "import server, cleaners, ai"` — no errors
- [ ] Any new module imports added to `make check`

## Smoke test (if new endpoint or UI added)
- [ ] Start the server (`make ui`) — loads without error
- [ ] The new feature is reachable at its expected URL / tab
- [ ] No console errors in the browser

## Version
- [ ] `kVersion` in `dustpan.applescript` bumped if behavior changed
- [ ] All `package.json` versions synced to match

## PR body
- [ ] Title starts with `vX.Y.Z:`
- [ ] Body has: What it is / What ships / How to verify
- [ ] No placeholder text left in the body

## Merge
- [ ] Merge via `--squash` (not `--merge`, not `--rebase`)
- [ ] After merge: run `confirm-ship-clearly` — show all four receipts
