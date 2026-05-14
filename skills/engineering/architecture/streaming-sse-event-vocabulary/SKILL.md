---
name: streaming-sse-event-vocabulary
id: SK-0010
keywords: [define-events, route-messages, handle-stream]
goal: Every AI agent stream uses the same named events so any frontend can consume any agent.
hash: ab17480
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  The canonical set of SSE event types for an AI agent streaming interface.
  Every event has a defined shape, a defined moment it fires, and a defined
  client behavior. Use this vocabulary when building or extending any AI
  chat endpoint. Triggers on "what SSE events should my AI agent emit",
  "AI streaming event types", "agent SSE vocabulary", "what events does
  the AI send", "tool_use_start event shape", "assistant_text_delta",
  "tool_approval_needed SSE", "design the streaming protocol".
---

# Streaming SSE event vocabulary — canonical event types for AI agent interfaces

Every AI agent streaming interface should emit the same vocabulary. When every project uses the same event names and shapes, any frontend can consume any agent without rework.

## The canonical event set

| Event | When it fires | Payload shape |
|---|---|---|
| `provider_info` | First event, once per turn | `{provider, model, tool_use_supported}` |
| `assistant_text` | Complete text block (non-streaming fallback) | `{text: string}` |
| `assistant_text_delta` | Each token chunk (streaming) | `{text: string}` |
| `tool_use_start` | Tool execution begins | `{id, name, input}` |
| `tool_use_result` | Tool execution ends | `{id, name, ok, result, elapsed_ms}` |
| `tool_approval_needed` | Destructive tool blocked on approval | `{id, name, input, summary, desc, cost}` |
| `assistant_done` | Loop complete (all rounds finished) | `{usage: {input_tokens, output_tokens}, rounds}` |
| `error` | Anything failed unrecoverably | `{message}` |

## The SSE frame format (server side)

```python
def _send_sse(self, data: dict) -> None:
    event = data.get("event", "message")
    payload = json.dumps(data.get("data", {}))
    frame = f"event: {event}\ndata: {payload}\n\n"
    self.wfile.write(frame.encode("utf-8"))
    self.wfile.flush()

# Usage:
self._send_sse({"event": "assistant_text_delta", "data": {"text": "Hello"}})
self._send_sse({"event": "tool_use_start",   "data": {"id": "tu_123", "name": "measure_path", "input": {"path": "~/Library"}}})
self._send_sse({"event": "assistant_done",    "data": {"usage": {"input_tokens": 412, "output_tokens": 89}, "rounds": 2}})
```

## The client handler (TypeScript)

```typescript
// In the SSE message handler:
switch (msg.event) {
  case "provider_info":
    setProviderInfo({ provider: data.provider, model: data.model });
    break;

  case "assistant_text_delta":
    // Append to current streaming bubble — no \n\n join
    setTurns(prev => appendToLastAssistant(prev, data.text));
    break;

  case "assistant_text":
    // Full block (non-streaming fallback) — join with \n\n if appending
    setTurns(prev => appendToLastAssistant(prev, data.text));
    break;

  case "tool_use_start":
    setTurns(prev => [...prev, { kind: "tool", id: data.id, name: data.name,
                                  input: data.input, status: "running" }]);
    break;

  case "tool_use_result":
    setTurns(prev => prev.map(t =>
      t.kind === "tool" && t.id === data.id
        ? { ...t, status: data.ok === false ? "error" : "done", result: data.result }
        : t
    ));
    break;

  case "tool_approval_needed":
    setTurns(prev => [...prev, { kind: "approval", ...data, status: "pending" }]);
    setBusy(false);  // stream closes — wait for user
    break;

  case "assistant_done":
    // Mark last streaming assistant turn as finalized
    setTurns(prev => prev.map(t =>
      t.kind === "assistant" && t.streaming ? { ...t, streaming: false } : t
    ));
    setBusy(false);
    break;

  case "error":
    setTurns(prev => [...prev, { kind: "system", text: data.message, level: "error" }]);
    setBusy(false);
    break;
}
```

## Critical design rules

1. **`assistant_text_delta` vs `assistant_text`** — delta is token-by-token (streaming providers). `assistant_text` is the whole block (non-streaming fallback). Both must be handled; the client appends either way.

2. **`tool_approval_needed` closes the stream.** The stream stops. Client renders approval card. On approve, client re-POSTs with `pending_tool_results`. See `tool-calling-approval-reentry` skill.

3. **`provider_info` fires first, always.** Client uses it to show which model is responding. If `tool_use_supported: false`, show a banner and skip tool rendering.

4. **`assistant_done` is the canonical "turn complete" signal.** The client sets `busy = false` only here — not on `assistant_text` or `tool_use_result`.

5. **`error` is terminal for that turn.** Client sets `busy = false` and shows the error. A new user message starts a fresh turn.

## Anti-patterns

- ❌ Using `done` instead of `assistant_done` — ambiguous when tool loops have their own done events
- ❌ Emitting text via `data` field without an `event` field — clients default-handle unnamed events differently
- ❌ Closing the SSE stream before `assistant_done` fires — client can't distinguish "done" from "connection dropped"
- ❌ Putting the full message history in every event — event payloads should be minimal deltas

## Invocation

- "Use **streaming-sse-event-vocabulary**."
- "What events should my AI agent stream?"
- "Design the SSE protocol for this agent."

## Reference implementation

DustPan v0.23.0 → v0.27.0. Server: `_send_sse()` in `web/server.py` + `complete_with_tools()` in `web/ai.py`. Client: `AIAgentChat.tsx` in `apps/web/src/components/`. The approval re-entry protocol: `tool-calling-approval-reentry` skill.
