---
name: virtual-list-framer-motion
id: SK-0141
keywords: [tanstack-virtual, framer-motion, motion, translateY, blank-list, stacked-rows]
goal: Virtualized React lists stay visible when using Motion — transform on the positioning layer, opacity-only inside.
hash: claude-archive-2026-05
relations: [post-sse-via-fetch-readablestream]
before: []
governed_by: [global]
meta: dynamic
description: >-
  Fix blank or stacked virtual lists when TanStack Virtual and Framer Motion
  share one element. Motion's x/y animation overwrites translateY used for
  row positioning. Use a plain wrapper for translateY; animate opacity only, or
  drop virtualization under ~5k rows. Also covers claude-chat-reader Docker dev
  overlay when localhost:3000 shows empty UI after prod rebuild. Triggers on
  "virtual list blank", "conversations page empty", "all rows stacked",
  "translateY motion conflict", "tanstack virtual framer", "docker compose
  port 3000 not working".
---

# Virtual list + Framer Motion — keep translateY on a plain wrapper

TanStack Virtual positions rows with `position: absolute` and `transform: translateY(offset)`. Framer Motion also uses `transform` for `x`, `y`, and `scale`. **One element cannot hold both** — Motion wins and every row renders at `translateY(0)`, so titles stack or the list looks empty (opacity stuck at 0).

## When to use this skill

- Long list renders blank but the server shows the correct count (e.g. "286 shown")
- All virtual rows overlap in one band at the top of the scroll area
- You combined `@tanstack/react-virtual` with `motion/react` enter animations
- claude-chat-reader `/conversations` after Docker prod rebuild with no `ports: 3000:3000`
- The user says "virtual list broken with motion" or "conversations page not working"

## The pattern (correct)

**Outer div** — virtualizer owns position (never pass through Motion):

```tsx
<div
  className="absolute left-0 right-0"
  style={{
    top: 0,
    height: virtualRow.size,
    transform: `translateY(${virtualRow.start}px)`,
  }}
>
  {/* Optional: opacity-only fade — no x/y/scale on this wrapper */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
    className="h-full"
  >
    <Link href={href} className="flex h-full items-center ...">
      ...
    </Link>
  </motion.div>
</div>
```

**Headers** — same rule: `translateY` on a plain `motion.div`, no Motion on that node.

## Simpler escape hatch (< ~5k rows)

Skip virtualization. Use a scroll container + `map()`:

```tsx
<div className="surface overflow-y-auto" style={{ maxHeight: "min(72vh, 800px)" }}>
  {rows.map((row) => (/* header | link */))}
</div>
```

claude-chat-reader uses this for ~300 conversations — fast enough, no transform fights.

## Anti-patterns

- ❌ `initial={{ opacity: 0, x: -6 }}` on the same node that has `style={{ transform: translateY(...) }}`
- ❌ `motion.div` with `layout` on virtual rows (layout also competes with absolute positioning)
- ❌ Assuming `pnpm dev` hot reload fixed Docker **production** `app` — prod image must be rebuilt

## claude-chat-reader Docker (same incident)

| Symptom | Cause | Fix |
|---------|--------|-----|
| Blank list, count correct | Old prod bundle + UI bug above | Fix component; rebuild or use dev overlay |
| `localhost:3000` connection refused | `app` only `expose: 3000` (Caddy on 443) | Dev overlay publishes port |

```bash
cd ~/Developer/claude-chat-reader
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build app
# http://localhost:3000 — live mount + port map
```

Production-only:

```bash
docker compose up -d --build app caddy
# https://localhost/conversations
```

## Verification

1. Page shows N rows matching server count (not one glitched stack).
2. Scroll reveals distinct clickable rows.
3. Browser devtools: row wrappers have different `transform: translateY(...)` values.

## What this is NOT for

- General Motion best practices (see emil-design-eng / app-launch-workflow)
- Infinite scroll pagination architecture
- Server-side list filtering (separate concern)

## Invocation

- "Use **virtual-list-framer-motion**."
- "Fix tanstack virtual list with motion"

## Reference implementation

- Fix: `marvelousempire/claude-chat-reader` → `src/components/conversations-list.tsx` (plain scroll list, May 2026)
- Tech stack: [`skills/engineering/tech-stacks/claude-archive-living-ingest.md`](../tech-stacks/claude-archive-living-ingest.md)
