// Pulls the first ```text fenced block out of an LLM response.
// Falls back to the largest ``` block of any language, then to raw text.

export const extractFencedTextBlock = (raw: string): string => {
  const trimmed = raw.trim()

  // Prefer explicitly-tagged ```text blocks.
  const textBlock = /```text\s*\n([\s\S]*?)\n```/m.exec(trimmed)
  if (textBlock) return textBlock[1].trimEnd()

  // Fallback: any fenced block. Pick the largest by line count.
  const blocks = [...trimmed.matchAll(/```[^\n]*\n([\s\S]*?)\n```/gm)]
  if (blocks.length > 0) {
    const largest = blocks.reduce((a, b) =>
      b[1].split('\n').length > a[1].split('\n').length ? b : a,
    )
    return largest[1].trimEnd()
  }

  // No fences at all — assume the model returned bare ASCII art.
  return trimmed
}
