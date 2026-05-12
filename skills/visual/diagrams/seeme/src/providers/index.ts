import { createOllama } from 'ollama-ai-provider'
import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { openai, createOpenAI } from '@ai-sdk/openai'
import { google, createGoogleGenerativeAI } from '@ai-sdk/google'
import { perplexity, createPerplexity } from '@ai-sdk/perplexity'
import type { LanguageModel } from 'ai'
import type { ProviderName } from '../types.ts'
import { env } from '../env.ts'

const defaultModels: Record<ProviderName, string> = {
  ollama: 'llama3.1',
  anthropic: 'claude-opus-4-7',
  openai: 'gpt-4o',
  gemini: 'gemini-2.0-flash',
  perplexity: 'sonar-pro',
}

export const resolveModel = (
  provider: ProviderName,
  model?: string,
): { model: LanguageModel; modelId: string; provider: ProviderName } => {
  const id = model ?? env.SEEME_MODEL ?? defaultModels[provider]

  switch (provider) {
    case 'ollama': {
      const ollama = createOllama({ baseURL: `${env.OLLAMA_HOST}/api` })
      return { model: ollama(id), modelId: id, provider }
    }
    case 'anthropic':
      return { model: anthropic(id), modelId: id, provider }
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

export const listProviders = async (): Promise<
  { name: ProviderName; available: boolean; reason: string }[]
> => {
  const ollama = await ollamaReachable()
  return [
    {
      name: 'ollama',
      available: ollama,
      reason: ollama ? `reachable at ${env.OLLAMA_HOST}` : `not reachable at ${env.OLLAMA_HOST}`,
    },
    {
      name: 'anthropic',
      available: !!env.ANTHROPIC_API_KEY,
      reason: env.ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY set' : 'no key',
    },
    {
      name: 'openai',
      available: !!env.OPENAI_API_KEY,
      reason: env.OPENAI_API_KEY ? 'OPENAI_API_KEY set' : 'no key',
    },
    {
      name: 'gemini',
      available: !!env.GOOGLE_API_KEY,
      reason: env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY set' : 'no key',
    },
    {
      name: 'perplexity',
      available: !!env.PERPLEXITY_API_KEY,
      reason: env.PERPLEXITY_API_KEY ? 'PERPLEXITY_API_KEY set' : 'no key',
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
