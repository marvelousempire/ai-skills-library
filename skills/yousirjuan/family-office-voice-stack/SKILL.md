---
name: family-office-voice-stack
id: SK-YSJ-0201
domain: yousirjuan
status: Active
description: >
  Sovereign voice stack — M5 Holler/Parakeet edge, DGX Whisper/Fish fallback,
  tower-api routing tiers, no cloud TTS/STT.
---

# Family Office Voice Stack

## When to use

Voice, TTS, STT, Parakeet pad, Jarvis lane, or "which engine for talk-and-reply?"

## Architecture

| Tier | Engine | Host | Role |
|------|--------|------|------|
| premium | Holler (Qwen3-TTS) | M5 Max | Daily Jarvis voice |
| premium | F5-TTS / NeMo Riva | DGX | Clone / prime quality |
| fallback | Kokoro / speaches | DGX | Emergency only |
| STT | faster-whisper | M5 | Edge route |
| STT | nephew-whisper | DGX | Brain route |

**Jarvis = voice only.** Visual = Obsidian. Never cite retired Kokoro as primary.

## Operator commands (Nephew repo)

```bash
make ensure-m5-voice
make m5-voice-loop-probe
make cassette-line CHECK=voice
curl -s http://10.1.0.5:8088/api/v1/voice/tts  # route probe via CT
```

## Canonical docs

- YSJ `docs/setup/11-voice-parakeet-premium-stack.md`
- YSJ `docs/setup/28-voice-containers-whisper-fish-speech.md`
- Nephew `data/voice-config.json` · `docs/pockit/Parakeet-Voice-Cassette-Vanilla.md`

## Sovereign rule

No cloud speech APIs. `NEPHEW_EGRESS_DENY=1` on voice-related deploy overlays.
