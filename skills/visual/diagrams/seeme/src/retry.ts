import { generateText, streamText } from 'ai'
import type { LanguageModel, CoreMessage, LanguageModelUsage } from 'ai'
import { extractFencedTextBlock, lint } from './lint/index.ts'
import { systemPrompt } from './prompt/system.ts'
import { repairPrompt } from './prompt/repair.ts'
import type { CacheUsage, LintError, Style } from './types.ts'

interface RunOpts {
  model: LanguageModel
  input: string
  style: Style
  maxRetries: number
  onStreamChunk?: (chunk: string) => void
}

interface RunResult {
  diagram: string
  attempts: number
  warnings: LintError[]
  usage: CacheUsage
}

interface CallResult {
  text: string
  usage: CacheUsage
}

const emptyUsage = (): CacheUsage => ({
  cacheReadInputTokens: 0,
  cacheCreationInputTokens: 0,
  cachedPromptTokens: 0,
  promptTokens: 0,
  completionTokens: 0,
})

const addUsage = (a: CacheUsage, b: CacheUsage): CacheUsage => ({
  cacheReadInputTokens: a.cacheReadInputTokens + b.cacheReadInputTokens,
  cacheCreationInputTokens:
    a.cacheCreationInputTokens + b.cacheCreationInputTokens,
  cachedPromptTokens: a.cachedPromptTokens + b.cachedPromptTokens,
  promptTokens: a.promptTokens + b.promptTokens,
  completionTokens: a.completionTokens + b.completionTokens,
})

// Pull cache + token metadata out of provider-specific shapes.
// - Anthropic: providerMetadata.anthropic.{cacheReadInputTokens, cacheCreationInputTokens}
// - OpenAI:    providerMetadata.openai.cachedPromptTokens
// - Others:    nothing — left at 0.
const extractUsage = (
  usage: LanguageModelUsage | undefined,
  providerMetadata: Record<string, any> | undefined,
): CacheUsage => {
  const anthropic = providerMetadata?.anthropic ?? {}
  const openai = providerMetadata?.openai ?? {}
  return {
    cacheReadInputTokens: Number(anthropic.cacheReadInputTokens ?? 0),
    cacheCreationInputTokens: Number(anthropic.cacheCreationInputTokens ?? 0),
    cachedPromptTokens: Number(openai.cachedPromptTokens ?? 0),
    promptTokens: usage?.promptTokens ?? 0,
    completionTokens: usage?.completionTokens ?? 0,
  }
}

// Build a messages array where the system prompt is marked as cacheable.
// - Anthropic reads `providerOptions.anthropic.cacheControl` and caches the
//   ~30KB style spec for 5 minutes — repeat calls hit a ~90% discount.
// - OpenAI auto-caches any prefix ≥ 1024 tokens; the SKILL.md alone crosses
//   that threshold, so OpenAI caching works without any flag.
// - Ollama / Gemini / Perplexity ignore the providerOptions field.
const buildMessages = (system: string, user: string): CoreMessage[] => [
  {
    role: 'system',
    content: system,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
  { role: 'user', content: user },
]

const callModel = async (
  model: LanguageModel,
  system: string,
  user: string,
  onStreamChunk?: (chunk: string) => void,
): Promise<CallResult> => {
  const messages = buildMessages(system, user)

  if (onStreamChunk) {
    const stream = streamText({ model, messages })
    let full = ''
    for await (const chunk of stream.textStream) {
      full += chunk
      onStreamChunk(chunk)
    }
    const usage = await stream.usage
    const providerMetadata = await stream.providerMetadata
    return { text: full, usage: extractUsage(usage, providerMetadata) }
  }

  const result = await generateText({ model, messages })
  return {
    text: result.text,
    usage: extractUsage(result.usage, result.providerMetadata),
  }
}

export const generateWithRetry = async (opts: RunOpts): Promise<RunResult> => {
  const { model, input, style, maxRetries, onStreamChunk } = opts
  const system = systemPrompt(style)

  let totalUsage = emptyUsage()

  let { text: raw, usage } = await callModel(model, system, input, onStreamChunk)
  totalUsage = addUsage(totalUsage, usage)
  let diagram = extractFencedTextBlock(raw)

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const errors = lint(diagram)
    if (errors.length === 0) {
      return { diagram, attempts: attempt + 1, warnings: [], usage: totalUsage }
    }
    if (attempt === maxRetries) {
      return { diagram, attempts: attempt + 1, warnings: errors, usage: totalUsage }
    }

    // Repair calls run non-streamed so lint sees the full payload before any
    // output. Each repair reuses the cached system prompt — only the (small)
    // user payload changes.
    const repair = await callModel(model, system, repairPrompt(diagram, errors))
    totalUsage = addUsage(totalUsage, repair.usage)
    diagram = extractFencedTextBlock(repair.text)
  }

  // Unreachable — the loop returns inside.
  return {
    diagram,
    attempts: maxRetries + 1,
    warnings: lint(diagram),
    usage: totalUsage,
  }
}
