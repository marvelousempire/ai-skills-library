// `seeme serve` — a tiny local HTTP server that hosts the SEEME web UI.
// Pure Node stdlib (http + fs) — no Express, no extra deps. SSE for streaming.
//
// Endpoints:
//   GET  /                  → serves ui.html (self-contained, no CDN)
//   GET  /api/providers     → JSON list of providers + availability
//   POST /api/generate      → SSE stream of chunks + final result
//   GET  /api/last          → cached last diagram (for refine UI)

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { generate, readLastDiagram } from './generate.ts'
import { listProviders } from './providers/index.ts'
import type { ProviderName, Style } from './types.ts'

const here = dirname(fileURLToPath(import.meta.url))
const uiHtmlPath = resolve(here, 'ui.html')

// Read once at startup; the file is bundled with the package.
const uiHtml = (() => {
  try {
    return readFileSync(uiHtmlPath, 'utf-8')
  } catch {
    return '<!DOCTYPE html><meta charset="utf-8"><title>SEEME</title><pre>ui.html missing — reinstall the package</pre>'
  }
})()

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolveBody, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => resolveBody(data))
    req.on('error', reject)
  })

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
    'Cache-Control': 'no-store',
  })
  res.end(json)
}

const sendText = (res: ServerResponse, status: number, body: string, contentType: string) => {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

const writeSse = (res: ServerResponse, event: string, data: unknown) => {
  res.write(`event: ${event}\n`)
  res.write(`data: ${JSON.stringify(data)}\n\n`)
}

interface GenerateRequest {
  input?: string
  style?: Style
  provider?: ProviderName
  model?: string
  refineFrom?: string
  maxRetries?: number
}

const handleGenerate = async (req: IncomingMessage, res: ServerResponse) => {
  let body: GenerateRequest
  try {
    body = JSON.parse(await readBody(req)) as GenerateRequest
  } catch {
    return sendJson(res, 400, { error: 'Body must be JSON.' })
  }
  if (!body.input || typeof body.input !== 'string') {
    return sendJson(res, 400, { error: 'Missing required field: input (string).' })
  }

  // Switch to SSE for streaming chunks.
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
  })

  try {
    const result = await generate({
      input: body.input,
      style: body.style,
      provider: body.provider,
      model: body.model,
      maxRetries: body.maxRetries ?? 3,
      refineFrom: body.refineFrom,
      onStreamChunk: (chunk) => writeSse(res, 'chunk', { text: chunk }),
    })
    writeSse(res, 'done', result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    writeSse(res, 'error', { message })
  } finally {
    res.end()
  }
}

const router = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? '/'
  const method = req.method ?? 'GET'

  // CORS headers — useful if you want to call the API from a different page.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    return sendText(res, 200, uiHtml, 'text/html; charset=utf-8')
  }

  if (method === 'GET' && url === '/api/providers') {
    const list = await listProviders()
    return sendJson(res, 200, { providers: list })
  }

  if (method === 'GET' && url === '/api/last') {
    return sendJson(res, 200, { last: readLastDiagram() })
  }

  if (method === 'POST' && url === '/api/generate') {
    return handleGenerate(req, res)
  }

  return sendJson(res, 404, { error: `Not found: ${method} ${url}` })
}

export interface ServeOpts {
  port?: number
  host?: string
  open?: boolean
}

export const startServer = async (opts: ServeOpts = {}): Promise<void> => {
  const port = opts.port ?? Number(process.env.SEEME_PORT ?? 7777)
  const host = opts.host ?? '127.0.0.1'

  const server = createServer((req, res) => {
    router(req, res).catch((err) => {
      const message = err instanceof Error ? err.message : String(err)
      try {
        sendJson(res, 500, { error: message })
      } catch {
        // ignore — connection already closed
      }
    })
  })

  await new Promise<void>((resolveListen, rejectListen) => {
    server.on('error', rejectListen)
    server.listen(port, host, () => resolveListen())
  })

  const url = `http://${host}:${port}/`
  process.stderr.write(`SEEME UI running at ${url}\n`)
  process.stderr.write(`(Ctrl-C to stop)\n`)

  if (opts.open) {
    // Best-effort open — works on macOS, falls back silently elsewhere.
    const { spawn } = await import('node:child_process')
    const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
    spawn(opener, [url], { stdio: 'ignore', detached: true }).unref()
  }

  // Keep alive until SIGINT.
  await new Promise<void>((resolveProm) => {
    const cleanup = () => {
      server.close()
      resolveProm()
    }
    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
  })
}
