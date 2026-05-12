import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Re-import the cache module after redirecting $HOME so write/read hit a
// temp dir, not the real ~/.seeme.
const withTempHome = async (fn: () => Promise<void> | void) => {
  const tmp = mkdtempSync(join(tmpdir(), 'seeme-cache-'))
  const originalHome = process.env.HOME
  process.env.HOME = tmp
  try {
    // Import fresh so the module re-reads HOME.
    delete (globalThis as any).__seemeCacheCached
    const cache = await import(`../src/cache.ts?t=${Date.now()}`)
    await fn.call({ cache, tmp } as any)
  } finally {
    process.env.HOME = originalHome
    rmSync(tmp, { recursive: true, force: true })
  }
}

test('writeLastDiagram + readLastDiagram round-trip', async () => {
  await withTempHome(async function (this: any) {
    const { writeLastDiagram, readLastDiagram } = this.cache
    writeLastDiagram('┌──┐\n│ A │\n└──┘')
    assert.equal(readLastDiagram(), '┌──┐\n│ A │\n└──┘')
  })
})

test('readLastDiagram returns null when no cache file exists', async () => {
  await withTempHome(async function (this: any) {
    const { readLastDiagram } = this.cache
    assert.equal(readLastDiagram(), null)
  })
})

test('SEEME_NO_CACHE=1 disables write and read', async () => {
  await withTempHome(async function (this: any) {
    const { writeLastDiagram, readLastDiagram } = this.cache
    const prev = process.env.SEEME_NO_CACHE
    process.env.SEEME_NO_CACHE = '1'
    try {
      writeLastDiagram('should not persist')
      assert.equal(readLastDiagram(), null)
    } finally {
      if (prev === undefined) delete process.env.SEEME_NO_CACHE
      else process.env.SEEME_NO_CACHE = prev
    }
  })
})
