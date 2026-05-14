# AI Skills Library

**Private repo** — `marvelousempire/ai-skills-library`

This repository is the portable AI skills shelf for agent skills, Cursor/Claude rules, marketing skills, design skills, project skills, external tool bridge skills, and the copied You-Sir Juan platform skills map.

Master platform planning lives in:

```text
marvelousempire/yousirjuan
```

This repo is where the reusable skill copies live.

---

# What This Repo Is For

Use this repo to:

- browse available AI skills
- install skills into Cursor projects
- keep Claude/Cursor rules in sync
- reuse marketing and design skills
- document platform-specific skills
- track external tools and repo integrations
- act as a lightweight AI-readable skills guide

Think of it as:

> a poor-man's RAG shelf for AI skills, tools, and operating rules.

---

# Fast Navigation

| Need | Open |
|---|---|
| Full You-Sir Juan platform skills taxonomy | [`docs/yousirjuan-platform-skills-master.md`](docs/yousirjuan-platform-skills-master.md) |
| Every skill file and pack | [`skills/README.md`](skills/README.md) |
| Quick all-skill index | [`SKILL-INDEX.md`](SKILL-INDEX.md) |
| Marketing skills catalog | [`skills/marketing/SKILL-CATALOG.md`](skills/marketing/SKILL-CATALOG.md) |
| Marketing skills by category | [`skills/marketing/CATEGORIES.md`](skills/marketing/CATEGORIES.md) |
| Cursor skills catalog | [`skills/ide/cursor/SKILL-CATALOG.md`](skills/ide/cursor/SKILL-CATALOG.md) |
| UI/UX Pro Max skill | [`skills/visual/design/ui-ux-pro-max/SKILL.md`](skills/visual/design/ui-ux-pro-max/SKILL.md) |
| **SEEME** — AI diagram generator | [`skills/visual/diagrams/seeme/SKILL.md`](skills/visual/diagrams/seeme/SKILL.md) · [`README`](skills/visual/diagrams/seeme/README.md) |
| **Self-hosted Git** (GitLab CE + CI) | [`skills/infra/self-hosted-git/SKILL.md`](skills/infra/self-hosted-git/SKILL.md) · [`README`](skills/infra/self-hosted-git/README.md) |
| Red-E Play project skills | [`skills/project/red-e-play/README.md`](skills/project/red-e-play/README.md) |
| ReadyPlay context | [`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md) |
| External tool bridge skills | [`skills/external/SKILL-CATALOG.md`](skills/external/SKILL-CATALOG.md) |
| Rules pipeline | [`rules/README.md`](rules/README.md) · [`docs/rules-pipeline.md`](docs/rules-pipeline.md) |
| Install into another repo | [`docs/cursor-project-skills.md`](docs/cursor-project-skills.md) |
| Related GitHub projects | [`docs/related-github-projects.md`](docs/related-github-projects.md) |
| Third-party licenses | [`THIRD_PARTY.md`](THIRD_PARTY.md) |

---

# AI Skill Families

## 01 — Marketing Skills

**Purpose:** turn product ideas, pages, campaigns, offers, and positioning into clearer sales and growth assets.

**Use when:** the task involves landing pages, SEO, CRO, messaging, positioning, product launch, copy, funnels, or audience research.

| Resource | What It Covers |
|---|---|
| [`skills/marketing/SKILL-CATALOG.md`](skills/marketing/SKILL-CATALOG.md) | full marketing skill catalog |
| [`skills/marketing/CATEGORIES.md`](skills/marketing/CATEGORIES.md) | marketing skills grouped by category |

Outputs:

- landing page copy
- SEO content
- positioning
- campaign angles
- CRO notes
- product messaging
- launch assets

---

## 02 — Design & UI Skills

**Purpose:** improve visual quality, UI structure, layout, hierarchy, components, and premium polish.

**Use when:** the task involves interface design, website sections, dashboards, app screens, user experience, or frontend polish.

| Resource | What It Covers |
|---|---|
| [`skills/visual/design/ui-ux-pro-max/SKILL.md`](skills/visual/design/ui-ux-pro-max/SKILL.md) | UI/UX Pro Max skill for premium layout and UX guidance |
| [`docs/yousirjuan-platform-skills-master.md`](docs/yousirjuan-platform-skills-master.md) | broader design stack: AwesomeDesign, 21st.dev, Framer Motion, shadcn/ui, Tailwind, Magic UI, Aceternity |

Outputs:

- polished UI screens
- visual hierarchy guidance
- component recommendations
- dashboard layouts
- landing page structure
- motion and interaction direction

---

## 03 — Cursor & IDE Skills

**Purpose:** make the coding environment smarter and more repeatable.

**Use when:** the task involves Cursor, repo setup, codegen, babysitting tasks, canvas workflows, project skill installs, or IDE automation.

| Resource | What It Covers |
|---|---|
| [`skills/ide/cursor/SKILL-CATALOG.md`](skills/ide/cursor/SKILL-CATALOG.md) | Cursor skill pack catalog |
| [`docs/cursor-project-skills.md`](docs/cursor-project-skills.md) | install repo skills into a Cursor project |
| [`scripts/install-repo-skills-to-cursor-project.sh`](scripts/install-repo-skills-to-cursor-project.sh) | copies this library into another repo's `.cursor/skills/` |

Outputs:

- project-local Cursor skills
- repeatable IDE workflows
- repo-specific AI tooling
- coding task helpers

---

## 04 — Claude / Agent Rules

**Purpose:** keep AI agent behavior consistent across Claude, Cursor, and project environments.

**Use when:** the task involves rules, agent behavior, coding style, repo discipline, or syncing instructions.

| Resource | What It Covers |
|---|---|
| [`rules/README.md`](rules/README.md) | canonical rules library |
| [`docs/rules-pipeline.md`](docs/rules-pipeline.md) | how rules are generated and synced |
| [`scripts/generate-agent-rules.py`](scripts/generate-agent-rules.py) | generates agent rules |
| [`scripts/sync-rules-into-repo.sh`](scripts/sync-rules-into-repo.sh) | syncs rules into a repo |

Outputs:

- Cursor `.mdc` rules
- Claude-readable rules
- consistent agent behavior
- reusable operating guidance

---

## 05 — Project Skills

**Purpose:** hold project-specific skills and context for private apps or products.

**Use when:** the task involves ReadyPlay, You-Sir Juan, or another project that needs custom AI behavior.

| Resource | What It Covers |
|---|---|
| [`skills/project/red-e-play/README.md`](skills/project/red-e-play/README.md) | Red-E Play project skills |
| [`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md) | ReadyPlay positioning and product context |
| [`docs/yousirjuan-platform-skills-master.md`](docs/yousirjuan-platform-skills-master.md) | You-Sir Juan platform skills master copy |

Outputs:

- project-aware behavior
- project marketing alignment
- app-specific skill usage
- feature/platform context

---

## 06 — External Tool Bridge Skills

**Purpose:** document and expose external tools in a way agents can understand.

**Use when:** the task involves connecting skills to outside tools, CLIs, APIs, or generated bridge manifests.

| Resource | What It Covers |
|---|---|
| [`skills/external/SKILL-CATALOG.md`](skills/external/SKILL-CATALOG.md) | generated external bridge skills |
| [`docs/external-tools.manifest.json`](docs/external-tools.manifest.json) | machine-readable external tool manifest |
| [`scripts/generate-external-tool-skills.py`](scripts/generate-external-tool-skills.py) | generates bridge skills |
| [`scripts/link-external-skills-to-claude.sh`](scripts/link-external-skills-to-claude.sh) | links bridge skills to Claude workflows |

Outputs:

- external tool descriptions
- bridge skill files
- tool manifests
- AI-readable integration references

---

## 07 — You-Sir Juan Platform Skills

**Purpose:** mirror the You-Sir Juan ecosystem map into this library so AI agents can browse one clean skill guide.

**Use when:** the task involves You-Sir Juan architecture, AI tools, media systems, voice systems, infrastructure, hardware, repo integrations, or platform planning.

| Resource | What It Covers |
|---|---|
| [`docs/yousirjuan-platform-skills-master.md`](docs/yousirjuan-platform-skills-master.md) | clean domain taxonomy for all You-Sir Juan tools and skills |

Domains inside that guide:

| Domain | Purpose |
|---|---|
| Coding Intelligence | Claude Code, Continue.dev, Aider, OpenHands, coding models |
| Model Runtime | Ollama, vLLM, Open WebUI, NVIDIA NIM, TensorRT |
| Retrieval & Memory | RAG Anything, Qdrant, embeddings, vector databases |
| Browser & Web | Playwright CLI, Firecrawl, Browser-use |
| Design & Frontend | UI/UX Pro Max, AwesomeDesign, 21st.dev, Framer Motion |
| Media Intelligence | Higgsfield, Seedance, ComfyUI, Flux, LivePortrait |
| Voice & Speech | Whisper, Piper, Kokoro, ElevenLabs, Coqui TTS |
| Productivity | GWS, Gmail, Calendar, Docs, Sheets |
| Evaluation | DeepEval, Promptfoo, Playwright Tests, Sentry |
| Infrastructure | Docker, PostgreSQL, Redis, WireGuard, nginx, Caddy, Terraform |
| Governance | Git, GitHub, **GitLab CE (skill ready: [`self-hosted-git`](skills/infra/self-hosted-git/))**, runners, artifacts |
| Hardware | MacBook Pro M5 Max, Mac mini M4 Pro, DGX Spark, Jetson Thor |

Outputs:

- platform planning
- AI-readable skill routing
- tool selection guidance
- repo integration map
- model/hardware routing guidance

---

## 08 — Visual Diagrams (SEEME)

**Purpose:** turn any text — prose, code, JSON, meeting notes, a one-line idea — into a clean Unicode box-and-arrow diagram, automatically.

**Use when:** the task involves "diagram this," "explain visually," "show me how X talks to Y," generating architecture pictures, flowcharts, sequence diagrams, or teaching diagrams that copy-paste cleanly into Notion / GitHub / docs.

```text
   ┌──────────────┐   ┌──────────────────┐   ┌──────────────┐   ┌──────────┐
   │   input      │──►│   provider       │──►│  lint loop   │──►│ diagram  │
   │  prompt/CLI/ │   │  Ollama default  │   │  ≤ 3 retries │   │ stdout   │
   │  MCP/UI      │   │  + cloud APIs    │   │  5 rules     │   │ + SVG    │
   └──────────────┘   └──────────────────┘   └──────────────┘   └──────────┘
                              │                      ▲
                              │ system prompt        │ targeted fix prompt
                              ▼                      │ on lint failure
                      ┌──────────────────────────────┴─┐
                      │  ascii-flow-diagrams style spec│
                      │  (the SKILL.md, verbatim)      │
                      └────────────────────────────────┘
```

**Two paired skills:**

1. **`ascii-flow-diagrams`** — the **style spec**. Defines the Unicode box-and-arrow format (┌ ┐ └ ┘ │ ─ ▲ ▼ ◄ ►) with 8 worked examples (compact topology, annotated decision-flow, sequence, merged). Auto-applied by Claude + Cursor via an `alwaysApply` rule.
2. **`seeme`** — the **AI tool** that reads the style spec verbatim as its system prompt and renders diagrams from any input. Provider-agnostic: Ollama-default (local, free, private), with OpenAI / Anthropic / Google Gemini / Perplexity as bring-your-own-key fallbacks. Ships **six surfaces** for the same engine:

| Surface | Command | What it does |
|---|---|---|
| CLI | `seeme "explain RAG"` | one-shot diagram from a prompt / stdin / file |
| Refine | `seeme --refine "add a redis cache"` | edits the last cached diagram, inherits style |
| Chain | `seeme "X" --then "Y" --then "Z"` | one call, N refines, all share the cached system prompt |
| Web UI | `seeme serve --open` | split-pane streaming preview, copy + SVG export, refine button |
| MCP server | `seeme-mcp` | exposes `generate_diagram` / `refine_diagram` / `list_providers` to Claude Desktop / Cursor / Claude Code |
| Docker | `docker compose up -d` | full stack — SEEME UI + Ollama + llama3.1 auto-pull |

**Engine highlights:** 5-rule lint loop (no-diagram → unicode → width → closure → alignment), no-diagram sub-classifier (refused / wrong-format / truncated), Anthropic prompt caching (5-min default, 1-h opt-in), OpenAI auto-cache, file-watch mode, `--explain` prose alongside the diagram, opt-in JSONL history + stats dashboard. 42 unit tests + 1 live-Ollama integration test.

| Resource | What It Covers |
|---|---|
| [`skills/visual/diagrams/ascii-flow-diagrams/SKILL.md`](skills/visual/diagrams/ascii-flow-diagrams/SKILL.md) | the canonical style spec |
| [`skills/visual/diagrams/seeme/SKILL.md`](skills/visual/diagrams/seeme/SKILL.md) | tool playbook + invocation |
| [`skills/visual/diagrams/seeme/README.md`](skills/visual/diagrams/seeme/README.md) | full README with install + quick-start |

---

## 09 — Infrastructure (self-hosted Git + private CI)

**Purpose:** stand up sovereign infrastructure for the You-Sir Juan stack — your own Git server, your own CI runners, your own container registry, all on your own hardware.

**Use when:** the task involves "self-host Git," "private GitLab," "replace GitHub Actions," "private CI/CD," "GitLab on Mac mini," "private container registry," or migrating off GitHub.

```text
   ┌─────────────────┐   tunnel    ┌────────────────────────────┐
   │  laptop / phone │◄────────────┤   Caddy (auto-HTTPS)       │
   │  anywhere       │             │   git + registry on :443   │
   └─────────────────┘             └──────────────┬─────────────┘
                                                  │
                                                  ▼
                                   ┌────────────────────────────┐
                                   │   GitLab CE (Omnibus)      │
                                   │   web UI + git + registry  │
                                   │   + runners + packages     │
                                   └─────────┬──────────────────┘
                                             │
                                             ▼
                                   ┌────────────────────────────┐
                                   │   GitLab Runner            │
                                   │   GitHub-Actions-equivalent│
                                   │   .gitlab-ci.yml workflows │
                                   └────────────────────────────┘
```

**One skill, six layers:**

| Layer | Resource |
|---|---|
| Docker Compose stack | [`templates/gitlab-compose.yml`](skills/infra/self-hosted-git/templates/gitlab-compose.yml) — GitLab CE + Runner + Caddy reverse proxy |
| HTTPS | [`templates/Caddyfile`](skills/infra/self-hosted-git/templates/Caddyfile) — Let's Encrypt automatic |
| Two network paths | [`tailscale-quickstart.md`](skills/infra/self-hosted-git/templates/tailscale-quickstart.md) (Path A — today) · [`wireguard-quickstart.md`](skills/infra/self-hosted-git/templates/wireguard-quickstart.md) (Path B — Mac mini + Flint 2 target) |
| CI/CD templates | [`templates/ci/`](skills/infra/self-hosted-git/templates/ci/) — five ready-to-use `.gitlab-ci.yml` patterns + a [10-minute tutorial](skills/infra/self-hosted-git/templates/ci/TUTORIAL.md) |
| CI overview dashboard | [`dashboard/`](skills/infra/self-hosted-git/dashboard/) — self-contained UI, polls every 15s, shows pipeline status across every project |
| Day-2 ops | [`backup.sh`](skills/infra/self-hosted-git/templates/backup.sh) (to Backblaze B2) · [`upgrade-checklist.md`](skills/infra/self-hosted-git/templates/upgrade-checklist.md) · [`migrate-from-github.sh`](skills/infra/self-hosted-git/templates/migrate-from-github.sh) · [`runner-setup.md`](skills/infra/self-hosted-git/templates/runner-setup.md) |

**Cost when complete:** ~$0/month recurring (one-time hardware + ~$0.05/mo Backblaze B2 backups). Yours. Private. Reachable from anywhere via the WireGuard tunnel.

**Aligns with yousirjuan plan:** operationalizes Category 11 (Governance, GitOps & Operational Memory) — GitLab CE / Runners / Registry move from "Planned" to "Skill ready." Decision record vs Forgejo lives in [`references/gitlab-vs-forgejo.md`](skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md).

| Resource | What It Covers |
|---|---|
| [`skills/infra/self-hosted-git/SKILL.md`](skills/infra/self-hosted-git/SKILL.md) | the full playbook |
| [`skills/infra/self-hosted-git/README.md`](skills/infra/self-hosted-git/README.md) | human-readable README |
| [`skills/infra/README.md`](skills/infra/README.md) | infrastructure-skills index (future packs land here) |

---

# AI Routing Cheat Sheet

| Task Type | First Place To Look |
|---|---|
| Marketing copy or growth strategy | `skills/marketing/` |
| UI, app, dashboard, or page design | `skills/visual/design/` + You-Sir Juan design domain |
| **Generate a diagram / flow / architecture picture** | **`skills/visual/diagrams/seeme/` — or just run `seeme "..."`** |
| **Self-host Git or replace GitHub Actions** | **`skills/infra/self-hosted-git/`** |
| Cursor project skills | `skills/ide/cursor/` |
| Agent rules | `rules/` |
| ReadyPlay context | `context/readyplay-product-marketing-context.md` |
| You-Sir Juan tool choice | `docs/yousirjuan-platform-skills-master.md` |
| External APIs/tools | `skills/external/` |
| Installing skills into a repo | `docs/cursor-project-skills.md` |
| License / attribution review | `THIRD_PARTY.md` |

---

# Repo Structure

```text
ai-skills-library/
├── README.md
├── SKILL-INDEX.md
├── THIRD_PARTY.md
├── context/
│   ├── README.md
│   └── readyplay-product-marketing-context.md
├── skills/
│   ├── README.md
│   ├── marketing/
│   │   ├── SKILL-CATALOG.md
│   │   └── CATEGORIES.md
│   ├── visual/
│   │   ├── design/ui-ux-pro-max/
│   │   └── diagrams/
│   │       ├── ascii-flow-diagrams/    # the style spec (system prompt)
│   │       └── seeme/                  # the AI tool: CLI + MCP + Web UI + Docker
│   ├── infra/
│   │   └── self-hosted-git/            # GitLab CE + CI + dashboard
│   ├── ide/cursor/
│   ├── project/red-e-play/
│   └── external/
├── rules/
├── docs/
│   ├── yousirjuan-platform-skills-master.md
│   ├── yousirjuan-upstream-repo-ledger.md
│   ├── related-github-projects.md
│   ├── cursor-project-skills.md
│   ├── marketingskills.md
│   ├── process.md
│   └── rules-pipeline.md
└── scripts/
    ├── rescan-skills.sh
    ├── vendor-skills-from-home.sh
    ├── install-repo-skills-to-cursor-project.sh
    ├── validate-skill-frontmatter.py
    ├── generate-skill-catalogs.py
    ├── generate-external-tool-skills.py
    ├── generate-agent-rules.py
    ├── link-external-skills-to-claude.sh
    └── sync-rules-into-repo.sh
```

---

# Counts

Current known count:

```text
71 SKILL.md files under skills/
```

Regenerate catalogs after vendoring or editing skills.

---

# Quick Use For Agents

1. Identify the user request domain.
2. Open the matching category above.
3. Use the linked catalog or skill file.
4. Prefer the most specific skill over a general skill.
5. For You-Sir Juan work, open `docs/yousirjuan-platform-skills-master.md` first.
6. For project-specific work, check `skills/project/` and `context/`.
7. For repeated behavior, update `rules/`.

---

# Install Into Another Repo

```bash
./scripts/install-repo-skills-to-cursor-project.sh /path/to/repo
```

This copies the skills into:

```text
<repo>/.cursor/skills/
```

Reference:

```text
docs/cursor-project-skills.md
```

---

# Refresh Skills From Local Machine

```bash
cd ~/Developer/ai-skills-library
./scripts/vendor-skills-from-home.sh
git add -A skills/ context/ docs/
git commit -m "chore: refresh vendored skills"
git push
```

---

# Master / Copy Rule

| Repo | Role |
|---|---|
| `marvelousempire/yousirjuan` | master platform source of truth |
| `marvelousempire/ai-skills-library` | reusable skill shelf and portable copy |

When You-Sir Juan adds new skills, tools, repos, models, or hardware roles, refresh this repo so the skill shelf stays current.

---

# Maintenance Rule

Every new skill family should be documented with:

- what it does
- when to use it
- inputs
- outputs
- related files
- platform role
- install/sync path
- status

This README should stay simple enough for a human to browse and structured enough for an AI agent to route tasks correctly.
