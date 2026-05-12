export type ProviderName =
  | 'ollama'
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'perplexity'

export type Style =
  | 'compact'
  | 'annotated'
  | 'sequence'
  | 'merged'
  | 'auto'

export interface GenerateOptions {
  input: string
  style?: Style
  provider?: ProviderName
  model?: string
  maxRetries?: number
  onStreamChunk?: (chunk: string) => void
  /**
   * If set, treat `input` as an edit instruction applied to this previous
   * diagram. The system prompt (style guide) is unchanged, so prompt caching
   * still hits on supported providers.
   */
  refineFrom?: string
}

export interface GenerateResult {
  diagram: string
  attempts: number
  warnings: LintError[]
  provider: ProviderName
  model: string
  usage: CacheUsage
}

export interface LintError {
  line: number
  problem: string
  suggestion: string
  rule: 'unicode' | 'width' | 'closure' | 'extract' | 'no-diagram' | 'alignment'
}

export interface CacheUsage {
  /** Tokens read from a previously-cached prompt (Anthropic). */
  cacheReadInputTokens: number
  /** Tokens written to cache on this call (Anthropic, first hit). */
  cacheCreationInputTokens: number
  /** OpenAI auto-cache hits. */
  cachedPromptTokens: number
  /** Total input tokens charged. */
  promptTokens: number
  /** Total completion tokens. */
  completionTokens: number
}
