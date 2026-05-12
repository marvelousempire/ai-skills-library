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
  .option('--explain', 'After the diagram, also output a short prose explanation of what each part means and why this style was picked.')
  .option('--out <path>', 'Also write the diagram as an SVG file (or .txt for raw text). Path extension picks the format.')
  .option('--watch <path>', 'Re-render every time the file at <path> changes. Stdout gets the latest diagram. Ctrl-C to stop.')
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
  // --watch mode: re-render every time the watched file changes. Yields control
  // back to the runtime after each run; Ctrl-C exits.
  if (opts.watch) {
    const { runWatch } = await import('./watch.ts')
    return runWatch(String(opts.watch), opts, runOnce)
  }
  return runOnce(prompt, opts)
}

const runOnce = async (prompt: string[], opts: any) => {
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

  // Track aggregate stats across the entire chain (step 1 + each --then).
  const totalSteps = 1 + thens.length
  const stepResults: GenerateResult[] = []

  // Step 1: initial generation (or first refine, if --refine).
  const firstLabel = opts.refine ? 'refining' : totalSteps > 1 ? 'step 1/' + totalSteps : 'thinking'
  process.stderr.write(dim(firstLabel + '…\n'))
  let result = await runOne({
    input,
    style: styleOpt,
    provider: opts.provider,
    model: opts.model,
    maxRetries: Number(opts.retries),
    refineFrom,
    stream,
  })
  printStep(result, opts.refine ? 'refined' : 'generated', stream)
  stepResults.push(result)

  // Steps 2..N: each --then refines the previous result.
  for (let i = 0; i < thens.length; i++) {
    const instruction = thens[i]
    const stepNum = i + 2
    process.stderr.write(dim(`\n→ step ${stepNum}/${totalSteps}: ${instruction}\n`))
    result = await runOne({
      input: instruction,
      style: styleOpt,
      provider: opts.provider,
      model: opts.model,
      maxRetries: Number(opts.retries),
      refineFrom: result.diagram,
      stream,
    })
    printStep(result, `step ${stepNum}`, stream)
    stepResults.push(result)
  }

  // Chain summary: only print when there's more than one step.
  if (totalSteps > 1) printChainSummary(stepResults)

  // Final write: full diagram to stdout. Intermediate diagrams stayed on stderr.
  process.stdout.write(result.diagram + '\n')

  // Output explanation if requested. Runs after the final diagram so stdout
  // contains [diagram, blank, explanation] — easy to clip the diagram alone
  // with `seeme ... | head -n -K`.
  if (opts.explain && !opts.refine) {
    await emitExplanation(input, result.diagram, opts)
  }

  if (opts.copy) {
    await clipboard.write(result.diagram)
    process.stderr.write(dim('copied to clipboard\n'))
  }

  // Optional SVG export.
  if (opts.out) {
    const { writeSvg } = await import('./export-svg.ts')
    const outPath = String(opts.out)
    writeSvg(result.diagram, outPath)
    process.stderr.write(dim(`wrote ${outPath}\n`))
  }
}

const emitExplanation = async (input: string, diagram: string, opts: any) => {
  process.stderr.write(dim('\nexplaining…\n'))
  // Lazy import to avoid loading the explain prompt + model on every call.
  const { generateExplanation } = await import('./explain.ts')
  const text = await generateExplanation({
    input,
    diagram,
    provider: opts.provider,
    model: opts.model,
  })
  process.stdout.write('\n' + text + '\n')
}

interface RunOneOpts {
  input: string
  style: Style
  provider?: ProviderName
  model?: string
  maxRetries: number
  refineFrom?: string
  stream: boolean
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

const printChainSummary = (results: GenerateResult[]) => {
  const totals = results.reduce(
    (acc, r) => ({
      promptTokens: acc.promptTokens + r.usage.promptTokens,
      completionTokens: acc.completionTokens + r.usage.completionTokens,
      cacheReadInputTokens: acc.cacheReadInputTokens + r.usage.cacheReadInputTokens,
      cacheCreationInputTokens:
        acc.cacheCreationInputTokens + r.usage.cacheCreationInputTokens,
      cachedPromptTokens: acc.cachedPromptTokens + r.usage.cachedPromptTokens,
      attempts: acc.attempts + r.attempts,
    }),
    {
      promptTokens: 0,
      completionTokens: 0,
      cacheReadInputTokens: 0,
      cacheCreationInputTokens: 0,
      cachedPromptTokens: 0,
      attempts: 0,
    },
  )

  process.stderr.write(
    bold(`\n── chain summary ──────────────────────────────\n`),
  )
  process.stderr.write(
    dim(
      `${cyan('steps:')} ${results.length}  ${cyan('total attempts:')} ${totals.attempts}\n`,
    ),
  )

  const usageLine = formatUsage(totals)
  if (usageLine) process.stderr.write(dim(usageLine + '\n'))

  const totalCachedIn = totals.cacheReadInputTokens + totals.cachedPromptTokens
  if (totalCachedIn > 0) {
    const ratio = ((totalCachedIn / Math.max(totals.promptTokens, 1)) * 100).toFixed(0)
    process.stderr.write(
      green(`✓ ${ratio}% of input served from prompt cache across the chain\n`),
    )
  }
}

cli.command('providers', 'List providers and whether each is available').action(async () => {
  const list = await listProviders()
  for (const p of list) {
    const tick = p.available ? green('●') : dim('○')
    console.log(
      `${tick}  ${bold(p.name.padEnd(11))} ${dim(`default: ${p.defaultModel}`.padEnd(32))} ${dim(p.reason)}`,
    )
  }
})

cli.command('config', 'Print resolved SEEME configuration (no secrets)').action(async () => {
  const { env: envValues, longCache, historyEnabled, cacheDisabled } = await import('./env.ts')
  const cached = readLastDiagram()
  const lines = [
    `${cyan('default provider:')} ${envValues.SEEME_PROVIDER ?? bold('auto-detect')}`,
    `${cyan('default model:')}    ${envValues.SEEME_MODEL ?? bold('per-provider default')}`,
    `${cyan('ollama host:')}      ${envValues.OLLAMA_HOST}`,
    `${cyan('long cache (1h):')}  ${longCache ? green('on') : dim('off (5min default)')}`,
    `${cyan('history log:')}      ${historyEnabled ? green('on (~/.seeme/history.jsonl)') : dim('off')}`,
    `${cyan('diagram cache:')}    ${cacheDisabled ? dim('disabled (SEEME_NO_CACHE)') : green(`enabled (${cacheLocation()})`)}`,
    `${cyan('last diagram:')}     ${cached ? green(`cached ${cached.timestamp ?? 'unknown date'} via ${cached.provider}/${cached.model}`) : dim('none yet')}`,
    '',
    `${cyan('keys present:')}`,
    `  anthropic:  ${envValues.ANTHROPIC_API_KEY ? green('●') : dim('○')}`,
    `  openai:     ${envValues.OPENAI_API_KEY ? green('●') : dim('○')}`,
    `  gemini:     ${envValues.GOOGLE_API_KEY ? green('●') : dim('○')}`,
    `  perplexity: ${envValues.PERPLEXITY_API_KEY ? green('●') : dim('○')}`,
  ]
  for (const line of lines) console.log(line)
})

cli
  .command(
    'example [name]',
    'Print an example diagram from the fixtures (offline — no provider needed)',
  )
  .action(async (name?: string) => {
    const { showExample } = await import('./example.ts')
    showExample(name)
  })

cli
  .command('serve', 'Start the SEEME web UI (local HTTP server with live preview)')
  .option('--port <port>', 'Port to bind (default 7777 or $SEEME_PORT)', { default: 7777 })
  .option('--host <host>', 'Host to bind (default 127.0.0.1)', { default: '127.0.0.1' })
  .option('--open', 'Open the UI in your default browser after starting')
  .action(async (opts) => {
    const { startServer } = await import('./server.ts')
    await startServer({
      port: Number(opts.port),
      host: String(opts.host),
      open: !!opts.open,
    })
  })

cli
  .command('stats', 'Summarize history (requires SEEME_HISTORY=1): calls, tokens, cache hit rate')
  .action(async () => {
    const { readHistory, historyLocation } = await import('./history.ts')
    const entries = readHistory()
    if (entries.length === 0) {
      console.log(dim(`No history at ${historyLocation()}. Set SEEME_HISTORY=1 and run seeme once.`))
      return
    }
    const totals = entries.reduce(
      (acc, e) => ({
        calls: acc.calls + 1,
        prompt: acc.prompt + e.usage.promptTokens,
        completion: acc.completion + e.usage.completionTokens,
        cacheRead: acc.cacheRead + e.usage.cacheReadInputTokens + e.usage.cachedPromptTokens,
        cacheWritten: acc.cacheWritten + e.usage.cacheCreationInputTokens,
        attempts: acc.attempts + e.attempts,
      }),
      { calls: 0, prompt: 0, completion: 0, cacheRead: 0, cacheWritten: 0, attempts: 0 },
    )
    const cacheHitRate = totals.prompt > 0 ? (totals.cacheRead / totals.prompt) * 100 : 0

    const byProvider = new Map<string, number>()
    for (const e of entries) byProvider.set(e.provider, (byProvider.get(e.provider) ?? 0) + 1)

    console.log(`${bold('calls:')}            ${totals.calls}`)
    console.log(`${bold('total attempts:')}   ${totals.attempts} (${(totals.attempts / totals.calls).toFixed(2)}/call)`)
    console.log(`${bold('tokens in:')}        ${totals.prompt}`)
    console.log(`${bold('tokens out:')}       ${totals.completion}`)
    console.log(`${bold('cache read:')}       ${totals.cacheRead}`)
    console.log(`${bold('cache written:')}    ${totals.cacheWritten}`)
    console.log(`${bold('cache hit rate:')}   ${cacheHitRate.toFixed(1)}% of input served from cache`)
    console.log(`${bold('by provider:')}`)
    for (const [p, n] of [...byProvider.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${p.padEnd(11)} ${n}`)
    }
    console.log(dim(`\nHistory file: ${historyLocation()}`))
  })

cli.help()
cli.version('1.0.0')

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
