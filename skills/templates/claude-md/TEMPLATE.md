# CLAUDE.md — [Project Name]

This file is read by Claude Code at the start of every session.

---

## What this repo is

[2-3 sentences: what the project is, what surfaces it has, what it does]

**Source of truth:** [org/repo]
**Skills library:** `vendor/ai-skills-library/` (submodule — do not copy, reference in place)

---

## Skills library

```
vendor/ai-skills-library/
```

| What you need | Read this first |
|---|---|
| Which tool to use for any task | `vendor/ai-skills-library/docs/[project]-platform-skills-master.md` |
| Full skill index | `vendor/ai-skills-library/SKILL-INDEX.md` |
| Agent routing rules | `vendor/ai-skills-library/AGENTS.md` |
| Code style rules | `vendor/ai-skills-library/rules/` |

### Quick routing

| Task | Use |
|---|---|
| [task type] | [tool/pattern] |

---

## Key repo files

| File | Purpose |
|---|---|
| `README.md` | Product vision |
| `plans/` | Build roadmaps |
| `docs/marketing/` | Per-feature marketing docs |
| `.env.example` | All environment variables |

---

## [Product-specific members / agents / paradigms]

[Table of the key entities that all sessions need to know]

**Terminology rule:** [Any critical terminology constraints]

---

## Running the system

```bash
# [Surface 1]
[command]

# [Surface 2]
[command]

# Tests
[command]
```

---

## Hardware targets

| Tier | Hardware |
|---|---|
| Floor | [minimum] |
| Ceiling | [maximum] |

---

## Submodule hygiene

```bash
git submodule update --init --recursive
cd vendor/ai-skills-library && git checkout main && git pull
cd ../.. && git add vendor/ai-skills-library && git commit -m "chore(vendor): bump ai-skills-library"
```

---

## Commit convention

`feat:` · `fix:` · `chore:` · `docs:` · `refactor:` · `test:`
