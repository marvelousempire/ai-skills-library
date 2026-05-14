---
name: hardware-before-installer
id: RL-0018
keywords: [enforce-hardware, check-before, build-installer]
goal: Deliver hardware before installer output correctly and completely.
hash: 775aeed
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Hardware Before Installer

Before writing any installer script for a specific hardware target, write the hardware compatibility doc first. The compatibility doc surfaces constraints that change the installer's behavior — and finding those constraints after the installer is written means rewriting the installer.

## What the compatibility doc must answer before the installer is written

1. **What can and cannot run on this hardware?** (Xcode version caps, CUDA availability, GPU inference support)
2. **What's the recommended Ollama model for this CPU?** (Different models = different installer downloads)
3. **What's the memory-to-model mapping?** (8 GB RAM needs a different OLLAMA_MODEL than 64 GB RAM)
4. **Are there OS version constraints?** (macOS Ventura blocks Xcode 16 — that must go in the installer warning)
5. **What's the go-live path for this specific machine?** (LaunchAgent vs systemd vs pm2 varies by platform)

## The iMac 2017 lesson

We wrote the hardware doc (`docs/hardware/imac-2017-intel-i5.md`) before the installer. That doc revealed:
- Xcode 15 cap on Ventura → installer should warn about iOS 18 dev limitation
- CPU-only Ollama → installer should default to `llama3.2:3b` not `llama3.3:70b`
- No ROCm on macOS AMD → installer should not attempt GPU configuration

All three changed the installer meaningfully. Without the hardware doc first, the installer would have been wrong.

## The rule

```
docs/hardware/<machine>.md must exist and be reviewed
→ before
installers/<platform>/install.sh is written
```

## Template

See: `skills/templates/hardware-doc/TEMPLATE.md`
