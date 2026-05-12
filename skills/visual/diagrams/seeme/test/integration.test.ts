import { test } from 'node:test'
import { strict as assert } from 'node:assert'

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://localhost:11434'

interface OllamaTagsResponse {
  models?: { name: string }[]
}

const probeOllama = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(1000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as OllamaTagsResponse
    const models = json.models ?? []
    if (models.length === 0) return null
    // Prefer llama3.1 if present, otherwise pick the first model.
    const llama = models.find((m) => m.name.startsWith('llama3.1'))
    return (llama ?? models[0]).name
  } catch {
    return null
  }
}

const reachableModel = await probeOllama()

test('end-to-end: generate against live Ollama', { skip: reachableModel === null ? 'Ollama not reachable at OLLAMA_HOST' : false }, async () => {
  // Lazy-import so the module-level SKILL.md read happens only when we actually run.
  const { generate } = await import('../src/generate.ts')

  const result = await generate({
    input: 'Show a simple client → API → database flow.',
    provider: 'ollama',
    model: reachableModel!,
    maxRetries: 2,
  })

  // Diagram came back non-empty.
  assert.ok(result.diagram.length > 0, 'diagram should be non-empty')

  // Contains at least some box-drawing characters (this is the same check as
  // the no-diagram lint rule, but as an end-to-end smoke test).
  const boxChars = (result.diagram.match(/[┌┐└┘│─├┤┬┴┼╔╗╚╝║═▲▼◄►]/g) ?? []).length
  assert.ok(
    boxChars >= 3,
    `expected ≥ 3 box-drawing chars, got ${boxChars}. Output:\n${result.diagram}`,
  )

  // Provider/model/attempts populated.
  assert.equal(result.provider, 'ollama')
  assert.equal(result.model, reachableModel!)
  assert.ok(result.attempts >= 1)

  // Usage struct is shaped correctly (Ollama won't have cache stats, but
  // promptTokens/completionTokens should at least be numbers — possibly 0
  // depending on the model wrapper).
  assert.equal(typeof result.usage.promptTokens, 'number')
  assert.equal(typeof result.usage.completionTokens, 'number')
  assert.equal(result.usage.cacheReadInputTokens, 0, 'Ollama should report 0 cache reads')
  assert.equal(result.usage.cacheCreationInputTokens, 0, 'Ollama should report 0 cache writes')
})
