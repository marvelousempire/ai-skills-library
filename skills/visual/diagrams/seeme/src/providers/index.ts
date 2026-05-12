import { createOllama } from 'ollama-ai-provider'
import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { google, createGoogleGenerativeAI } from '@ai-sdk/google'
import { perplexity, createPerplexity } from '@ai-sdk/perplexity'
import type { LanguageModel } from 'ai'
import type { ProviderName } from '../types.ts'
import { env, longCache } from '../env.ts'

// When SEEME_LONG_CACHE=1, send the beta header that enables the 1h cache TTL
// in cache_control. Without this header Anthropic rejects ttl: '1h'.
//
// Built lazily so tests can flip env at runtime and the next call picks it up.
// One-time cost; memoized per (longCache, anthropic-beta) state.
let _anthropicProvider: ReturnType<typeof createAnthropic> | typeof anthropic | undefined
const getAnthropic = () => {
  if (_anthropicProvider) return _anthropicProvider
  _anthropicProvider = longCache
    ? createAnthropic({
        headers: { 'anthropic-beta': 'extended-cache-ttl-2025-04-11' },
      })
    : anthropic
  return _anthropicProvider
}

// Memoize the Ollama client per host string. Building it is cheap but
// allocating one per call wastes work in library-mode (MCP server, --then).
const _ollamaCache = new Map<string, ReturnType<typeof createOllama>>()
const getOllama = (host: string) => {
  let client = _ollamaCache.get(host)
  if (!client) {
    client = createOllama({ baseURL: `${host}/api` })
    _ollamaCache.set(host, client)
  }
  return client
}

const defaultModels: Record<ProviderName, string> = {
  ollama: 'llama3.1',
  anthropic: 'claude-opus-4-7',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  perplexity: 'sonar-pro',
}

export const defaultModelFor = (provider: ProviderName): string =>
  defaultModels[provider]

export const resolveModel = (
  provider: ProviderName,
  model?: string,
): { model: LanguageModel; modelId: string; provider: ProviderName } => {
  const id = model ?? env.SEEME_MODEL ?? defaultModels[provider]

  switch (provider) {
    case 'ollama': {
      const ollama = getOllama(env.OLLAMA_HOST)
      return { model: ollama(id), modelId: id, provider }
    }
    case 'anthropic':
      return { model: getAnthropic()(id), modelId: id, provider }
    case 'openai':
      return { model: openai(id), modelId: id, provider }
    case 'gemini':
      return { model: google(id), modelId: id, provider }
    case 'perplexity':
      return { model: perplexity(id), modelId: id, provider }
  }
}

export const ollamaReachable = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${env.OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(500),
    })
    return res.ok
  } catch {
    return false
  }
}

export const autodetectProvider = async (): Promise<ProviderName> => {
  if (env.SEEME_PROVIDER) return env.SEEME_PROVIDER
  if (await ollamaReachable()) return 'ollama'
  if (env.ANTHROPIC_API_KEY) return 'anthropic'
  if (env.OPENAI_API_KEY) return 'openai'
  if (env.GOOGLE_API_KEY) return 'gemini'
  if (env.PERPLEXITY_API_KEY) return 'perplexity'
  throw new Error(
    'No provider available. Start Ollama (https://ollama.com) or set a provider key in .env (see .env.example).',
  )
}

export interface ProviderStatus {
  name: ProviderName
  available: boolean
  reason: string
  defaultModel: string
}

export const listProviders = async (): Promise<ProviderStatus[]> => {
  const ollama = await ollamaReachable()
  return [
    {
      name: 'ollama',
      available: ollama,
      reason: ollama ? `reachable at ${env.OLLAMA_HOST}` : `not reachable at ${env.OLLAMA_HOST}`,
      defaultModel: defaultModels.ollama,
    },
    {
      name: 'anthropic',
      available: !!env.ANTHROPIC_API_KEY,
      reason: env.ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY set' : 'no key',
      defaultModel: defaultModels.anthropic,
    },
    {
      name: 'openai',
      available: !!env.OPENAI_API_KEY,
      reason: env.OPENAI_API_KEY ? 'OPENAI_API_KEY set' : 'no key',
      defaultModel: defaultModels.openai,
    },
    {
      name: 'gemini',
      available: !!env.GOOGLE_API_KEY,
      reason: env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY set' : 'no key',
      defaultModel: defaultModels.gemini,
    },
    {
      name: 'perplexity',
      available: !!env.PERPLEXITY_API_KEY,
      reason: env.PERPLEXITY_API_KEY ? 'PERPLEXITY_API_KEY set' : 'no key',
      defaultModel: defaultModels.perplexity,
    },
  ]
}

// Silence unused-import warnings for the `create*` factories — kept exported
// for callers who want to bring their own per-request configuration.
export {
  createAnthropic,
  createOpenAI,
  createGoogleGenerativeAI,
  createPerplexity,
}
