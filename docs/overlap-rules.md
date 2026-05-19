# Overlap rules

When more than one skill matches your wording, the model **does not** run a guaranteed priority queue — it **interprets**. These rules are **for you** (and optional `.cursor/rules` in a project) so behavior is predictable.

## Default precedence (suggested)

1. **Explicit name wins** — If you say “use **ui-ux-pro-max**,” that skill should drive the answer for the part you scoped.
2. **Split by artifact type**
   - **Data / tables / interactive panel** → **canvas** first, then optional **ui-ux-pro-max** for visual polish in a second pass.
   - **Marketing copy** → copywriting skill (when installed) first; **ui-ux-pro-max** for layout, typography, hierarchy — not for brand voice unless you ask.
   - **Ship status / git / PR** → **verify-ship** (Claude) or ad-hoc git (Cursor) — say **verify-ship** on Claude to force the playbook.
3. **Tool boundary** — Skills under **`~/.claude/skills`** apply to **Claude Code** sessions; **`~/.cursor/skills*`** apply to **Cursor** agent. Same task on different tools may need the same *idea* but different invocations.

## Template you can paste

> Use **&lt;skill-a&gt;** for &lt;scope-a&gt;. Use **&lt;skill-b&gt;** only for &lt;scope-b&gt;. Do not blend conflicting advice.

## Optional: encode in a repo

In a codebase, add `.cursor/rules/skills-precedence.mdc` with project-specific overrides.

## Engineering rebrands

- **Repo/product fork:** Use **fork-rebrand-product** when the work includes a fork, package identity, repo remotes, attribution, compatibility fallbacks, docs, and verification.
- **Local token cleanup:** Use **bulk-rename-tokens** when the work is only a scoped string/path rename inside an existing product boundary.

## Doctrine / PRD documentation sorting

- **Full sort (renumber + dedupe + folders):** **doctrine-decanter-sorting-agent** — use when the dump has repeated PRD drafts, overlapping bibles, and the user wants non-doubles at the top and duplicates moved to the bottom with clear spacing.
- **Split only:** **prd-journal-page-splitter** — page folders and section files without the full renumber/dedupe/archive pass.
- **Session lessons, not file layout:** **skill-nutrients-decanter** — net-positive learnings into the library; not PRD folder explosion.

> Use **doctrine-decanter-sorting-agent** for structure + dedupe. Use **prd-journal-page-splitter** only when you explicitly do not need renumbering or bottom cleared zones.

## Marketing bundle (coreyhaines31/marketingskills)

- **Foundation:** `product-marketing-context` — run or refresh before big marketing passes when upstream skills chain context.
- **Copy vs layout:** **copywriting** / **copy-editing** own words; **page-cro** / **form-cro** own conversion structure; **ui-ux-pro-max** owns visual system / patterns when you want design-database output — say which is primary.
- **CRO family:** signup-flow-cro vs onboarding-cro vs paywall-upgrade-cro — scope by *funnel stage* in your prompt so one skill leads.
