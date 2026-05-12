import type { LintError } from '../types.ts'

// Flag lines that look like ASCII boxes instead of Unicode box-drawing.
// Heuristic patterns: +--+ corners, all-pipe rails, --- horizontals between |.

const ASCII_CORNER = /\+[-=]+\+/
const ASCII_PIPE_RAIL = /^\s*\|[^|\n]*\|\s*$/
const ASCII_DASH_RAIL = /^\s*[+|]?\s*-{3,}\s*[+|]?\s*$/

export const lintUnicode = (diagram: string): LintError[] => {
  const errors: LintError[] = []
  const lines = diagram.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (ASCII_CORNER.test(line)) {
      errors.push({
        line: i + 1,
        problem: `uses ASCII corners like "+---+"`,
        suggestion: `replace with Unicode box corners: ┌ ┐ └ ┘`,
        rule: 'unicode',
      })
      continue
    }

    if (ASCII_PIPE_RAIL.test(line) && !/[┌┐└┘│├┤]/.test(line)) {
      errors.push({
        line: i + 1,
        problem: `uses ASCII pipes "|" as a box side`,
        suggestion: `replace "|" with Unicode "│" for vertical box sides`,
        rule: 'unicode',
      })
      continue
    }

    if (ASCII_DASH_RAIL.test(line) && !/[─━═]/.test(line)) {
      errors.push({
        line: i + 1,
        problem: `uses ASCII dashes "---" as a horizontal rail`,
        suggestion: `replace "-" with Unicode "─" for horizontal box edges`,
        rule: 'unicode',
      })
    }
  }

  return errors
}
