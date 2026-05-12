# AI Conductor Skills Architecture

This guide explains how a custom AI system can route a user's command through rules, agents, skills, RAG, model selection, tool execution, review, and final output.

The main idea:

```text
The user does not talk directly to a model.
The user talks to a conductor.
The conductor decides what rules, agents, skills, memory, tools, and model should be used.
```

---

# 1. Full Round-Trip Flow

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║           USER COMMAND → CONDUCTOR → RULES → AGENT → SKILLS → TASK         ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────┐
│  USER / OPERATOR   │
│  "Build my app"    │
└─────────┬──────────┘
          │  in: voice / text / file / click
          │ out: raw command
          ▼

┌────────────────────┐
│  FRONTEND / UI     │
│  GUI / CLI / App   │
└─────────┬──────────┘
          │  in: raw command
          │ out: normalized request
          ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  CONDUCTOR / ORCHESTRATOR                                                  │
│                                                                            │
│  This is the command desk.                                                  │
│                                                                            │
│  It decides:                                                               │
│  • What is being asked?                                                     │
│  • Which rules apply first?                                                 │
│  • Which agent should handle it?                                            │
│  • Which skills are needed?                                                 │
│  • Is RAG needed?                                                           │
│  • Which model should run?                                                  │
│  • Which tools can act?                                                     │
│  • What must be checked before output?                                      │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: normalized request
        │ out: classified task
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  FIRST RULE GATE                                                            │
│                                                                            │
│  These rules protect the workflow before any agent acts.                    │
│                                                                            │
│  Examples:                                                                 │
│  • safety rules                                                             │
│  • repo rules                                                               │
│  • file access rules                                                        │
│  • coding style rules                                                       │
│  • user tone rules                                                          │
│  • no-delete rules                                                          │
│  • ask-before-risk rules                                                    │
│  • output format rules                                                      │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: classified task
        │ out: allowed task plan
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  AGENT SELECTOR                                                             │
│                                                                            │
│  Chooses the right agent role.                                               │
│                                                                            │
│  Example agents:                                                            │
│  • coder agent                                                              │
│  • planner agent                                                            │
│  • UI designer agent                                                        │
│  • legal writer agent                                                       │
│  • research agent                                                           │
│  • repo maintainer agent                                                    │
│  • automation agent                                                         │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: allowed task plan
        │ out: selected agent role
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  SKILL ROUTER                                                               │
│                                                                            │
│  Looks inside the skills library and chooses the right skill pack.          │
│                                                                            │
│  Sources can include:                                                       │
│  • skills/                                                                  │
│  • rules/                                                                   │
│  • docs/                                                                    │
│  • context/                                                                 │
│  • project-specific skill folders                                           │
│  • external tool bridge skills                                              │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: selected agent role + task type
        │ out: matched skill instructions
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  RAG / MEMORY DECISION                                                      │
│                                                                            │
│  The conductor decides whether to retrieve extra knowledge.                 │
│                                                                            │
│  Use RAG when the model needs:                                              │
│  • repo knowledge                                                           │
│  • project docs                                                             │
│  • prior notes                                                              │
│  • saved rules                                                              │
│  • product context                                                          │
│  • private knowledge                                                        │
│  • long-term memory                                                         │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: task + skill needs
        │ out: search queries
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  RETRIEVAL LAYER                                                            │
│                                                                            │
│  This finds the facts before the model answers.                             │
│                                                                            │
│  Possible stores:                                                           │
│  • vector database                                                          │
│  • markdown files                                                           │
│  • GitHub repo search                                                       │
│  • local notes                                                              │
│  • file index                                                               │
│  • PostgreSQL                                                               │
│  • SQLite                                                                   │
│  • document embeddings                                                      │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: search query
        │ out: relevant chunks
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  CONTEXT PACKER                                                             │
│                                                                            │
│  Builds the final prompt package.                                           │
│                                                                            │
│  It combines:                                                              │
│  • user command                                                             │
│  • first rule gate                                                          │
│  • selected agent role                                                      │
│  • matched skill instructions                                               │
│  • retrieved RAG chunks                                                     │
│  • available tool list                                                      │
│  • output rules                                                             │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: rules + skills + RAG chunks
        │ out: packed prompt
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  MODEL ROUTER                                                               │
│                                                                            │
│  Chooses which model should handle the packed prompt.                       │
│                                                                            │
│  Example routing:                                                           │
│  • coding task      → deepseek-coder / qwen-coder                           │
│  • fast chat        → llama                                                 │
│  • long writing     → mistral / qwen                                        │
│  • reasoning task   → qwen / deepseek                                       │
│  • tiny local task  → small local model                                     │
│  • heavy task       → cloud model if allowed                                │
│                                                                            │
│  Important:                                                                 │
│  Ollama does not choose the model by itself.                                │
│  The conductor or model router sends Ollama the chosen model name.          │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: packed prompt
        │ out: model name + prompt
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  OLLAMA / MODEL RUNTIME                                                     │
│                                                                            │
│  Ollama is the engine, not the conductor.                                   │
│                                                                            │
│  It receives:                                                              │
│  • model name                                                               │
│  • prompt                                                                   │
│  • context                                                                  │
│                                                                            │
│  It runs:                                                                   │
│  • local model files                                                        │
│  • CPU / GPU inference                                                      │
│  • streamed response                                                        │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: model name + packed prompt
        │ out: draft answer / tool plan
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  SECOND RULE GATE / ACTION SETUP                                            │
│                                                                            │
│  These rules prepare the model response before anything acts.               │
│                                                                            │
│  Examples:                                                                 │
│  • verify file paths                                                        │
│  • check commands before running                                            │
│  • prevent dangerous deletes                                                │
│  • confirm output format                                                    │
│  • require tests for code changes                                           │
│  • require citations for research                                           │
│  • require summary before final output                                      │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: draft answer / proposed action
        │ out: approved action plan
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  TOOL EXECUTOR                                                              │
│                                                                            │
│  Performs the real work.                                                     │
│                                                                            │
│  Tools may include:                                                         │
│  • file read/write                                                          │
│  • terminal                                                                 │
│  • GitHub                                                                   │
│  • browser                                                                  │
│  • database                                                                 │
│  • API calls                                                                │
│  • shell scripts                                                            │
│  • build/test commands                                                      │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: approved action plan
        │ out: execution results
        ▼

┌────────────────────────────────────────────────────────────────────────────┐
│  REVIEW / VALIDATION LOOP                                                   │
│                                                                            │
│  Checks the result before sending it back.                                  │
│                                                                            │
│  It can ask:                                                               │
│  • Did the command work?                                                    │
│  • Did tests pass?                                                          │
│  • Did files change correctly?                                              │
│  • Do we need another RAG search?                                           │
│  • Do we need another model pass?                                           │
│  • Do we need a different skill?                                            │
└───────┬────────────────────────────────────────────────────────────────────┘
        │  in: tool results
        │ out: verified result
        ▼

┌────────────────────┐
│  FINAL RESPONSE    │
│  UI / CLI / App    │
└─────────┬──────────┘
          │  in: verified result
          │ out: answer / files / action log
          ▼

┌────────────────────┐
│  USER / OPERATOR   │
│  sees final output │
└────────────────────┘
```

---

# 2. Short Stack View

```text
┌──────────────┐
│ User Input   │
└──────┬───────┘
       │ in: prompt
       │ out: command
       ▼
┌──────────────┐
│ Frontend UI  │
└──────┬───────┘
       │ in: command
       │ out: clean request
       ▼
┌──────────────┐
│ Conductor    │
└──────┬───────┘
       │ in: clean request
       │ out: task route
       ▼
┌──────────────┐
│ Rule Gate 1  │
└──────┬───────┘
       │ in: task route
       │ out: allowed plan
       ▼
┌──────────────┐
│ Agent Select │
└──────┬───────┘
       │ in: allowed plan
       │ out: agent role
       ▼
┌──────────────┐
│ Skill Router │
└──────┬───────┘
       │ in: agent role
       │ out: skill pack
       ▼
┌──────────────┐
│ RAG / Memory │
└──────┬───────┘
       │ in: search need
       │ out: facts / chunks
       ▼
┌──────────────┐
│ Context Pack │
└──────┬───────┘
       │ in: rules + facts + skills
       │ out: final prompt
       ▼
┌──────────────┐
│ Model Router │
└──────┬───────┘
       │ in: final prompt
       │ out: selected model
       ▼
┌──────────────┐
│ Ollama       │
└──────┬───────┘
       │ in: model + prompt
       │ out: model response
       ▼
┌──────────────┐
│ Rule Gate 2  │
└──────┬───────┘
       │ in: response/action
       │ out: safe action
       ▼
┌──────────────┐
│ Tool Execute │
└──────┬───────┘
       │ in: safe action
       │ out: result
       ▼
┌──────────────┐
│ Review Loop  │
└──────┬───────┘
       │ in: result
       │ out: verified answer
       ▼
┌──────────────┐
│ Final Output │
└──────────────┘
```

---

# 3. The Conductor's Job

The conductor is the main middle layer between the user and the model runtime.

It can be built as:

- a Python script
- a Node/Express backend
- a Tauri desktop app backend
- an Electron app backend
- a local API service
- a CLI tool
- a LangGraph / LlamaIndex / custom agent graph
- a Cursor/Claude-style rules runner

The conductor should not be treated as the LLM itself. The conductor is the workflow controller.

```text
Conductor = decision layer
Ollama    = model runtime
Model     = language brain
Skills    = reusable instructions
Rules     = guardrails and operating law
Tools     = hands that perform work
RAG       = memory and knowledge retrieval
```

---

# 4. Where Model Selection Happens

Model selection should happen before the request is sent to Ollama.

Example model router logic:

```text
if task.type == "code":
    model = "deepseek-coder"

if task.type == "frontend":
    model = "qwen-coder"

if task.type == "fast-chat":
    model = "llama"

if task.type == "long-writing":
    model = "mistral"

if task.type == "heavy-reasoning":
    model = "qwen"
```

Then the conductor sends:

```json
{
  "model": "deepseek-coder",
  "messages": [
    {
      "role": "user",
      "content": "packed prompt goes here"
    }
  ]
}
```

Ollama runs the model it is given. It does not normally pick the best model automatically.

---

# 5. Where RAG Happens

RAG happens before the final model call.

```text
User asks question
→ conductor sees knowledge is needed
→ RAG creates search query
→ retriever searches vector database / docs / repo
→ relevant chunks return
→ context packer adds chunks to prompt
→ model answers using those chunks
```

RAG can search:

- `docs/`
- `rules/`
- `skills/`
- `context/`
- local markdown files
- GitHub repo content
- embeddings database
- Postgres text records
- project notes
- saved chat summaries

---

# 6. Where Skills Fit

Skills should be selected before the final model call and before tool execution.

A skill can provide:

- task rules
- output format
- examples
- tool instructions
- command recipes
- project conventions
- safety checks
- validation steps

Skill flow:

```text
Task detected
→ skill router searches skill library
→ matching SKILL.md is loaded
→ reference files are loaded if needed
→ instructions are added to context pack
→ model receives the skill-guided prompt
```

---

# 7. Where the Two Rule Gates Fit

## Rule Gate 1: Before Agent + Skills

Purpose: decide what is allowed and how the task should be framed.

Use it for:

- system safety
- repo rules
- user style rules
- permission rules
- routing rules
- task classification rules

## Rule Gate 2: Before Tool Execution

Purpose: make sure the proposed action is safe and correctly shaped before real work happens.

Use it for:

- file safety
- command safety
- database safety
- output format checks
- test requirements
- review requirements
- final action approval

---

# 8. Recommended Repo Placement

This architecture belongs in:

```text
docs/ai-conductor-skills-architecture.md
```

Related files:

```text
README.md
rules/README.md
docs/rules-pipeline.md
docs/yousirjuan-platform-skills-master.md
skills/README.md
SKILL-INDEX.md
```

---

# 9. Practical Build Order

Build the system in this order:

1. Frontend prompt box
2. Conductor API
3. First rule gate
4. Agent selector
5. Skill router
6. RAG retriever
7. Context packer
8. Model router
9. Ollama call
10. Second rule gate
11. Tool executor
12. Review loop
13. Final output log

---

# 10. Clean Mental Model

```text
User gives the order.
Frontend receives the order.
Conductor understands the order.
Rules limit the order.
Agent owns the order.
Skills shape the order.
RAG feeds the order.
Model answers the order.
Rules check the action.
Tools perform the action.
Review confirms the result.
Frontend returns the result.
```

The podium is the conductor.

The conductor points to the agent, the skills, the RAG store, the model, and the tools.

Ollama is not the podium. Ollama is the local engine that runs the chosen model.
