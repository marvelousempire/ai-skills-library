// `seeme --watch <path>` — re-render the diagram every time the watched file
// changes. Useful for "edit markdown in one pane, diagram updates in the
// other." Uses node's built-in fs.watch with a small debounce — no chokidar
// dependency.

import { watch } from 'node:fs'
import { dim, red } from 'yoctocolors'

const DEBOUNCE_MS = 250

type RunOnce = (prompt: string[], opts: any) => Promise<void>

export const runWatch = async (
  filePath: string,
  opts: any,
  runOnce: RunOnce,
): Promise<void> => {
  // Force file mode for the initial + every subsequent run.
  const withFile = { ...opts, watch: undefined, file: filePath }

  // Initial run so the user sees output immediately.
  process.stderr.write(dim(`watching ${filePath} — Ctrl-C to stop\n`))
  await safeRun(runOnce, [], withFile)

  let timer: NodeJS.Timeout | undefined
  let lastRunAt = 0

  const watcher = watch(filePath, { persistent: true }, (event) => {
    if (event !== 'change' && event !== 'rename') return
    // Debounce: editors often write the file in 2–3 quick syscalls.
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      const now = Date.now()
      if (now - lastRunAt < DEBOUNCE_MS) return
      lastRunAt = now
      process.stderr.write(dim(`\n— ${filePath} changed, re-rendering —\n`))
      await safeRun(runOnce, [], withFile)
    }, DEBOUNCE_MS)
  })

  // Keep the process alive until SIGINT / SIGTERM.
  await new Promise<void>((resolveProm) => {
    const cleanup = () => {
      watcher.close()
      if (timer) clearTimeout(timer)
      resolveProm()
    }
    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
  })
}

const safeRun = async (runOnce: RunOnce, prompt: string[], opts: any) => {
  try {
    await runOnce(prompt, opts)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stderr.write(red(`✗ ${msg}\n`))
    // Don't exit — let the next file change try again.
  }
}
