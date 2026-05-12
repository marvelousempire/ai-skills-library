import { autodetectProvider, resolveModel } from './providers/index.ts'
import { generateWithRetry } from './retry.ts'
import { refinePrompt } from './prompt/refine.ts'
import { writeLastDiagram } from './cache.ts'
import type { GenerateOptions, GenerateResult } from './types.ts'

export const generate = async (opts: GenerateOptions): Promise<GenerateResult> => {
  const providerName = opts.provider ?? (await autodetectProvider())
  const { model, modelId, provider } = resolveModel(providerName, opts.model)

  // In refine mode, the "input" is treated as the edit instruction and the
  // user-prompt is rewritten to include the previous diagram. The system
  // prompt (style guide) is unchanged, so cache hits still apply.
  const userPayload = opts.refineFrom
    ? refinePrompt(opts.refineFrom, opts.input)
    : opts.input

  const style = opts.style ?? 'auto'

  const { diagram, attempts, warnings, usage } = await generateWithRetry({
    model,
    input: userPayload,
    style,
    maxRetries: opts.maxRetries ?? 3,
    onStreamChunk: opts.onStreamChunk,
  })

  // Cache the latest clean diagram + metadata for the next `--refine` call.
  if (warnings.length === 0) {
    writeLastDiagram({
      diagram,
      style,
      provider,
      model: modelId,
      input: opts.input,
    })
  }

  return { diagram, attempts, warnings, provider, model: modelId, usage }
}

export { readLastDiagram, cacheLocation } from './cache.ts'
export type { CachedDiagram } from './cache.ts'
