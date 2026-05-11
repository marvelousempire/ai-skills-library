# You-Sir Juan Platform Skills Master Copy

## Source Of Truth

The master source of truth for the You-Sir Juan platform skills, tools, and repo map lives in:

```text
marvelousempire/yousirjuan
```

This repository, `marvelousempire/ai-skills-library`, is the portable copied skills library.

Use this repo to browse, install, and reuse skills from one place.

---

# Purpose

This document merges the You-Sir Juan AI skills, upstream repos, tools, runtimes, models, media systems, voice systems, and infrastructure systems into the AI Skills Library.

It explains:

- what each skill/tool is
- what it does
- why it matters
- how You-Sir Juan uses it
- whether it is active, approved, planned, candidate, or reference

---

# Platform Skill Categories

| Category | Purpose |
|---|---|
| Coding Skills | build, refactor, test, and maintain code |
| Design Skills | improve UI, layout, accessibility, and visual polish |
| Retrieval Skills | ingest and search documents, images, transcripts, and memory |
| Browser Skills | automate websites, tests, screenshots, onboarding, and UI checks |
| Media Skills | generate video, images, avatars, and cinematic assets |
| Voice Skills | transcription, TTS, voice assistants, and spoken workflows |
| Evaluation Skills | test model quality, hallucinations, workflows, and output safety |
| Productivity Skills | connect AI to Gmail, Calendar, Docs, Sheets, and operations |
| Infrastructure Skills | deploy, monitor, version, and operate the platform |
| Governance Skills | Git, CI/CD, audit history, runners, artifacts, and operational memory |

---

# Coding & Developer Intelligence

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Claude Code | terminal AI coding and repo editing | builds and modifies platform files, services, docs, and workflows | active |
| Continue.dev | IDE AI coding assistant | connects local/cloud models to developer workflows | active |
| Aider | Git-aware coding assistant | makes repo changes with commit-friendly workflows | active |
| OpenHands | autonomous engineering agent | future autonomous build, test, and repair workflows | candidate |
| Roo Code | editor-based coding agent | future IDE-native agent workflow layer | candidate |
| Qwen Coder | coding model | local coding intelligence and repo assistance | approved |
| DeepSeek Coder | coding model | code reasoning, generation, and debugging | approved |
| Devstral | coding model | autonomous software engineering workflows | candidate |
| Codestral | coding model | fast coding workflows | candidate |

---

# Runtime & Local Inference

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Ollama | local model runtime | local inference and model hosting | active |
| vLLM | high-throughput inference server | larger GPU-backed inference | candidate |
| Open WebUI | local AI interface | user interface for local models and assistants | active |
| NVIDIA NIM | NVIDIA model-serving stack | DGX Spark model serving path | candidate |
| TensorRT | NVIDIA inference optimization | optimized DGX Spark workloads | candidate |

---

# Retrieval, Memory & RAG

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| RAG Anything | multimodal document ingestion | ingests PDFs, scans, screenshots, images, and transcripts | active |
| Qdrant | vector database | semantic memory and retrieval | active |
| LanceDB | local vector database | optional embedded retrieval backend | candidate |
| ChromaDB | lightweight vector DB | local prototype retrieval | candidate |
| FAISS | vector search | high-speed local retrieval experiments | candidate |
| LlamaIndex | retrieval framework | memory pipelines and contextual retrieval | candidate |
| LangChain | orchestration/RAG framework | tools, retrievers, and chains | candidate |
| SentenceTransformers | embeddings | local embedding generation | active |
| bge-large | embedding model | enterprise semantic retrieval | approved |
| nomic-embed | embedding model | local retrieval and memory | approved |
| e5-large | embedding model | semantic search | approved |

---

# Browser Automation & Web Intelligence

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Playwright CLI | browser automation and testing | onboarding tests, screenshots, dashboard checks, browser workflows | active |
| Firecrawl | structured web crawling | turns websites into structured memory and research inputs | active |
| Browser-use | browser agent framework | autonomous browser workflows | candidate |
| Selenium | browser automation | fallback browser testing | candidate |

---

# Design Intelligence & Frontend Quality

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| UI/UX Pro Max | design reasoning, layout, UX flow, polish | improves admin, marketing, and assistant interfaces | active |
| AwesomeDesign.md | frontend critique and design rules | reviews and improves AI-generated UI | active |
| 21st.dev | modern UI blocks and hero inspiration | premium landing sections and UI generation | active |
| Framer Motion | animation and interaction system | cinematic transitions and motion polish | active |
| shadcn/ui | reusable UI primitives | admin and marketing component foundation | active |
| Tailwind CSS | utility styling | design tokens and styling system | active |
| Magic UI | animated UI sections | premium marketing pages | candidate |
| Aceternity UI | high-end interaction effects | cinematic product storytelling | candidate |
| Lucide Icons | clean iconography | consistent app icons | active |
| Three.js | 3D graphics | infrastructure visuals and cinematic product visuals | active |
| React Three Fiber | React-based 3D layer | immersive Next.js visuals | active |

---

# Media Intelligence

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Higgsfield | cinematic AI video generation | premium AI videos, demos, feature explainers | candidate |
| Seedance | AI motion/video generation | cinematic scene and asset workflows | candidate |
| Runway | AI video workflow reference | high-end video workflow pattern reference | reference |
| Kling | motion generation reference | cinematic motion reference | reference |
| ComfyUI | modular diffusion pipeline | local image/video generation orchestration | planned |
| Flux | image generation | premium visual asset generation | planned |
| AUTOMATIC1111 | Stable Diffusion UI | local image-generation experiments | candidate |
| AnimateDiff | animation generation | motion from generated images | candidate |
| Deforum | cinematic diffusion | AI film sequence generation | candidate |
| StoryDiffusion | storyboard generation | visual narrative planning | candidate |
| LivePortrait | talking portraits | avatar and assistant presentation workflows | candidate |
| FaceFusion | face/media workflow | controlled face/media pipeline | candidate |

---

# TTS, Speech & Audio

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Whisper | speech-to-text | voice notes, meetings, calls, and audio into searchable memory | active |
| Piper | local TTS | fast private assistant voice output | active |
| Kokoro | high-quality local TTS | premium local assistant voice | active |
| ElevenLabs | cloud voice / voice cloning | polished demos and narration when allowed | reference |
| Coqui TTS | open-source TTS | alternate local voice output | candidate |
| AudioCraft | audio/music generation | future sound design and AI audio workflows | candidate |

---

# Productivity Integrations

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| GWS | Google Workspace integration | Gmail, Calendar, Docs, Sheets integration | active |
| Gmail integration | communications | summarize, draft, organize emails when authorized | planned |
| Calendar integration | scheduling | reminders, events, and operational coordination | planned |
| Docs integration | document memory | document workflows into memory/retrieval | planned |
| Sheets integration | structured data | ledgers, trackers, analytics, reports | planned |

---

# Evaluation & Trust Infrastructure

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| DeepEval | AI evaluation | answer quality, hallucination risk, retrieval quality | candidate |
| Promptfoo | prompt regression testing | model/prompt comparison and quality drift prevention | candidate |
| Playwright Tests | UI evaluation | dashboard, onboarding, and browser workflow testing | active |
| Recharts | analytics UI | displays usage, eval results, and operational metrics | active |
| Sentry | observability | frontend/backend error tracking | approved |

---

# Infrastructure, Network & Governance

| Skill / Tool | What It Does | You-Sir Juan Use | Status |
|---|---|---|---|
| Git | version control | operational memory, code history, assistant versions | core |
| GitLab CE | private Git platform | CI/CD, runners, artifacts, issue tracking, governance | planned |
| GitHub | repo hosting | current repo hosting and upstream synchronization | active |
| Gitea | lightweight Git hosting | optional smaller self-hosted Git platform | candidate |
| Forgejo | community Git forge | optional open-source Git platform | candidate |
| Docker | containerization | runtime services, databases, queues, and AI interfaces | active |
| Docker Compose | local orchestration | service startup and coordination | active |
| PostgreSQL | database | workspaces, namespaces, assistants, jobs, metadata | active schema |
| Redis | queues | background jobs, orchestration, evals, ingestion | planned |
| WireGuard | secure networking | connects workstation, runtime server, DGX Spark, Jetson Thor, VPS, storage | active |
| nginx | reverse proxy | traffic routing and TLS termination | candidate |
| pm2 | process manager | runtime persistence on servers | candidate |
| Terraform | infrastructure-as-code | reproducible infrastructure | planned |
| Ansible | server automation | provisioning and server management | planned |
| SOPS | secret encryption | encrypted env files and deployment secrets | candidate |
| Vault | secrets management | central secrets and policy management | candidate |

---

# Hardware Skills / Compute Roles

| Hardware | What It Does | You-Sir Juan Use |
|---|---|---|
| MacBook Pro M5 Max | main workstation | local inference, coding, orchestration, design, creative work |
| Mac mini M4 Pro | persistent runtime node | APIs, queues, Qdrant, Open WebUI, ingestion workers |
| NVIDIA DGX Spark | frontier inference node | CUDA workloads, fine-tuning, large-model serving |
| NVIDIA Jetson Thor | edge AI node | robotics, vision, voice, camera intelligence, edge inference |
| Flint 2 | infrastructure gateway | WireGuard gateway and network backbone |
| Slate AX | travel router | secure remote access into home infrastructure |
| NAS / DAS / NVMe | storage layer | models, archives, embeddings, datasets, backups |

---

# Master / Copy Rule

Master planning and platform architecture live in:

```text
marvelousempire/yousirjuan
```

Portable skills, vendored skills, Cursor/Claude skill files, and reusable skill docs live in:

```text
marvelousempire/ai-skills-library
```

When You-Sir Juan adds a new skill or upstream tool, this copied library should be refreshed so all skills remain browsable from one place.

---

# Next Sync Targets

This copied skills library should eventually include:

- individual skill folders for each You-Sir Juan platform skill
- install notes per skill
- source URLs
- license notes
- security notes
- related feature IDs
- related PRDs
- related pain journal entries
- Cursor skill adapters
- Claude skill adapters
- orchestration prompts

---

# Strategic Goal

The AI Skills Library should be the single browsable copy of the platform skills ecosystem.

You-Sir Juan remains the master platform.
The skills library remains the portable skill shelf.
