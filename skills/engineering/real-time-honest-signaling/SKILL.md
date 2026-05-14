---
name: real-time-honest-signaling
id: SK-0036
keywords: [real, time, honest]
description: >-
  Never fake completion, progress, or measurement. Wire every UI signal to the
  real event source — the kernel-reported freed-GB after a subprocess exits,
  the actual SSE done event from a background process, the real disk usage from
  df/du not an estimate. Anti-pattern: setTimeout(1500) to mark a card done
  while the rm -rf is still running. Also covers: freed-GB from the OS delta
  not from counters; streaming from the real SSE done event; per-command
  elapsed timers that start on click and stop on actual completion. Triggers on
  "fake completion", "real-time feedback", "setTimeout for done state", "freed
  GB counter", "live disk updates", "progress is lying", "the UI says done but
  it is still running", "honest progress bar", "actual measurement not estimate".
---

# Real-time honest signaling — never fake what the system actually says

The anti-pattern that triggered this skill: DustPan v0.21.4 marked Emergency Rescue command cards as ✓ Done after a hardcoded 1500ms timeout. An `rm -rf` on a 15 GB DerivedData folder takes 3–8 seconds. The card was showing ✓ while the process was still running. The freed-GB counter showed nothing because we had discarded the actual measurement.

This is the broader principle: **every signal the user sees must come from the actual system, not from an approximation, a timer, or a guess**.

## When to use this skill

- Building real-time feedback for any long-running operation (cleanup, download, build, migration)
- Any UI that shows "freed X GB" or "took N seconds"
- Any completion state (`✓ Done`, progress bar at 100%, notification on finish)
- Auditing a UI that has `setTimeout` anywhere near a completion-state update
- The user says "the progress bar is lying" or "it says done but it's still going"

## The principle (one sentence)

> Wire every completion state, measurement, and timing to the real event source — never a timer, never an estimate, never a cached value that isn't fresh.

## The four specific patterns

### 1. Completion state from the actual SSE done event

```typescript
// ❌ Fake completion
const run = (id: string) => {
  runActionDirect("emergency", id, label);
  setTimeout(() => {
    setDoneSet(prev => new Set([...prev, id]));
  }, 1500);  // guessing it'll be done by now
};

// ✅ Real completion from SSE done event
const run = (id: string) => {
  runActionDirect("emergency", id, label, (freed_gb) => {
    // This fires from the actual SSE "done" event when the subprocess exits
    setDoneSet(prev => new Set([...prev, id]));
    setFreedMap(prev => ({ ...prev, [id]: freed_gb }));
  });
};
```

### 2. Freed-GB from the kernel's reported delta, not from counters

```python
# ❌ Estimate from command output parsing
freed_gb = 6.4  # guessed from looking at the command

# ✅ Kernel-reported before/after delta
before = shutil.disk_usage("/")
subprocess.run(cmd, ...)
after = shutil.disk_usage("/")
freed_gb = round((after.free - before.free) / 1024**3, 2)
```

Why: `rm -rf` completion and inode flush are different events. On a fast SSD the freed-GB can read low for 100–500ms after the process exits. The kernel delta is the truth source. Accept the variance rather than fake precision.

### 3. Live disk meter from the OS, not from accumulated state

```typescript
// ❌ Accumulate freed-GB from completed cards
const sessionFreed = cards.filter(c => c.done).reduce((s, c) => s + c.freed_gb, 0);

// ✅ Use current OS free minus baseline at mount — OS is truth
const liveDelta = Math.max(0, status.free_gb - baselineFreeAtMount);
```

Show both when you can: the per-card freed-GB (from the kernel delta at command exit) + the session total (from the live OS free minus baseline). They'll agree most of the time; when they don't, the OS wins.

### 4. Elapsed timer that starts on click, stops on actual completion

```typescript
// Start timer on button click
const startedAt = Date.now();
setCards(prev => ({ ...prev, [id]: { ...prev[id], status: "running", startedAt } }));

// Stop timer in the actual done callback
runActionDirect(catId, id, label, (freed_gb) => {
  const elapsed_s = Math.floor((Date.now() - startedAt) / 1000);
  setCards(prev => ({
    ...prev,
    [id]: { status: "done", freed_gb, startedAt, elapsed_s },
  }));
});

// Render while running: a live ticking component
function RunningTimer({ startedAt }: { startedAt: number }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setSecs(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [startedAt]);
  return <span>{secs}s elapsed</span>;
}
```

## The forced `api.status()` after completion

For global state (disk free counter in the header), always force-refresh immediately after any command exits — don't wait for the 2-second SSE poll:

```typescript
// In the SSE done handler:
api.status().then(setStatus).catch(() => {});  // immediate refresh
// The /api/live 2s poll handles all other updates
```

This gives sub-100ms header updates without burning extra polling.

## Anti-patterns

- ❌ `setTimeout(N, () => setDone(true))` — N is a guess. The subprocess doesn't know about your timer.
- ❌ "Freed X GB" computed from the command's output text (parsing `df -h` output) — fragile, locale-dependent, and still not the kernel truth.
- ❌ Progress bar that jumps to 100% when the command is sent, not when it completes.
- ❌ Notification that fires immediately after clicking "Run" — the notification should fire from the done callback.

## Invocation

- "Use **real-time-honest-signaling**."
- "The freed-GB counter is an estimate — make it real."
- "The card says done but it's still running — fix it."
- "Wire the completion state to the actual subprocess exit."

## Reference implementation

DustPan v0.21.5 (the fix). Before: `setTimeout(1500)` in `EmergencyPanel.tsx`. After: `runActionDirect` exposes an `onDone(freed_gb)` callback wired to the SSE `done` event in `handleStream`. Per-card freed-GB, elapsed timer, and session total all sourced from real kernel data. Commit in PR #51 → fixed in PR #52.

The data analysis that caught the bugs: the `data:analyze` skill found three independent calculation errors. Real-time-honest-signaling is the principle that unifies all three.
