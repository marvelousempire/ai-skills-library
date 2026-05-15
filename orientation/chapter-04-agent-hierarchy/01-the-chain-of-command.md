# Chapter 4 — The Agent Hierarchy

## Section 4.1 — The Dealer (National Distributor) = Nephew (Managing Trustee)

**Nephew IS the Dealer.** They are the same entity, two names for the same role.

- **Nephew** is the name of the agent and its implementation (`agents/nephew.md`)
- **Dealer** is the name of the distribution role it holds
- **Managing Trustee** is the title — the one who holds authority and decides who gets what

Nephew is the highest authority over work distribution in the library. Every incoming task, question, request, and signal — regardless of source — passes through Nephew first. Nephew classifies, prioritizes, packages, and routes to the correct Orchestrator (Operator).

Nephew decides which Operator gets which Order Request. That is the complete statement of the Dealer role.

**Nephew does not do the work. Nephew routes it.**

See `agents/nephew.md` for the full implementation specification.

## Section 4.2 — The Orchestrator (Local Distributor)

The Orchestrator is one tier below the Dealer. It receives work packages from the Dealer and manages local distribution — assigning work through the Receiving Chain and then routing pure output to the correct skill, rule, or agent.

**The Orchestrator supervises the chain. The Dealer tracks it nationally.**

## Section 4.3 — The Receiving Chain

Every incoming shipment is processed through 7 departments in strict order:

```
1. Scather      — scrapes the raw surface
2. Decanter     — separates essence from noise
3. Analyzer     — deep structural examination
4. Appropriator — distinguishes and classifies
5. Validator    — checks against standards
6. Inspector    — quality control
7. Stripper     — final distillation to pure core
```

Nothing skips a department. Nothing moves out of order. Each department has one job.

## Section 4.4 — The Question Decomposer

A specialized receiving agent for incoming questions and prompts. Decomposes every raw question into: (1) concise form ≤20 words, (2) function label → skill ID. Logs to `docs/faq/question-log.md`. Part of the intake chain for all question-type shipments.

## Section 4.5 — The Catchall Processor

Handles all shipments that exit the Receiving Chain without a matching skill. Routes by score: ≥4.0 = handled, 2-3.9 = needs-human, <2.0 = proposed. Files skill proposals for everything it cannot handle. The library has no permanent blind spots.

## Section 4.6 — The Full Chain of Command

```
DEALER (National Distributor — top authority)
    ↓ routes to
ORCHESTRATOR (Local Distributor)
    ↓ assigns to
RECEIVING CHAIN (7 departments)
    ↓ pure output routes to
SKILL / RULE / AGENT (executes the work)
    ↓ output reported back through
ORCHESTRATOR → DEALER
```
