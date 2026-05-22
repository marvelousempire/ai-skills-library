# CHECKLIST — filling in this recipe folder

You (the receiving AI) landed here because the operator pointed you at this
folder and asked you to "build me a live dashboard like the Nephew Control
Tower one." This checklist is the order of operations. Follow it top to bottom.

Estimated total: ~30–45 min for a skilled agent. Most of the work is
reading the canonical references and producing faithful copies — there
is no novel design to invent here.

---

## Stage 0 — Orient (5 min)

- [ ] Read `SKILL.md` in this directory. That's the contract — what the
      pattern is, when it fires, the six primitives.
- [ ] Read `README.md` for the one-paragraph summary.
- [ ] Read `PROMPT.md` if the operator handed it to you — it has the
      verbatim trigger and the success criteria.
- [ ] Confirm you have read access to the canonical Nephew repo at
      `~/Developer/nephew/` (or its github.com origin). Every file in
      this recipe references a canonical sibling there.

## Stage 1 — Fill in the starter primitives (10 min)

The primitives library is ~470 LoC total across two files. You will copy
the canonical bodies verbatim — DO NOT re-derive them from the SKILL.md
prose. The canonical files are the source of truth.

- [ ] **`starter/live-dashboard.tsx.template` → `starter/live-dashboard.tsx`**
      Read the canonical body at:
      `~/Developer/nephew/apps/control-tower/src/lib/live-dashboard.tsx`
      Copy it verbatim into `starter/live-dashboard.tsx` (drop the
      `.template` extension). Confirm it exports: `useLivePoll`,
      `<AnimatedNumber>`, `<MeterBar>`, `<Sparkline>`, `<LiveDot>`,
      `<LiveTile>`, plus the `LivePollOpts` and `LivePollResult` types.

- [ ] **`starter/os-chrome.tsx.template` → `starter/os-chrome.tsx`**
      Read the canonical body at:
      `~/Developer/nephew/apps/control-tower/src/lib/os-chrome.tsx`
      Copy verbatim. Confirm it exports: `<OSPill>`, `<AboutModal>`,
      `<OSChrome>` (composite), plus the `AboutInfo` and `Health` types.

- [ ] **`starter/package-deps.md`** — already concrete. No fill-in
      needed. Just confirm the target repo has these 5 deps installed
      (react, react-router-dom, vite, typescript, tailwindcss). If
      missing, run `pnpm add` accordingly.

## Stage 2 — Build the reference page (10 min)

- [ ] **`starter/ExampleCard.tsx.template` → `starter/ExampleCard.tsx`**
      Read the canonical reference impl:
      `~/Developer/nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx`
      Genericize it into a minimal example that:
      - Uses all four hooks/primitives (`useLivePoll`, `AnimatedNumber`,
        `MeterBar`, `Sparkline`, `LiveDot`, `LiveTile`)
      - Renders OSChrome top-left
      - Has a fake fetcher returning a small JSON shape with one numeric
        metric (so the example runs without a backend)
      - Includes prominent comments naming each primitive's purpose

The point of ExampleCard is to be a 100-line distillation that an AI
or human reading this folder for the first time understands without
needing to also read the full DustpanSummaryPage.

## Stage 3 — Copy the worked examples (5 min)

These two files are the production cards Nephew CT ships. Copy them
verbatim (no genericization) so future readers can see the pattern at
two different domains.

- [ ] **`examples/disks-card.tsx.template` → `examples/disks-card.tsx`**
      Verbatim copy of
      `~/Developer/nephew/apps/control-tower/src/pages/DustpanSummaryPage.tsx`.

- [ ] **`examples/processes-card.tsx.template` → `examples/processes-card.tsx`**
      Verbatim copy of
      `~/Developer/nephew/apps/control-tower/src/pages/DustpanProcessesPage.tsx`.

## Stage 4 — Apply the rules (5 min)

Per `nephew/.claude/rules/version-bump-and-changelog.md`:

- [ ] Bump `package.json` version in `ai-skills-library` (or the host
      repo) if any version file exists. If not (AISL has no top-level
      version), add an entry to `CHANGELOG.md`.
- [ ] Add a `CHANGELOG.md` entry covering this fill-in, dated with
      Eastern time, listing every file you created.

Per `nephew/.claude/rules/rule-propagation-discipline.md`:

- [ ] Confirm the skill mirror still exists at
      `ai-skills-library/.claude/rules/live-dashboard-pattern.md` and
      `ai-skills-library/.cursor/rules/live-dashboard-pattern.mdc`. If
      missing, copy from `nephew/.claude/rules/live-dashboard-pattern.md`.

## Stage 5 — Ship (5 min)

- [ ] `git add` each file by explicit path (no `git add -A`).
- [ ] Commit with a message naming this fill-in as a recipe rollout.
- [ ] Push to `origin` and `gitlab` (where present).
- [ ] Open a PR.

## Stage 6 — Verify by handing the folder back

- [ ] Open `PROMPT.md` and read it as if you were a third AI receiving
      this folder fresh. Could you build the pattern in a new repo from
      this folder alone? If yes, the recipe is portable. If no, identify
      the gap and add it to PROMPT.md or to the templates.

---

## Cross-references

- **Rule (canonical):** `~/Developer/nephew/.claude/rules/live-dashboard-pattern.md`
- **Rule (mirror here):** `ai-skills-library/.claude/rules/live-dashboard-pattern.md`
- **Skill body:** `ai-skills-library/skills/methodology/live-dashboard-pattern/SKILL.md`
- **Breakthrough writeup:** `~/Developer/nephew/docs/breakthroughs/2026-05-22-live-dashboard-pattern.md`
- **Operator memory entry:** `~/.claude/projects/-Users-averygoodman-Developer/memory/feedback_live_dashboards.md`

## What "done" looks like

This folder, when filled in correctly, lets the operator open ONE path
in ANY agent and say: "build me a live dashboard card following this
recipe." The agent reads CHECKLIST.md, follows it, and ships the same
pattern with no further operator hand-holding.

If you fill this in and the next AI session can NOT do that, the
fill-in is incomplete.
