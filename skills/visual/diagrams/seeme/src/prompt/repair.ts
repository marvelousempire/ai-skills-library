import type { LintError } from '../types.ts'

export const repairPrompt = (diagram: string, errors: LintError[]): string => `Your previous diagram had ${errors.length} issue(s). Fix them and output the FULL corrected diagram in a single \`\`\`text block.

ORIGINAL:
\`\`\`text
${diagram}
\`\`\`

ISSUES:
${errors
  .map((e, i) => `${i + 1}. Line ${e.line} [${e.rule}]: ${e.problem}\n   Fix: ${e.suggestion}`)
  .join('\n')}

Output ONLY the corrected diagram inside a single \`\`\`text fence. No commentary, no explanation.
`
