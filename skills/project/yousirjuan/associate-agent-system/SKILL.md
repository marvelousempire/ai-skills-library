---
name: associate-agent-system
id: SK-0125
keywords: [associate, agent, system]
domain: project/yousirjuan
status: Active
tool: Claude Code
description: >
  The 4-persona paradigm architecture powering You-Sir Juan OS. Each family member
  gets a named Associate Agent with its own voice, color world, label vocabulary,
  and persistent memory. Same backend functions, radically different presentation.
---

# Associate Agent System

## The architecture

```
Family member authenticates (face ID)
    ↓
api/src/identity.js: face_id → user_id
    ↓
api/src/personas.js: user_id → { paradigm, agent }
    ↓
Client renders:
  - CSS vars: --bg, --fg, --accent from paradigm
  - Layout class from paradigm.layout
  - Labels from paradigm.labelSet
  - Agent greeting from agent.greeting
  - TTS voice from agent.voice
```

## The four founding Associates

| userId | Member | Agent | Accent | Paradigm | Voice hint |
|---|---|---|---|---|---|
| `u_avery` | Avery Goodman | Sterling | `#7C5CFF` | executive-grid / serif-strong | `deep_male_calm` |
| `u_bobby` | Robert Bobby | Blake | `#FF6B35` | soft-stack / humanist-rounded | `warm_male_friendly` |
| `u_nivram` | NIVRAM | Cipher | `#00FF88` | developer-dense / monospace-sharp | `precise_neutral_tech` |
| `u_yousirjuan` | Yousir Juan | Sovereign | `#FFD700` | command-center / display-bold | `resonant_authority` |

## The five label sets

| labelSet | day | tasks | world | signOut | voice |
|---|---|---|---|---|---|
| `executive` | Today | Briefings | Operations | End session | Mic |
| `warm` | Your day | On your list | Home | See you later | Mic2 |
| `technical` | Session | Queue | Runtime | End session | Radio |
| `sovereign` | Agenda | Directives | Domain | Adjourn | MicVocal |
| `casual` | Right now | Stuff to do | World | Peace out | Mic |

## Persona data structure

```javascript
{
  userId: 'u_avery',
  name: 'Avery Goodman',
  household: 'yousirjuan',
  role: 'principal',
  paradigm: {
    palette: 'obsidian',
    accent: '#7C5CFF',
    background: '#0A0A12',
    foreground: '#F5F3FF',
    layout: 'executive-grid',
    labelSet: 'executive',
    typography: 'serif-strong',
    mood: 'focused',
  },
  agent: {
    name: 'Sterling',
    voice: 'deep_male_calm',
    persona: 'executive-associate',  // Ollama system prompt key
    avatar: null,
    greeting: 'Welcome back, Avery. The household is steady.',
  },
}
```

## System prompts (in api/src/ollama.js)

Each `persona` value maps to a system prompt that defines the agent's character:
- `executive-associate` → precise, formal, solution-oriented
- `warm-associate` → warm, direct, trusted advisor
- `technical-associate` → signal-dense, systematic, no fluff
- `sovereign-associate` → commanding, strategic, declarative

## iOS implementation

- `Sources/Support/ParadigmIcon.swift` — SF Symbols per paradigm × 5 icon kinds
- `Sources/Views/HomeWorldView.swift` — applies paradigm to layout, colors, labels
- `Sources/Views/AvatarRealityView.swift` — renders accent color in RealityKit orb
- `Sources/Services/Speech.swift` — maps voice hints to AVSpeechSynthesisVoice identifiers

## Web implementation

- `app/session-provider.tsx` — applies CSS vars from paradigm on session load
- `app/home/page.tsx` — LABEL_SETS object, LAYOUTS object, InlineIcon renderer
- `app/lib/paradigm-icons.ts` — icon map: 5 paradigms × 5 icon kinds

## Adding a fifth member

1. Add entry to `api/src/personas.js` store
2. Add face ID to `api/src/identity.js` faceIndex
3. Update `labelForUser()` in `apps/yousirjuan-ios/Sources/Views/AuthView.swift`
4. Update `labelForUser()` in `apps/yousirjuan-web/app/auth/page.tsx`
5. Design a paradigm (palette, accent, layout, labelSet, typography, mood)
6. Write a system prompt for the new agent persona in `api/src/ollama.js`
7. Add to `docs/marketing/02-associate-agents.md`

## Terminology
Never "butler", never "persona" in user-facing strings. Always "Associate Agent" or "Associate".
