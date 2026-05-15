# Tech stack — Claude Archive UI (Next.js + virtual lists)

**Witness repo:** [marvelousempire/claude-chat-reader](https://github.com/marvelousempire/claude-chat-reader)

## Conversations list

| Topic | Doc / file |
|-------|------------|
| List component | `src/components/conversations-list.tsx` |
| Virtual list + Motion gotcha | AISL skill [`virtual-list-framer-motion`](../virtual-list-framer-motion/SKILL.md) (SK-0141) |
| Docker dev (port 3000) | `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d app` |

## Rule

Do not combine TanStack Virtual `translateY` with Motion `x`/`y` on the same DOM node.
