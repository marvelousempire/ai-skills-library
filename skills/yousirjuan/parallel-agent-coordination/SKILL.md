---
name: parallel-agent-coordination
id: SK-0130
keywords: [run-parallel, check-agent, build-coordination]
goal: Deliver parallel agent coordination output correctly and completely.
hash: a4c73fd
relations: []
before: []
governed_by: [global]
meta: dynamic
domain: yousirjuan
status: Active
tool: Claude Code
description: >
  Split large builds across independent background agents by surface (iOS, web, backend),
  brief each agent with full terminology + member context up front, and coordinate via
  system reminder notifications. Eliminates sequential bottlenecks on multi-surface work.
---

# Parallel Agent Coordination

## When to use

Any session where work on iOS, web, and backend is independent and can be parallelized. The pattern in this session: iOS agent (background) + web agent (background) + main thread (backend + infra) ran simultaneously and produced ~10× more output than sequential execution.

## The pattern

```
Main thread: backend, docker, infra, terminology enforcement, git
  ↓ simultaneously ↓
Background agent A: iOS (apps/yousirjuan-ios/ ONLY)
Background agent B: web (apps/yousirjuan-web/ ONLY)
```

## Critical briefing elements

Every background agent prompt must contain:

### 1. Terminology rules (copy-paste these)
```
Terminology — USE THROUGHOUT:
- Associate Agents (NOT "butlers", NOT "personas")
- Short form: "Associate" or "your associate"
- Never: "butler", "personal agent", "chatbot"
```

### 2. All 4 family members (every time)
```
| userId | Full name | Role |
|---|---|---|
| u_avery | Avery Goodman | principal |
| u_bobby | Robert Bobby | partner |
| u_nivram | NIVRAM | architect |
| u_yousirjuan | Yousir Juan | founder |
```

### 3. Strict file scope boundary
```
iOS agent: ONLY touch apps/yousirjuan-ios/
Web agent: ONLY touch apps/yousirjuan-web/
```
Overlap causes hook conflicts and file clobbering.

### 4. Build verification step
```
After writing files:
1. Run xcodegen generate (iOS) or pnpm build (web)
2. Fix any compile errors
3. Report final build result
```

## What to watch for

- **System reminder notifications** tell you what background agents are changing in real time. Read them — they prevent you from editing the same file.
- **Terminology drift**: if an agent wrote "Morgan" or "butler" despite the briefing, catch it in a verification pass and fix with a targeted Edit.
- **Port/API URL drift**: brief agents with the correct port (`4000`) and API URL; agents default to what they see in existing code.

## Post-agent verification pass

After both agents complete, run:
```bash
grep -r "butler\|Morgan\|Jordan\|4001" apps/ 2>/dev/null
# Should return nothing
```

## Inputs
- List of gaps/elevations to implement per surface
- Terminology rules
- Full member registry
- File scope boundary per agent
- Build verification command

## Outputs
- iOS BUILD SUCCEEDED (or error report + fix)
- Web BUILD SUCCEEDED (or error report + fix)
- Terminology-clean codebase
- All features implemented per spec

## Related rules
- `associate-agent-terminology`
- `readme-reflects-reality`
