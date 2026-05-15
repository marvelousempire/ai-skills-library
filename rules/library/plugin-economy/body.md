---
name: plugin-economy
keywords: [plugin-economy, document-installed-plugins, token-cost-honesty]
goal: When an agent's spec promises capabilities backed by upstream plugins or external packages, the dependency MUST be documented in the agent's spec AND its token cost MUST be stated. No silent installs, no architectural fictions.
relations: [add-agent-to-skills-library]
before: []
governed_by: [global]
meta: dynamic
---

# Plugin economy — installed dependencies are documented, not hidden

## When this fires

Any time an agent in `agents/` documents capabilities (a swarm, a federation, an MCP server, a tool registry) that aren't actually shipped IN the agent's own pointer file — meaning the capability is backed by an upstream plugin, a marketplace install, an `npx` package, or any external dependency that has to be installed for the agent's spec to be honest.

## What it says

Three obligations.

### 1 · Name the dependency in the agent's spec

The agent's `agents/<name>.md` must include a section (typically "My infrastructure" or "Engine note") listing every plugin / marketplace / external package its spec depends on. For each:

- The upstream source (e.g. `ruvnet/ruflo`, the npm package name, the GitHub repo)
- The install command (e.g. `claude plugin install ruflo-core@ruflo`)
- The role it plays in the agent's dispatch (e.g. "provides 4 of the 5 native swarm agents — researcher / coder / reviewer / witness-curator")
- Whether the plan is to keep it long-term or replace it (e.g. "current engine until nephew publishes its own `nephew-core` plugin")

### 2 · State the token cost

Every plugin has an always-on token cost. Find it with:

```bash
claude plugin details <name>
# Look for "Projected token cost — Always-on: ~N tok"
```

Sum the always-on tokens across all dependencies and state the total in the agent's spec AND in the consuming project's `STACK.md` "What's shipped today" table. This makes the cost legible. The user is allowed to disagree with the tradeoff; they are not allowed to be surprised by it.

### 3 · No silent installs

A plugin installed at user-scope without being documented is a debt. If you find one (e.g. via `claude plugin list`), one of two things must happen in the same session:

- **Document it** — add the section above to the relevant agent's spec, plus the cost row in STACK.md.
- **Uninstall it** — `claude plugin uninstall <name>` and remove any references. Note the removal in `docs/improvement/decision-records/`.

There is no third path. "Leave it and figure it out later" is how libraries accumulate unowned overhead.

## Examples

✅ Correct: `agents/nephew.md` "My infrastructure" section names `ruflo-core@ruflo` + `ruflo-federation@ruflo` as the current engine for the native swarm, lists the ~628 token total, and notes the future swap plan when nephew ships its own marketplace.

❌ Wrong: nephew's spec promises `@nephew-core:researcher / coder / reviewer / witness-curator` and `@nephew-federation:federation-coordinator` without documenting that these are actually `ruflo-core` and `ruflo-federation` plugins under the hood — silently making the spec depend on an external install no one knows is there.

## Cross-references

- Rule: [`rules/library/add-agent-to-skills-library/body.md`](../add-agent-to-skills-library/body.md) — the pointer-not-replica counterpart. Together they govern the full plugin economy.
- Standard: [`docs/standards/orchestration-hierarchy.md`](../../../docs/standards/orchestration-hierarchy.md) — Engine note section.
- Decision: filed in `docs/improvement/decision-records/` whenever a plugin is added or removed.

## Origin

Codified after the 2026-05-14 brokerage-make-shim-docker-colima session. We installed `ruflo-core` + `ruflo-federation` mid-session as a Path A evaluation of upstream Ruflo, then bailed and built our own scheduled scripts (port-drift). The plugins stayed installed at user scope. The session's gap audit flagged this as "Elevation H — uninstall Ruflo plugins, ~628 tokens/session." That recommendation was architecturally wrong: those plugins ARE the engine nephew's spec promises (5 of 5 swarm agents). This rule exists so the next agent we add doesn't accumulate the same kind of silent dependency.
