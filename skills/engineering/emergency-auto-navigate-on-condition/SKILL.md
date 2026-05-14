---
name: emergency-auto-navigate-on-condition
description: >-
  When a system metric crosses a critical threshold (disk at zero, error rate
  spiking, health check failing), automatically navigate the UI to the relevant
  surface without user action. The SADPA pattern: monitor continuously via a
  live data channel, detect the threshold crossing, call setActiveTab() or
  equivalent immediately. Two tiers — critical (auto-navigate now) and warning
  (kick off background prep so the destination is ready when they arrive).
  Triggers on "auto-navigate when disk is low", "navigate to emergency panel
  automatically", "SADPA pattern", "monitor and redirect", "auto-switch tab
  on condition", "proactive UI navigation", "detect threshold and respond".
---

# Emergency auto-navigate on condition — the SADPA pattern

When a system is in distress, the user shouldn't have to find the right panel. The app should notice before they do and take them there.

The failure mode: disk hits zero, user opens DustPan, lands on the Overview tab, has to manually navigate to Emergency Rescue while macOS is refusing to open apps. The fix: monitor the metric, detect the crossing, navigate immediately.

## The two-tier pattern

```typescript
// In DashboardContext — runs whenever the live metric updates
useEffect(() => {
  if (!status) return;

  // TIER 1 — CRITICAL: act immediately, no user decision needed
  if (status.free_gb < 1 && !autoNavigatedRef.current) {
    autoNavigatedRef.current = true;
    setActiveTab("emergency");   // takes them there right now
  }

  // TIER 2 — WARNING: prepare in background while user is elsewhere
  if (status.free_gb < 10 && !autoScannedRef.current) {
    autoScannedRef.current = true;
    setTimeout(() => void scanEverything(), 800);  // background prep, no disruption
  }
}, [status?.free_gb]);  // only re-evaluate when the metric changes
```

## The three design rules

1. **One-shot refs, not repeated triggers.** Use `useRef(false)` flags so the auto-navigate fires once per session, not every render cycle. After the user manually navigates away, they stay away.

2. **Two tiers, not one.** The critical tier (< 1 GB) auto-navigates — takes the wheel. The warning tier (< 10 GB) prepares silently — the destination is loaded when they get there. Never collapse these into one.

3. **The live channel, not polling.** The metric comes from a persistent SSE stream (`/api/live`), not a timer. The `useEffect` depends on the metric value — it re-evaluates the instant the value changes, not on a schedule.

## Generalizing to other conditions

The pattern is not disk-specific. Apply it to any monitored metric:

```typescript
// Error rate spike → navigate to diagnostics
if (status.error_rate > 0.05 && !navigatedToDiag.current) {
  navigatedToDiag.current = true;
  setActiveTab("diagnostics");
}

// Auth session expiring → navigate to login
if (status.session_expires_in_seconds < 60 && !warnedSession.current) {
  warnedSession.current = true;
  setActiveTab("session");
}

// Build failing → navigate to CI panel
if (status.build_status === "failing" && !navigatedToCI.current) {
  navigatedToCI.current = true;
  setActiveTab("ci");
}
```

## What NOT to auto-navigate

- ❌ Warning states that aren't urgent (< 20 GB free). Show a banner. Don't move them.
- ❌ Conditions the user caused intentionally (they just emptied Trash — disk change is expected)
- ❌ Anything that fires more than once per session without the user resetting
- ❌ Mid-workflow navigation (if the user is actively using a tab, don't yank them away)

## Anti-patterns

- ❌ Polling (`setInterval`) instead of subscribing to a live channel — wastes resources, adds latency
- ❌ No one-shot ref — the navigation fires repeatedly on every re-render
- ❌ Single threshold only — missing the "prepare in background" tier means the destination is empty when they arrive
- ❌ Auto-navigate for non-critical states — the pattern loses trust if it fires for low-severity conditions

## Invocation

- "Use **emergency-auto-navigate-on-condition**."
- "When X drops below Y, automatically take the user to the Z panel."
- "Apply the SADPA auto-navigate pattern to this dashboard."

## Reference implementation

DustPan v0.21.4. `DashboardContext.tsx` — `autoEmergencyRef` and `autoScannedRef`. The live channel is `EventSource('/api/live')`. The thresholds are `free_gb < 1` (critical) and `free_gb < 10` (warning). Source: `apps/web/src/state/DashboardContext.tsx`.
