# Unified System Flow

## Purpose

This document explains how the major layers of the You-Sir Juan ecosystem connect together.

It acts as:

- a runtime map
- an orchestration map
- an onboarding map
- a lightweight systems-RAG guide
- a mental model for humans and AI agents

---

# High-Level Flow

```text
User
 ↓
Frontend / Dashboard / APIs
 ↓
Assistant Layer
 ↓
Planner / Router / Orchestration
 ↓
Memory + Retrieval
 ↓
Models + Agents
 ↓
Voice + Media + Automation
 ↓
Infrastructure Runtime
 ↓
Storage + Governance
```

---

# Detailed Flow

## 01 — User Layer

Humans interact through:

- dashboards
- chats
- voice
- APIs
- automation triggers
- workflows

Outputs:

- prompts
- uploads
- commands
- requests
- media inputs
- voice inputs

---

## 02 — Frontend & API Layer

Systems:

- Next.js
- React
- shadcn/ui
- Framer Motion
- Open WebUI
- FastAPI
- Node services

Responsibilities:

- authentication
- UI rendering
- request handling
- namespace routing
- assistant selection

---

## 03 — Assistant Layer

Assistant types:

- coding assistants
- family assistants
- onboarding assistants
- legal assistants
- media assistants
- voice assistants
- operations assistants

Responsibilities:

- context assembly
- personality
- workflow guidance
- tool selection
- namespace awareness

---

## 04 — Orchestration Layer

Systems:

- routers
- planners
- workflow engines
- queue managers
- agent coordinators

Responsibilities:

- model routing
- memory retrieval
- agent delegation
- fallback logic
- workflow execution
- token budgeting

---

## 05 — Memory & Retrieval Layer

Systems:

- Qdrant
- embeddings
- RAG Anything
- Firecrawl
- document ingestion
- transcript ingestion
- namespace memory

Responsibilities:

- semantic retrieval
- embeddings
- long-term memory
- document indexing
- audio indexing
- vector search

---

## 06 — Models & Agents Layer

Models:

- Qwen
- DeepSeek
- Llama
- Gemma
- Mistral
- coding models
- embedding models

Agents:

- Claude Code
- Aider
- OpenHands
- browser agents
- workflow agents

Responsibilities:

- reasoning
- coding
- retrieval
- execution
- planning
- automation

---

## 07 — Voice & Media Layer

Systems:

- Whisper
- Kokoro
- Piper
- Higgsfield
- ComfyUI
- Flux
- LivePortrait
- Blender MCP

Responsibilities:

- transcription
- narration
- cinematic generation
- avatars
- image generation
- voice output

---

## 08 — Infrastructure Runtime Layer

Systems:

- Docker
- PostgreSQL
- Redis
- WireGuard
- GitLab CE
- nginx
- Terraform
- Ansible

Responsibilities:

- runtime services
- orchestration
- queues
- networking
- deployment
- persistence
- governance

---

## 09 — Hardware Layer

Nodes:

- MacBook Pro M5 Max
- Mac mini M4 Pro
- DGX Spark
- Jetson Thor
- NAS / NVMe storage

Responsibilities:

- inference
- orchestration
- edge AI
- storage
- media rendering
- retrieval

---

# Strategic Principle

The platform is not:

> one giant model.

It is:

> a coordinated operating system of specialized systems.
