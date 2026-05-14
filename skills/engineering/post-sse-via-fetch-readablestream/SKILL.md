---
name: post-sse-via-fetch-readablestream
id: SK-0034
keywords: [stream-post, parse-sse, handle-events]
goal: POST endpoints can stream SSE without EventSource — any AI chat backend works with any frontend.
hash: 507a320
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  EventSource (the standard SSE client) is GET-only. When your streaming
  endpoint requires a POST body (e.g. sending conversation history to an AI
  chat endpoint), use fetch() + ReadableStream + a manual SSE line parser.
  Produces the same {event, data} objects as streamSSE(). ~80 lines. Triggers
  on "POST endpoint with SSE", "EventSource is GET-only", "stream from POST
  request", "SSE with request body", "chat endpoint streaming", "can't send
  body with EventSource".
---

# POST-based SSE via fetch + ReadableStream — when EventSource won't work

`EventSource` — the standard W3C SSE client — is GET-only. If your streaming endpoint needs a POST body (conversation history, auth token in body, large payload), you need a different approach: `fetch()` + `ReadableStream` + a hand-rolled SSE frame parser.

The result is the same `{event, data}` shape as a GET-based `EventSource`. Callers don't need to know the difference.

## When to use this skill

- AI chat endpoint that sends conversation history via POST body
- Any SSE endpoint that requires authentication via body (not headers)
- Endpoints where the streaming payload is >2KB (too large for query string)
- The user says "I can't use EventSource because my endpoint is POST"

## The canonical implementation (~80 lines)

```typescript
// streamChat.ts — POST-based SSE parser

export interface ChatSSEMessage {
  event: string;
  data:  any;
}

export interface ChatStreamHandle {
  close: () => void;
}

export function streamChat(
  body: any,
  onMessage: (msg: ChatSSEMessage) => void,
  onError?:  (err: Error) => void,
): ChatStreamHandle {
  const controller = new AbortController();
  let closed = false;

  (async () => {
    let resp: Response;
    try {
      resp = await fetch("/api/ai/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
        signal:  controller.signal,
      });
    } catch (e) {
      if (!closed) onError?.(e as Error);
      return;
    }

    if (!resp.ok || !resp.body) {
      if (!closed) onError?.(new Error(`stream failed: ${resp.status}`));
      return;
    }

    const reader  = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    try {
      while (!closed) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // SSE: frames separated by blank line
        let idx;
        while ((idx = buf.indexOf("\n\n")) !== -1) {
          const frame = buf.slice(0, idx);
          buf = buf.slice(idx + 2);

          let eventName = "message";
          const dataLines: string[] = [];
          for (const line of frame.split("\n")) {
            if (line.startsWith("event:")) {
              eventName = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trim());
            }
            // ignore SSE comments (lines starting with `:`)
          }
          if (dataLines.length === 0) continue;
          const dataStr = dataLines.join("\n");
          try {
            const data = JSON.parse(dataStr);
            onMessage({ event: eventName, data });
          } catch {
            onMessage({ event: eventName, data: dataStr });
          }
        }
      }
    } catch (e) {
      if (!closed) onError?.(e as Error);
    }
  })();

  return {
    close() {
      closed = true;
      try { controller.abort(); } catch { /* ignore */ }
    },
  };
}
```

## How to use it

```typescript
// In the component:
const streamRef = useRef<ChatStreamHandle | null>(null);

const send = (text: string) => {
  streamRef.current = streamChat(
    { messages: conversationHistory, allow_safe_auto: false },
    (msg) => {
      if (msg.event === "assistant_text_delta") { /* append chunk */ }
      if (msg.event === "tool_use_start")       { /* show tool chip */ }
      if (msg.event === "assistant_done")        { /* finalize */ }
    },
    (err) => console.error("Stream error:", err),
  );
};

// Clean up on unmount:
useEffect(() => () => streamRef.current?.close(), []);
```

## The server side (Python stdlib)

The server doesn't change — it still writes SSE frames to the response body the same way. Only the client changes.

```python
# server.py — same SSE emission regardless of GET or POST
def _send_sse(self, data: dict) -> None:
    event = data.get("event", "message")
    payload = json.dumps(data.get("data", {}))
    line = f"event: {event}\ndata: {payload}\n\n"
    self.wfile.write(line.encode("utf-8"))
    self.wfile.flush()
```

The critical difference: `do_POST` can now read the request body via `Content-Length` + `self.rfile.read(length)` and still write SSE frames to the response. This works in Python's stdlib `http.server` without any framework.

## Key correctness properties

1. **`AbortController` for cancellation.** Closing the handle aborts the fetch mid-stream. No zombie requests.
2. **`TextDecoder` with `{ stream: true }`.** The last chunk may be partial UTF-8. The `stream: true` flag holds the incomplete bytes for the next `decode()` call.
3. **Buffer-based frame detection.** SSE frames end with `\n\n`. Buffer across `read()` calls because a frame may span multiple chunks.
4. **Ignore SSE comment lines** (starting with `:`). Server-side keepalives are `: keepalive\n\n`. Don't try to parse them as data.

## Anti-patterns

- ❌ `new EventSource("/api/chat")` when the endpoint is POST — EventSource ignores the method and sends GET.
- ❌ Reading the full response body with `.json()` or `.text()` — this waits for the full stream to complete before you get any data.
- ❌ No AbortController — closing the component leaves fetch running until the server closes the connection.
- ❌ `TextDecoder` without `{ stream: true }` — breaks on multi-byte characters that straddle chunk boundaries.

## Invocation

- "Use **post-sse-via-fetch-readablestream**."
- "My SSE endpoint requires POST — EventSource won't work."
- "Build the streaming chat client for a POST endpoint."

## Reference implementation

DustPan v0.23.0. [`apps/web/src/lib/streamChat.ts`](https://github.com/marvelousempire/dustpan/blob/main/apps/web/src/lib/streamChat.ts) — the canonical 80-line implementation. Used by `AIAgentChat.tsx` to stream from `POST /api/ai/chat` which carries conversation history in the body.
