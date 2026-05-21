---
name: sidebar-nav-dual-list
id: RL-0052
hash: b6f8c5d
keywords: [enforce-sidebar, check-nav, build-dual]
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver sidebar nav dual list output correctly and completely.
---

# Sidebar nav dual-list antipattern — one source of truth

When a codebase has a hardcoded sidebar component (`sidebar.tsx`) AND a
separate nav-config file (`admin-nav.ts`), they drift apart silently. New
routes get added to one but not the other. The config file drives search,
breadcrumbs, and the "more" overlay; the sidebar component is a completely
separate hardcoded list. Both must be in sync — and without a guard, they
never are.

---

## The failure mode

The config file (`admin-nav.ts`) drives search + breadcrumbs; the sidebar
component (`sidebar.tsx`) is a completely separate hardcoded list. Three or
more separate nav items can be added to the config file but never appear in
the sidebar. The user sees correct breadcrumbs and search results, but the
sidebar link is missing — so the page is only reachable via direct URL or
search.

---

## The rule

Any project with a sidebar must have ONE source of truth. Either:

**(a) Dynamic sidebar** — the sidebar component reads `admin-nav.ts` and
renders from the config. Adding a route to the config is sufficient; no
sidebar edit required.

**(b) Static sidebar with a CI guard** — the sidebar stays hardcoded but a
script compares its hrefs against the config file's hrefs and fails CI if
they differ.

Until one of these is implemented:

**Every new route MUST be added to BOTH the config file AND the sidebar
component in the same PR, atomically.**

---

## Diagnosis

```bash
# Extract hrefs from config:
grep -oE "href: '[^']+'" admin/lib/admin-nav.ts | sort > /tmp/nav-config.txt

# Extract hrefs from sidebar:
grep -oE 'href="[^"]+"' admin/components/layout/sidebar.tsx | sort > /tmp/nav-sidebar.txt

# Find routes in config but not sidebar:
diff /tmp/nav-config.txt /tmp/nav-sidebar.txt
```

Any line in the config-only side is a missing sidebar link.

---

## Long-term fix

Convert the sidebar to read from the nav config:

```tsx
import { adminNavSections } from "@/lib/admin-nav";

export function Sidebar() {
  return (
    <nav>
      {adminNavSections.map((section) =>
        section.items.map((item) => (
          <SidebarLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </SidebarLink>
        ))
      )}
    </nav>
  );
}
```

One data source. One update. No drift.

---

## First seen

Red-E Play admin dashboard, 2026-05-14. Partnerships, Creator Applications,
and 7 other routes were in `admin-nav.ts` but missing from `sidebar.tsx`.
All were reachable via search; none were visible in the sidebar.
