# What makes a good skill

The four-gate filter. Every skill candidate must pass all four before filing.

---

## Gate 1 — Scope: does it apply beyond this project?

If the pattern only makes sense for one specific codebase, it belongs in that repo's docs — not the global library. The global library is for primitives that transfer.

✅ "Allowlist + hard-deny path validator for AI agent FS access" — works for any AI agent
❌ "How to add a new route to DustPan's server.py" — too specific to one file in one project

## Gate 2 — Trigger: is it narrow enough?

The frontmatter `description` must not fire on every "improve" task. If the skill would load for "make this better," it's too broad.

✅ Triggers on "POST endpoint with SSE", "EventSource won't work with POST"
❌ Triggers on "streaming", "real-time", "events" (too broad — overlaps everything)

Test: could you write 5 specific phrases a user would say that SHOULD load this skill and 5 they'd say that should NOT? If the "should not" list is empty, the trigger is too broad.

## Gate 3 — Substance: does it contain concrete code?

Skills with only principles don't help. The user needs something they can paste and run. A skill that says "always validate paths" is useless. A skill with the actual Python `validate_peek_path()` function is valuable.

✅ Contains: the actual implementation, or a complete template, or a runnable checklist
❌ Contains: only advice — "make sure to test edge cases"

## Gate 4 — Origin: was it learned the hard way?

The best skills name the specific bug, failure, or friction that triggered them. This tells future readers WHEN the skill matters — not just what it does, but what world it's the solution for.

✅ "Originated from bin/xcc still using `XCODE_CLEANUP_*` env vars 65 days after the rebrand — because `make check` only checked syntax, not consumer references"
❌ No origin story — just a best practice that seemed sensible

---

## What makes a skill great vs mediocre

| Dimension | Mediocre | Great |
|---|---|---|
| Trigger | Broad — fires on "improve this" | Narrow — fires on 3-5 specific phrases |
| Substance | Principles only | Working code or paste-ready template |
| Origin | No story | Names the exact bug/moment that originated it |
| Anti-patterns | None | Lists 3+ specific wrong approaches |
| Scope | Vague | "Not for X" section prevents misuse |
| Reference | No link | Points to the real-world repo + file that demonstrates it |

---

## The eight sections every skill should have

1. **Frontmatter** — `name`, `description` with trigger phrases (the AI reads this to decide when to load)
2. **Tagline** — one sentence under the H1 that names the failure mode it prevents
3. **When to use** — specific trigger conditions, including exact phrases
4. **The mechanism** — named after what it teaches (not "How it works"), with actual code
5. **What this is NOT for** — prevents scope creep and misuse
6. **Anti-patterns** — the wrong approaches with `❌` prefix and brief reason
7. **Invocation** — how to explicitly trigger this skill by name
8. **Reference implementation** — link to the real-world working example

---

## Filing checklist

- [ ] Passes all four gates (scope / trigger / substance / origin)
- [ ] Has all eight sections
- [ ] Frontmatter `name` is kebab-case, matches the folder name
- [ ] Frontmatter `description` includes 4-6 specific trigger phrases
- [ ] Contains runnable code or a paste-ready template (not just advice)
- [ ] Names the specific origin moment
- [ ] Has at least 3 anti-patterns
- [ ] Links to a real-world reference implementation
- [ ] Runs through `validate-skill-frontmatter.py` — OK
