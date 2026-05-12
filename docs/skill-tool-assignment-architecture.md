# Skill And Tool Assignment Architecture

This document explains how an AI system decides which skills and tools to use inside Cursor, Claude, RoofFlow / RUFLOW-style orchestration, or a custom conductor.

The main idea:

```text
The model does not magically know the correct tool order.
The system gives it rules, available tools, available skills, and a routing process.
The conductor or orchestrator decides what should load first, what should run next, and what should be checked before final output.
```

---

# 1. Big Picture

```text
╔══════════════════════════════════════════════════════════════════════════════╗
║              SKILL + TOOL ASSIGNMENT ARCHITECTURE                          ║
║        How Cursor / Claude / RoofFlow / Conductor Chooses What To Use       ║
╚══════════════════════════════════════════════════════════════════════════════╝


┌────────────────────┐
│  USER ORDER        │
│  "Fix this app"    │
└─────────┬──────────┘
          │ in: text / voice / click / file
          │ out: raw task request
          ▼

┌────────────────────┐
│  AI INTERFACE      │
│  Cursor / Claude   │
│  Custom UI / CLI   │
└─────────┬──────────┘
          │ in: raw request
          │ out: normalized task
          ▼

┌──────────────────────────────────────────────────────────────┐
│  CONDUCTOR / ORCHESTRATOR                                    │
│                                                              │
│  This can be:                                                │
│  • Cursor agent behavior                                     │
│  • Claude project rules                                      │
│  • RoofFlow / RUFLOW pipeline                                │
│  • custom Node/Python script                                 │
│  • local agent backend                                       │
│                                                              │
│  It decides:                                                 │
│  • What type of task is this?                                │
│  • Which rules apply?                                        │
│  • Which skills should load?                                 │
│  • Which tools are allowed?                                  │
│  • What order should happen?                                 │
│  • What needs review before output?                          │
└───────┬──────────────────────────────────────────────────────┘
        │ in: normalized task
        │ out: task route
        ▼

┌──────────────────────────────────────────────────────────────┐
│  TASK CLASSIFIER                                              │
│                                                              │
│  Converts the user order into a type.                         │
│                                                              │
│  Examples:                                                    │
│  • coding fix                                                 │
│  • UI design                                                  │
│  • file edit                                                  │
│  • repo search                                                │
│  • shell command                                              │
│  • marketing copy                                             │
│  • research answer                                            │
│  • database task                                              │
└───────┬──────────────────────────────────────────────────────┘
        │ in: task route
        │ out: task type + intent
        ▼

┌──────────────────────────────────────────────────────────────┐
│  RULE GATE 1                                                  │
│                                                              │
│  Rules are checked before skills/tools run.                   │
│                                                              │
│  Examples:                                                    │
│  • never delete files without permission                      │
│  • search before editing                                      │
│  • prefer project skills before general skills                │
│  • use repo rules before global rules                         │
│  • do not run risky terminal commands                         │
│  • cite source files when explaining repo facts               │
└───────┬──────────────────────────────────────────────────────┘
        │ in: task type + intent
        │ out: allowed task plan
        ▼

┌──────────────────────────────────────────────────────────────┐
│  SKILL MATCHER                                                │
│                                                              │
│  Looks through the skill library and chooses useful skills.   │
│                                                              │
│  It checks:                                                   │
│  • skill name                                                 │
│  • skill description                                          │
│  • trigger words                                              │
│  • project folder                                             │
│  • task type                                                  │
│  • required output                                            │
│  • related tools                                              │
└───────┬──────────────────────────────────────────────────────┘
        │ in: allowed task plan
        │ out: ranked skill list
        ▼

┌──────────────────────────────────────────────────────────────┐
│  SKILL LOADER                                                 │
│                                                              │
│  Loads the chosen skill instructions into the work context.   │
│                                                              │
│  Loads only what is needed:                                   │
│  • SKILL.md                                                   │
│  • reference files                                            │
│  • templates                                                  │
│  • command recipes                                            │
│  • validation rules                                           │
└───────┬──────────────────────────────────────────────────────┘
        │ in: ranked skill list
        │ out: active skill instructions
        ▼

┌──────────────────────────────────────────────────────────────┐
│  TOOL MATCHER                                                 │
│                                                              │
│  Chooses the tools needed to do the task.                     │
│                                                              │
│  Examples:                                                    │
│  • file search                                                │
│  • file read/write                                            │
│  • terminal                                                   │
│  • GitHub                                                     │
│  • browser                                                    │
│  • database                                                   │
│  • shell script                                               │
│  • API connector                                              │
│  • test runner                                                │
└───────┬──────────────────────────────────────────────────────┘
        │ in: task + active skills
        │ out: allowed tool list
        ▼

┌──────────────────────────────────────────────────────────────┐
│  ACTION PLANNER                                               │
│                                                              │
│  Creates the order of operations.                             │
│                                                              │
│  Example order:                                               │
│  1. search repo                                               │
│  2. read files                                                │
│  3. load matching skill                                       │
│  4. draft patch                                               │
│  5. write files                                               │
│  6. run tests                                                 │
│  7. summarize changes                                         │
└───────┬──────────────────────────────────────────────────────┘
        │ in: skills + tools
        │ out: ordered action plan
        ▼

┌──────────────────────────────────────────────────────────────┐
│  MODEL CALL                                                   │
│                                                              │
│  The selected model receives:                                 │
│  • user task                                                  │
│  • rules                                                      │
│  • active skills                                              │
│  • allowed tools                                              │
│  • action plan                                                │
│  • relevant files/context                                     │
└───────┬──────────────────────────────────────────────────────┘
        │ in: packed work context
        │ out: draft answer / tool request
        ▼

┌──────────────────────────────────────────────────────────────┐
│  RULE GATE 2                                                  │
│                                                              │
│  Checks the model's proposed action before real execution.    │
│                                                              │
│  Examples:                                                    │
│  • is this command safe?                                      │
│  • are file paths correct?                                    │
│  • is this the right skill?                                   │
│  • does this need user approval?                              │
│  • should tests run first?                                    │
└───────┬──────────────────────────────────────────────────────┘
        │ in: proposed action
        │ out: approved action
        ▼

┌──────────────────────────────────────────────────────────────┐
│  TOOL EXECUTOR                                                │
│                                                              │
│  Runs the approved tools in order.                            │
│                                                              │
│  Tool output becomes new context for the next step.           │
└───────┬──────────────────────────────────────────────────────┘
        │ in: approved action
        │ out: tool results
        ▼

┌──────────────────────────────────────────────────────────────┐
│  REVIEW LOOP                                                  │
│                                                              │
│  Checks if the result is good enough.                         │
│                                                              │
│  It may loop back to:                                         │
│  • skill matcher                                              │
│  • tool matcher                                               │
│  • action planner                                             │
│  • model call                                                 │
│  • tool executor                                              │
└───────┬──────────────────────────────────────────────────────┘
        │ in: tool results
        │ out: verified result
        ▼

┌────────────────────┐
│  FINAL OUTPUT      │
│  answer / patch    │
│  files / summary   │
└─────────┬──────────┘
          │ in: verified result
          │ out: user-visible result
          ▼

┌────────────────────┐
│  USER RECEIVES IT  │
└────────────────────┘
```

---

# 2. Simplest View

```text
┌─────┐   in: order    ┌───────────┐   out: task type   ┌───────────┐
│ YOU │───────────────►│ CONDUCTOR │───────────────────►│ RULES     │
└─────┘                └─────┬─────┘                    └─────┬─────┘
                             │ in: allowed task               │ out: safe plan
                             ▼                                ▼
                       ┌───────────┐                    ┌───────────┐
                       │ SKILLS    │◄───────────────────│ SKILL     │
                       │ LIBRARY   │  in: task type     │ MATCHER   │
                       └─────┬─────┘  out: skill pack   └───────────┘
                             │
                             │ in: active skill
                             │ out: needed tools
                             ▼
                       ┌───────────┐
                       │ TOOL      │
                       │ MATCHER   │
                       └─────┬─────┘
                             │ in: tool needs
                             │ out: tool order
                             ▼
                       ┌───────────┐
                       │ ACTION    │
                       │ PLANNER   │
                       └─────┬─────┘
                             │ in: plan
                             │ out: model/tool call
                             ▼
                       ┌───────────┐
                       │ MODEL +   │
                       │ TOOLS     │
                       └─────┬─────┘
                             │ out: result
                             ▼
                       ┌───────────┐
                       │ REVIEW    │
                       │ LOOP      │
                       └─────┬─────┘
                             │ out: final
                             ▼
                           ┌─────┐
                           │ YOU │
                           └─────┘
```

---

# 3. Cursor / Claude / RoofFlow Comparison

```text
┌──────────────────────┐
│ Cursor               │
├──────────────────────┤
│ Interface + agent    │
│ Reads repo files     │
│ Applies rules        │
│ Uses tools           │
│ Edits code           │
└──────────┬───────────┘
           │ role: IDE-side conductor
           ▼
┌──────────────────────┐
│ Skills / Rules       │
│ .cursor rules        │
│ project instructions │
│ repo context         │
└──────────────────────┘


┌──────────────────────┐
│ Claude               │
├──────────────────────┤
│ Chat/project agent   │
│ Uses instructions    │
│ Uses available tools │
│ Follows project docs │
└──────────┬───────────┘
           │ role: conversation-side conductor
           ▼
┌──────────────────────┐
│ Skills / Projects    │
│ project knowledge    │
│ custom instructions  │
│ tool permissions     │
└──────────────────────┘


┌──────────────────────┐
│ RoofFlow / RUFLOW    │
├──────────────────────┤
│ Workflow pipeline    │
│ Explicit steps       │
│ Can route tasks      │
│ Can call tools       │
└──────────┬───────────┘
           │ role: programmable conductor
           ▼
┌──────────────────────┐
│ Skills / Tools       │
│ task definitions     │
│ rules                │
│ action steps         │
│ validation gates     │
└──────────────────────┘
```

---

# 4. How The System Knows What Skill To Use

The system does not truly know by magic. It matches the task against skill metadata and rules.

```text
User says:
"Fix the login bug"

Conductor sees:
• task type = coding bug
• project = current repo
• needs files = yes
• needs terminal = maybe
• needs browser = maybe

Skill matcher searches:
• coding skills
• repo skills
• Cursor skills
• debugging skills
• project-specific skills

Best match loads:
• debugging workflow
• repo rules
• test rules
• output summary format
```

---

# 5. How The System Knows What Tool To Use

Tools are chosen based on what the current step requires.

```text
Need to understand repo?
→ use repo search / file search

Need to inspect code?
→ read file tool

Need to modify code?
→ write file tool

Need to verify code?
→ terminal / test runner

Need to update GitHub?
→ GitHub tool

Need current web facts?
→ browser / web search

Need stored knowledge?
→ RAG / vector database
```

---

# 6. Tool Order Example

```text
User:
"Add login validation and make sure tests pass"

Order:
1. Classify task
   in: raw request
   out: coding task

2. Apply rules
   in: coding task
   out: safe coding plan

3. Match skills
   in: safe coding plan
   out: coding + testing skills

4. Search repo
   in: login validation query
   out: matching files

5. Read files
   in: matching file paths
   out: code context

6. Ask model for plan
   in: code context + skills
   out: patch plan

7. Check second rules
   in: patch plan
   out: approved edits

8. Write files
   in: approved edits
   out: changed files

9. Run tests
   in: changed files
   out: pass/fail results

10. Review
    in: test results
    out: final summary or loop back

11. Return final output
    in: verified result
    out: user-facing answer
```

---

# 7. Best Mental Model

```text
Skills are training manuals.
Rules are laws and guardrails.
Tools are hands.
RAG is memory.
The model is the brain.
The conductor decides who uses what, when, and why.
RoofFlow / RUFLOW can act as the programmable conductor if it supports this routing pattern.
Cursor can act as the IDE conductor.
Claude can act as the conversation conductor.
A custom backend can act as the private full-control conductor.
```

---

# 8. Assignment Formula

```text
Task Type
+ Active Rules
+ Project Context
+ Skill Metadata
+ Tool Permissions
+ Risk Level
+ Desired Output
= Ordered Execution Plan
```

---

# 9. Practical Repo Use

Use this architecture to decide where new repo files belong.

```text
rules/
  Put global behavior, safety, repo discipline, and tool-use policy here.

skills/
  Put reusable workflows and task-specific instructions here.

docs/
  Put architecture explanations, routing diagrams, and system maps here.

context/
  Put project facts, product notes, and stable reference material here.

scripts/
  Put executable helpers that generate, sync, validate, or install rules/skills here.
```

---

# 10. Direct Answer

RoofFlow / RUFLOW is useful if the goal is to define an explicit workflow pipeline.

It is not the model.
It is not the skill itself.
It is not the tool itself.

It can be the conductor layer that says:

```text
First check rules.
Then select agent.
Then load skills.
Then choose tools.
Then run model.
Then execute tools.
Then validate.
Then return output.
```

That is why it fits the architecture.
