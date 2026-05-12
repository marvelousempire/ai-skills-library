import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import type { Style } from '../types.ts'

const here = dirname(fileURLToPath(import.meta.url))
const skillPath = resolve(here, '..', '..', '..', 'ascii-flow-diagrams', 'SKILL.md')

const loadStyleGuide = (): string => {
  if (!existsSync(skillPath)) {
    throw new Error(
      `SEEME cannot find the ascii-flow-diagrams style spec.\n` +
        `  Expected: ${skillPath}\n` +
        `  Reason: SEEME reads the neighboring SKILL.md as its system prompt.\n` +
        `  Fix: ensure skills/visual/diagrams/ascii-flow-diagrams/SKILL.md exists\n` +
        `       next to skills/visual/diagrams/seeme/, or set the SEEME_STYLE_SPEC env var.`,
    )
  }
  try {
    return readFileSync(skillPath, 'utf-8')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`SEEME failed to read style spec at ${skillPath}: ${msg}`)
  }
}

// Allow override via env (useful for tests / vendored installs that bundle
// the spec separately). Falls back to the neighbor SKILL.md.
const styleGuide = process.env.SEEME_STYLE_SPEC && existsSync(process.env.SEEME_STYLE_SPEC)
  ? readFileSync(process.env.SEEME_STYLE_SPEC, 'utf-8')
  : loadStyleGuide()

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
