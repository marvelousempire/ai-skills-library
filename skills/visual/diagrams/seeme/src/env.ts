import 'dotenv/config'
import { z } from 'zod'
import type { ProviderName } from './types.ts'

// Treat empty strings as unset — common when a shell exports `FOO=` placeholders.
const presentString = z
  .string()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))

const Schema = z.object({
  ANTHROPIC_API_KEY: presentString,
  OPENAI_API_KEY: presentString,
  GOOGLE_API_KEY: presentString,
  PERPLEXITY_API_KEY: presentString,
  OLLAMA_HOST: presentString.pipe(
    z.string().url().optional().default('http://localhost:11434'),
  ),
  SEEME_PROVIDER: presentString.pipe(
    z.enum(['ollama', 'anthropic', 'openai', 'gemini', 'perplexity']).optional(),
  ),
  SEEME_MODEL: presentString,
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

export const defaultProvider = env.SEEME_PROVIDER as ProviderName | undefined
export const defaultModel = env.SEEME_MODEL
