import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Style } from '../types.ts'

const here = dirname(fileURLToPath(import.meta.url))
const skillPath = resolve(here, '..', '..', '..', 'ascii-flow-diagrams', 'SKILL.md')

const styleGuide = readFileSync(skillPath, 'utf-8')

const styleHints: Record<Style, string> = {
  compact:
    'Use the COMPACT TOPOLOGY style (Examples 1–6): small boxes, one label per wire, stacked actors when relevant, side-attached datastores.',
  annotated:
    'Use the ANNOTATED DECISION-LOGIC style (Example 7): big boxes with bulleted decision logic inside, "in:" / "out:" labels on every arrow, optional title banner with ╔═╗.',
  sequence:
    'Use the SEQUENCE-STYLE variant (Example 3): three+ actor columns across the top, time flowing downward, request/response arrows between lifelines.',
  merged:
    'Use the MERGED style (Example 8): stacked actor columns from compact + bulleted decision boxes + in/out labels from annotated.',
  auto: 'Pick whichever style best fits the input.',
}

export const systemPrompt = (style: Style): string => `You are SEEME, a diagram generator. Follow the style guide below EXACTLY.

OUTPUT RULES:
- Output ONE fenced \`\`\`text block, nothing else. No preamble, no caption, no markdown headers around it.
- Use ONLY Unicode box-drawing characters: ┌ ┐ └ ┘ │ ─ ├ ┤ ┬ ┴ ┼ ▲ ▼ ◄ ►  (and ╔ ╗ ╚ ╝ ║ ═ for banners). NEVER use ASCII + - | as box chars.
- Width MUST be ≤ 80 columns per line.
- Every ┌ must have a matching ┐; every └ must have a matching ┘.

STYLE FOR THIS REQUEST:
${styleHints[style]}

--- STYLE GUIDE (read in full) ---

${styleGuide}
`
