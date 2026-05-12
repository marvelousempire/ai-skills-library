# RUFLO Conductor Role

This document formally defines where RUFLO fits inside the AI operating system architecture.

---

# Core Understanding

```text
RUFLO is NOT the AI model.
RUFLO is NOT the skill itself.
RUFLO is NOT the tool itself.

RUFLO is the programmable conductor/orchestrator.
```

---

# RUFLO Position In The Stack

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║                     RUFLO CONDUCTOR ARCHITECTURE                           ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────┐
│  USER              │
│  gives command     │
└─────────┬──────────┘
          │ in: prompt / order / request
          │ out: task intent
          ▼

┌────────────────────┐
│  UI / INTERFACE    │
│  Cursor / Claude   │
│  Custom App / CLI  │
└─────────┬──────────┘
          │ in: raw task
          │ out: normalized request
          ▼

┌──────────────────────────────────────────────┐
│  RUFLO                                       │
│  PROGRAMMABLE CONDUCTOR                      │
│                                              │
│  Responsibilities:                           │
│  • classify tasks                            │
│  • enforce rules                             │
│  • select agents                             │
│  • select skills                             │
│  • route RAG requests                        │
│  • choose models                             │
│  • sequence tools                            │
│  • manage execution order                    │
│  • run review loops                          │
│  • return verified results                   │
└───────┬───────────────┬──────────────────────┘
        │               │
        │               │ in: knowledge need
        │               │ out: retrieval query
        │               ▼
        │      ┌────────────────────┐
        │      │      RAG           │
        │      │ memory retrieval   │
        │      └─────────┬──────────┘
        │                │ in: query
        │                │ out: chunks/docs
        │                ▼
        │      ┌────────────────────┐
        │      │ VECTOR DATABASE    │
        │      │ docs / embeddings  │
        │      └────────────────────┘
        │
        │ in: task + rules + skills
        │ out: selected model
        ▼

┌──────────────────────────────────────────────┐
│  MODEL ROUTER                                │
│                                              │
│  Examples:                                   │
│  • code → deepseek-coder                     │
│  • writing → mistral                         │
│  • reasoning → qwen                          │
│  • quick chat → llama                        │
└─────────┬────────────────────────────────────┘
          │ in: model selection
          │ out: runtime request
          ▼

┌──────────────────────────────────────────────┐
│  OLLAMA                                      │
│  LOCAL MODEL RUNTIME                         │
│                                              │
│  Ollama runs the chosen model.               │
│  Ollama does NOT orchestrate the workflow.   │
└─────────┬────────────────────────────────────┘
          │ in: prompt + model name
          │ out: model response
          ▼

┌────────────────────┐
│  LOCAL MODEL       │
│  llama / qwen      │
│  deepseek / mistral│
└─────────┬──────────┘
          │ in: packed context
          │ out: answer / plan
          ▼

┌──────────────────────────────────────────────┐
│  TOOL EXECUTION                              │
│                                              │
│  • file access                               │
│  • terminal                                  │
│  • browser                                   │
│  • GitHub                                    │
│  • database                                  │
│  • APIs                                      │
└─────────┬────────────────────────────────────┘
          │ in: approved action
          │ out: tool results
          ▼

┌──────────────────────────────────────────────┐
│  REVIEW LOOP                                 │
│                                              │
│  RUFLO can loop back to:                     │
│  • rules                                     │
│  • skills                                    │
│  • RAG                                       │
│  • model routing                             │
│  • tool execution                            │
└─────────┬────────────────────────────────────┘
          │ in: results
          │ out: verified output
          ▼

┌────────────────────┐
│  FINAL OUTPUT      │
└─────────┬──────────┘
          │ out: visible answer/result
          ▼

┌────────────────────┐
│  USER              │
└────────────────────┘
```

---

# Clean Mental Model

```text
RUFLO = air traffic controller
Ollama = engine room
Model = AI brain
Skills = training manuals
Rules = laws and guardrails
Tools = hands
RAG = memory system
```

---

# Main Takeaway

```text
The user does not directly control the model.

The user gives orders to RUFLO.

RUFLO decides:
• what rules apply
• which skills load
• which tools run
• which model is best
• what order happens
• what must be reviewed
• when loops should occur
```

---

# Final Stack

```text
User
→ Interface
→ RUFLO
→ Rules
→ Agents
→ Skills
→ RAG
→ Model Router
→ Ollama
→ Local Model
→ Tool Executor
→ Review Loop
→ Final Output
→ User
```
