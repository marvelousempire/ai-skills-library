import type { LintError } from '../types.ts'

// Check that every `│` character has a vertical anchor in the line above
// OR the line below — i.e. another `│`, a corner (`┌ ┐ └ ┘`), a tee
// (`├ ┤ ┬ ┴ ┼`), or a banner-equivalent at the same column.
//
// This catches the common "box wall doesn't line up" error where a model
// shifts the right edge by one column between adjacent rows. We allow
// orphan `│` only when the line below is empty (last row of the diagram).
//
// Heuristic: tolerant — we DON'T require every `│` to span the full box
// height (since boxes have different heights), just that each `│` has a
// neighbor on at least one side. False positives are worse than false
// negatives for this rule, because the repair prompt costs a round-trip.

const VERTICAL_ANCHORS = new Set([
  '│', '┌', '┐', '└', '┘', '├', '┤', '┬', '┴', '┼', '║', '╔', '╗', '╚', '╝',
])

export const lintAlignment = (diagram: string): LintError[] => {
  const lines = diagram.split('\n')
  const errors: LintError[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Iterate code points so emoji / wide chars don't shift columns we
    // can't reason about. For box-drawing diagrams this equals .length,
    // but stay safe.
    const chars = Array.from(line)

    for (let col = 0; col < chars.length; col++) {
      if (chars[col] !== '│') continue

      const above = lines[i - 1]
      const below = lines[i + 1]

      const aboveChar = above ? Array.from(above)[col] : undefined
      const belowChar = below ? Array.from(below)[col] : undefined

      const hasAnchorAbove = aboveChar !== undefined && VERTICAL_ANCHORS.has(aboveChar)
      const hasAnchorBelow = belowChar !== undefined && VERTICAL_ANCHORS.has(belowChar)

      if (!hasAnchorAbove && !hasAnchorBelow) {
        errors.push({
          line: i + 1,
          problem: `"│" at column ${col + 1} has no vertical neighbor above or below — the box wall doesn't line up`,
          suggestion: `move this "│" or the matching corner one column so the wall is straight (every "│" needs another box char directly above or below)`,
          rule: 'alignment',
        })
        // Only report the first misalignment per line — repair prompts get noisy fast.
        break
      }
    }
  }

  return errors
}
