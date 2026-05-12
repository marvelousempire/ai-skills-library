// Generate a short prose explanation of a diagram: what each box means,
// which connections matter, and why this style was chosen. Uses the same
// provider/model resolution as `generate()` so the user pays for one extra
// call (the system prompt is already cached from the generate step).

import { generateText } from 'ai'
import { autodetectProvider, resolveModel } from './providers/index.ts'
import type { ProviderName } from './types.ts'

interface ExplainOpts {
  input: string
  diagram: string
  provider?: ProviderName
  model?: string
}

const buildExplainPrompt = (input: string, diagram: string): string => `Below is a request and the diagram I generated for it. Write a SHORT prose explanation (3–6 sentences, under 100 words) covering:

- What each significant box / actor represents
- The most important connection or flow
- Why the chosen layout fits this content

No markdown headers, no bullet points, no preamble. Just plain prose paragraphs.

REQUEST:
${input}

DIAGRAM:
\`\`\`text
${diagram}
\`\`\`
`

export const generateExplanation = async (opts: ExplainOpts): Promise<string> => {
  const providerName = opts.provider ?? (await autodetectProvider())
  const { model } = resolveModel(providerName, opts.model)

  const { text } = await generateText({
    model,
    // Plain string system + prompt; no caching on this call since the prompt
    // is short and one-shot. The big style guide isn't needed for explanation.
    system:
      'You are an expert at explaining technical diagrams concisely. Write tight, plain prose. No fluff.',
    prompt: buildExplainPrompt(opts.input, opts.diagram),
  })
  return text.trim()
}
