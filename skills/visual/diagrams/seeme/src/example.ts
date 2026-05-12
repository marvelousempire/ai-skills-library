// Print a fixture diagram so a user can see what SEEME output looks like
// before installing/running a provider. Pure offline — no network, no API
// key, no Ollama needed.

import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const fixturesDir = resolve(here, '..', 'test', 'fixtures', 'good')

const list = (): string[] => {
  try {
    return readdirSync(fixturesDir).filter((f) => f.endsWith('.txt'))
  } catch {
    return []
  }
}

export const showExample = (name?: string): void => {
  const files = list()
  if (files.length === 0) {
    process.stderr.write(
      `No example fixtures found at ${fixturesDir}. Reinstall the skill?\n`,
    )
    process.exit(1)
  }

  // Resolve which fixture to show.
  let pick: string | undefined
  if (name) {
    pick = files.find((f) => f === name || f === `${name}.txt`)
    if (!pick) {
      process.stderr.write(
        `Unknown example "${name}". Available: ${files.map((f) => f.replace(/\.txt$/, '')).join(', ')}\n`,
      )
      process.exit(1)
    }
  } else {
    pick = files[0] // canonical or simple, whichever sorts first (alpha)
  }

  const diagram = readFileSync(resolve(fixturesDir, pick), 'utf-8')
  process.stdout.write(diagram)

  if (!name) {
    process.stderr.write(
      `\n(example: ${pick.replace(/\.txt$/, '')} — try \`seeme example <name>\` for a different one. Available: ${files.map((f) => f.replace(/\.txt$/, '')).join(', ')})\n`,
    )
    process.stderr.write(
      'This is a static fixture — `seeme "<prompt>"` against a real provider generates fresh diagrams in this style.\n',
    )
  }
}
