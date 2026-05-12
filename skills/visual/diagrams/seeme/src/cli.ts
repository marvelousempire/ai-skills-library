import { readFileSync, existsSync } from 'node:fs'
import { cac } from 'cac'
import clipboard from 'clipboardy'
import { bold, cyan, dim, green, red, yellow } from 'yoctocolors'
import { generate, readLastDiagram, cacheLocation } from './generate.ts'
import { listProviders } from './providers/index.ts'
import type { CacheUsage, GenerateResult, ProviderName, Style } from './types.ts'

const cli = cac('seeme')

cli
  .command('[...prompt]', 'Generate a diagram from a prompt, stdin, or --file')
  .option('--style <style>', 'compact | annotated | sequence | merged | auto', {
    default: 'auto',
  })
  .option('--provider <name>', 'ollama | anthropic | openai | gemini | perplexity')
  .option('--model <id>', 'Model id, e.g. claude-opus-4-7 / llama3.1 / gpt-4o')
  .option('--file <path>', 'Read input from a file instead of args/stdin')
  .option('--copy', 'Also copy the final diagram to the clipboard')
  .option('--no-stream', 'Disable streaming output')
  .option('--retries <n>', 'Max repair retries on lint failure (default 3)', { default: 3 })
  .option('--refine', 'Treat the prompt as an edit instruction applied to the last diagram (from ~/.seeme/last.json, --from, or stdin). Inherits the previous style unless --style is passed.')
  .option('--from <path>', 'Path to a previous diagram (for --refine). Defaults to ~/.seeme/last.json')
  .option('--then <instruction>', 'After the first generation, refine with this instruction. Repeatable — each --then refines the previous output. All share the same cached system prompt.')
  .action(async (prompt: string[], opts) => {
    try {
      await runGenerate(prompt, opts)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      process.stderr.write(red(`✗ ${msg}\n`))
      process.exit(1)
    }
  })

const runGenerate = async (prompt: string[], opts: any) => {
  const input = await resolveInput(prompt, opts.file)
  if (!input) {
    const what = opts.refine ? 'an edit instruction' : 'a prompt'
    process.stderr.write(red(`No input. Pass ${what}, --file <path>, or pipe via stdin.\n`))
    process.exit(1)
  }

  // --then is repeatable; cac surfaces it as either a string (one) or array.
  const thens: string[] =
    typeof opts.then === 'string' ? [opts.then] : Array.isArray(opts.then) ? opts.then : []

  // Resolve initial refine source (if --refine was passed without --then).
  let refineFrom: string | undefined
  let inheritedStyle: Style | undefined
  if (opts.refine) {
    const { diagram, style } = resolveRefineSource(opts.from)
    if (!diagram) {
      process.stderr.write(
        red(`--refine needs a previous diagram. None found at ${cacheLocation()}.\n`),
      )
      process.stderr.write(
        dim('  Pass --from <path>, pipe one via stdin (paired with --file), or run seeme once first.\n'),
      )
      process.exit(1)
    }
    refineFrom = diagram
    inheritedStyle = style
  }

  const stream = opts.stream !== false
  const styleOpt: Style = opts.style ?? inheritedStyle ?? 'auto'

  // Step 1: initial generation (or first refine, if --refine).
  process.stderr.write(dim(opts.refine ? 'refining…\n' : 'thinking…\n'))
  let result = await runOne({
    input,
    style: styleOpt,
    provider: opts.provider,
    model: opts.model,
    maxRetries: Number(opts.retries),
    refineFrom,
    stream,
    label: opts.refine ? 'refine' : 'generate',
  })
  printStep(result, opts.refine ? 'refined' : 'generated', stream)

  // Steps 2..N: each --then refines the previous result.
  for (let i = 0; i < thens.length; i++) {
    const instruction = thens[i]
    process.stderr.write(dim(`\n→ then: ${instruction}\n`))
    result = await runOne({
      input: instruction,
      style: styleOpt,
      provider: opts.provider,
      model: opts.model,
      maxRetries: Number(opts.retries),
      refineFrom: result.diagram,
      stream,
      label: `then[${i + 1}]`,
    })
    printStep(result, `refined (step ${i + 2})`, stream)
  }

  // Final write: full diagram to stdout. Intermediate diagrams stayed on stderr.
  process.stdout.write(result.diagram + '\n')

  if (opts.copy) {
    await clipboard.write(result.diagram)
    process.stderr.write(dim('copied to clipboard\n'))
  }
}

interface RunOneOpts {
  input: string
  style: Style
  provider?: ProviderName
  model?: string
  maxRetries: number
  refineFrom?: string
  stream: boolean
  label: string
}

const runOne = async (o: RunOneOpts): Promise<GenerateResult> => {
  return generate({
    input: o.input,
    style: o.style,
    provider: o.provider,
    model: o.model,
    maxRetries: o.maxRetries,
    refineFrom: o.refineFrom,
    onStreamChunk: o.stream ? (c) => process.stderr.write(dim(c)) : undefined,
  })
}

const printStep = (result: GenerateResult, label: string, streamed: boolean) => {
  if (streamed) process.stderr.write('\n')

  process.stderr.write(
    dim(
      `${cyan(label + ':')} ${result.provider} / ${result.model}  ${cyan('attempts:')} ${result.attempts}\n`,
    ),
  )

  const usageLine = formatUsage(result.usage)
  if (usageLine) process.stderr.write(dim(usageLine + '\n'))

  if (result.warnings.length > 0) {
    process.stderr.write(
      yellow(
        `${bold('⚠')}  ${result.warnings.length} lint warning(s) remain after ${result.attempts} attempt(s):\n`,
      ),
    )
    for (const w of result.warnings) {
      process.stderr.write(yellow(`   • Line ${w.line} [${w.rule}]: ${w.problem}\n`))
    }
  } else if (result.attempts > 1) {
    process.stderr.write(green(`✓ clean after ${result.attempts} attempts\n`))
  } else {
    process.stderr.write(green('✓ clean on first try\n'))
  }
}

const formatUsage = (u: CacheUsage): string | null => {
  const cacheBits: string[] = []
  if (u.cacheReadInputTokens > 0) cacheBits.push(`${u.cacheReadInputTokens} read`)
  if (u.cacheCreationInputTokens > 0) cacheBits.push(`${u.cacheCreationInputTokens} written`)
  if (u.cachedPromptTokens > 0) cacheBits.push(`${u.cachedPromptTokens} cached`)

  if (u.promptTokens === 0 && cacheBits.length === 0) return null

  return (
    `${cyan('tokens:')} ${u.promptTokens} in / ${u.completionTokens} out` +
    (cacheBits.length > 0 ? `  ${cyan('cache:')} ${cacheBits.join(' / ')}` : '')
  )
}

cli.command('providers', 'List providers and whether each is available').action(async () => {
  const list = await listProviders()
  for (const p of list) {
    const tick = p.available ? green('●') : dim('○')
    console.log(`${tick}  ${bold(p.name.padEnd(11))} ${dim(p.reason)}`)
  }
})

cli.help()
cli.version('0.2.0')

const resolveInput = async (prompt: string[], file?: string): Promise<string | null> => {
  if (file) {
    if (!existsSync(file)) throw new Error(`File not found: ${file}`)
    return readFileSync(file, 'utf-8')
  }
  if (prompt.length > 0) return prompt.join(' ')
  if (!process.stdin.isTTY) {
    let data = ''
    for await (const chunk of process.stdin) data += chunk
    return data.trim() || null
  }
  return null
}

const resolveRefineSource = (
  fromPath?: string,
): { diagram: string | null; style?: Style } => {
  if (fromPath) {
    if (!existsSync(fromPath)) throw new Error(`File not found: ${fromPath}`)
    return { diagram: readFileSync(fromPath, 'utf-8').trimEnd() }
  }
  const cached = readLastDiagram()
  if (!cached) return { diagram: null }
  return { diagram: cached.diagram, style: cached.style }
}

cli.parse()
