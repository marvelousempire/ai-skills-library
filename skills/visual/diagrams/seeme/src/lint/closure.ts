import type { LintError } from '../types.ts'

const count = (s: string, ch: string): number => {
  let n = 0
  for (const c of s) if (c === ch) n++
  return n
}

export const lintClosure = (diagram: string): LintError[] => {
  const errors: LintError[] = []

  // Light corners: ┌ ┐ └ ┘ — must balance pairwise.
  const topLeft = count(diagram, '┌')
  const topRight = count(diagram, '┐')
  const botLeft = count(diagram, '└')
  const botRight = count(diagram, '┘')

  if (topLeft !== topRight) {
    errors.push({
      line: 1,
      problem: `${topLeft} "┌" but ${topRight} "┐" (top corners do not balance)`,
      suggestion: `add the missing ${topLeft > topRight ? '"┐"' : '"┌"'} to close every box`,
      rule: 'closure',
    })
  }
  if (botLeft !== botRight) {
    errors.push({
      line: 1,
      problem: `${botLeft} "└" but ${botRight} "┘" (bottom corners do not balance)`,
      suggestion: `add the missing ${botLeft > botRight ? '"┘"' : '"└"'} to close every box`,
      rule: 'closure',
    })
  }
  // Note: we deliberately do NOT require `┌` count == `└` count. Loop-back
  // arrows below the main row use `└──...──┘` as a connector, not as a box
  // closure — so bottom-corner count routinely exceeds top-corner count in
  // valid diagrams. We only require each corner type balances its pair.

  // Heavy banner corners: ╔ ╗ ╚ ╝ — same check.
  const hTL = count(diagram, '╔')
  const hTR = count(diagram, '╗')
  const hBL = count(diagram, '╚')
  const hBR = count(diagram, '╝')

  if (hTL !== hTR || hBL !== hBR || hTL !== hBL) {
    errors.push({
      line: 1,
      problem: `heavy-banner corners do not balance (╔=${hTL} ╗=${hTR} ╚=${hBL} ╝=${hBR})`,
      suggestion: `every ╔ needs a ╗ on the same line and a matching ╚/╝ pair below`,
      rule: 'closure',
    })
  }

  return errors
}
