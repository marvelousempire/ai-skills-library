import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { startServer } from '../src/server.ts'

// Start the server on an ephemeral high port, hit two endpoints, then
// rely on process exit to tear down. We don't await startServer() because
// it blocks until SIGINT — we let it run in the background.

const PORT = 7791

test('server: GET / returns the UI HTML', async () => {
  // Fire-and-forget server start. Yield once to let it bind.
  startServer({ port: PORT }).catch(() => {})
  await new Promise((r) => setTimeout(r, 250))

  const res = await fetch(`http://127.0.0.1:${PORT}/`)
  assert.equal(res.status, 200)
  const html = await res.text()
  assert.ok(html.includes('<title>SEEME</title>'), 'HTML should include SEEME title')
  assert.ok(html.includes('id="generate"'), 'HTML should include the generate button')
})

test('server: GET /api/providers returns five providers', async () => {
  const res = await fetch(`http://127.0.0.1:${PORT}/api/providers`)
  assert.equal(res.status, 200)
  const json = (await res.json()) as { providers: { name: string; defaultModel: string }[] }
  assert.equal(json.providers.length, 5)
  const names = json.providers.map((p) => p.name).sort()
  assert.deepEqual(names, ['anthropic', 'gemini', 'ollama', 'openai', 'perplexity'])
  // Every provider should report a default model.
  for (const p of json.providers) {
    assert.ok(p.defaultModel.length > 0, `${p.name} should have a default model`)
  }
})

test('server: POST /api/generate without body returns 400', async () => {
  const res = await fetch(`http://127.0.0.1:${PORT}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not json',
  })
  assert.equal(res.status, 400)
})

test('server: unknown route returns 404', async () => {
  const res = await fetch(`http://127.0.0.1:${PORT}/nope`)
  assert.equal(res.status, 404)
})
