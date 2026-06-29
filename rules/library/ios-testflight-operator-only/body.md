---
name: ios-testflight-operator-only
id: RL-IOS-TF-001
keywords: [ios, testflight, archive, upload, verify-build, operator-only]
goal: Agents verify clean iOS builds; the operator owns all TestFlight upload and distribution.
description: iOS TestFlight upload/processing is operator-only — agents stop at zero-error zero-warning verify build.
alwaysApply: true
relations: [ios-build-preflight, go-live-path, verification-before-ship]
before: []
governed_by: [global]
meta: dynamic
---

# iOS TestFlight — operator only (agents verify, never upload)

## The verbatim source (stated by Avery 2026-06-29)

> You'll never have to worry about the TestFlight stuff — normally only just
> verified clean builds for TestFlight so that they pass expectations, that's
> it. I'll do all the TestFlight stuff after that. You never have to worry
> about sending it.

## The rule

**Agents prepare the bill. The operator ships to TestFlight.**

Applies to **every AI assistant** (Claude, Cursor, Grok, Codex, etc.) working on Red-E Play iOS or any repo that adopts this rule pack.

### What every AI agent MUST do (iOS ship path)

When iOS code ships or the operator needs a TestFlight-ready build:

1. Bump `MARKETING_VERSION` + `CURRENT_PROJECT_VERSION` per `changelog-and-versioning` / `ios-version-truth` (Red-E Play: `Red-E Play/RedEPlay.xcodeproj/project.pbxproj`).
2. Run a **zero-error, zero-warning** verify build:

```bash
xcodebuild -project "Red-E Play/RedEPlay.xcodeproj" \
  -scheme RedEPlay \
  -destination 'generic/platform=iOS Simulator' \
  -configuration Debug build
```

3. Report the **clean bill**: iOS version, build number, `BUILD SUCCEEDED`, warning count = 0.
4. Stop. Tell the operator the build is ready for them to archive/upload in Xcode.

### What every AI agent must NOT do (unless the operator explicitly asks)

- Archive for App Store / TestFlight (`xcodebuild archive`, `altool`, App Store Connect API)
- Upload to TestFlight or watch processing
- Trigger GitHub Actions / workflows for TestFlight distribution
- Offer "want me to cut/upload a TestFlight build?" as a default follow-up
- Treat "shipped iOS" as complete only because TestFlight processed — agent "done" = **verify build green + merged**

### Operator owns

- Xcode archive (Release / TestFlight scheme)
- Upload to App Store Connect
- TestFlight processing and device testing
- App Store submission (still requires explicit operator go-ahead)

### Device install exception

When the operator asks to **build to my iPhone** / install on device, follow `ios-device-install-discipline` — that is **not** TestFlight upload.

## When this fires

- Any iOS PR merge or session closeout mentioning TestFlight
- Go-live path for iOS touches
- After fixing iOS build breaks intended for operator QA

## When this does NOT fire

- Simulator-only iteration with no ship intent
- Web/backend/admin deploy paths (unchanged)

## Why

TestFlight requires operator Apple credentials, signing judgment, and release timing. Agents burning cycles on archive/upload duplicates work the operator already does in Xcode — and has caused confusion when agents offered uploads the operator never wanted automated.

## Propagation

- **Canonical library body:** `rules/library/ios-testflight-operator-only/body.md` (this file)
- **Red-E Play repo:** `.claude/rules/ios-testflight-operator-only.md` + `.cursor/rules/ios-testflight-operator-only.mdc`
- **Cross-assistant:** `AGENTS.md` § Go live path — iOS; `CLAUDE.md` § iOS ship path
- **Global memory:** `~/.claude/CLAUDE.md` § iOS TestFlight operator-only
- **Skills:** `skills/engineering/ship-flow`, `skills/project/red-e-play/verify-ship`, `agents/ship-flow-runner`