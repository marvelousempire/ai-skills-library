# FORENSIC INVESTIGATION RULE

Whenever the operator asks for a formal investigation, a forensic case, Ground Zero, or a cross-surface bug that needs proof before a fix, you must open or continue a case folder and follow the forensic-case-investigation skill. You must not treat chat as the only record.

Whenever you work in the Red-E Play monorepo (or any product repo that uses `docs/investigations/`), you must put case evidence under `docs/investigations/<case-slug>/` with the standard files and `log/` transactions.

Whenever you are about to ship a fix from an investigation, you must pass the Two-Question Test (mechanism + regression) and log the result in the case folder before merging.

**What you must do**

- Declare the case slug (`<topic-kebab>-<YYYY-MM-DD>`).
- Create or update `docs/investigations/<case-slug>/` with at least: `README.md`, `000-ground-zero.md` (immutable), `001-charter.md`, `002-hypothesis-ledger.md`, and `log/` entries per transaction.
- Run the full procedure from the skill: `vendor/ai-skills-library/skills/methodology/forensic-case-investigation/SKILL.md` (or the same path in the ai-skills-library checkout).
- For each step: write Intent before acting, Product and validation after, and link `parent_transaction_id` so the trail walks backward to Ground Zero.
- Before calling a fix “done,” confirm live version when the bug is on production (see live-version-before-debug in product repos).
- Use `docs/diagnosis/` only for short pipeline incident writeups — not for full forensic cases.

**Why we want it done this way**

- Chat disappears; the case folder is the durable truth for operators and the next agent.
- Cross-surface bugs (iOS vs API vs DB vs deploy) need exhibits, not guesses.
- Fixes without mechanism proof waste deploy cycles and repeat the same failure.

**What will go wrong if you do not follow it**

- The team loses chain of custody and re-investigates the same symptom.
- A plausible story ships without proof; prod stays broken or regresses elsewhere.
- Ground Zero gets edited and the original symptom is lost.

**What good result we get when you follow it correctly**

- Anyone can open `docs/investigations/<slug>/` and see status, hypotheses, and logs.
- Fixes cite mechanism and verification commands in the case folder.
- Post-ship audits have a grep-traceable trail from intake to merge.

**Correct examples**

- Open `docs/investigations/stats-big-shot-marv-2026-05-20/` with `000-ground-zero.md`, ledger, and `log/2026-05-20T0015Z-T0002-specimen-and-code-trace.md`.
- README points at `forensic-case-investigation` skill; T0003 log records API curl output before a schema fix PR.
- Mechanism sentence + regression note in the log before `gh pr merge`.

**Incorrect examples**

- Long investigation thread in chat only — no `docs/investigations/` folder.
- Editing `000-ground-zero.md` after new facts arrive (append a new log instead).
- Merging a fix because “CI is green” without live version check or case log update.
- Using `docs/diagnosis/` for a multi-day cross-surface case that needs a hypothesis ledger.

Is there any part of this rule that you do not understand?

## Technical reference

| Layer | Location |
|-------|----------|
| **Commandment (this file)** | `AI_AGENT_RULES/FORENSIC_INVESTIGATION_RULE.md` |
| **Procedure (Skill)** | `skills/methodology/forensic-case-investigation/` in [ai-skills-library](https://github.com/marvelousempire/ai-skills-library) |
| **Case artifacts (product repo)** | `docs/investigations/<case-slug>/` — see `docs/README.md` § Conventions in red-e-play-app |
| **Short incident doc** | `docs/diagnosis/` + `diagnosis-report` skill — not a substitute for a full case |

**Red-E Play example case:** `docs/investigations/stats-big-shot-marv-2026-05-20/`.

-----
