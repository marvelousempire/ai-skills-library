import type { LintError } from '../types.ts'

// Fast-fail check: if the extracted text contains essentially no box-drawing
// characters, the model returned prose (or apology, or refusal) instead of a
// diagram. When this fires, other lint rules are noise — short-circuit them
// in lint() and re-prompt with a clear "give me a diagram" instruction.
//
// Sub-classifies the failure when possible so the repair prompt is sharper:
//   - refused:      "I'm sorry I cannot…" / "I can't help with…"
//   - wrong-format: returned JSON / markdown table / numbered list
//   - truncated:    looks like a diagram but got cut off mid-line
//   - generic:      everything else (prose, empty, gibberish)

const BOX_CHARS = /[┌┐└┘│─├┤┬┴┼╔╗╚╝║═▲▼◄►]/g
const MIN_BOX_CHARS = 3

const REFUSAL_PATTERNS = [
  /\bi (cannot|can't|am unable|am not able)\b/i,
  /\bsorry\b.{0,40}\b(can't|cannot|unable)\b/i,
  /\b(unable|refuse) to (help|provide|generate)\b/i,
  /\bas an ai\b.{0,40}\b(can't|cannot|unable)\b/i,
]

const looksLikeJson = (text: string): boolean => {
  const trimmed = text.trim()
  return (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  )
}

const looksLikeMarkdownTable = (text: string): boolean => {
  // Header row: at least one |...| pair.
  if (!/^\s*\|.+\|\s*$/m.test(text)) return false
  // Separator row: only dashes, colons, pipes, and whitespace. Must contain
  // a dash to distinguish from a regular pipe-delimited row.
  return /^\s*\|[\s\-:|]+\|\s*$/m.test(text) && /-/.test(text)
}

const looksLikeNumberedList = (text: string): boolean => {
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  if (lines.length < 3) return false
  const numbered = lines.filter((l) => /^\s*\d+[.)]\s+/.test(l)).length
  return numbered / lines.length > 0.5
}

const looksTruncated = (text: string, boxCount: number): boolean => {
  // Has SOME box chars but fewer than the threshold, and the last line
  // doesn't appear to close properly (no `┘`, no `─` at the end).
  if (boxCount === 0) return false
  const lastLine = text.split('\n').filter((l) => l.length > 0).pop() ?? ''
  return !/[┘─┐│]$/.test(lastLine.trimEnd())
}

const classify = (text: string, boxCount: number): {
  kind: 'refused' | 'wrong-format' | 'truncated' | 'generic'
  problem: string
  suggestion: string
} => {
  if (REFUSAL_PATTERNS.some((re) => re.test(text))) {
    return {
      kind: 'refused',
      problem: 'model refused to generate a diagram',
      suggestion:
        'rephrase the user prompt to make it concrete (e.g. instead of "explain this concept," try "diagram the data flow between X, Y, and Z"). If the refusal persists, switch providers with --provider.',
    }
  }
  if (looksLikeJson(text)) {
    return {
      kind: 'wrong-format',
      problem: 'model returned JSON instead of a fenced ```text diagram',
      suggestion:
        'output a Unicode box-and-arrow diagram (┌ ┐ └ ┘ │ ─) inside a single ```text fence. Do NOT return JSON or any other structured format.',
    }
  }
  if (looksLikeMarkdownTable(text)) {
    return {
      kind: 'wrong-format',
      problem: 'model returned a markdown table instead of a diagram',
      suggestion:
        'output a Unicode box-and-arrow diagram (┌ ┐ └ ┘ │ ─) inside a ```text fence. Do NOT use markdown tables.',
    }
  }
  if (looksLikeNumberedList(text)) {
    return {
      kind: 'wrong-format',
      problem: 'model returned a numbered list instead of a diagram',
      suggestion:
        'output a Unicode box-and-arrow diagram (┌ ┐ └ ┘ │ ─) inside a ```text fence. Do NOT use prose or numbered lists.',
    }
  }
  if (looksTruncated(text, boxCount)) {
    return {
      kind: 'truncated',
      problem: 'diagram appears truncated mid-line',
      suggestion:
        'output the FULL diagram. The previous response was cut off — try again, keep width ≤ 80 columns so it fits in one response.',
    }
  }
  const preview = text.slice(0, 80).replace(/\n/g, ' ')
  return {
    kind: 'generic',
    problem: `no diagram detected — found only ${boxCount} box-drawing character(s). (preview: "${preview}…")`,
    suggestion:
      'output ONE fenced ```text block containing a Unicode box-and-arrow diagram. Use ┌ ┐ └ ┘ │ ─ for boxes and ▲ ▼ ◄ ► for arrows. No prose, no apology, no commentary outside the fenced block.',
  }
}

export const lintDiagramPresent = (diagram: string): LintError | null => {
  const matches = diagram.match(BOX_CHARS)
  const count = matches?.length ?? 0
  if (count >= MIN_BOX_CHARS) return null

  const c = classify(diagram, count)
  return {
    line: 1,
    problem: c.problem,
    suggestion: c.suggestion,
    rule: 'no-diagram',
  }
}
