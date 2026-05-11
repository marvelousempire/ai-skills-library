# 07 — Voice, Speech & Audio Skills Family

## Purpose

This family covers speech-to-text, text-to-speech, live voice chat, local voice servers, narration, audio memory, and assistant voice interfaces.

Use this family when the task involves:

- voice assistants
- local TTS
- speech-to-text
- meeting transcription
- audio memory
- narrated demos
- voice chat
- assistant voice output
- spoken onboarding

---

# Core Voice Stack

| Tool / Repo | Type | Purpose | You-Sir Juan Use | Status |
|---|---|---|---|---|
| Whisper | STT | speech-to-text transcription | turns voice notes, meetings, calls, and recordings into searchable memory | Active |
| Piper | TTS | local text-to-speech | fast local assistant voice output | Active |
| Kokoro | TTS | higher-quality local voice | premium local assistant voice and narration | Active |
| Kokoro-FastAPI | TTS server | API wrapper/server for Kokoro workflows | deployable local voice API for assistant speech services | Candidate |
| voxtral-tts.c | TTS/runtime | compact C-based TTS-style runtime candidate | lightweight local voice experiments and edge voice workflows | Candidate |
| voicebox | voice tooling | voice interface / voice workflow candidate | possible voice capture, playback, or assistant voice bridge | Candidate |
| voice-chat-ai | voice chat | conversational voice AI candidate | real-time voice assistant conversation patterns | Candidate |
| ElevenLabs | cloud voice | premium voice/narration | high-quality demos and narrated marketing assets when approved | Reference |
| Coqui TTS | open TTS | alternate local TTS | backup local voice option | Candidate |
| AudioCraft | audio generation | music and sound generation | future sound design and audio asset workflows | Candidate |

---

# Newly Tracked Repos

| Repo | Platform Role |
|---|---|
| `https://github.com/jamiepine/voicebox` | candidate voice interaction utility / voice workflow bridge |
| `https://github.com/mudler/voxtral-tts.c` | candidate lightweight local TTS runtime path |
| `https://github.com/bigsk1/voice-chat-ai` | candidate conversational voice assistant pattern |
| `https://github.com/remsky/Kokoro-FastAPI` | candidate FastAPI service wrapper for Kokoro-based voice output |

---

# Inputs

- voice notes
- meetings
- recordings
- phone/call audio
- assistant responses
- scripts
- onboarding text
- product demo scripts

---

# Outputs

- transcripts
- summaries
- memory records
- spoken responses
- narrated walkthroughs
- voice assistant output
- audio assets

---

# Voice-To-Memory Flow

```text
Audio Input
   ↓
Speech-To-Text
   ↓
Transcript Cleanup
   ↓
Chunking + Metadata
   ↓
Embedding
   ↓
Memory Store
   ↓
Assistant Retrieval
   ↓
Text-To-Speech Response
```

---

# Hardware Routing

| Hardware | Voice Role |
|---|---|
| Mac mini M4 Pro | always-on transcription and local voice API services |
| MacBook Pro M5 Max | voice testing, editing, demo creation, prompt design |
| Jetson Thor | edge voice, robotics voice, low-latency local speech |
| DGX Spark | multimodal voice-agent reasoning and heavier audio workflows |

---

# AI Routing Note

If the task involves listening, speaking, narrating, transcribing, or voice-based onboarding, route here first.

Default preference:

1. Local STT first.
2. Local TTS first.
3. Cloud voice only when explicitly approved.
4. Transcripts should become namespace-bound memory.
