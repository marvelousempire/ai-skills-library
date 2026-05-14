# [Machine Name] — You-Sir Juan OS Compatibility

## Machine specs

| Component | Spec | Notes |
|---|---|---|
| CPU | [Brand, GHz, cores/threads, microarch] | [AVX2? Neural Engine?] |
| GPU | [Model, VRAM] | [CUDA? ROCm? Metal?] |
| RAM | [GB, speed] | [Official max? Upgraded?] |
| OS | [macOS/Linux version] | [Latest supported?] |
| Xcode max | [Version if macOS] | [Target ceiling] |

---

## How it fits You-Sir Juan OS

**Tier:** [Sovereign / Standard / BYO] runtime node — [one-sentence role]

[2-3 sentences describing what this machine is good at and its key constraint]

---

## What it can run — and how well

### ✅ Full capability

| Service | Port | Notes |
|---|---|---|
| Express API | 4000 | |
| PostgreSQL | 5432 | |
| Redis | 6379 | |
| Qdrant | 6333 | |
| Next.js web app | 3000 | |
| Kokoro TTS | 8880 | CPU / GPU mode |

### ✅ Ollama — model selection

| Model | RAM needed | Speed estimate | Verdict |
|---|---|---|---|
| `llama3.2:3b` Q4_K_M | ~2 GB | [N] tok/sec | [✅/⚠️/❌] |
| `llama3.1:8b` Q4_K_M | ~5 GB | [N] tok/sec | [✅/⚠️/❌] |
| `llama3.3:70b` Q4_K_M | ~40 GB | [N] tok/sec | [✅/⚠️/❌] |

**Recommended:** `OLLAMA_MODEL=[model]` — [reason in plain language]

### ⚠️ or ❌ — limitations

[List anything this machine can't do and why]

---

## Recommended role

[One paragraph: how to use this machine in a household. What it runs, what it serves, where it sits in the mesh.]

---

## Quick capability summary

| Capability | Status |
|---|---|
| Backend API | ✅ / ⚠️ / ❌ |
| Web interface | ✅ / ⚠️ / ❌ |
| Voice turns (llama3.2:3b) | ✅ / ⚠️ / ❌ |
| iOS 18 app development | ✅ / ⚠️ / ❌ |
| GPU inference | ✅ / ⚠️ / ❌ |

---

## `.env` for this machine

```bash
PORT=4000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=[recommended-model]
SESSION_SECRET=change-me-before-deployment
POSTGRES_PASSWORD=sovereign
DATABASE_URL=postgresql://sovereign:sovereign@localhost:5432/yousirjuan
MEMORY_DIR=.data/memory
YOUSIRJUAN_API_URL=http://localhost:4000
KOKORO_URL=http://localhost:8880
```

---

## One-liner setup

```bash
curl -fsSL https://get.yousirjuan.ai/[platform] | sh
```
