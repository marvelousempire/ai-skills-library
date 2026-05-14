# After-Action Report — Family Interface MVP
**Date:** 2026-05-14
**Session duration:** Full day
**Operator:** NIVRAM / marvelousempire
**Repo:** marvelousempire/yousirjuan

---

## What we set out to do
Build the You-Sir Juan™ family interface: a private AI operating system for a family office, with a walk-up biometric kiosk, four personalized Associate Agents, voice-first conversation, and a cinematic iOS + web interface.

## What shipped

### Product vision documented
- README: "Yours to Train" differentiator + "The Interface" UX vision + Hardware SKUs section
- `docs/marketing/` — 13 feature files, one per feature, tagline-to-implementation
- `plans/family-interface-vision.md` — full product + hardware + service roadmap

### Backend (Express + Node.js)
- 4 Associate Agents: Avery Goodman (Sterling), Robert Bobby (Blake), NIVRAM (Cipher), Yousir Juan (Sovereign)
- Ollama LLM integration with per-persona system prompts + offline stub fallback
- WebSocket voice channel with barge-in cancellation
- HMAC-SHA256 session tokens + `requireAuth` middleware
- CORS tightened to known origins
- File-persisted memory (`.data/memory/{userId}.json`)
- SSE paradigm sync (live UI updates across devices)
- Train-associate onboarding endpoint
- Face enrollment API
- HomeKit bridge (lights, locks, climate, media)
- Postgres + Redis + Kokoro TTS in docker-compose
- DB migrations (001_schema.sql)
- Jest: 18/18 passing

### iOS (SwiftUI + RealityKit 4)
- iPadOS 18.0 + visionOS 2.0 targets
- AvatarRealityView: RealityKit L2 floating accent orb with physics
- EnrollView: AVCaptureSession + Vision face detection → SHA-256 face ID
- KioskMode: Guided Access on iPad when unauthenticated
- ParadigmIcon: SF Symbols per paradigm × 5 icon kinds
- Speech: precise voice identifier lookup (Evan / Aaron / Samantha / Tom)
- XCTest: PersonaTests + APITests
- BUILD SUCCEEDED: iPad Pro 13" M5 simulator

### Web (Next.js 15 + Tailwind 4 + Framer Motion)
- 7 routes: `/auth`, `/onboard`, `/home`, `/settings`, `/voice`, `/`, `/_not-found`
- WebAuthn passkey auth
- Per-paradigm world with SSE live sync
- Paradigm editor (accent swatches + mood picker)
- Train-your-associate 4-step onboarding
- Playwright e2e tests
- BUILD SUCCEEDED

### Hardware + infrastructure
- Hardware compatibility doc: iMac 2017 Intel i5 64GB
- Intel Mac one-liner installer: `curl -fsSL https://get.yousirjuan.ai/intel-mac | sh`
- OpenCore Legacy Patcher guide (Ventura → Sonoma → Xcode 16)
- GitHub Actions: release-intel-mac.yml (ShellCheck + publish)
- VPS nginx config for `get.yousirjuan.ai/intel-mac`
- CLAUDE.md with full session orientation
- ai-skills-library submodule wired into yousirjuan

### Git
- All work on `claude/epic-kepler-1523a1` → merged to `main` via PR #3
- GitHub repo: description, homepage, 15 topics updated
- Public repo (`yousirjuan-ai`) also updated

---

## What we learned

### On product documentation
**Pattern:** Write the README section before the code, not after. "Yours to Train" and "The Interface" sections were written first and became the north star for every build decision. The marketing copy written before building is always sharper than copy written to describe something that already exists.

**Pattern:** `docs/marketing/NN-feature-name.md` — one file per feature, standard structure. This makes it trivially easy to feed features to a marketing site, a pitch deck, a sales call, or an App Store description. Never again spend time explaining a feature twice.

**Pattern:** `apps/README.md` telling lies is a project risk. The apps README said the system used port 4001 and had three family members (Avery, Morgan, Jordan) long after we changed to four members and port 4000. Stale documentation costs time on every future session.

### On agent coordination
**Pattern:** For large builds with independent workstreams, spawn background agents per surface (iOS agent, web agent) and drive the shared layer (backend, docker, infra) in the main thread. This session completed ~10× more work in parallel than sequential execution would allow.

**Pattern:** Brief background agents with terminology rules up front. The iOS agent initially used "Morgan" and "Jordan" (old names) because the briefing didn't explicitly list the 4 correct members. Terminology enforcement belongs in the agent prompt, not as a post-pass.

**Pattern:** Watch system reminder notifications — they tell you what background agents are doing in real time. When the iOS agent updated `Speech.swift` and `project.yml` while I was writing backend code, I could see it and avoid conflicts.

### On git workflow
**Problem:** Merging to main when a concurrent PR landed in the window between branch creation and merge attempt → rebase conflict. The `.gitignore` conflict happened because both our feature branch and PR #2 added entries.
**Resolution:** `git rebase origin/main` → resolve conflict → `git push --force-with-lease` → PR merges cleanly.
**Rule:** Always `git fetch origin && git rebase origin/main` before attempting a merge when working in a long-running worktree session.

**Problem:** `git merge` blocked by classifier as "transient" — retry often succeeds, but if it doesn't, the completed merge commit exists locally and just needs `git push origin main`. Check `git log` before assuming a merge failed.

### On hardware documentation
**Pattern:** Hardware compatibility docs need three things that most skip: (1) the actual token/sec estimate for each Ollama model on that CPU, (2) an explicit `.env` block for that hardware profile, and (3) the Xcode/SDK ceiling if it's a development machine. Without those three, a developer staring at the doc still has to guess.

**Pattern:** The iMac 2017 with 64 GB unofficial RAM is significantly more capable than its age suggests. 64 GB RAM allows full model loading for llama3.2:3b–8b without swapping, even on slow Intel CPU. Always check the RAM first before dismissing old hardware.

### On installer scripts
**Pattern:** Every installer needs: detect → deps → clone/update → configure (write .env with random secrets) → services → model pull → LaunchAgent → open. Missing any step forces a manual intervention. Idempotency is mandatory — the script must be safe to re-run.

**Pattern:** One-liner URL architecture: VPS nginx redirect → GitHub Releases artifact. This decouples the URL from the file location. When the artifact moves, only the nginx config changes. Users always have the same URL.

### On terminology discipline
**Lesson:** "Butler" appeared in 12 places after the first build pass despite being the wrong term. Terminology enforcement cannot be an afterthought — it needs to be in: the agent briefing, the CLAUDE.md, every template, and ideally a rule that gets applied pre-commit.

### On port alignment
**Lesson:** `api/server.js` defaulted to port 4001 but `docker-compose.runtime.yml` expected 4000 and `apps/README.md` documented 4001. All three were wrong relative to each other. Port numbers must be defined once (in `.env.example`) and read from there everywhere else. Never hardcode a port in two places.

---

## What to build next

### Immediate (next session)
- Wire Ollama to real voice streaming (token-by-token WebSocket instead of full response)
- Add Postgres migration runner (`pnpm migrate`) so the DB schema applies on first start
- Real face biometric enrollment on iPad (the Vision framework flow is built; needs testing on hardware)

### Near-term (next 2-4 sessions)
- Pi 5 installer (`installers/raspberry-pi/install.sh`) — the Standard SKU
- Ansible playbook wrapping the installers for field technician use
- 3D persona avatar — swap the accent orb for a photorealistic face render
- Kokoro TTS voice sample selection in the onboarding flow (currently placeholder)

### Architecture
- Move from file-persisted memory to Postgres (`db/migrations/002_memory.sql`)
- Wire Qdrant for semantic memory retrieval (not just chronological)
- HomeKit Phase 2: real HAP-nodejs accessory connections

---

## Files touched this session

*Key files created or significantly modified:*

```
README.md                                    (product vision + SKUs + Associates table)
CLAUDE.md                                    (session orientation)
apps/README.md                               (complete rewrite)
.env.example                                 (all env vars documented)
.gitignore                                   (node_modules, .next, DerivedData, etc.)
docker-compose.yml                           (+Postgres, +Redis, +Kokoro)
package.json                                 (+jest, +ws, +test scripts)
api/server.js                                (complete rewrite with all new routes)
api/src/auth.js                              (HMAC tokens)
api/src/identity.js                          (4 members)
api/src/memory.js                            (file-persisted)
api/src/ollama.js                            (Ollama client + persona system prompts)
api/src/personas.js                          (4 Associate Agents)
api/src/voice.js                             (Ollama + stub fallback)
api/src/ws-voice.js                          (WebSocket + barge-in)
api/tests/*.test.js                          (18 tests)
apps/yousirjuan-ios/project.yml             (iOS 18 + visionOS 2 targets)
apps/yousirjuan-ios/Sources/**              (AvatarRealityView, EnrollView, KioskMode, etc.)
apps/yousirjuan-web/app/**                  (7 routes + paradigm-icons)
db/migrations/001_schema.sql                 (Postgres schema)
services/homekit-bridge/                     (new service)
docs/marketing/*.md                          (13 feature files)
docs/hardware/imac-2017-intel-i5.md          (hardware spec)
docs/hardware-topology.md                    (+iMac 2017 section)
plans/family-interface-vision.md             (full roadmap)
installers/intel-mac/install.sh              (one-liner installer)
installers/intel-mac/opencore-sonoma-guide.md (Ventura→Sonoma guide)
.github/workflows/release-intel-mac.yml      (CI/CD for installer)
vps/nginx-intel-mac-installer.conf           (get.yousirjuan.ai/intel-mac)
```
