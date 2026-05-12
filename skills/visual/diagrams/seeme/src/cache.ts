// Single-slot cache: stores the most recent successful diagram at
// ~/.seeme/last.txt so `seeme --refine "..."` can read it without the user
// having to paste or pipe. Overwritten on every successful run, not a log.
// Opt out by setting SEEME_NO_CACHE=1.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const dir = join(homedir(), '.seeme')
const file = join(dir, 'last.txt')

const cacheDisabled = (): boolean =>
  process.env.SEEME_NO_CACHE === '1' || process.env.SEEME_NO_CACHE === 'true'

export const writeLastDiagram = (diagram: string): void => {
  if (cacheDisabled()) return
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    writeFileSync(file, diagram, { encoding: 'utf-8', mode: 0o600 })
  } catch {
    // Cache is best-effort — never fail a generation because of a disk hiccup.
  }
}

export const readLastDiagram = (): string | null => {
  if (cacheDisabled()) return null
  try {
    if (!existsSync(file)) return null
    return readFileSync(file, 'utf-8').trimEnd() || null
  } catch {
    return null
  }
}

export const cacheLocation = (): string => file
