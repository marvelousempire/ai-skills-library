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
