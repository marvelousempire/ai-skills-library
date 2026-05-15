---
name: admin-completeness-audit
description: "Audit whether an admin page or nav route is fully wired up across all required layers. Use when the user asks: 'check if admin page is wired up,' 'why doesn't the nav show,' 'admin route missing,' 'menu item not appearing,' 'admin page exists but I can't navigate to it,' 'new admin section not in sidebar,' 'admin search doesn't find the route,' 'breadcrumbs broken on admin page,' 'admin feature missing.' Runs a structured 5-step audit across nav config, sidebar, backend endpoint, TypeScript types, and API helper, then generates a remediation list."
metadata:
  version: 1.0.0
---

# Admin Completeness Audit

You are auditing an admin page or route to confirm it is fully wired up
across all required layers. Missing any one layer makes the feature partially
broken — reachable by URL but invisible in navigation, or visible but without
data, or with data but without proper breadcrumbs.

---

## Step 1 — Nav config vs sidebar diff

Run a diff between the hrefs in the nav config and the hrefs in the sidebar:

```bash
# Extract hrefs from nav config (adjust path as needed):
grep -oE "href: '[^']+'" admin/lib/admin-nav.ts | sed "s/href: '//;s/'//" | sort > /tmp/nav-config.txt

# Extract hrefs from sidebar component:
grep -oE 'href="[^"]+"' admin/components/layout/sidebar.tsx | sed 's/href="//;s/"//' | sort > /tmp/nav-sidebar.txt

# Routes in config but NOT in sidebar (the bug):
comm -23 /tmp/nav-config.txt /tmp/nav-sidebar.txt

# Routes in sidebar but NOT in config (orphaned sidebar links):
comm -13 /tmp/nav-config.txt /tmp/nav-sidebar.txt
```

For every route missing from the sidebar: add it in the correct section with
the correct icon and label.

For every orphaned sidebar link: verify the page exists or remove the link.

---

## Step 2 — Backend API endpoint

For each admin page that displays data, verify the backend route exists:

```bash
grep -rn "router.get.*admin" backend/src/routes/admin.js | grep -i "ROUTE_KEYWORD"
```

If the endpoint is missing, add it. The endpoint must:
- Use `requireAdmin` or equivalent middleware
- Return data in the shape the frontend TypeScript interface expects
- Include all fields displayed on the page

---

## Step 3 — TypeScript interface and API helper

For each admin page, verify:

```bash
# TypeScript interface exists:
grep -n "interface.*Player\|type.*Player" admin/lib/types.ts | head -10

# API helper function exists:
grep -n "fetchPlayerAdmin\|getAdminPlayer\|FUNCTION_NAME" admin/lib/api.ts
```

The helper must:
- Use `fetchJSON` (not raw `fetch`) for consistent error handling
- Match the field names in the TypeScript interface
- Map snake_case DB fields to camelCase TypeScript fields

---

## Step 4 — Page component check

For each admin page:

```bash
# Page file exists at the right path:
ls admin/app/(dashboard)/ROUTE_PATH/page.tsx

# All serializer fields are displayed:
# List the fields in formatPlayer / the API serializer:
grep -oE "(\w+):" backend/src/routes/admin.js | sort > /tmp/serializer-fields.txt
# List the fields referenced in the page component:
grep -oE "player\.\w+" admin/app/(dashboard)/players/\[id\]/page.tsx | sort -u > /tmp/page-fields.txt
# Fields in serializer but not displayed on page:
comm -23 /tmp/serializer-fields.txt /tmp/page-fields.txt
```

Any field in the serializer but not on the page is a gap.

---

## Step 5 — Pre-merge checklist

Before opening the PR, verify all of the following:

- [ ] Backend API endpoint exists and returns correct shape
- [ ] TypeScript interface defined in `admin/lib/types.ts`
- [ ] API helper function in `admin/lib/api.ts` using `fetchJSON`
- [ ] Next.js server component page at correct path
- [ ] Route added to `admin/lib/admin-nav.ts` (search + breadcrumbs)
- [ ] Route added to `admin/components/layout/sidebar.tsx` in correct section
- [ ] Route added to `admin/components/layout/more-hood-overlay.tsx` (mobile)
- [ ] Height displayed as `5′9″` not `69"` (use `formatHeight()` from lib)
- [ ] `admin/package.json` version bumped
- [ ] `backend/package.json` version bumped if backend changed
- [ ] CHANGELOG entry written
- [ ] Deploy triggered and smoke-tested at the live admin URL

---

## Output format

```
AUDIT RESULTS for [admin route or page name]:

Missing from sidebar: [list of routes]
Missing backend endpoint: [list of routes]
Missing TypeScript type: [list of fields]
Missing API helper: [list of functions]
Missing page renders: [list of fields]
Missing from nav config: [list of routes]

REMEDIATION (ordered by priority):
1. [highest impact gap — typically sidebar or backend]
2. [next gap]
...
```

---

## Related rules

- `sidebar-nav-dual-list` — one source of truth for nav
- `format-measurements-for-display` — never show raw inches
- `shared-util-extraction` — formatters belong in lib/
