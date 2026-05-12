// Opt-in JSONL history at ~/.seeme/history.jsonl. One line per successful
// generation. Enabled by SEEME_HISTORY=1. Powers `seeme stats`.

import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { CacheUsage, ProviderName, Style } from './types.ts'

const dir = join(homedir(), '.seeme')
const file = join(dir, 'history.jsonl')

export interface HistoryEntry {
  timestamp: string
  input: string
  provider: ProviderName
  model: string
  style: Style
  attempts: number
  usage: CacheUsage
  /** "generate" | "refine" | "then[i]" — what kind of step this was. */
  kind: 'generate' | 'refine' | 'then'
}

const historyEnabled = (): boolean =>
  process.env.SEEME_HISTORY === '1' || process.env.SEEME_HISTORY === 'true'

export const appendHistory = (entry: HistoryEntry): void => {
  if (!historyEnabled()) return
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    appendFileSync(file, JSON.stringify(entry) + '\n', { mode: 0o600 })
  } catch {
    // Best-effort — never fail a generation because of a disk hiccup.
  }
}

export const readHistory = (): HistoryEntry[] => {
  try {
    if (!existsSync(file)) return []
    const raw = readFileSync(file, 'utf-8')
    return raw
      .split('\n')
      .filter((l) => l.length > 0)
      .map((l) => {
        try {
          return JSON.parse(l) as HistoryEntry
        } catch {
          return null
        }
      })
      .filter((e): e is HistoryEntry => e !== null)
  } catch {
    return []
  }
}

export const historyLocation = (): string => file
