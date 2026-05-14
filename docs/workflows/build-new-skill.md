# Workflow — build a new skill

End-to-end from "I want to build X" to "X is on `main` and discoverable."

## 1. Decide

- [ ] Does the work touch > 2 files, change architecture, or affect > 50 lines? → Plan first.
- [ ] Pick a family (`marketing`, `infra`, `visual`, `ide`, `external`, `project`, `mobile`, `engineering`, `methodology`).
- [ ] Pick a slug (kebab-case, no version numbers).

## 2. Plan

Write the plan per [`plan-naming.md`](../standards/plan-naming.md):

```sh
cp docs/templates/PLAN.md.template ~/.claude/plans/<slug>.md
# Fill in: Context, Goals, Tasks, Critical files, Verification, Recovery
```

## 3. Tag a recovery point

```sh
git -C ~/Developer/ai-skills-library tag -a "pre-<slug>-$(date +%Y-%m-%d)" origin/main -m "Recovery before <slug>"
git -C ~/Developer/ai-skills-library push origin "pre-<slug>-$(date +%Y-%m-%d)"
```

## 4. Scaffold

Use the templates:

```sh
mkdir -p skills/<family>/<slug>/{templates,references}
cp docs/templates/SKILL.md.template skills/<family>/<slug>/SKILL.md
touch skills/<family>/<slug>/README.md
```

If the skill ships containers:

```sh
cp docs/templates/docker-compose.with-labels.yml.template skills/<family>/<slug>/docker-compose.yml
```

If the skill ships a Makefile-driven service:

```sh
cp docs/templates/Makefile.template skills/<family>/<slug>/Makefile
cp docs/templates/doctor.sh.template skills/<family>/<slug>/scripts/doctor.sh
chmod +x skills/<family>/<slug>/scripts/doctor.sh
```

If the skill ships a web UI:

```sh
cp docs/templates/server.ts.template skills/<family>/<slug>/server.ts
cp docs/templates/single-page-ui.html.template skills/<family>/<slug>/index.html
```

## 5. Fill in content

- Frontmatter (per [`frontmatter.md`](../standards/frontmatter.md))
- SKILL.md sections: When to use · How it works · Invocation · Verification · Pairing · yousirjuan alignment
- README.md sections: Quick start · Architecture · What lives where

## 6. Cross-reference (per [`cross-reference.md`](../checklists/cross-reference.md))

- `SKILL-INDEX.md` (count + row)
- `README.md` (root)
- `skills/<family>/README.md`
- `docs/yousirjuan-*.md` if anchored

## 7. Verify (per [`verification-gates.md`](../standards/verification-gates.md))

```sh
bash scripts/check-skill-count.sh
bash scripts/lint-skill-frontmatter.sh
bash scripts/check-cross-references.sh
```

All exit 0.

## 8. Commit + merge + push (per [`ship.md`](../checklists/ship.md))

```sh
git add -A skills/<family>/<slug>/ SKILL-INDEX.md README.md skills/<family>/README.md
git commit -m "feat(<family>/<slug>): <one-line>"
git push origin HEAD

# Merge into main:
git -C ~/Developer/ai-skills-library checkout main
git -C ~/Developer/ai-skills-library merge --no-ff -m "Merge: <skill>" claude/<branch>
git -C ~/Developer/ai-skills-library push origin main
```

## 9. After-ship audit (per [`after-ship-audit.md`](../checklists/after-ship-audit.md))

```sh
cp docs/templates/gap-audit.md.template docs/improvement/audits/$(date +%Y-%m-%d)-<slug>.md
# Run the gap + elevation pass, file it.
```

## 10. Update the session report

```sh
# Either start a new one or append to today's:
cp docs/templates/session-report.md.template docs/reports/$(date +%Y-%m-%d)-<topic>.md
```

## Anti-patterns

- Skipping the plan ("just a small change") for substantive work
- Skipping the recovery tag (no rollback path)
- Skipping cross-references (drift accumulates)
- Skipping the audit (gaps evaporate; we re-derive them next session)
