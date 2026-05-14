# You-Sir Juan Platform Skills Master Copy

## Source Of Truth

Master platform planning, architecture, and feature ownership live in:

```text
marvelousempire/yousirjuan
```

This repository, `marvelousempire/ai-skills-library`, is the portable copied skills shelf.

Use this document as a lightweight AI-readable knowledge guide: a poor man's RAG index for tools, skills, repos, and platform roles.

---

# How AI Should Use This Guide

When asked to build, plan, design, deploy, or explain You-Sir Juan, first identify the domain below, then select the correct tool family.

## Selection Rule

| User Intent | Use These Categories First |
|---|---|
| build or edit code | Coding + Runtime + Git/Governance |
| improve UI or website | Design + Frontend + Media |
| ingest documents or memory | Retrieval + Data + Voice if audio |
| automate browser work | Browser + Web Intelligence + Evaluation |
| make videos, images, demos | Media + Voice + Design |
| add speech or assistant voice | Voice + Retrieval + Assistant Runtime |
| deploy or operate platform | Infrastructure + Network + Governance |
| test quality | Evaluation + Observability + Browser |
| connect work apps | Productivity + Retrieval + Governance |
| map hardware or performance | Compute + Runtime + Models |

---

# Status Legend

| Status | Meaning |
|---|---|
| Core | foundational platform dependency |
| Active | already used or directly included in current platform direction |
| Approved | selected for integration |
| Planned | part of roadmap but not fully implemented |
| Candidate | under review or useful future option |
| Reference | pattern, benchmark, or optional outside inspiration |

---

# Domain Map

| Domain | Purpose | Primary Output |
|---|---|---|
| 01 Coding Intelligence | code generation, repo editing, refactoring | working code, commits, tests |
| 02 Model Runtime | local models and inference servers | model responses, APIs |
| 03 Retrieval Memory | documents, embeddings, semantic search | memory recall, RAG answers |
| 04 Browser Web Intelligence | web automation, crawling, UI checks | screenshots, extracted data, tests |
| 05 Design Frontend | UI quality, components, motion | polished app and landing pages |
| 06 Media Intelligence | video, image, avatar, cinematic output | demos, visual assets, clips |
| 07 Voice Speech Audio | STT, TTS, voice assistants | transcripts, voice replies, narration |
| 08 Productivity Integrations | Gmail, Calendar, Docs, Sheets | operational workflows |
| 09 Evaluation Observability | quality checks, tracing, monitoring | scores, reports, alerts |
| 10 Infrastructure Network | deploy, connect, secure services | running platform |
| 11 Governance GitOps | versioning, CI/CD, artifacts | operational memory |
| 12 Hardware Compute | workload placement | node strategy |

---

# 01 Coding Intelligence

## Role

Turns the platform into a buildable, maintainable software system.

## Inputs

- repo files
- issues
- feature specs
- PRDs
- bugs
- terminal commands

## Outputs

- code changes
- commits
- tests
- refactors
- implementation plans

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Claude Code | coding agent | terminal AI coding and repo editing | builds and modifies services, docs, configs, and features | Active |
| Continue.dev | IDE assistant | editor-local AI assistance | connects local/cloud models into coding workflow | Active |
| Aider | Git-aware coding CLI | commit-aware repo editing | fast AI changes inside Git repos | Active |
| OpenHands | autonomous engineering | end-to-end coding agent | future autonomous build/test/repair workflows | Candidate |
| Roo Code | IDE agent | agentic coding in editor | future IDE-native agent workflow | Candidate |
| Qwen Coder | coding model | code generation and reasoning | local coding model for repo work | Approved |
| DeepSeek Coder | coding model | code reasoning and debugging | coding and refactor workloads | Approved |
| Devstral | coding model | agentic software engineering | candidate for autonomous coding workflows | Candidate |
| Codestral | coding model | fast coding assistance | quick code generation and editing | Candidate |

## AI Routing Note

For code edits, prefer Claude Code, Aider, or Continue.dev. For local model support, route to Qwen Coder or DeepSeek Coder.

---

# 02 Model Runtime & Inference

## Role

Runs AI models locally or on dedicated compute nodes.

## Inputs

- prompts
- model files
- API calls
- embeddings requests
- agent requests

## Outputs

- generated text
- code
- reasoning
- embeddings
- model API responses

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Ollama | local runtime | simple local model hosting | local inference for assistants and coding | Active |
| vLLM | inference server | high-throughput serving | GPU-backed inference on stronger nodes | Candidate |
| Open WebUI | model interface | web UI for local models | local chat and assistant interface | Active |
| NVIDIA NIM | model serving | NVIDIA model containers | DGX Spark serving path | Candidate |
| TensorRT | optimization | NVIDIA inference acceleration | optimized DGX Spark workloads | Candidate |

## AI Routing Note

Use Ollama for simple local runtime. Use vLLM/NIM/TensorRT when the task needs DGX Spark or CUDA acceleration.

---

# 03 Retrieval, Memory & RAG

## Role

Turns files, text, images, transcripts, and records into searchable memory.

## Inputs

- PDFs
- screenshots
- images
- documents
- markdown
- transcripts
- websites
- repos

## Outputs

- chunks
- embeddings
- vector records
- search results
- retrieved context

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| RAG Anything | multimodal RAG | ingest multimodal documents | PDFs, scans, images, screenshots, transcripts | Active |
| Qdrant | vector DB | semantic memory store | core vector retrieval backend | Active |
| LanceDB | vector DB | embedded/local vectors | optional local retrieval backend | Candidate |
| ChromaDB | vector DB | lightweight vector DB | prototypes and experiments | Candidate |
| FAISS | vector search | fast local similarity search | custom retrieval experiments | Candidate |
| LlamaIndex | retrieval framework | document/query pipelines | structured memory workflows | Candidate |
| LangChain | orchestration/RAG | chains, tools, retrievers | workflow and tool integration | Candidate |
| SentenceTransformers | embeddings | local embedding generation | document and memory embeddings | Active |
| bge-large | embedding model | strong semantic retrieval | enterprise-grade embeddings | Approved |
| nomic-embed | embedding model | local embedding model | private memory embeddings | Approved |
| e5-large | embedding model | semantic retrieval | search and recall workflows | Approved |

## AI Routing Note

For memory or knowledge questions, prefer RAG Anything for ingestion, Qdrant for storage, and SentenceTransformers or approved embedding models for indexing.

---

# 04 Browser Automation & Web Intelligence

## Role

Lets agents operate websites, test pages, collect public web data, and validate UI flows.

## Inputs

- URLs
- browser tasks
- onboarding flows
- test cases
- scraping targets

## Outputs

- screenshots
- extracted content
- UI test results
- crawl outputs
- automation logs

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Playwright CLI | browser automation | browser control and testing | onboarding tests, screenshots, dashboard checks | Active |
| Firecrawl | web ingestion | structured crawling/extraction | web-to-memory research pipeline | Active |
| Browser-use | browser agent | autonomous browser operation | future web-task agent layer | Candidate |
| Selenium | browser automation | legacy browser testing | fallback automation option | Candidate |

## AI Routing Note

Use Playwright for controlled browser automation and UI testing. Use Firecrawl for extracting website content into memory.

---

# 05 Design Intelligence & Frontend Quality

## Role

Creates polished interfaces, landing pages, dashboards, and visual systems.

## Inputs

- PRDs
- feature descriptions
- page goals
- dashboard needs
- brand direction
- UI screenshots

## Outputs

- layouts
- components
- pages
- motion specs
- design critiques
- frontend improvements

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| UI/UX Pro Max | design skill | layout, UX flow, polish | improves admin, marketing, assistant interfaces | Active |
| AwesomeDesign.md | design critique | frontend quality rules | reviews and improves AI-generated UI | Active |
| 21st.dev | UI inspiration | premium sections and blocks | landing pages and component inspiration | Active |
| Framer Motion | motion library | animation and interactions | cinematic transitions and polish | Active |
| shadcn/ui | component library | reusable UI primitives | admin and marketing foundation | Active |
| Tailwind CSS | styling | utility styles and tokens | design system styling | Active |
| Magic UI | motion components | animated UI sections | premium marketing page candidates | Candidate |
| Aceternity UI | visual effects | high-end interactions | cinematic storytelling candidates | Candidate |
| Lucide Icons | icons | modern icon set | consistent UI iconography | Active |
| Three.js | 3D engine | 3D graphics | infrastructure visuals and demos | Active |
| React Three Fiber | React 3D | Three.js in React | immersive Next.js visuals | Active |

## AI Routing Note

For any UI request, combine UI/UX Pro Max, shadcn/ui, Tailwind, and Framer Motion first. Use 21st.dev, Magic UI, and Aceternity for premium page ideas.

---

# 06 Media Intelligence

## Role

Turns features, scripts, assistants, and platform stories into videos, images, avatars, and cinematic assets.

## Inputs

- scripts
- PRDs
- feature ledgers
- images
- storyboards
- prompts
- voice tracks

## Outputs

- product videos
- demo clips
- generated images
- avatars
- motion sequences
- marketing assets

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Higgsfield | AI video | cinematic generation | premium demos and feature explainers | Candidate |
| Seedance | AI video/motion | scene and motion generation | cinematic asset workflows | Candidate |
| Runway | AI video | high-end video reference | workflow pattern reference | Reference |
| Kling | AI motion | cinematic motion reference | motion-generation reference | Reference |
| ComfyUI | node pipeline | modular image/video generation | local media orchestration | Planned |
| Flux | image generation | premium visuals | marketing and product visuals | Planned |
| AUTOMATIC1111 | SD UI | local image experiments | image workflow fallback | Candidate |
| AnimateDiff | animation | motion from stills | animation workflows | Candidate |
| Deforum | diffusion video | cinematic sequences | AI film experiments | Candidate |
| StoryDiffusion | storyboard | visual narrative planning | story and demo planning | Candidate |
| LivePortrait | avatar animation | talking portraits | assistant presentation workflows | Candidate |
| FaceFusion | face/media workflow | controlled face pipelines | media production candidate | Candidate |

## AI Routing Note

For product storytelling, combine feature PRDs + media tools + TTS. For local pipelines, prioritize ComfyUI, Flux, Whisper, Kokoro/Piper.

---

# 07 Voice, Speech & Audio

## Role

Enables the platform to listen, transcribe, speak, narrate, and turn audio into memory.

## Inputs

- voice notes
- meetings
- phone/call recordings
- scripts
- assistant responses
- audio files

## Outputs

- transcripts
- summaries
- memory records
- spoken replies
- narrated demos
- audio assets

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Whisper | speech-to-text | transcription | voice notes, meetings, calls into searchable memory | Active |
| Piper | local TTS | fast speech output | private assistant voice output | Active |
| Kokoro | local TTS | higher-quality voice | premium local assistant voice | Active |
| ElevenLabs | cloud voice | premium voice/narration | polished demos when approved | Reference |
| Coqui TTS | open TTS | alternate local TTS | backup/private voice option | Candidate |
| AudioCraft | audio generation | music/sound generation | future sound design workflows | Candidate |

## AI Routing Note

Use Whisper to ingest spoken knowledge. Use Piper/Kokoro for local assistant voice. Use ElevenLabs only for approved premium narration.

---

# 08 Productivity Integrations

## Role

Connects the AI system to real work tools and daily operations.

## Inputs

- emails
- calendar events
- documents
- sheets
- tasks
- contacts

## Outputs

- drafts
- summaries
- reminders
- documents
- reports
- ledger updates

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| GWS | workspace bridge | Google Workspace integration | Gmail, Calendar, Docs, Sheets workflows | Active |
| Gmail integration | communication | email workflows | summarize, draft, organize with permission | Planned |
| Calendar integration | scheduling | calendar workflows | events, reminders, coordination | Planned |
| Docs integration | documents | document workflows | document memory and retrieval | Planned |
| Sheets integration | data | structured data workflows | ledgers, trackers, analytics | Planned |

## AI Routing Note

For operational work, connect GWS with memory/retrieval so emails, docs, calendars, and sheets become usable context.

---

# 09 Evaluation, Testing & Observability

## Role

Checks quality, catches errors, evaluates outputs, and monitors runtime health.

## Inputs

- prompts
- responses
- retrieved context
- UI flows
- runtime logs
- model comparisons

## Outputs

- scores
- errors
- regression reports
- screenshots
- dashboards
- alerts

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| DeepEval | AI eval | output and retrieval scoring | hallucination and quality testing | Candidate |
| Promptfoo | prompt testing | regression testing | model/prompt comparison | Candidate |
| Playwright Tests | UI testing | browser-based tests | dashboard and onboarding validation | Active |
| Recharts | analytics UI | charts and dashboards | eval, usage, and system metrics | Active |
| Sentry | observability | error tracking | frontend/backend monitoring | Approved |

## AI Routing Note

Before shipping features, pair Promptfoo/DeepEval for AI behavior and Playwright for UI behavior.

---

# 10 Infrastructure, Network & Deployment

## Role

Runs, connects, and secures the platform services.

## Inputs

- Docker services
- env files
- servers
- nodes
- network configs
- deployment scripts

## Outputs

- running services
- private network links
- database runtime
- queues
- reverse proxy
- deployments

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Docker | containerization | isolate services | APIs, DBs, queues, AI UIs | Active |
| Docker Compose | orchestration | local service startup | dev/home-lab runtime | Active |
| Colima | Docker engine | Apple-Silicon-native daemon | recommended replacement for Docker Desktop on macOS Tahoe | Active ([dockyard](../skills/infra/dockyard/references/engines-compared.md)) |
| OrbStack | Docker engine | paid native daemon UI | alternative to Docker Desktop / Colima | Alternative ([dockyard](../skills/infra/dockyard/references/engines-compared.md)) |
| Docker Desktop | Docker engine | bundled engine + GUI | legacy on Apple Silicon + macOS Tahoe (May 2026 regressions) | Legacy ([migration](../skills/infra/dockyard/references/switching-from-docker-desktop.md)) |
| Dockyard | Docker UI | container manager UI (replaces Docker Desktop's GUI) | every library stack ships `ai-skills-library.*` labels for Dockyard's Compose view | Skill ready ([dockyard](../skills/infra/dockyard/)) |
| PostgreSQL | relational DB | structured data | workspaces, namespaces, jobs, metadata | Active schema |
| Redis | queue system | background jobs | ingestion, evals, orchestration | Planned |
| WireGuard | VPN/network | encrypted private routing | connects all compute/storage nodes | Active |
| nginx | reverse proxy | route traffic/TLS | public/private service routing | Candidate |
| pm2 | process manager | keep services alive | Node service persistence | Candidate |
| Terraform | IaC | reproducible infra | future deploy automation | Planned |
| Ansible | automation | server provisioning | setup/hardening scripts | Planned |
| SOPS | secrets | encrypted env files | secure config management | Candidate |
| Vault | secrets | central secret store | future policy/secrets engine | Candidate |

## AI Routing Note

Use this category for installation, deployment, service wiring, and secure network design.

---

# 11 Governance, GitOps & Operational Memory

## Role

Tracks changes, versions assistants, runs CI/CD, stores artifacts, and preserves operational history.

## Inputs

- code changes
- assistant configs
- namespace configs
- feature specs
- pipelines
- artifacts

## Outputs

- commits
- releases
- CI jobs
- artifacts
- audit history
- rollback points

| Tool | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Git | version control | operational memory | code, assistant versions, infrastructure history | Core |
| GitHub | repo hosting | current remote hosting | source hosting and upstream sync | Active |
| GitLab CE | private Git platform | CI/CD, runners, artifacts | private governance platform | Skill ready ([self-hosted-git](../skills/infra/self-hosted-git/)) |
| Gitea | Git platform | lightweight self-hosted Git | optional smaller deployment | Alternative (not selected — see [decision](../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md)) |
| Forgejo | Git platform | community Git forge | optional open-source alternative | Alternative (not selected — see [decision](../skills/infra/self-hosted-git/references/gitlab-vs-forgejo.md)) |
| GitLab Runners | CI execution | pipeline workers | builds, tests, deploys, evals | Skill ready (auto-registered by [self-hosted-git](../skills/infra/self-hosted-git/)) |
| GitLab Registry | registry | container/package storage | internal runtime images | Skill ready (enabled in [self-hosted-git](../skills/infra/self-hosted-git/) Compose) |
| Git LFS | large files | large artifact tracking | models, media, datasets | Candidate |

## AI Routing Note

For platform governance, all durable changes should map back to Git history, issues, PRDs, and release artifacts.

---

# 12 Hardware & Compute Roles

## Role

Places workloads on the correct machines.

## Inputs

- model size
- runtime type
- media workload
- voice workload
- storage need
- latency need

## Outputs

- hardware routing plan
- node responsibility
- scaling recommendation

| Hardware | Role | Best Workloads | Status |
|---|---|---|---|
| MacBook Pro M5 Max | main workstation | coding, local inference, design, orchestration, creative review | Planned/Target |
| Mac mini M4 Pro | persistent runtime node | APIs, Qdrant, Open WebUI, queues, ingestion workers | Planned/Target |
| NVIDIA DGX Spark | frontier inference node | CUDA, fine-tuning, large models, media generation | Optional expansion |
| NVIDIA Jetson Thor | edge AI node | robotics, vision, voice, camera intelligence | Optional expansion |
| Flint 2 | home gateway | WireGuard server and network backbone | Planned/Target |
| Slate AX | travel router | secure remote access | Planned/Target |
| NAS / DAS / NVMe | storage | models, embeddings, datasets, backups, media archives | Planned/Target |

## AI Routing Note

Do not put every workload on one machine. Separate workstation, persistent runtime, frontier inference, edge AI, and storage.

---

# Master / Copy Rule

| Repo | Role |
|---|---|
| `marvelousempire/yousirjuan` | master platform source of truth |
| `marvelousempire/ai-skills-library` | portable copied skill shelf |

When You-Sir Juan adds a new skill, upstream tool, or feature category, refresh this copied library so agents can browse one clean guide.

---

# Future File Structure

Every major tool should eventually have its own skill file:

```text
skills/platform/yousirjuan/<domain>/<tool>/SKILL.md
```

Recommended fields:

- name
- domain
- status
- source URL
- license
- what it does
- inputs
- outputs
- You-Sir Juan role
- install notes
- security notes
- related feature IDs
- related PRDs
- related pain journal entries

---

# AI Retrieval Shortcut

Use this simple matching rule:

```text
Need to build?       → Coding Intelligence
Need to run models?  → Model Runtime
Need memory?         → Retrieval Memory
Need browser/web?    → Browser Web Intelligence
Need UI?             → Design Frontend
Need video/images?   → Media Intelligence
Need speech?         → Voice Speech Audio
Need work apps?      → Productivity Integrations
Need tests?          → Evaluation Observability
Need deployment?     → Infrastructure Network
Need governance?     → GitOps Operational Memory
Need hardware plan?  → Hardware Compute
```

---

# Strategic Goal

This guide should let an AI quickly know:

- which tool category applies
- which tool to choose
- what the tool produces
- how it fits You-Sir Juan
- whether it is ready now or later

The goal is a clean, browsable, AI-friendly skills map that acts like a lightweight RAG layer before full retrieval infrastructure is built.

---

# 13 — Session Operations (added 2026-05-14)

## Role

Patterns for operating efficiently in long Claude Code sessions on this repo.
How to start, how to parallelize, how to close, and how to file learnings.

## Key patterns

| Pattern | When to use | Reference |
|---|---|---|
| **Parallel agent coordination** | Any session touching iOS + web + backend | `skills/project/yousirjuan/parallel-agent-coordination/SKILL.md` |
| **After-action report** | End of any session that produced significant work | `skills/templates/after-action/TEMPLATE.md` |
| **Pre-PR checklist** | Before opening any PR | `checklists/pre-pr.md` |
| **New session checklist** | Start of every session | `checklists/new-session.md` |

## Routing note

At session start: run `checklists/new-session.md`.
At session end: write `after-action/YYYY-MM-DD-session-title.md` using the template.
Before PR: run `checklists/pre-pr.md`.

---

# 14 — Hardware + Installer Track (added 2026-05-14)

## Role

Documenting hardware compatibility, writing one-liner installers, and publishing
them via the GitHub Actions → GitHub Releases → VPS nginx pipeline.

## Workflow

```
1. Write hardware doc → docs/hardware/<machine>.md
   (template: skills/templates/hardware-doc/TEMPLATE.md)
2. Write installer → installers/<platform>/install.sh
   (reference: skills/project/yousirjuan/bash-installer-oneliners/SKILL.md)
3. Write GitHub Actions workflow → .github/workflows/release-<platform>.yml
4. Write VPS nginx config → vps/nginx-<platform>-installer.conf
5. Tag a release → workflow publishes to yousirjuan-ai
6. VPS nginx serves: https://get.yousirjuan.ai/<platform>
```

## Routing note

For new hardware: `hardware-before-installer` rule applies.
For installer writing: `bash-installer-oneliners` skill.
For OpenCore/legacy hardware: `installers/intel-mac/opencore-sonoma-guide.md` is the model doc.

## Current hardware docs

| Machine | Doc | Installer |
|---|---|---|
| iMac 2017 Intel i5 64GB | `docs/hardware/imac-2017-intel-i5.md` | `installers/intel-mac/install.sh` |
| MacBook Pro M5 Max / Mac mini M4 Pro | `docs/hardware/apple-device-stack.md` | `installers/macos.sh` |
| NVIDIA DGX Spark | `hardware/dgx-spark-frontier-node.md` | (CLI only) |
