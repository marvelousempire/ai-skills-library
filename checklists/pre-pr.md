# Pre-PR Checklist — You-Sir Juan OS

Run before opening any PR. Catches the most common session-end failures.

## Terminology
```bash
grep -r "butler\|Morgan\|Jordan\|personal agent\|chatbot" apps/ api/src/ docs/ README.md 2>/dev/null
# Expected: no output
```

## Port consistency
```bash
grep -rn "4001\|localhost:4001" api/ apps/ docs/ README.md 2>/dev/null
# Expected: no output
```

## README accuracy
```
[ ] apps/README.md: member names are Avery Goodman / Robert Bobby / NIVRAM / Yousir Juan
[ ] apps/README.md: port is 4000, not 4001
[ ] apps/README.md: "What MVP does NOT do" only lists truly unbuilt things
[ ] README.md: no "private butler" anywhere (should be "Associate Agent")
```

## Secrets check
```bash
grep -rn "SESSION_SECRET=change-me\|sovereign" .env 2>/dev/null
# .env should have real values, not defaults
# .env should NOT be staged: git diff --staged -- .env (expect nothing)
```

## Staged files — explicit paths only
```bash
git status --short
# Never: git add -A or git add .
# Always: git add path/to/specific/file
```

## Build verification
```bash
pnpm test       # Jest: all tests passing
cd apps/yousirjuan-web && pnpm build 2>&1 | tail -5   # BUILD succeeded
```

## Commit message format
```
feat: [description]
fix: [description]
chore: [description]
docs: [description]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
