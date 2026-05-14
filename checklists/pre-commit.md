# Pre-commit checklist

Run before every `git commit`. One screen, top to bottom.

## All commits

- [ ] `git status --short` — only files you intended to change?
- [ ] `git diff --staged` — eyeball the diff; no debugging code, no console.logs, no `// TEMP`
- [ ] No `.env`, no credentials, no secret keys (the cross-worktree hook usually catches but check anyway)
- [ ] Stage by explicit path: `git add path/to/file1 path/to/file2` (no `git add -A`, no `git add .`, no `git add -u`)

## Migration commits

- [ ] Filename prefix matches `bash scripts/either-host/next-migration-number.sh` output (run RIGHT before commit)
- [ ] Feature IDs in seed migrations match `bash scripts/either-host/next-feature-id.sh` + safety margin
- [ ] `ALTER TYPE` statements OUTSIDE the BEGIN/COMMIT block
- [ ] Every FK column's type matches the parent's id type (grep `CREATE TABLE.*<parent>`)
- [ ] `is_public=TRUE` on every new plan insert
- [ ] Every INSERT has `ON CONFLICT DO NOTHING` or `DO UPDATE` for idempotency
- [ ] Paren balance: `python3 -c "s=open('FILE').read(); print(s.count('('), s.count(')'))"`
- [ ] Header comment explains intent + scope + what's NOT in here

## Multi-surface commits

- [ ] CHANGELOG.md entry with Eastern timestamp
- [ ] Feature Ledger.md mirror updated if a feature row status changed
- [ ] Affected `package.json` versions bumped per CLAUDE.md rule 15
- [ ] iOS: `project.pbxproj` registration if a new Swift file was added
- [ ] No `swift-codable-guard` failures if a Codable model was touched

## Commit message

- [ ] Conventional prefix (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- [ ] Subject line < 70 chars
- [ ] Body explains WHY, not just WHAT
- [ ] `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer
- [ ] Use HEREDOC for multi-line bodies (matches the project's commit pattern)
