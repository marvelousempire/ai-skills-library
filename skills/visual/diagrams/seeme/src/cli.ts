import { readFileSync, existsSync } from 'node:fs'
import { cac } from 'cac'
import clipboard from 'clipboardy'
import { bold, cyan, dim, green, red, yellow } from 'yoctocolors'
import { generate, readLastDiagram, cacheLocation } from './generate.ts'
import { listProviders } from './providers/index.ts'
import type { ProviderName, Style } from './types.ts'

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
  .option('--refine', 'Treat the prompt as an edit instruction applied to the last diagram (from ~/.seeme/last.txt, --from, or stdin)')
  .option('--from <path>', 'Path to a previous diagram (for --refine). Defaults to ~/.seeme/last.txt')
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

    let refineFrom: string | undefined
    if (opts.refine) {
      refineFrom = resolveRefineSource(opts.from)
      if (!refineFrom) {
        process.stderr.write(
          red(`--refine needs a previous diagram. None found at ${cacheLocation()}.\n`),
        )
        process.stderr.write(
          dim('  Pass --from <path>, pipe one via stdin (paired with --file), or run seeme once first.\n'),
        )
        process.exit(1)
      }
    }

    const stream = opts.stream !== false
    process.stderr.write(dim(opts.refine ? 'refining…\n' : 'thinking…\n'))

    const result = await generate({
      input,
      style: opts.style as Style,
      provider: opts.provider as ProviderName | undefined,
      model: opts.model,
      maxRetries: Number(opts.retries),
      refineFrom,
      onStreamChunk: stream ? (c) => process.stderr.write(dim(c)) : undefined,
    })

    if (stream) process.stderr.write('\n\n')

    process.stdout.write(result.diagram + '\n')

    process.stderr.write(
      dim(
        `\n${cyan('provider:')} ${result.provider}  ${cyan('model:')} ${result.model}  ${cyan('attempts:')} ${result.attempts}\n`,
      ),
    )

    const u = result.usage
    const cacheBits: string[] = []
    if (u.cacheReadInputTokens > 0)
      cacheBits.push(`${u.cacheReadInputTokens} read`)
    if (u.cacheCreationInputTokens > 0)
      cacheBits.push(`${u.cacheCreationInputTokens} written`)
    if (u.cachedPromptTokens > 0) cacheBits.push(`${u.cachedPromptTokens} cached`)
    if (cacheBits.length > 0 || u.promptTokens > 0) {
      process.stderr.write(
        dim(
          `${cyan('tokens:')} ${u.promptTokens} in / ${u.completionTokens} out` +
            (cacheBits.length > 0 ? `  ${cyan('cache:')} ${cacheBits.join(' / ')}` : '') +
            '\n',
        ),
      )
    }

    if (result.warnings.length > 0) {
      process.stderr.write(
        yellow(`\n${bold('⚠')}  ${result.warnings.length} lint warning(s) remain after ${result.attempts} attempt(s):\n`),
      )
      for (const w of result.warnings) {
        process.stderr.write(yellow(`   • Line ${w.line} [${w.rule}]: ${w.problem}\n`))
      }
    } else if (result.attempts > 1) {
      process.stderr.write(green(`✓ clean after ${result.attempts} attempts\n`))
    } else {
      process.stderr.write(green('✓ clean on first try\n'))
    }

    if (opts.copy) {
      await clipboard.write(result.diagram)
      process.stderr.write(dim('copied to clipboard\n'))
    }
}

cli.command('providers', 'List providers and whether each is available').action(async () => {
  const list = await listProviders()
  for (const p of list) {
    const tick = p.available ? green('●') : dim('○')
    console.log(`${tick}  ${bold(p.name.padEnd(11))} ${dim(p.reason)}`)
  }
})

cli.help()
cli.version('0.1.0')

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

const resolveRefineSource = (fromPath?: string): string | undefined => {
  if (fromPath) {
    if (!existsSync(fromPath)) throw new Error(`File not found: ${fromPath}`)
    return readFileSync(fromPath, 'utf-8').trimEnd()
  }
  return readLastDiagram() ?? undefined
}

cli.parse()
