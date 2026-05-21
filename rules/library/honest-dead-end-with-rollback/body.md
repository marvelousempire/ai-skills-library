---
name: honest-dead-end-with-rollback
id: RL-0025
hash: d17c032
keywords: [enforce-honest, check-dead, build-end]
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver honest dead end with rollback output correctly and completely.
---

When evaluating a tool / library / plugin / approach that doesn't fit, **surface the dead-end honestly with a concrete rollback path** — don't pretend it works, don't bury the gap, and don't silently keep the inert install around taxing future sessions.

The pattern has three parts:

1. **Name the gap precisely.** Not "this didn't work" — say *what* doesn't work *for which use case*, with citations. ("Ruflo Path A doesn't register the MCP server; the federation skill body's `npx -y @claude-flow/cli@latest ruflo-federation init` is sandbox-blocked; the `federation` skill's call to `mcp__claude-flow__memory_store` resolves to nothing because the MCP isn't installed.")

2. **Give the rollback command.** Not "you can uninstall it" — give the literal command(s). ("`claude plugin uninstall ruflo-core ruflo-federation && claude plugin marketplace remove ruflo`.")

3. **Recommend the next step.** Not "let me know what you want" — pick one and explain the tradeoff in one sentence. ("My recommendation: bail. Federation is for cross-machine trust boundaries; our pain is two repos on one machine — markdown ledger is working. Revisit when a 3rd machine or 3rd developer enters the rotation.")

The user's call is always next. But the call needs to be informed, not "decide whether this is salvageable."

## Examples

✅ Correct — "Path A as installed is a paper tiger for our use case. It registers a marketplace and exposes skills, but every skill body says 'now run this `npx -y @claude-flow/cli@latest ...`' — sandbox-blocked. ~628 always-on tokens/session. To rollback: `claude plugin uninstall ruflo-core ruflo-federation`. Recommendation: bail. Revisit when [conditions]."

❌ Wrong — "Ruflo seems hard to use, want to try something else?"

❌ Wrong — silently leaving inert installs in place because "the user might want to try later"
