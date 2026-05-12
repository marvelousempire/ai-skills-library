import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { lintAlignment } from '../src/lint/alignment.ts'

test('aligned box passes', () => {
  const diagram = '┌──┐\n│ A │\n└──┘'
  // Note: "│ A │" has the right wall at col 4 but "┌──┐" at col 3 — different
  // box widths. Let's use a properly aligned 5-wide box.
  const aligned = '┌───┐\n│ A │\n└───┘'
  assert.deepEqual(lintAlignment(aligned), [])
  // The narrower variant should also be fine since each │ has anchors top/bottom.
  const narrow = '┌─┐\n│A│\n└─┘'
  assert.deepEqual(lintAlignment(narrow), [])
})

test('misaligned right wall fires', () => {
  // ┌──┐ at cols 0-3, │ at col 0, but the inner │ shifts to col 3 vs corner at col 3 — fine.
  // Bad case: middle row's right │ at col 4, but top corner at col 3.
  const bad = '┌──┐\n│  │\n│   │\n└──┘'
  const errors = lintAlignment(bad)
  // The trailing │ on the wider middle row has no anchor above/below.
  assert.ok(errors.length > 0, 'expected at least one alignment error')
  assert.equal(errors[0].rule, 'alignment')
})

test('floating │ with no neighbor fires', () => {
  // A pipe with nothing above or below it.
  const bad = '┌──┐\n│  │   │\n└──┘'
  const errors = lintAlignment(bad)
  assert.ok(errors.length > 0)
})

test('canonical multi-row layout from fixtures passes', () => {
  // Mirrors the shape of test/fixtures/good/canonical.txt — left and right
  // columns both have walls that anchor consistently top-to-bottom.
  const canonical = [
    '   ┌──────────────┐                          ┌──────────────┐',
    '   │  iOS / iPad  │◄──── HTTPS + JWT ───────►│              │',
    '   ├──────────────┤                          │              │',
    '   │   Website    │◄──── HTTPS + JWT ───────►│   Backend    │',
    '   │ (player-web) │                          │     API      │◄──── PostgreSQL',
    '   ├──────────────┤                          │  (Express)   │     (loopback only)',
    '   │ Admin panel  │◄──── HTTPS + admin JWT ─►│              │',
    '   └──────────────┘                          └──────────────┘',
  ].join('\n')
  const errors = lintAlignment(canonical)
  assert.deepEqual(errors, [], `expected zero alignment errors, got ${JSON.stringify(errors)}`)
})
