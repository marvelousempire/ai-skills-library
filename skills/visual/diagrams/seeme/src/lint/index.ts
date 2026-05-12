import type { LintError } from '../types.ts'
import { lintUnicode } from './unicode.ts'
import { lintWidth } from './width.ts'
import { lintClosure } from './closure.ts'
import { lintDiagramPresent } from './diagram-present.ts'

export const lint = (diagram: string): LintError[] => {
  // Short-circuit: if no diagram was returned at all, the other rules are
  // noise (they'd fire on the prose-shaped fallback output). Return the
  // single no-diagram error so the repair prompt asks for the right thing.
  const missing = lintDiagramPresent(diagram)
  if (missing) return [missing]

  return [...lintUnicode(diagram), ...lintWidth(diagram), ...lintClosure(diagram)]
}

export { extractFencedTextBlock } from './extract.ts'
