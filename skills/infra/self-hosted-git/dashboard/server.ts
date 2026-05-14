// CI dashboard server — proxies the GitLab API to a single self-contained
// HTML page. Pure Node stdlib (http + fs), no extra deps. Reads GITLAB_URL
// and GITLAB_TOKEN from the environment.
//
// Run:
//   GITLAB_URL=https://git.your.tld \
//   GITLAB_TOKEN=glpat-xxx \
//   node --experimental-strip-types server.ts
//
// Or use the convenience launcher:
//   ./serve.sh

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const indexPath = resolve(here, 'index.html')

const PORT = Number(process.env.SEEME_CI_PORT ?? 7778)
const HOST = process.env.SEEME_CI_HOST ?? '127.0.0.1'
const GITLAB_URL = (process.env.GITLAB_URL ?? '').replace(/\/$/, '')
const GITLAB_TOKEN = process.env.GITLAB_TOKEN ?? ''

if (!GITLAB_URL || !GITLAB_TOKEN) {
  console.error(
    'GITLAB_URL and GITLAB_TOKEN must be set.\n' +
      '  GITLAB_URL=https://git.your.tld\n' +
      '  GITLAB_TOKEN=<personal access token with `read_api` scope>\n',
  )
  process.exit(1)
}

const indexHtml = (() => {
  if (!existsSync(indexPath)) {
    return '<!DOCTYPE html><meta charset="utf-8"><title>CI dashboard</title><pre>index.html missing</pre>'
  }
  return readFileSync(indexPath, 'utf-8')
})()

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

// Proxy a GitLab API path. Adds the PRIVATE-TOKEN header server-side so the
// browser never sees the credential.
const proxyGitlab = async (apiPath: string, res: ServerResponse) => {
  try {
    const url = `${GITLAB_URL}/api/v4${apiPath}`
    const upstream = await fetch(url, {
      headers: {
        'PRIVATE-TOKEN': GITLAB_TOKEN,
        Accept: 'application/json',
      },
      // GitLab can be slow during heavy pipelines — bound at 15s.
      signal: AbortSignal.timeout(15000),
    })
    const text = await upstream.text()
    res.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
      'Cache-Control': 'no-store',
    })
    res.end(text)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    sendJson(res, 502, { error: `GitLab proxy failed: ${message}`, url: apiPath })
  }
}

const router = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? '/'
  const method = req.method ?? 'GET'

  // CORS — open for local-network use.
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  if (method === 'GET' && (url === '/' || url === '/index.html')) {
    return sendText(res, 200, indexHtml, 'text/html; charset=utf-8')
  }

  if (method === 'GET' && url === '/api/config') {
    return sendJson(res, 200, { gitlabUrl: GITLAB_URL })
  }

  // /api/projects — proxy GitLab's owned-projects list.
  if (method === 'GET' && url === '/api/projects') {
    return proxyGitlab('/projects?membership=true&order_by=last_activity_at&per_page=50&simple=true', res)
  }

  // /api/projects/:id/pipelines — recent pipelines per project.
  const pipelineMatch = url.match(/^\/api\/projects\/(\d+)\/pipelines$/)
  if (method === 'GET' && pipelineMatch) {
    return proxyGitlab(`/projects/${pipelineMatch[1]}/pipelines?per_page=10`, res)
  }

  // /api/projects/:id/pipelines/:pid — single pipeline detail.
  const detailMatch = url.match(/^\/api\/projects\/(\d+)\/pipelines\/(\d+)$/)
  if (method === 'GET' && detailMatch) {
    return proxyGitlab(`/projects/${detailMatch[1]}/pipelines/${detailMatch[2]}`, res)
  }

  // /api/projects/:id/pipelines/:pid/jobs — jobs in a pipeline.
  const jobsMatch = url.match(/^\/api\/projects\/(\d+)\/pipelines\/(\d+)\/jobs$/)
  if (method === 'GET' && jobsMatch) {
    return proxyGitlab(`/projects/${jobsMatch[1]}/pipelines/${jobsMatch[2]}/jobs?per_page=50`, res)
  }

  return sendJson(res, 404, { error: `Not found: ${method} ${url}` })
}

const server = createServer((req, res) => {
  router(req, res).catch((err) => {
    const message = err instanceof Error ? err.message : String(err)
    try {
      sendJson(res, 500, { error: message })
    } catch {
      // connection already closed
    }
  })
})

await new Promise<void>((resolveListen, rejectListen) => {
  server.on('error', rejectListen)
  server.listen(PORT, HOST, () => resolveListen())
})

process.stderr.write(`CI dashboard running at http://${HOST}:${PORT}/\n`)
process.stderr.write(`Proxying to ${GITLAB_URL}\n`)
process.stderr.write(`(Ctrl-C to stop)\n`)

await new Promise<void>((resolveProm) => {
  const cleanup = () => {
    server.close()
    resolveProm()
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
})
