// Homelab console — single aggregator server. Polls every service in the
// stack and exposes a unified status JSON to the HTML page. Pure Node stdlib
// (http + fs), no extra deps.
//
// Services it knows how to talk to (all optional — gracefully degrades if
// any of them are down):
//   SEEME          http://localhost:7777    (the diagram CLI's web server)
//   GitLab CE      env: GITLAB_URL + GITLAB_TOKEN
//   Ollama         env: OLLAMA_HOST (default http://localhost:11434)
//   CI Dashboard   env: CI_DASHBOARD_URL    (just for the "open" link)
//
// Run:
//   ./serve.sh           # reads .env, launches on :7779
//   make start           # boots everything else first, then the console

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const indexPath = resolve(here, 'index.html')

const PORT = Number(process.env.CONSOLE_PORT ?? 7779)
const HOST = process.env.CONSOLE_HOST ?? '127.0.0.1'

const SEEME_URL = (process.env.SEEME_URL ?? 'http://localhost:7777').replace(/\/$/, '')
const GITLAB_URL = (process.env.GITLAB_URL ?? '').replace(/\/$/, '')
const GITLAB_TOKEN = process.env.GITLAB_TOKEN ?? ''
const OLLAMA_HOST = (process.env.OLLAMA_HOST ?? 'http://localhost:11434').replace(/\/$/, '')
const CI_DASHBOARD_URL = (process.env.CI_DASHBOARD_URL ?? 'http://localhost:7778').replace(/\/$/, '')

const indexHtml = existsSync(indexPath)
  ? readFileSync(indexPath, 'utf-8')
  : '<!DOCTYPE html><pre>index.html missing</pre>'

// ─── tiny HTTP helpers ──────────────────────────────────────────────
const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(json),
    'Cache-Control': 'no-store',
  })
  res.end(json)
}

const sendText = (res: ServerResponse, status: number, body: string, ct: string) => {
  res.writeHead(status, {
    'Content-Type': ct,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  })
  res.end(body)
}

const probe = async <T,>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 2500,
): Promise<{ ok: boolean; status: number; body?: T; error?: string }> => {
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) {
      return { ok: false, status: res.status, error: `HTTP ${res.status}` }
    }
    const ct = res.headers.get('content-type') ?? ''
    const body = ct.includes('application/json')
      ? ((await res.json()) as T)
      : ((await res.text()) as unknown as T)
    return { ok: true, status: res.status, body }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { ok: false, status: 0, error }
  }
}

// ─── per-service status fetchers ────────────────────────────────────
interface ServiceStatus {
  name: string
  available: boolean
  detail: string
  links: { label: string; href: string }[]
  data?: Record<string, unknown>
}

const seemeStatus = async (): Promise<ServiceStatus> => {
  const probeRes = await probe<{ providers: { name: string; available: boolean }[] }>(
    `${SEEME_URL}/api/providers`,
  )
  if (!probeRes.ok) {
    return {
      name: 'SEEME',
      available: false,
      detail: probeRes.error ?? 'unreachable',
      links: [{ label: 'open', href: SEEME_URL }],
    }
  }
  const providers = probeRes.body?.providers ?? []
  const availableCount = providers.filter((p) => p.available).length
  return {
    name: 'SEEME',
    available: true,
    detail: `${availableCount}/${providers.length} provider${providers.length === 1 ? '' : 's'} reachable`,
    links: [{ label: 'open', href: SEEME_URL }],
    data: { providers },
  }
}

const ollamaStatus = async (): Promise<ServiceStatus> => {
  const versionRes = await probe<{ version: string }>(`${OLLAMA_HOST}/api/version`)
  if (!versionRes.ok) {
    return {
      name: 'Ollama',
      available: false,
      detail: versionRes.error ?? 'unreachable',
      links: [],
    }
  }
  const tagsRes = await probe<{ models: { name: string; size?: number }[] }>(
    `${OLLAMA_HOST}/api/tags`,
  )
  const models = tagsRes.body?.models ?? []
  const totalSize = models.reduce((n, m) => n + (m.size ?? 0), 0)
  return {
    name: 'Ollama',
    available: true,
    detail: `v${versionRes.body?.version ?? '?'} · ${models.length} model${models.length === 1 ? '' : 's'} (${(totalSize / 1e9).toFixed(1)} GB)`,
    links: [],
    data: { models, version: versionRes.body?.version },
  }
}

interface GitlabPipeline {
  id: number
  status: string
  ref: string
  sha: string
  duration: number | null
  created_at: string
  updated_at: string
  web_url?: string
}
interface GitlabProject {
  id: number
  name: string
  path_with_namespace: string
  web_url: string
  last_activity_at: string
}

const gitlabStatus = async (): Promise<ServiceStatus> => {
  if (!GITLAB_URL || !GITLAB_TOKEN) {
    return {
      name: 'GitLab CE',
      available: false,
      detail: 'GITLAB_URL / GITLAB_TOKEN not set',
      links: [],
    }
  }
  const versionRes = await probe<{ version: string }>(`${GITLAB_URL}/api/v4/version`, {
    headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN },
  })
  if (!versionRes.ok) {
    return {
      name: 'GitLab CE',
      available: false,
      detail: versionRes.error ?? 'unreachable',
      links: [{ label: 'open', href: GITLAB_URL }],
    }
  }
  const projectsRes = await probe<GitlabProject[]>(
    `${GITLAB_URL}/api/v4/projects?membership=true&order_by=last_activity_at&per_page=50&simple=true`,
    { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } },
  )
  const projects = Array.isArray(projectsRes.body) ? projectsRes.body : []
  // Fetch 5 most-recent pipelines across all projects in parallel.
  const recentPipelines: Array<GitlabPipeline & { project: GitlabProject }> = []
  await Promise.all(
    projects.slice(0, 20).map(async (proj) => {
      const r = await probe<GitlabPipeline[]>(
        `${GITLAB_URL}/api/v4/projects/${proj.id}/pipelines?per_page=3`,
        { headers: { 'PRIVATE-TOKEN': GITLAB_TOKEN } },
        2000,
      )
      if (r.ok && Array.isArray(r.body)) {
        for (const p of r.body) recentPipelines.push({ ...p, project: proj })
      }
    }),
  )
  recentPipelines.sort((a, b) => (b.updated_at || b.created_at).localeCompare(a.updated_at || a.created_at))
  const lastFive = recentPipelines.slice(0, 5)
  const running = recentPipelines.filter(
    (p) => p.status === 'running' || p.status === 'pending' || p.status === 'preparing',
  ).length

  return {
    name: 'GitLab CE',
    available: true,
    detail: `v${versionRes.body?.version ?? '?'} · ${projects.length} project${projects.length === 1 ? '' : 's'} · ${running} running`,
    links: [
      { label: 'open', href: GITLAB_URL },
      { label: 'CI dashboard', href: CI_DASHBOARD_URL },
    ],
    data: {
      version: versionRes.body?.version,
      projectCount: projects.length,
      runningPipelines: running,
      recentPipelines: lastFive,
    },
  }
}

// ─── router ─────────────────────────────────────────────────────────
const router = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? '/'
  const method = req.method ?? 'GET'

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

  if (method === 'GET' && url === '/api/status') {
    // Fan out to every service in parallel; aggregate.
    const [seeme, gitlab, ollama] = await Promise.all([
      seemeStatus(),
      gitlabStatus(),
      ollamaStatus(),
    ])
    return sendJson(res, 200, {
      services: [seeme, gitlab, ollama],
      links: {
        seeme: SEEME_URL,
        gitlab: GITLAB_URL || null,
        ollama: OLLAMA_HOST,
        ciDashboard: CI_DASHBOARD_URL,
      },
      timestamp: new Date().toISOString(),
    })
  }

  if (method === 'GET' && url === '/api/config') {
    return sendJson(res, 200, {
      seemeUrl: SEEME_URL,
      gitlabUrl: GITLAB_URL || null,
      ollamaHost: OLLAMA_HOST,
      ciDashboardUrl: CI_DASHBOARD_URL,
    })
  }

  return sendJson(res, 404, { error: `Not found: ${method} ${url}` })
}

const server = createServer((req, res) => {
  router(req, res).catch((err) => {
    const message = err instanceof Error ? err.message : String(err)
    try {
      sendJson(res, 500, { error: message })
    } catch {}
  })
})

await new Promise<void>((resolveListen, rejectListen) => {
  server.on('error', rejectListen)
  server.listen(PORT, HOST, () => resolveListen())
})

process.stderr.write(`Homelab console running at http://${HOST}:${PORT}/\n`)
process.stderr.write(`Aggregating:\n`)
process.stderr.write(`  SEEME       ${SEEME_URL}\n`)
process.stderr.write(`  GitLab CE   ${GITLAB_URL || '(unset)'}\n`)
process.stderr.write(`  Ollama      ${OLLAMA_HOST}\n`)
process.stderr.write(`  CI dashbd   ${CI_DASHBOARD_URL}\n`)
process.stderr.write(`(Ctrl-C to stop)\n`)

await new Promise<void>((resolveProm) => {
  const cleanup = () => {
    server.close()
    resolveProm()
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
})
