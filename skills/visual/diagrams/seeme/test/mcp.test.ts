import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const binPath = resolve(here, '..', 'bin', 'seeme-mcp')

interface JsonRpcMessage {
  jsonrpc: '2.0'
  id?: number
  method?: string
  params?: unknown
  result?: unknown
  error?: unknown
}

// Minimal MCP stdio client: send line-delimited JSON-RPC, read line-delimited
// JSON-RPC responses. Enough to verify the server registers two tools and
// rejects malformed calls without spinning up a real model.
const runMcp = async (
  messages: JsonRpcMessage[],
): Promise<JsonRpcMessage[]> => {
  const child = spawn(binPath, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, SEEME_NO_CACHE: '1' },
  })

  const responses: JsonRpcMessage[] = []
  let buffer = ''

  const done = new Promise<void>((resolveDone) => {
    child.stdout.on('data', (chunk: Buffer) => {
      buffer += chunk.toString('utf-8')
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          responses.push(JSON.parse(trimmed) as JsonRpcMessage)
        } catch {
          // ignore garbage
        }
      }
      if (responses.length >= messages.length) resolveDone()
    })
  })

  for (const msg of messages) {
    child.stdin.write(JSON.stringify(msg) + '\n')
  }

  // Race against a 5s ceiling so a hung server can't hang the test suite.
  await Promise.race([
    done,
    new Promise<void>((r) => setTimeout(r, 5000)),
  ])

  child.kill()
  return responses
}

test('seeme-mcp: initialize handshake + listTools returns both tools', async () => {
  const responses = await runMcp([
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '0.0.0' },
      },
    },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  ])

  assert.ok(responses.length >= 2, `expected ≥ 2 responses, got ${responses.length}`)

  const initResp = responses.find((r) => r.id === 1)
  assert.ok(initResp, 'should respond to initialize')
  assert.ok((initResp!.result as any)?.serverInfo, 'init should include serverInfo')

  const listResp = responses.find((r) => r.id === 2)
  assert.ok(listResp, 'should respond to tools/list')
  const tools = (listResp!.result as any)?.tools as { name: string }[]
  assert.ok(Array.isArray(tools), 'tools should be an array')
  const names = tools.map((t) => t.name).sort()
  assert.deepEqual(names, ['generate_diagram', 'list_providers', 'refine_diagram'])
})

test('seeme-mcp: list_providers returns reachability info', async () => {
  const responses = await runMcp([
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '0.0.0' },
      },
    },
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'list_providers', arguments: {} },
    },
  ])

  const callResp = responses.find((r) => r.id === 2)
  assert.ok(callResp, 'should respond to tools/call')
  const result = callResp!.result as any
  const text = (result?.content?.[0]?.text ?? '') as string

  // All five providers should appear by name.
  for (const name of ['ollama', 'anthropic', 'openai', 'gemini', 'perplexity']) {
    assert.ok(text.includes(name), `list_providers output should mention ${name}`)
  }
})

test('seeme-mcp: refine_diagram without previous + no cache → useful error', async () => {
  const responses = await runMcp([
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test', version: '0.0.0' },
      },
    },
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'refine_diagram', arguments: { instruction: 'do a thing' } },
    },
  ])

  const callResp = responses.find((r) => r.id === 2)
  assert.ok(callResp, 'should respond to tools/call')
  const result = callResp!.result as any
  assert.ok(result?.isError, 'should mark response as error')
  const text = result.content?.[0]?.text ?? ''
  assert.ok(
    text.includes('No previous diagram'),
    `error text should mention missing previous diagram, got: ${text}`,
  )
})
