# Lead Sheet — order of operations for any mindset in this folder

```
┌─ The 11-step runbook ─────────────────────────────────────────────────┐
│                                                                        │
│  1.  Listen for the analogy             ← what real-world product?    │
│  2.  Diagram first                       ← ASCII box, fenced text     │
│  3.  Cite the precedent                  ← Apple / Linear / Figma     │
│  4.  Identify what executes              ← shell / URL / state-only   │
│  5.  Build in vertical order             ← data → component → wire → │
│                                            skin override → animation │
│  6.  Strict lint + build verify          ← exit-code check, not pipe │
│  7.  Smoke test if possible              ← curl, click, screenshot   │
│  8.  Atomic commit with full message     ← what + why + branch + PR  │
│  9.  Push to feature branch              ← never main                │
│  10. Bump version + changelog            ← Eastern timestamp to sec  │
│  11. Append journal modification         ← intention doc, why-line   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

Apple recipe-card idiom — every numbered step is necessary and the order matters.

Follow this every time you apply any mindset captured in this folder. The lead sheet IS the discipline; the mindset is the flavor.

---

## 1. Listen for the analogy

When the operator asks for something, the *first* thing they almost always do is point to a real-world product or hardware metaphor. **Don't paraphrase — extract.**

- "like Apple Cmd+Tab" → not just "a switcher" — Cmd+Tab semantics specifically (commit on click, revert on Esc, anchor LED on origin).
- "MPC pad" → not just "a button grid" — hardware producer gestalt (bezels, gradient, LCD glow).
- "Dockyard can do it" → not "make it work" — match Dockyard's architecture (Python server fronting shell).

**If the analogy isn't named, ask before designing.** A wrong analogy is the most expensive mistake in this folder.

## 2. Diagram first

Per the [`ui-design-diagram-first`](../../../../rules/library/ui-design-diagram-first/body.md) rule: every UI proposal opens with a Unicode ASCII box-and-arrow diagram inside a fenced ```` ```text ```` block, before any prose.

Concrete zone labels. Compact symbols where they help (`☀` `🌙` `◐` `▶` `ⓘ` `⚙` `●`). No "Box A" placeholders.

## 3. Cite the precedent

After the diagram, a single sentence (one to three) naming a real-world product as the design vocabulary's source: *"matches Apple System Settings"*, *"Linear-style segmented control"*, *"Cmd+Tab semantics"*, *"Akai MPC chassis idiom"*.

Two consequences:
- The operator can approve in one read (precedent = shared vocabulary).
- The vocabulary stays consistent across the operator's whole stack (no agent-invented patterns).

## 4. Identify what executes

Before writing any component, classify the new surface:

| Class | What it does | Security model |
|-------|--------------|----------------|
| **State-only** | Updates `useState`, persists to `localStorage`, sets DOM attribute | None — no exec |
| **URL open** | Calls `@tauri-apps/plugin-shell` `open(url)` (Tauri) or `window.open` (browser) | Just an opener — safe |
| **Whitelisted shell** | Runs `bash scripts/<bucket>/<kind>.sh` via Tauri `invoke(...)` OR FastAPI `POST /<bucket>/<kind>` | Whitelist in Rust + Python — frontend never passes a path |
| **Native API** | WebGPU, getUserMedia, etc. — browser/Tauri APIs | Browser sandbox + permission prompts |

**Whitelisted shell is the only class that needs lockstep maintenance.** Adding a new shell-exec button = touching four places (script file, Rust whitelist, Python whitelist, frontend catalog).

## 5. Build in vertical order

```
┌─ Vertical build order ──────────────┐
│  ① types / data (catalog, schema)    │
│  ② component (presentation)          │
│  ③ wiring (App.tsx, callbacks)       │
│  ④ skin overrides (CSS per data-skin)│
│  ⑤ animation (transitions, keyframes)│
└──────────────────────────────────────┘
```

Why this order: each layer depends on the one above. Trying to animate before the component renders, or override skins before the component has classes to target, produces churn and wasted commits. Top-down is uniquely cheap.

## 6. Strict lint + build verify

```bash
pnpm --filter @automata/pad-desktop run lint; lint_exit=$?; \
if [ "$lint_exit" -ne 0 ]; then exit 1; fi && \
pnpm --filter @automata/pad-desktop run build 2>&1 | tail -6
```

**Never** pipe lint to `tail` and trust the exit code — `tail` always exits 0 and masks real failures. Use `$?` capture + explicit check. (Learned the hard way this session — shipped a broken commit because of a pipe-to-tail.)

For Rust: `cd src-tauri && cargo check`. For Python: `python -c "import api.main"`.

## 7. Smoke test if possible

If the change is observable, observe it before committing:

- **HTTP endpoint** → `curl -sS` it. Show the response body in the commit message.
- **UI button** → click it in the live window. Confirm the LCD shows the expected output.
- **Skin swap** → cycle to it via the HUD. Confirm the layout transforms.
- **WebGPU effect** → toggle it. Confirm the canvas updates.

A working smoke test is the difference between "claims to work" and "verified working." The operator's standard is the latter.

## 8. Atomic commit with full message

One logical change per commit. Commit message body explains *why*, not just *what*. Use heredoc (per the operator's CLI rules):

```bash
git commit -m "$(cat <<'EOF'
feat(pad): <one-line subject>

<paragraph explaining the why + the operator's request that triggered it>

<details — file paths, behavior changes, test plan>

<branch / PR reference if applicable>
EOF
)"
```

## 9. Push to feature branch

Never commit on `main`. Branch `feature/<short-slug>` from `origin/main`. Push after every commit so it lives on the remote (defense against lost work). Don't bundle 10 commits and push once.

## 10. Bump version + changelog

Per [`changelog-and-versioning`](../../../../rules/library/changelog-and-versioning/body.md):

- Bump `package.json` + `Cargo.toml` (the surface that changed).
- Add a new top section to `docs/CHANGELOG.md`:
  ```
  ## [0.x.y] — YYYY-MM-DD HH:MM:SS Eastern · *short tagline*
  ```
- US-Eastern timestamp to the second. Get it with `TZ=America/New_York date '+%Y-%m-%d %H:%M:%S Eastern'`.

## 11. Append journal modification

Per the journal/intentions convention: the **original plan** section of the active intention doc is frozen after first write. Every plan change goes into the **Modifications** section as an append-only entry: `YYYY-MM-DD · what changed · why`.

The journal doc is the source of truth for *how we got here*. The changelog is the source of truth for *what shipped*. Both matter.

---

## When to deviate from the lead sheet

Never deviate without saying so out loud. If a step doesn't apply (e.g. step 4 for a pure CSS-only commit), call it out: *"Step 4 N/A — CSS-only change, no exec."* The lead sheet is non-negotiable; the steps within it can be N/A if and only if you name them.

## What this lead sheet is NOT

- It's not a code template. The mindset captured in each subfolder gives flavor — the lead sheet gives discipline.
- It's not a substitute for the [`ui-design-diagram-first`](../../../../rules/library/ui-design-diagram-first/body.md) rule. The diagram-first habit is INSIDE step 2; the rule still fires.
- It's not optional. Steps 1–11 happen every time, in order.
