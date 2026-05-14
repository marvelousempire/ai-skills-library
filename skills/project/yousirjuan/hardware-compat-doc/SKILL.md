---
name: hardware-compat-doc
domain: project/yousirjuan
status: Active
tool: Claude Code
description: >
  How to write a hardware compatibility doc for You-Sir Juan OS. Covers: capability
  matrix, Ollama model selection with token/sec estimates, Xcode/SDK ceilings,
  recommended .env block, and role assignment in the hardware topology.
---

# Hardware Compatibility Doc

## When to write one

Any time a family member, customer, or team member asks "can I run this on my [machine]?"
Write the doc before writing the installer for that machine.

## Required sections

### 1. Machine specs table
```markdown
| Component | Spec | Notes |
|---|---|---|
| CPU | Intel Core i5 3.4GHz (Kaby Lake) | 4C/4T, AVX2 |
| GPU | Radeon Pro 560, 4GB | AMD — no CUDA on macOS |
| RAM | 64 GB DDR4-2667 | Unofficial upgrade; recognized |
| OS | macOS Ventura 13.7.8 | Latest supported; Sonoma requires OCLP |
| Xcode max | Xcode 15.4 | Cannot build iPadOS 18 |
```

### 2. Role assignment
One sentence: what role does this machine play in the You-Sir Juan OS ecosystem?
- Always-on runtime node
- Developer workstation
- BYO interface device
- Edge node

### 3. Capability matrix with status
```markdown
| Capability | Status | Notes |
|---|---|---|
| Backend API | ✅ Full | |
| Ollama voice turns | ✅ With llama3.2:3b | 2-4 sec response |
| Build iOS 18 app | ❌ | Ventura/Xcode 15 cap |
| Use iOS app on real iPad | ✅ | Point iPad at this machine's IP |
| 70b LLM inference | ⚠️ Loads but slow | 0.5 tok/sec |
```

### 4. Ollama model table with speed estimates
```markdown
| Model | RAM needed | Speed estimate | Verdict |
|---|---|---|---|
| llama3.2:3b Q4_K_M | ~2 GB | 8-15 tok/sec | ✅ Recommended — real-time voice |
| llama3.1:8b Q4_K_M | ~5 GB | 3-6 tok/sec | ✅ Acceptable |
| llama3.3:70b Q4_K_M | ~40 GB | 0.5-1 tok/sec | ❌ Too slow for voice |
```

Speed estimates for common CPUs:
- Intel i5 3.4GHz (4C): 8-15 tok/sec for 3b models
- Intel i7 (8C): 15-25 tok/sec for 3b models
- Apple M4 Pro: 60-90 tok/sec for 3b, 15-25 for 8b
- Apple M5 Max: 80-120 tok/sec for 3b, 20-35 for 8b
- (Times vary with quantization and thermal state)

### 5. Ready-to-paste .env block
```bash
PORT=4000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b  # Best for this CPU
SESSION_SECRET=change-me
POSTGRES_PASSWORD=sovereign
DATABASE_URL=postgresql://sovereign:sovereign@localhost:5432/yousirjuan
MEMORY_DIR=.data/memory
YOUSIRJUAN_API_URL=http://localhost:4000
KOKORO_URL=http://localhost:8880
```

### 6. Cross-reference to installer
```markdown
## One-liner setup
curl -fsSL https://get.yousirjuan.ai/<platform> | sh
See: installers/<platform>/install.sh
```

## File location

```
docs/hardware/<machine-identifier>.md
```

Convention: `imac-2017-intel-i5.md`, `macmini-m4-pro.md`, `raspberry-pi-5.md`

## Template

See: `skills/templates/hardware-doc/TEMPLATE.md`

## Existing docs in this repo

- `docs/hardware/apple-device-stack.md` — MacBook Pro M5 Max + Mac mini M4 Pro
- `docs/hardware/imac-2017-intel-i5.md` — iMac 2017, 64GB, Intel i5
- `hardware/dgx-spark-frontier-node.md` — NVIDIA DGX Spark
