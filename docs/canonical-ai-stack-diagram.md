# Canonical AI Stack Diagram

This file preserves the original canonical conductor/RAG/model routing explanation exactly as written during architecture planning.

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║          YOUR OWN AI STACK: WHERE THE PROMPT GOES, RAG, MODEL, TOOLS       ║
╚══════════════════════════════════════════════════════════════════════════════╝
┌────────────────────┐
│  YOU               │
│  "Build my app"    │
└─────────┬──────────┘
          │  in: words / voice
          │ out: user intent
          ▼
┌────────────────────┐
│  YOUR UI           │
│  GUI / CLI / App   │
└─────────┬──────────┘
          │  in: raw prompt
          │ out: clean request
          ▼
┌──────────────────────────────────────────────┐
│  CONDUCTOR / AGENT ORCHESTRATOR              │
│                                              │
│  This is YOUR middleman brain.               │
│                                              │
│  It decides:                                 │
│  • What is the task?                         │
│  • Do we need RAG?                           │
│  • Do we need files?                         │
│  • Do we need terminal?                      │
│  • Which model should answer?                │
│  • Which tools should run?                   │
└───────┬───────────────┬──────────────────────┘
        │               │
        │               │ in: question needing facts
        │               │ out: search query
        │               ▼
        │      ┌────────────────────┐
        │      │        RAG         │
        │      │ Retrieval System   │
        │      └─────────┬──────────┘
        │                │ in: search query
        │                │ out: matching chunks
        │                ▼
        │      ┌────────────────────┐
        │      │  VECTOR DATABASE   │
        │      │  Chroma / Qdrant   │
        │      │  LanceDB / Weaviate│
        │      └─────────┬──────────┘
        │                │ out: docs / notes / code
        │                ▼
        │      ┌────────────────────┐
        │      │  CONTEXT PACKER    │
        │      │  Adds found info   │
        │      │  into prompt       │
        │      └─────────┬──────────┘
        │                │ out: prompt + facts
        │                │
        ◄────────────────┘
        │
        │ in: task + context
        │ out: selected model name
        ▼
┌──────────────────────────────────────────────┐
│  MODEL ROUTER                                │
│                                              │
│  This chooses the model.                     │
│                                              │
│  Example rules:                              │
│  • Coding task → deepseek-coder              │
│  • Fast chat → llama3                        │
│  • Long writing → mistral                    │
│  • Math/reasoning → qwen                     │
│                                              │
│  This is NOT automatic unless YOU build it.  │
│  Ollama only runs the model you ask for.     │
└─────────┬────────────────────────────────────┘
          │  in: model choice
          │ out: Ollama request
          ▼
┌──────────────────────────────────────────────┐
│  OLLAMA                                      │
│                                              │
│  Ollama is the engine.                       │
│  It does NOT decide your whole workflow.     │
│                                              │
│  It receives:                                │
│  • model name                               │
│  • prompt                                   │
│  • context from RAG                         │
│                                              │
│  Example:                                    │
│  model: deepseek-coder                       │
│  prompt: "Use these docs and build..."       │
└─────────┬────────────────────────────────────┘
          │  in: prompt + model name
          │ out: model response
          ▼
┌────────────────────┐
│  LOCAL MODEL       │
│  deepseek / llama  │
│  qwen / mistral    │
└─────────┬──────────┘
          │  in: packed prompt
          │ out: answer / code / plan
          ▼
┌──────────────────────────────────────────────┐
│  CONDUCTOR CHECKS RESPONSE                   │
│                                              │
│  It asks:                                    │
│  • Should files be written?                  │
│  • Should terminal run?                      │
│  • Should another model review it?           │
│  • Should RAG search again?                  │
└───────┬───────────────┬──────────────────────┘
        │               │
        │               │ in: command request
        │               │ out: result
        │               ▼
        │      ┌────────────────────┐
        │      │ TOOLS              │
        │      │ files / terminal   │
        │      │ browser / database │
        │      └────────────────────┘
        │
        ▼
┌────────────────────┐
│  YOUR UI           │
│  Shows final result│
└─────────┬──────────┘
          │  in: finished answer
          │ out: visible result
          ▼
┌────────────────────┐
│  YOU               │
│  See answer / app  │
└────────────────────┘
```
