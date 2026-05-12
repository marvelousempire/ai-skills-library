// MCP server exposing SEEME as two tools over stdio:
//   - generate_diagram(input, style?, provider?, model?)
//   - refine_diagram(instruction, previous?, style?, provider?, model?)
//
// Wire into Claude Desktop / Cursor / Claude Code by adding to MCP config:
//   {
//     "mcpServers": {
//       "seeme": { "command": "seeme-mcp" }
//     }
//   }

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { generate, readLastDiagram } from './generate.ts'
import type { ProviderName, Style } from './types.ts'

const STYLES: Style[] = ['compact', 'annotated', 'sequence', 'merged', 'auto']
const PROVIDERS: ProviderName[] = [
  'ollama',
  'anthropic',
  'openai',
  'gemini',
  'perplexity',
]

const server = new Server(
  { name: 'seeme', version: '0.2.0' },
  { capabilities: { tools: {} } },
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'generate_diagram',
      description:
        'Turn any input (prose, code, JSON, notes, a one-line idea) into a Unicode box-and-arrow diagram in the ascii-flow-diagrams style. Returns the diagram inside a fenced ```text block. Defaults to local Ollama; falls back to whichever cloud provider has a key set.',
      inputSchema: {
        type: 'object',
        required: ['input'],
        properties: {
          input: {
            type: 'string',
            description: 'The text, code, or idea to diagram.',
          },
          style: {
            type: 'string',
            enum: STYLES,
            description:
              'compact = topology, annotated = boxes with bulleted decision logic, sequence = time-ordered actor columns, merged = both topology and decision logic, auto = let the model pick.',
            default: 'auto',
          },
          provider: {
            type: 'string',
            enum: PROVIDERS,
            description:
              'Force a specific provider. Default: auto-detect (Ollama if reachable, otherwise the first cloud provider with a key).',
          },
          model: {
            type: 'string',
            description:
              'Model id (e.g. llama3.1, claude-opus-4-7, gpt-4o). Defaults to the provider-default.',
          },
        },
      },
    },
    {
      name: 'refine_diagram',
      description:
        'Apply a natural-language edit instruction to an existing diagram. If `previous` is omitted, reads ~/.seeme/last.json (the last clean diagram from this user). Style is inherited from the previous diagram unless `style` is passed.',
      inputSchema: {
        type: 'object',
        required: ['instruction'],
        properties: {
          instruction: {
            type: 'string',
            description:
              'What to change. E.g. "add a redis cache between the API and the database" or "split the API into auth and data".',
          },
          previous: {
            type: 'string',
            description:
              'The previous diagram to refine. Optional — defaults to the cached last diagram.',
          },
          style: { type: 'string', enum: STYLES },
          provider: { type: 'string', enum: PROVIDERS },
          model: { type: 'string' },
        },
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  const a = (args ?? {}) as Record<string, unknown>

  try {
    if (name === 'generate_diagram') {
      const input = requireString(a, 'input')
      const result = await generate({
        input,
        style: pickEnum(a.style, STYLES, 'auto'),
        provider: pickEnum(a.provider, PROVIDERS),
        model: typeof a.model === 'string' ? a.model : undefined,
      })
      return formatResult(result)
    }

    if (name === 'refine_diagram') {
      const instruction = requireString(a, 'instruction')

      let previous = typeof a.previous === 'string' ? a.previous : undefined
      let inheritedStyle: Style | undefined
      if (!previous) {
        const cached = readLastDiagram()
        if (!cached) {
          return errorResponse(
            'No previous diagram to refine. Pass `previous` explicitly, or call `generate_diagram` first.',
          )
        }
        previous = cached.diagram
        inheritedStyle = cached.style
      }

      const result = await generate({
        input: instruction,
        style: pickEnum(a.style, STYLES, inheritedStyle ?? 'auto'),
        provider: pickEnum(a.provider, PROVIDERS),
        model: typeof a.model === 'string' ? a.model : undefined,
        refineFrom: previous,
      })
      return formatResult(result)
    }

    return errorResponse(`Unknown tool: ${name}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return errorResponse(msg)
  }
})

const requireString = (a: Record<string, unknown>, key: string): string => {
  const v = a[key]
  if (typeof v !== 'string' || v.length === 0) {
    throw new Error(`Missing or empty required argument: ${key}`)
  }
  return v
}

function pickEnum<T extends string>(value: unknown, allowed: T[], fallback: T): T
function pickEnum<T extends string>(value: unknown, allowed: T[], fallback?: undefined): T | undefined
function pickEnum<T extends string>(value: unknown, allowed: T[], fallback?: T): T | undefined {
  if (typeof value === 'string' && (allowed as string[]).includes(value)) return value as T
  return fallback
}

const formatResult = (result: Awaited<ReturnType<typeof generate>>) => {
  const summary = `provider: ${result.provider} · model: ${result.model} · attempts: ${result.attempts}`
  const warningsBlock =
    result.warnings.length > 0
      ? `\n\n⚠ ${result.warnings.length} lint warning(s) remain:\n` +
        result.warnings
          .map((w) => `  • Line ${w.line} [${w.rule}]: ${w.problem}`)
          .join('\n')
      : ''
  return {
    content: [
      {
        type: 'text' as const,
        text: '```text\n' + result.diagram + '\n```\n\n' + summary + warningsBlock,
      },
    ],
  }
}

const errorResponse = (message: string) => ({
  isError: true,
  content: [{ type: 'text' as const, text: `Error: ${message}` }],
})

const main = async () => {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  // stderr is fine to log to — stdio transport uses stdout for protocol frames.
  process.stderr.write('seeme-mcp ready on stdio\n')
}

main().catch((err) => {
  process.stderr.write(`seeme-mcp fatal: ${err instanceof Error ? err.message : err}\n`)
  process.exit(1)
})
