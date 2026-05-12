import type { LintError } from '../types.ts'

// Fast-fail check: if the extracted text contains essentially no box-drawing
// characters, the model returned prose (or apology, or refusal) instead of a
// diagram. When this fires, other lint rules are noise — short-circuit them
// in lint() and re-prompt with a clear "give me a diagram" instruction.

const BOX_CHARS = /[┌┐└┘│─├┤┬┴┼╔╗╚╝║═▲▼◄►]/g
const MIN_BOX_CHARS = 3

export const lintDiagramPresent = (diagram: string): LintError | null => {
  const matches = diagram.match(BOX_CHARS)
  const count = matches?.length ?? 0
  if (count >= MIN_BOX_CHARS) return null

  const preview = diagram.slice(0, 80).replace(/\n/g, ' ')
  return {
    line: 1,
    problem: `no diagram detected — found only ${count} box-drawing character(s). Output looks like prose, not a diagram. (preview: "${preview}…")`,
    suggestion: `output ONE fenced \`\`\`text block containing a Unicode box-and-arrow diagram. Use ┌ ┐ └ ┘ │ ─ for boxes and ▲ ▼ ◄ ► for arrows. No prose, no apology, no commentary outside the fenced block.`,
    rule: 'no-diagram',
  }
}
