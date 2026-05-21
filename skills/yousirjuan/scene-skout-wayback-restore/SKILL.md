---
name: scene-skout-wayback-restore
id: SK-0128
keywords: [run-scene, check-skout, build-wayback]
hash: 3a23c9f
relations: []
before: []
governed_by: [global]
meta: dynamic
  - scene-skout
  - wayback
  - restore website
  - web.archive.org
  - archive-reviver
  - SKOUT
goal: Press, shred, and repurpose legacy sites from Wayback; route cabinet_targets to apps/cabinet-kitchen.
domain: yousirjuan
status: Active
tool: Cursor
description: >
  Scene Skout presses Wayback mirrors, shreds SKOUT reports (CMS layers, cabinet_targets),
  repurpose via Vite rebuilds. Cabinet Kitchen vault: scene-skout/apps/cabinet-kitchen/.
  Bishop archive-reviver is staff; cabinet-kitchen is employee. Nephew routes to scene-skout first.
---

# Scene Skout Wayback Restore

## Hierarchy

```
Nephew → scene-skout (manager) → archive-reviver (staff)
```

## When to use

- Dead site / Wayback calendar URL
- Need **styled** local static mirror + auditable SKOUT receipt

## Canonical CLI (Scene Skout repo)

```bash
cd /Users/nivram/Developer/scene-skout
make redesign-wzm
# or stepwise:
make list-days HOST=wonderzoomedia.com
make restore-day HOST=wonderzoomedia.com DAY=20121125
make rebuild CAPTURE=SKOUT-... HOST=wonderzoomedia.com
cd rebuilds/SKOUT-... && make ui
```

Bishop: `make wayback-redesign-wzm` from `bishop/` (delegates to Scene Skout).

Output: `captures/SKOUT-*/<host>/` + `docs/reports/SKOUT-*.json` + optional `rebuilds/SKOUT-*/` Vite app.

**Cabinet Kitchen** (intake approved kits):

```bash
cd /Users/nivram/Developer/scene-skout/apps/cabinet-kitchen
make api
curl -s http://127.0.0.1:39810/api/v1/intake-queue
```

Application law: `scene-skout/AI_AGENT_RULES/APPLICATION_STRUCTURE.md`

Use `--day YYYYMMDD` (or `make restore-day`) so all URLs come from one archive day. Use `--latest` only when you explicitly want the newest day per URL collapsed globally.

## Bishop staff

`archive-reviver` only calls Scene Skout CLI via `bishop/core/scene_skout_cli.py`.

## DRY

All mirror logic: `scene-skout/lib/wayback/` only.

## Supersedes

`wayback-site-reviver` skill (Bishop archive-reviver as sole owner) — use this skill instead.
