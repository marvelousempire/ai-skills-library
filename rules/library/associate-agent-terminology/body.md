---
name: associate-agent-terminology
id: RL-0006
keywords: [enforce-associate, check-agent, build-terminology]
goal: Deliver associate agent terminology output correctly and completely.
hash: 1a72fe5
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Associate Agent Terminology

All user-facing copy, code comments, and documentation in You-Sir Juan™ must use the correct terminology. Violations cause confusion in marketing, inconsistency in the product, and re-work across every surface.

## The canonical terms

| Correct | Never use | Context |
|---|---|---|
| **Associate Agent** | butler, chatbot, persona, assistant | The AI companion paired with a member |
| **Associate** | butler, bot, agent (alone) | Short form in UI copy |
| your Associate | your butler, your bot | Possessive form in UI |
| Sterling / Blake / Cipher / Sovereign | any other name | The four founding agent names |
| family member | user (in copy) | The humans in the household |
| paradigm | theme, skin, profile | The per-member visual world |
| voice turn | chat, message | A single exchange |
| memory | history, logs, data | The persistent relationship store |

## Where this rule applies

- All `api/src/personas.js` agent definitions
- iOS: every user-facing string in Views
- Web: every user-facing string in app/
- README.md and all docs/marketing/ files
- CLAUDE.md orientation docs
- Agent briefing prompts when spawning background agents

## How to enforce

Before any PR that touches copy or terminology:
```bash
grep -r "butler\|personal agent\|your bot\|chatbot" apps/ api/src/ docs/ README.md
```
Any match is a violation. Fix before merge.

## Why it matters

"Butler" positions the product as a service. "Associate Agent" positions it as a relationship. The distinction is the entire product thesis — a private AI that belongs to the family, shaped by the family. Every slip back to "butler" dilutes that.
