import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
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
    const cache = await import(`../src/cache.ts?t=${Date.now()}`)
    await fn.call({ cache, tmp } as any)
  } finally {
    process.env.HOME = originalHome
    rmSync(tmp, { recursive: true, force: true })
  }
}

test('writeLastDiagram + readLastDiagram round-trip with metadata', async () => {
  await withTempHome(async function (this: any) {
    const { writeLastDiagram, readLastDiagram } = this.cache
    writeLastDiagram({
      diagram: '┌──┐\n│ A │\n└──┘',
      style: 'compact',
      provider: 'anthropic',
      model: 'claude-opus-4-7',
      input: 'show A',
    })
    const got = readLastDiagram()
    assert.equal(got?.diagram, '┌──┐\n│ A │\n└──┘')
    assert.equal(got?.style, 'compact')
    assert.equal(got?.provider, 'anthropic')
    assert.equal(got?.model, 'claude-opus-4-7')
    assert.equal(got?.input, 'show A')
    assert.ok(got?.timestamp, 'timestamp should be auto-populated')
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
      writeLastDiagram({ diagram: 'should not persist' })
      assert.equal(readLastDiagram(), null)
    } finally {
      if (prev === undefined) delete process.env.SEEME_NO_CACHE
      else process.env.SEEME_NO_CACHE = prev
    }
  })
})

test('readLastDiagram falls back to legacy ~/.seeme/last.txt', async () => {
  await withTempHome(async function (this: any) {
    // Seed a v0.1-style legacy text file (no JSON).
    const seemeDir = join(this.tmp, '.seeme')
    mkdirSync(seemeDir, { recursive: true })
    writeFileSync(join(seemeDir, 'last.txt'), '┌──┐\n│ B │\n└──┘\n', 'utf-8')

    const { readLastDiagram } = this.cache
    const got = readLastDiagram()
    assert.equal(got?.diagram, '┌──┐\n│ B │\n└──┘')
    assert.equal(got?.style, undefined, 'legacy file has no style metadata')
  })
})
