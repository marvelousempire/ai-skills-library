---
name: multi-surface-auth-redirect
id: RL-0026
keywords: [enforce-multi, check-surface, build-auth]
goal: Deliver multi surface auth redirect output correctly and completely.
hash: 42eddcd
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Multi-surface auth redirect

## The rule

Marketing pages that have functional equivalents on the player-web (app)
surface **must** redirect signed-in users to the player-web surface. A
signed-in user landing on the marketing homepage has no use for a signup
pitch — they should land in their app home immediately.

---

## Which pages must redirect

| Page | Reason |
|---|---|
| Homepage (`/`) | Pure acquisition surface — useless to existing users |
| Login page (`/login/`) | User is already authenticated; re-auth is friction |
| Any "sign up / join" CTA page | Same as login |

**Do NOT redirect** from pages where signed-in users have legitimate reasons
to visit: news, leaderboard, features, docs, public profiles (`/p/[id]/`),
changelog, learn. These are informational and sharable; forcing a redirect
there breaks link-sharing.

---

## The pattern (Next.js App Router RSC)

```tsx
// app/page.tsx (homepage)
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { playerWebUrl } from "@/lib/site-origins";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(playerWebUrl("/"));

  // ... rest of page
}
```

```tsx
// app/login/page.tsx — fix the common mistake of redirecting to /account/
// (marketing surface) instead of the player-web home
export default async function LoginPage({ searchParams }: ...) {
  const user = await getCurrentUser();
  if (user) redirect(playerWebUrl("/"));   // ← player web, not "/account/"

  // ... Apple Sign In UI
}
```

---

## Why page-level, not middleware

Using Next.js `middleware.ts` for auth redirects has a seductive simplicity:
one function, no per-page logic. But it creates problems:

1. **Middleware can't call the backend** — it runs on the edge and can only
   inspect cookies. You can check whether `rp_session` exists but not whether
   it's valid. A user with an expired session gets redirected to the app, which
   then bounces them back to marketing login — a redirect loop.
2. **Middleware applies broadly** — it's easy to accidentally redirect users
   away from news, changelog, and public profile pages where they have a reason
   to be.

Page-level `getCurrentUser()` calls the backend, gets a definitive yes/no,
and the scope is explicit. The per-page cost (one API call) is acceptable
because the marketing homepage is low-traffic relative to the app.

---

## The `playerWebUrl()` helper

`playerWebUrl(path)` in `lib/site-origins.ts` handles the split-deploy:

```ts
// Production: NEXT_PUBLIC_PLAYER_WEB_ORIGIN=https://me.readyplay.app
// → returns "https://me.readyplay.app/"
playerWebUrl("/")

// Dev (env var not set)
// → returns "/" (same host, single-server mode works fine)
playerWebUrl("/")
```

Never hardcode `https://me.readyplay.app` in a redirect. Always go through
`playerWebUrl()` so dev and production both work.

---

## Common mistake: redirecting to `/account/` on the marketing surface

The marketing site has an `/account/` route for account management. When
fixing the "already signed in" case on the login page, the obvious shorthand
is `redirect("/account/")`. This is wrong — it stays on the marketing surface.
The user should land in the player-web home where their game history, feed,
and community context live.

```tsx
// ❌ Wrong — keeps user on marketing surface
if (user) redirect("/account/");

// ✅ Right — sends user to player web
if (user) redirect(playerWebUrl("/"));
```

---

## Related rules

- [`parallel-surfaces-from-day-one`](parallel-surfaces-from-day-one.mdc) — the architecture that makes this rule necessary
- [`go-live-path`](go-live-path.mdc) — smoke-test the redirect works on the live URL after deploy
