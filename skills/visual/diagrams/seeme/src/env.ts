import 'dotenv/config'
import { z } from 'zod'
import type { ProviderName } from './types.ts'

// Treat empty strings as unset — common when a shell exports `FOO=` placeholders.
// The transform happens BEFORE downstream validation, so callers see undefined
// instead of "". Use it as the entry point for every env var SEEME reads.
const optionalNonEmpty = () =>
  z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))

const Schema = z.object({
  ANTHROPIC_API_KEY: optionalNonEmpty(),
  OPENAI_API_KEY: optionalNonEmpty(),
  GOOGLE_API_KEY: optionalNonEmpty(),
  PERPLEXITY_API_KEY: optionalNonEmpty(),
  OLLAMA_HOST: optionalNonEmpty().pipe(
    z.string().url().default('http://localhost:11434'),
  ),
  SEEME_PROVIDER: optionalNonEmpty().pipe(
    z.enum(['ollama', 'anthropic', 'openai', 'gemini', 'perplexity']).optional(),
  ),
  SEEME_MODEL: optionalNonEmpty(),
  // Opt in to Anthropic's 1-hour prompt cache (requires beta access).
  SEEME_LONG_CACHE: optionalNonEmpty(),
  // Opt in to a single-line JSONL history at ~/.seeme/history.jsonl.
  SEEME_HISTORY: optionalNonEmpty(),
  // Disable the on-disk last-diagram cache.
  SEEME_NO_CACHE: optionalNonEmpty(),
})

export const env = (() => {
  const parsed = Schema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`,
    )
  }
  return parsed.data
})()

const isTruthy = (v: string | undefined): boolean => v === '1' || v === 'true'

export const defaultProvider = env.SEEME_PROVIDER as ProviderName | undefined
export const defaultModel = env.SEEME_MODEL
export const longCache: boolean = isTruthy(env.SEEME_LONG_CACHE)
export const historyEnabled: boolean = isTruthy(env.SEEME_HISTORY)
export const cacheDisabled: boolean = isTruthy(env.SEEME_NO_CACHE)
