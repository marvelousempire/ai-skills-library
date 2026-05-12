import type { LintError } from '../types.ts'

// The style guide targets ≤ 80 cols, but the canonical reference is 81 and
// loop-back arrows often push diagrams a few cols past 80. Lint at 100 — a
// hard ceiling for "definitely too wide" — and treat 81–100 as acceptable.
const MAX_WIDTH = 100

// Count display columns. Treat each code point as width 1.
// Strips ANSI escapes defensively in case anything bleeds through.
const displayWidth = (line: string): number => {
  const clean = line.replace(/\x1b\[[0-9;]*m/g, '')
  // Use Array.from to count code points (not UTF-16 units) — box-drawing chars are BMP so this equals .length, but safer for any future emoji.
  return Array.from(clean).length
}

export const lintWidth = (diagram: string): LintError[] => {
  const errors: LintError[] = []
  const lines = diagram.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const width = displayWidth(lines[i])
    if (width > MAX_WIDTH) {
      errors.push({
        line: i + 1,
        problem: `line is ${width} columns wide (max ${MAX_WIDTH})`,
        suggestion: `shorten box contents, split into two diagrams, or shrink wire labels`,
        rule: 'width',
      })
    }
  }

  return errors
}
