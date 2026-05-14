---
name: bash-installer-oneliners
id: SK-0126
keywords: [bash, installer, oneliners]
domain: project/yousirjuan
status: Active
tool: Claude Code
description: >
  Production-quality bash installer structure for You-Sir Juan OS one-liners.
  Covers: detect → deps → clone/update → configure → services → model → LaunchAgent → open.
  Paired with GitHub Actions release pipeline and VPS nginx serving.
---

# Bash Installer One-liners

## The URL architecture

```
User runs:
  curl -fsSL https://get.yousirjuan.ai/<platform> | sh

VPS nginx redirects to:
  https://github.com/marvelousempire/yousirjuan-ai/releases/latest/download/install-<platform>.sh

GitHub Actions publishes that artifact when a semver tag is pushed.
```

## Installer structure (required sections in order)

```bash
#!/usr/bin/env bash
set -euo pipefail
trap 'printf "Failed at line %s\n" "$LINENO"' ERR

# ── Config ────────────────────────────────────────────────────────────────────
# All defaults here, overridable by env var before running

# ── Logging ───────────────────────────────────────────────────────────────────
# tee to log file; user sees colors AND log is saved

# ── Helpers ───────────────────────────────────────────────────────────────────
# step/note/ok/warn/die/have/banner functions

# ── 1. Preflight ──────────────────────────────────────────────────────────────
# Verify OS, architecture, RAM, disk space

# ── 2. Dependencies ───────────────────────────────────────────────────────────
# Homebrew → Git → Node (nvm) → pnpm → Docker → Ollama
# Each: if ! have X → install X; else ok "X already installed"

# ── 3. Clone or update repo ───────────────────────────────────────────────────
# if .git exists: git pull; else: git clone
# Always: git submodule update --init --recursive

# ── 4. Configure .env ─────────────────────────────────────────────────────────
# Only write if file doesn't exist (idempotent)
# Generate SESSION_SECRET with: openssl rand -hex 32
# Write platform-appropriate OLLAMA_MODEL

# ── 5. Node deps ─────────────────────────────────────────────────────────────
# pnpm install --frozen-lockfile in root AND apps/yousirjuan-web

# ── 6. Docker services ────────────────────────────────────────────────────────
# docker compose up -d <specific services>
# Wait for Postgres health check

# ── 7. Ollama model ───────────────────────────────────────────────────────────
# Start ollama serve if not running
# ollama pull $OLLAMA_MODEL (skip if already present)

# ── 8. LaunchAgent (macOS) or systemd unit (Linux) ────────────────────────────
# Write plist/service file
# Load it (launchctl load / systemctl enable)

# ── 9. Start web app ──────────────────────────────────────────────────────────
# Background: pnpm dev &>/dev/null &
# Wait for port to respond

# ── 10. Done ─────────────────────────────────────────────────────────────────
# Print box with URLs
# open http://localhost:3000
```

## Platform model selection

| Platform | OLLAMA_MODEL | Why |
|---|---|---|
| Mac mini M4 Pro (48GB) | `llama3.2:3b` or `llama3.1:8b` | Apple Silicon CPU fast enough for either |
| iMac 2017 Intel i5 (64GB) | `llama3.2:3b` | CPU-only; 3b gives real-time voice |
| MacBook Pro M5 Max (128GB) | `llama3.3:70b` | 128GB unified = full 70b via MLX |
| Raspberry Pi 5 (8GB) | `qwen2.5:0.5b` or `llama3.2:1b` | Memory-constrained; tiny models only |
| Linux VPS (8GB RAM) | `llama3.2:3b` | Balanced for server use |

## GitHub Actions release pattern

```yaml
# .github/workflows/release-<platform>.yml
on:
  push:
    tags: ["v*.*.*"]

jobs:
  validate:
    runs-on: <matching-os-runner>
    steps:
      - bash -n installers/<platform>/install.sh   # syntax check
      - shellcheck --severity=error ...             # lint

  publish:
    needs: validate
    steps:
      - cp installers/<platform>/install.sh install-<platform>.sh
      - sha256sum install-<platform>.sh > install-<platform>.sh.sha256
      - gh release create/upload to marvelousempire/yousirjuan-ai
```

## VPS nginx config pattern

```nginx
location = /<platform> {
    return 302 https://github.com/marvelousempire/yousirjuan-ai/releases/latest/download/install-<platform>.sh;
}
location = /<platform>/sha256 {
    return 302 ...sha256;
}
location = /<platform>/guide {
    return 302 https://github.com/marvelousempire/yousirjuan/blob/main/installers/<platform>/README.md;
}
```

## Idempotency requirements

Every step must be safe to re-run:
- Dependency installs: `if ! have X; then install`
- Repo: `if .git exists: pull; else: clone`
- `.env`: `if [[ ! -f .env ]]; then write`
- LaunchAgent: `if [[ ! -f $PLIST ]]; then write and load`
- Ollama model: `if ! ollama list | grep -q model; then pull`

## Template

See: `skills/templates/installer-script/TEMPLATE.sh`
