# AI Conductor Skills Architecture

This document captures the full visual explanation from the planning chat and extends it with the rules, agent, skills, RAG, model routing, Ollama, tool execution, review, and return loop.

Core idea:

```text
The user does not talk directly to the model.
The user sends an order to the conductor.
The conductor decides which rules, agents, skills, memory, models, and tools must be used.
```

---

# 1. Original Local AI System Flow

```text
╔══════════════════════════════════════════════════════════════════╗
║                    YOUR OWN AI SYSTEM FLOW                     ║
║                  (Cursor / Ollama / Local AI)                  ║
╚══════════════════════════════════════════════════════════════════╝


                    YOU TYPE SOMETHING
                             │
                             │ in: words / voice / click
                             │ out: raw prompt
                             ▼

╔══════════════════════════════════════════════════════════════════╗
║                        YOUR INTERFACE                          ║
║                                                                ║
║  Examples:                                                     ║
║  • Custom GUI App                                              ║
║  • Cursor-like Interface                                       ║
║  • Command Line Tool                                           ║
║  • Voice Assistant                                             ║
║  • Web App                                                     ║
║                                                                ║
║  Built With:                                                   ║
║  • React                                                       ║
║  • Tauri                                                       ║
║  • Electron                                                    ║
║  • SwiftUI                                                     ║
║  • Python                                                      ║
║  • Framer / Motion                                             ║
╚══════════════════════════════════════════════════════════════════╝
                             │
                             │ in: raw prompt
                             │ out: clean request
                             ▼

╔══════════════════════════════════════════════════════════════════╗
║                 CONDUCTOR / MIDDLEMAN AGENT                    ║
║                                                                ║
║  This is the podium.                                           ║
║                                                                ║
║  It decides:                                                   ║
║  • Which rules apply                                           ║
║  • Which agent role should act                                 ║
║  • Which skill should load                                     ║
║  • Whether RAG is needed                                       ║
║  • Which model should run                                      ║
║  • Which tools may execute                                     ║
╚══════════════════════════════════════════════════════════════════╝
                             │
                             │ in: clean request
                             │ out: model + prompt + context
                             ▼

╔══════════════════════════════════════════════════════════════════╗
║                         OLLAMA SERVER                          ║
║                     (Runs in Background)                       ║
║                                                                ║
║  Think of Ollama like:                                         ║
║                                                                ║
║      "The Engine / Runtime Layer"                              ║
║                                                                ║
║  Ollama does:                                                  ║
║  • Loads AI models                                             ║
║  • Keeps them running                                          ║
║  • Gives API access                                            ║
║  • Handles token streaming                                     ║
║  • Lets apps talk to models                                    ║
║                                                                ║
║  Usually runs here:                                            ║
║                                                                ║
║      http://localhost:11434                                    ║
║                                                                ║
║  Meaning:                                                      ║
║  ONLY YOUR COMPUTER can see it                                 ║
╚══════════════════════════════════════════════════════════════════╝
                             │
                             │ in: selected model name + prompt
                             │ out: generated response
                             ▼

╔══════════════════════════════════════════════════════════════════╗
║                         LOCAL LLM MODEL                        ║
║                                                                ║
║  Examples:                                                     ║
║  • Llama                                                       ║
║  • DeepSeek                                                    ║
║  • Mistral                                                     ║
║  • Qwen                                                        ║
║  • Gemma                                                       ║
║                                                                ║
║  These are downloaded model files sitting on the computer.      ║
║                                                                ║
║  Example:                                                      ║
║      ollama pull llama3                                        ║
║                                                                ║
║  After download:                                               ║
║  The model can run locally on the machine.                     ║
╚══════════════════════════════════════════════════════════════════╝
                             │
                             │ in: packed prompt
                             │ out: answer / code / plan
                             ▼

╔══════════════════════════════════════════════════════════════════╗
║                     RESPONSE RETURNS BACK                      ║
║                                                                ║
║  Model → Ollama → Conductor → Your App → You                   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

# 2. What Cursor Is Really Doing

```text
             ┌────────────────────────────┐
             │        CURSOR APP          │
             └────────────┬───────────────┘
                          │ in: prompt + repo state
                          │ out: API request
                          ▼
             ┌────────────────────────────┐
             │      AI API / MODEL        │
             └────────────┬───────────────┘
                          │ in: request + context
                          │ out: answer / tool plan
                          ▼
             ┌────────────────────────────┐
             │   Reads Files / Terminal   │
             │   Executes Commands        │
             │   Modifies Code            │
             └────────────────────────────┘

Cursor is basically:

1. A polished interface
2. Connected to an AI model
3. Given permission to use tools
4. Able to read and write files
5. Wrapped in rules and repo context
```

---

# 3. Cloud Model vs Local Model

```text
CLOUD MODEL
────────────

You → Internet → OpenAI / Anthropic / other provider → Response

Pros:
• Powerful
• Fast
• Large models

Cons:
• Monthly cost
• Internet required
• Data leaves the local machine


LOCAL MODEL
────────────

You → Your Computer → Ollama / Local Runtime → Local Model → Response

Pros:
• Private
• Offline capable
• No per-call API fee
• Full local control

Cons:
• Slower on weak hardware
• Uses local CPU / GPU / RAM
• Smaller models may be less capable
```

---

# 4. Ollama Is Not The Model

```text
VERY IMPORTANT:

          OLLAMA ≠ THE AI MODEL

Ollama is the engine / runner.
The model is the brain file.


┌────────────────────┐
│      OLLAMA        │  ← engine / runtime
└─────────┬──────────┘
          │ in: model name + prompt
          │ out: generated response
          ▼
┌────────────────────┐
│      LLAMA 3       │  ← actual AI brain
└────────────────────┘
```

---

# 5. What The Custom System Becomes

```text
┌───────────────────────────────────────────────┐
│             YOUR OWN CURSOR                   │
├───────────────────────────────────────────────┤
│                                               │
│  Your UI                                      │
│  Your Commands                                │
│  Your Conductor                               │
│  Your Rules                                   │
│  Your Agents                                  │
│  Your Skills                                  │
│  Your Automations                             │
│  Your RAG / Memory                            │
│  Your Branding                                │
│  Your Workflow                                │
│                                               │
└───────────────────────┬───────────────────────┘
                        │ in: user order
                        │ out: routed task
                        ▼
┌───────────────────────────────────────────────┐
│            CONDUCTOR / PODIUM                 │
└───────────────────────┬───────────────────────┘
                        │ in: routed task
                        │ out: runtime request
                        ▼
┌───────────────────────────────────────────────┐
│                 OLLAMA                        │
└───────────────────────┬───────────────────────┘
                        │ in: model + prompt
                        │ out: model output
                        ▼
┌───────────────────────────────────────────────┐
│             LOCAL MODELS                      │
└───────────────────────────────────────────────┘
```

---

# 6. Simple Real-World Analogy

```text
YOU        = Boss
YOUR APP   = Front Desk Secretary
CONDUCTOR  = Office Manager / Podium
RULES      = Office Policy
AGENTS     = Specialized Staff
SKILLS     = Training Manuals
RAG        = File Cabinet / Library
OLLAMA     = Machine Room Engine
MODEL      = Genius Worker
TOOLS      = Hands / Equipment

Flow:

Boss says:
"Build me a website"

Secretary hears it
        │ in: spoken request
        │ out: clean order
        ▼
Office Manager checks policy
        │ in: clean order
        │ out: allowed plan
        ▼
Office Manager chooses staff + manual
        │ in: allowed plan
        │ out: agent + skill
        ▼
Office Manager checks file cabinet
        │ in: needed facts
        │ out: useful notes
        ▼
Machine room wakes genius worker
        │ in: model + packed prompt
        │ out: answer / work plan
        ▼
Hands perform the work
        │ in: safe action
        │ out: result
        ▼
Office Manager reviews it
        │ in: result
        │ out: final answer
        ▼
Boss receives finished result
```

---

# 7. Minimum Stack

```text
1. FRONTEND
─────────────────
GUI / CLI / app / voice interface

2. CONDUCTOR
─────────────────
Routes the order and controls the workflow

3. RULES
─────────────────
Defines what is allowed and how work must be shaped

4. AGENTS
─────────────────
Specialized roles for different work types

5. SKILLS LIBRARY
─────────────────
Reusable instructions, workflows, templates, and tool recipes

6. RAG / MEMORY
─────────────────
Searches docs, repo files, notes, context, embeddings, and saved knowledge

7. MODEL ROUTER
─────────────────
Chooses which model should run

8. OLLAMA
─────────────────
Runs local models

9. TOOL ACCESS
─────────────────
File editing, terminal, browser, database, APIs, GitHub

10. REVIEW LOOP
─────────────────
Checks results before returning output
```

---

# 8. Simple Command Flow

```text
You type:
─────────────────
"Make me a website"

Your app sends:
─────────────────
User input → Conductor

Conductor does:
─────────────────
1. Classifies task
2. Checks first rules
3. Selects web/app agent
4. Loads UI/design/coding skills
5. Searches RAG for project context
6. Packs prompt
7. Chooses coding model
8. Sends request to Ollama

Ollama receives:
─────────────────
Model name + packed prompt

Model thinks:
─────────────────
Generates code / plan / answer

Conductor receives:
─────────────────
Draft response / proposed tool calls

Second rules check:
─────────────────
Safe file paths / commands / test needs

Tools perform:
─────────────────
Write files / run npm / open preview

Review loop checks:
─────────────────
Did it work? Any fixes needed?

Your app receives:
─────────────────
Final answer + changed files + action log
```

---

# 9. Local AI System Architecture

```text
         ┌────────────────────┐
         │   YOU / HUMAN      │
         │────────────────────│
         │ • Type prompts     │
         │ • Voice commands   │
         │ • Click buttons    │
         │ • Drag files       │
         └─────────┬──────────┘
                   │ in: words / voice / files
                   │ out: user intent
                   ▼

┌──────────────────────────┐
│      YOUR FRONTEND       │
├──────────────────────────┤
│ • Custom GUI             │
│ • CLI Tool               │
│ • Mac App                │
│ • Web Dashboard          │
│ • iPhone App             │
│ • Voice Assistant        │
└────────────┬─────────────┘
             │ in: raw prompt
             │ out: clean request
             ▼

┌────────────────────────────────────────────────────────────────────────────┐
│                       CONDUCTOR / ORCHESTRATOR                             │
├────────────────────────────────────────────────────────────────────────────┤
│  PURPOSE:                                                                  │
│  Decide what should happen before any model runs.                          │
│                                                                            │
│  RESPONSIBILITIES:                                                         │
│  • classify the request                                                     │
│  • apply first rule gate                                                    │
│  • choose agent role                                                        │
│  • select skill pack                                                        │
│  • request RAG when needed                                                  │
│  • pack context                                                             │
│  • choose model                                                             │
│  • call Ollama                                                              │
│  • apply second rule gate                                                   │
│  • execute tools                                                            │
│  • review output                                                            │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │ in: clean request
                               │ out: selected model + packed prompt
                               ▼

┌────────────────────────────────────────────────────────────────────────────┐
│                             OLLAMA SERVER                                  │
├────────────────────────────────────────────────────────────────────────────┤
│  PURPOSE:                                                                  │
│  Ollama acts as the local AI runtime engine.                                │
│                                                                            │
│  RUNS AS:                                                                  │
│      Background service / daemon                                            │
│                                                                            │
│  EXPOSES API:                                                              │
│      http://localhost:11434                                                 │
└──────────────────────────────┬─────────────────────────────────────────────┘
                               │ in: model name + packed prompt
                               │ out: streamed tokens
                               ▼

          ┌────────────────────────────┐
          │       LOCAL MODELS         │
          ├────────────────────────────┤
          │                            │
          │  llama                     │
          │  deepseek-coder            │
          │  mistral                   │
          │  qwen                      │
          │  gemma                     │
          │                            │
          │  Downloaded to disk        │
          │  Runs on local hardware    │
          │                            │
          └────────────┬───────────────┘
                       │ in: packed prompt
                       │ out: answer / code / plan
                       ▼

╔══════════════════════════════════════════════════════════════════════════════╗
║                           RESPONSE GENERATED                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
                       ▲
                       │ in: model output
                       │ out: reviewed response
          ┌────────────┴───────────────┐
          │     CONDUCTOR REVIEW       │
          │  rules / tools / validation│
          └────────────┬───────────────┘
                       │ in: verified result
                       │ out: visible result
                       ▼

┌──────────────────────────┐
│      YOUR FRONTEND       │
├──────────────────────────┤
│ • Shows response         │
│ • Writes files           │
│ • Executes commands      │
│ • Updates UI             │
│ • Runs automations       │
└────────────┬─────────────┘
             │ in: final result
             │ out: user-visible answer
             ▼

        ┌───────────┐
        │   YOU     │
        └───────────┘
```

---

# 10. Cursor-Like System With File + Terminal Tools

```text
   ┌──────────────┐                          ┌─────────────────────┐
   │              │                          │                     │
   │ Cursor UI    │◄──── HTTPS / API ──────►│  AI Provider API    │
   │              │ in: prompt + repo        │ out: model answer   │
   └──────┬───────┘                          └─────────┬───────────┘
          │                                            │
          │ out: file/tool requests                    │ in: packed context
          │                                            ▼
          │                               ┌────────────────────────┐
          │                               │     Large Models       │
          │                               └────────────────────────┘
          │
          ▼
 ┌───────────────────────┐
 │  File System Access   │
 ├───────────────────────┤
 │ • Read files          │
 │ • Write files         │
 │ • Edit code           │
 │ • Create folders      │
 └──────────┬────────────┘
            │ in: file action
            │ out: changed files
            ▼
 ┌───────────────────────┐
 │   Terminal Access     │
 ├───────────────────────┤
 │ • npm install         │
 │ • git commit          │
 │ • docker compose      │
 │ • python scripts      │
 └───────────────────────┘
```

---

# 11. Your Own Local Version Of Cursor

```text
     ┌────────────────────┐
     │   YOUR CUSTOM UI   │
     │────────────────────│
     │ • Chat Window      │
     │ • Voice Input      │
     │ • File Explorer    │
     │ • Agent Controls   │
     │ • Memory Panel     │
     └─────────┬──────────┘
               │ in: prompt / click / voice
               │ out: normalized request
               ▼

     ┌────────────────────┐
     │    CONDUCTOR       │
     │────────────────────│
     │ • rules            │
     │ • agents           │
     │ • skills           │
     │ • RAG              │
     │ • model router     │
     │ • tool executor    │
     └─────────┬──────────┘
               │ in: task + context
               │ out: Ollama API call
               ▼

     ┌────────────────────┐
     │    OLLAMA API      │
     │────────────────────│
     │ localhost:11434    │
     │                    │
     │ /api/generate      │
     │ /api/chat          │
     │ /api/tags          │
     └─────────┬──────────┘
               │ in: model name + prompt
               │ out: model response
               ▼

     ┌────────────────────┐
     │    LOCAL MODEL     │
     │────────────────────│
     │ llama              │
     │ deepseek-coder     │
     │ qwen               │
     └─────────┬──────────┘
               │ in: packed prompt
               │ out: answer / code
               ▼

     ┌────────────────────┐
     │   TOOL SYSTEMS     │
     │────────────────────│
     │ • File access      │
     │ • Terminal         │
     │ • Browser control  │
     │ • Database access  │
     │ • SSH              │
     └────────────────────┘
```

---

# 12. Ollama Is Like Docker For AI

```text
              ┌──────────────────────────┐
              │        DOCKER            │
              │──────────────────────────│
              │ Runs Containers          │
              └────────────┬─────────────┘
                           │ in: image name + config
                           │ out: running container
                           ▼
                 ┌─────────────────┐
                 │   Containers    │
                 └─────────────────┘


              ┌──────────────────────────┐
              │        OLLAMA            │
              │──────────────────────────│
              │ Runs AI Models           │
              └────────────┬─────────────┘
                           │ in: model name + prompt
                           │ out: model response
                           ▼
                 ┌─────────────────┐
                 │   AI Models     │
                 └─────────────────┘
```

---

# 13. What localhost:11434 Means

```text
        ┌─────────────────────────────────────┐
        │         YOUR COMPUTER               │
        │                                     │
        │   ┌──────────────────────────┐      │
        │   │     YOUR APP             │      │
        │   └──────────┬───────────────┘      │
        │              │ in: prompt           │
        │              │ out: API request     │
        │              ▼                      │
        │   ┌──────────────────────────┐      │
        │   │      CONDUCTOR           │      │
        │   └──────────┬───────────────┘      │
        │              │ in: routed task      │
        │              │ out: model request   │
        │              ▼                      │
        │   ┌──────────────────────────┐      │
        │   │      OLLAMA API          │      │
        │   │     Port 11434           │      │
        │   └──────────┬───────────────┘      │
        │              │ in: model + prompt   │
        │              │ out: response        │
        │              ▼                      │
        │   ┌──────────────────────────┐      │
        │   │      AI MODEL            │      │
        │   └──────────────────────────┘      │
        │                                     │
        └─────────────────────────────────────┘

"localhost" means:

     "THIS SAME COMPUTER"

No internet is required for the local model path.
```

---

# 14. Example Real API Flow

```text
YOU TYPE:
────────────────────────────────────────
"Create a React dashboard"

YOUR APP SENDS TO CONDUCTOR:
────────────────────────────────────────
POST http://localhost:<your-conductor-port>/task

{
  "input": "Create a React dashboard"
}

CONDUCTOR BUILDS:
────────────────────────────────────────
{
  "task_type": "frontend-code",
  "rule_gate_1": "passed",
  "agent": "frontend-builder",
  "skills": ["ui-ux-pro-max", "cursor-code-workflow"],
  "rag_chunks": ["project notes", "design rules"],
  "selected_model": "qwen-coder"
}

CONDUCTOR SENDS TO OLLAMA:
────────────────────────────────────────
POST http://localhost:11434/api/chat

{
  "model": "qwen-coder",
  "messages": [
    {
      "role": "user",
      "content": "Use these rules, skills, and docs. Create a React dashboard..."
    }
  ]
}

OLLAMA RECEIVES:
────────────────────────────────────────
• Reads request
• Finds qwen-coder
• Loads model into RAM if needed
• Sends prompt to model

MODEL THINKS:
────────────────────────────────────────
• Predicts tokens
• Generates code
• Builds response

OLLAMA STREAMS RESPONSE:
────────────────────────────────────────
{
  "response": "import React from ..."
}

CONDUCTOR CHECKS RESPONSE:
────────────────────────────────────────
• Rule Gate 2
• file safety
• command safety
• output format
• test plan

TOOLS EXECUTE:
────────────────────────────────────────
• Creates files
• Runs npm install
• Opens preview
• Runs tests

YOUR APP RECEIVES:
────────────────────────────────────────
• Final summary
• File changes
• Action log
• Next steps
```

---

# 15. Full Conductor + Rules + Agent + Skills + RAG + Model Flow

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
│  • Do we need rules?                         │
│  • Do we need an agent?                      │
│  • Do we need skills?                        │
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
│  • Fast chat → llama                         │
│  • Long writing → mistral                    │
│  • Math/reasoning → qwen                     │
│                                              │
│  This is NOT automatic unless it is built.   │
│  Ollama only runs the model it is given.     │
└─────────┬────────────────────────────────────┘
          │  in: model choice
          │ out: Ollama request
          ▼

┌──────────────────────────────────────────────┐
│  OLLAMA                                      │
│                                              │
│  Ollama is the engine.                       │
│  It does NOT decide the whole workflow.      │
│                                              │
│  It receives:                                │
│  • model name                                │
│  • prompt                                    │
│  • context from RAG                          │
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

---

# 16. Expanded Order-Based Flow With Skills Library

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║      ORDER → RULES → AGENT → SKILLS → SECOND RULES → TASK → ROUND TRIP     ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────┐
│  USER ORDER        │
│  "Make this app"   │
└─────────┬──────────┘
          │ in: spoken / typed order
          │ out: raw instruction
          ▼

┌────────────────────┐
│  UI / INPUT LAYER  │
│  app / CLI / voice │
└─────────┬──────────┘
          │ in: raw instruction
          │ out: normalized order
          ▼

┌──────────────────────────────────────────────────────────────┐
│  CONDUCTOR / PODIUM                                          │
│                                                              │
│  The conductor receives the order and points the system       │
│  toward rules, agents, skills, RAG, models, and tools.        │
└───────┬──────────────────────────────────────────────────────┘
        │ in: normalized order
        │ out: task classification
        ▼

┌──────────────────────────────────────────────────────────────┐
│  FIRST RULE LIBRARY                                           │
│                                                              │
│  Before any agent acts, the request passes through rules.     │
│                                                              │
│  Examples:                                                    │
│  • safety rules                                               │
│  • repo rules                                                 │
│  • tone rules                                                 │
│  • coding rules                                               │
│  • file rules                                                 │
│  • ask-before-risk rules                                      │
│  • output format rules                                        │
└───────┬──────────────────────────────────────────────────────┘
        │ in: task classification
        │ out: allowed task plan
        ▼

┌──────────────────────────────────────────────────────────────┐
│  AGENT SELECTOR                                               │
│                                                              │
│  The conductor chooses the worker role.                       │
│                                                              │
│  Examples:                                                    │
│  • coder agent                                                │
│  • frontend agent                                             │
│  • UI/UX agent                                                │
│  • research agent                                             │
│  • repo maintainer agent                                      │
│  • automation agent                                           │
└───────┬──────────────────────────────────────────────────────┘
        │ in: allowed task plan
        │ out: selected agent role
        ▼

┌──────────────────────────────────────────────────────────────┐
│  SKILLS LIBRARY ROUTER                                        │
│                                                              │
│  The conductor now searches the library of skills.            │
│                                                              │
│  It can inspect:                                              │
│  • skills/                                                    │
│  • rules/                                                     │
│  • docs/                                                      │
│  • context/                                                   │
│  • SKILL-INDEX.md                                             │
│  • project-specific skills                                    │
│  • external bridge skills                                     │
└───────┬──────────────────────────────────────────────────────┘
        │ in: selected agent + task type
        │ out: matching skill pack
        ▼

┌──────────────────────────────────────────────────────────────┐
│  SKILL LOAD                                                   │
│                                                              │
│  The chosen skill contributes instructions.                   │
│                                                              │
│  A skill may provide:                                         │
│  • workflow steps                                             │
│  • required format                                            │
│  • tool instructions                                          │
│  • examples                                                   │
│  • validation checks                                          │
│  • command recipes                                            │
│  • project conventions                                        │
└───────┬──────────────────────────────────────────────────────┘
        │ in: matching skill pack
        │ out: skill instructions
        ▼

┌──────────────────────────────────────────────────────────────┐
│  RAG / KNOWLEDGE LOOKUP                                       │
│                                                              │
│  The conductor decides whether extra facts are needed.        │
│                                                              │
│  RAG can search:                                              │
│  • docs                                                       │
│  • repo files                                                 │
│  • markdown notes                                             │
│  • vector database                                            │
│  • embeddings                                                 │
│  • project memory                                             │
│  • previous summaries                                         │
└───────┬──────────────────────────────────────────────────────┘
        │ in: search need
        │ out: useful knowledge chunks
        ▼

┌──────────────────────────────────────────────────────────────┐
│  SECOND RULE LIBRARY / SETUP RULES                            │
│                                                              │
│  These rules set up the action before execution.              │
│                                                              │
│  Examples:                                                    │
│  • choose output structure                                    │
│  • check file paths                                           │
│  • block unsafe commands                                      │
│  • require tests                                              │
│  • require citations                                          │
│  • require action log                                         │
│  • require rollback note                                      │
└───────┬──────────────────────────────────────────────────────┘
        │ in: skills + RAG + proposed action
        │ out: safe execution package
        ▼

┌──────────────────────────────────────────────────────────────┐
│  CONTEXT PACKER                                               │
│                                                              │
│  Builds one clean package for the model.                      │
│                                                              │
│  Package contains:                                            │
│  • user order                                                 │
│  • first rules                                                │
│  • selected agent                                             │
│  • selected skills                                            │
│  • RAG chunks                                                 │
│  • second rules                                               │
│  • available tools                                            │
│  • desired output                                             │
└───────┬──────────────────────────────────────────────────────┘
        │ in: everything gathered
        │ out: final packed prompt
        ▼

┌──────────────────────────────────────────────────────────────┐
│  MODEL ROUTER                                                 │
│                                                              │
│  Chooses which model should receive the packed prompt.        │
│                                                              │
│  Example:                                                     │
│  • coding → deepseek-coder / qwen-coder                       │
│  • design → qwen / multimodal model                           │
│  • writing → mistral / llama                                  │
│  • reasoning → qwen / deepseek                                │
└───────┬──────────────────────────────────────────────────────┘
        │ in: packed prompt
        │ out: model name + request
        ▼

┌──────────────────────────────────────────────────────────────┐
│  OLLAMA / MODEL RUNTIME                                       │
│                                                              │
│  Ollama receives the chosen model name and packed prompt.     │
│  Ollama runs the model. It does not act as the conductor.     │
└───────┬──────────────────────────────────────────────────────┘
        │ in: model name + packed prompt
        │ out: draft answer / plan / tool call
        ▼

┌──────────────────────────────────────────────────────────────┐
│  TOOL EXECUTION                                                │
│                                                              │
│  The system performs the task if action is required.          │
│                                                              │
│  Tools may include:                                           │
│  • file writer                                                │
│  • terminal                                                   │
│  • GitHub                                                     │
│  • browser                                                    │
│  • database                                                   │
│  • APIs                                                       │
└───────┬──────────────────────────────────────────────────────┘
        │ in: approved action
        │ out: task result
        ▼

┌──────────────────────────────────────────────────────────────┐
│  REVIEW / VALIDATION LOOP                                     │
│                                                              │
│  The conductor checks the result before returning it.         │
│                                                              │
│  It may loop back to:                                         │
│  • RAG                                                        │
│  • skills                                                     │
│  • rules                                                      │
│  • model router                                               │
│  • tool executor                                              │
└───────┬──────────────────────────────────────────────────────┘
        │ in: task result
        │ out: verified result
        ▼

┌────────────────────┐
│  FINAL OUTPUT      │
│  answer / files    │
│  action log        │
└─────────┬──────────┘
          │ in: verified result
          │ out: human-readable result
          ▼

┌────────────────────┐
│  USER RECEIVES IT  │
└────────────────────┘
```

---

# 17. Short Final Route

```text
┌─────┐   in: order      ┌───────────┐   out: route      ┌────────────┐
│ YOU │─────────────────►│ CONDUCTOR │──────────────────►│ RULE GATE 1│
└─────┘                  └─────┬─────┘                   └─────┬──────┘
                               │ in: allowed plan              │ out: safe plan
                               ▼                               ▼
                         ┌───────────┐                   ┌────────────┐
                         │ AGENT     │◄──────────────────│ SKILL LIB  │
                         │ SELECTOR  │  out: skill match │ ROUTER     │
                         └─────┬─────┘                   └─────┬──────┘
                               │ in: agent + skill             │ out: facts need
                               ▼                               ▼
                         ┌───────────┐                   ┌────────────┐
                         │ RAG       │──────────────────►│ CONTEXT    │
                         │ MEMORY    │ out: chunks       │ PACKER     │
                         └───────────┘                   └─────┬──────┘
                                                               │ out: packed prompt
                                                               ▼
                         ┌───────────┐                   ┌────────────┐
                         │ MODEL     │──────────────────►│ OLLAMA     │
                         │ ROUTER    │ out: model name   │ RUNTIME    │
                         └───────────┘                   └─────┬──────┘
                                                               │ out: model response
                                                               ▼
                         ┌───────────┐                   ┌────────────┐
                         │ RULE      │──────────────────►│ TOOL       │
                         │ GATE 2    │ out: safe action  │ EXECUTOR   │
                         └───────────┘                   └─────┬──────┘
                                                               │ out: result
                                                               ▼
                                                        ┌────────────┐
                                                        │ REVIEW     │
                                                        │ LOOP       │
                                                        └─────┬──────┘
                                                              │ out: final result
                                                              ▼
                                                            ┌─────┐
                                                            │ YOU │
                                                            └─────┘
```

---

# 18. Clean Mental Model

```text
User gives the order.
Frontend receives the order.
Conductor understands the order.
First rules limit and shape the order.
Agent owns the order.
Skills teach the agent how to do the order.
RAG feeds the agent needed knowledge.
Second rules set up the safe action package.
Context packer prepares the model prompt.
Model router chooses the model.
Ollama runs the chosen model.
Tools perform the approved work.
Review loop checks the result.
Frontend returns the final result.
```

The podium is the conductor.

The conductor points to:

```text
rules
agents
skills
RAG / memory
models
Ollama
tools
review loop
```

Ollama is not the podium. Ollama is the local engine that runs the selected model.

---

# 19. Practical Build Order

```text
1. Build frontend prompt box
2. Build conductor API
3. Add first rule gate
4. Add agent selector
5. Add skill router
6. Add skill loader
7. Add RAG retriever
8. Add context packer
9. Add model router
10. Add Ollama call
11. Add second rule gate
12. Add tool executor
13. Add review loop
14. Add final output log
15. Add repo sync / GitHub memory
```

---

# 20. Repo Placement

This document belongs at:

```text
docs/ai-conductor-skills-architecture.md
```

Related repo areas:

```text
README.md
SKILL-INDEX.md
rules/README.md
docs/rules-pipeline.md
docs/yousirjuan-platform-skills-master.md
skills/README.md
skills/ide/cursor/
skills/external/
context/
```
