// Single-slot cache: stores the most recent successful diagram at
// ~/.seeme/last.json so `seeme --refine "..."` can read it without the user
// having to paste or pipe. Overwritten on every successful run, not a log.
// Opt out by setting SEEME_NO_CACHE=1.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { ProviderName, Style } from './types.ts'

const dir = join(homedir(), '.seeme')
const jsonFile = join(dir, 'last.json')
const legacyTextFile = join(dir, 'last.txt') // backward compat with v0.1

export interface CachedDiagram {
  diagram: string
  style?: Style
  provider?: ProviderName
  model?: string
  input?: string
  timestamp?: string
}

const cacheDisabled = (): boolean =>
  process.env.SEEME_NO_CACHE === '1' || process.env.SEEME_NO_CACHE === 'true'

export const writeLastDiagram = (entry: CachedDiagram): void => {
  if (cacheDisabled()) return
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const payload: CachedDiagram = {
      ...entry,
      timestamp: entry.timestamp ?? new Date().toISOString(),
    }
    writeFileSync(jsonFile, JSON.stringify(payload, null, 2) + '\n', {
      encoding: 'utf-8',
      mode: 0o600,
    })
  } catch {
    // Cache is best-effort — never fail a generation because of a disk hiccup.
  }
}

export const readLastDiagram = (): CachedDiagram | null => {
  if (cacheDisabled()) return null
  try {
    if (existsSync(jsonFile)) {
      const raw = readFileSync(jsonFile, 'utf-8')
      const parsed = JSON.parse(raw) as CachedDiagram
      if (parsed && typeof parsed.diagram === 'string') return parsed
      return null
    }
    // Backward compat: old v0.1 wrote a plain text file.
    if (existsSync(legacyTextFile)) {
      const text = readFileSync(legacyTextFile, 'utf-8').trimEnd()
      return text ? { diagram: text } : null
    }
    return null
  } catch {
    return null
  }
}

export const cacheLocation = (): string => jsonFile
