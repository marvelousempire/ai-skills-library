// Build a user-prompt that asks the model to edit an existing diagram
// according to a natural-language instruction, while preserving the style.
// The system prompt (style guide) is the same — only the user payload changes,
// so prompt caching still hits.

export const refinePrompt = (previousDiagram: string, instruction: string): string => `Refine the diagram below according to the instruction. Keep everything else the same — same overall topology, same style, same width. Output ONE fenced \`\`\`text block containing the FULL updated diagram. No commentary.

INSTRUCTION:
${instruction}

PREVIOUS DIAGRAM:
\`\`\`text
${previousDiagram}
\`\`\`

Output ONLY the updated diagram inside a single \`\`\`text fence.
`
