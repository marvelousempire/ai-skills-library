import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { lint } from '../src/lint/index.ts'
import { lintUnicode } from '../src/lint/unicode.ts'
import { lintWidth } from '../src/lint/width.ts'
import { lintClosure } from '../src/lint/closure.ts'

const here = dirname(fileURLToPath(import.meta.url))
const fixture = (path: string) =>
  readFileSync(resolve(here, 'fixtures', path), 'utf-8')

test('good/simple — no lint errors', () => {
  const errors = lint(fixture('good/simple.txt'))
  assert.deepEqual(errors, [], `expected zero errors, got: ${JSON.stringify(errors, null, 2)}`)
})

test('good/canonical — no lint errors', () => {
  const errors = lint(fixture('good/canonical.txt'))
  assert.deepEqual(errors, [], `expected zero errors, got: ${JSON.stringify(errors, null, 2)}`)
})

test('broken/ascii-corners — at least one unicode error', () => {
  const errors = lintUnicode(fixture('broken/ascii-corners.txt'))
  assert.ok(errors.length > 0, 'expected unicode errors')
  assert.ok(errors.some((e) => e.rule === 'unicode'))
})

test('broken/too-wide — at least one width error', () => {
  const errors = lintWidth(fixture('broken/too-wide.txt'))
  assert.ok(errors.length > 0, 'expected width errors')
  assert.ok(errors.every((e) => e.rule === 'width'))
})

test('broken/unclosed-box — at least one closure error', () => {
  const errors = lintClosure(fixture('broken/unclosed-box.txt'))
  assert.ok(errors.length > 0, 'expected closure errors')
  assert.ok(errors.every((e) => e.rule === 'closure'))
})

test('lint() short-circuits to no-diagram on fully-ASCII output', () => {
  // The ASCII-corners fixture has zero Unicode box chars, so the no-diagram
  // rule short-circuits the unicode/width/closure rules. This is the right
  // behavior: the repair prompt should ask for a diagram, not a list of
  // line-level corrections to noise.
  const errors = lint(fixture('broken/ascii-corners.txt'))
  assert.equal(errors.length, 1)
  assert.equal(errors[0].rule, 'no-diagram')
})

test('lint() runs other rules when ≥ 3 box chars are present', () => {
  // Mostly Unicode, but one ASCII corner slipped in — unicode rule should fire.
  const mixed = '┌──────────┐\n│  Client  │\n+----------+'
  const errors = lint(mixed)
  assert.ok(errors.length > 0)
  assert.ok(errors.some((e) => e.rule === 'unicode'))
})
