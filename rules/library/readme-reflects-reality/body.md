# README Reflects Reality

Every README in the repo must describe the current built state, not an aspirational or historical state. A README that documents the wrong port, wrong member names, or lists deferred work as "not done yet" when it's already built is an active liability — it misleads every future agent, developer, and installer.

## The failure modes this rule prevents

**Stale member names:** `apps/README.md` documented "Avery, Morgan, Jordan" long after we changed to "Avery Goodman, Robert Bobby, NIVRAM, Yousir Juan." Every future agent reading that README would seed the wrong data.

**Wrong port:** `apps/README.md` said `localhost:4001` after we aligned everything to `4000`. Every developer who followed that doc got a connection refused error and wasted time debugging.

**Lying "not done yet" list:** A "What MVP does NOT do" section that listed things already built (Ollama, WebSocket, RealityKit) made the project look less capable than it was and confused future build planning.

## The rule

After any session that changes: member names, ports, service URLs, built features, file structure, or terminology — update the affected README files in the same commit, or in an immediate follow-up commit before the next PR.

## Checklist before any PR

```
[ ] README.md: does it describe what actually runs?
[ ] apps/README.md: are member names, ports, and built features correct?
[ ] Any "not done yet" list: does it only contain truly unbuilt things?
[ ] File map: does it include new files created this session?
[ ] Environment variable table: are all new vars documented?
```

## How to audit

```bash
# Check for old member names
grep -r "Morgan\|Jordan" apps/README.md README.md docs/ 2>/dev/null

# Check for port inconsistencies
grep -r "4001\|localhost:3001" apps/README.md apps/yousirjuan-web/next.config.ts 2>/dev/null

# Check for "butler" terminology
grep -r "butler" apps/README.md README.md docs/ 2>/dev/null
```
