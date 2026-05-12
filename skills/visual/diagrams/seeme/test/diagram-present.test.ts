import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { lintDiagramPresent } from '../src/lint/diagram-present.ts'
import { lint } from '../src/lint/index.ts'

test('lintDiagramPresent passes when ≥ 3 box-drawing chars are present', () => {
  assert.equal(lintDiagramPresent('┌──┐\n│ A │\n└──┘'), null)
})

test('lintDiagramPresent fires on plain prose', () => {
  const err = lintDiagramPresent('I cannot create a diagram for that request.')
  assert.ok(err, 'should flag prose-only output')
  assert.equal(err!.rule, 'no-diagram')
  assert.ok(err!.problem.includes('no diagram detected'))
})

test('lintDiagramPresent fires on too-few box chars', () => {
  // One pipe, no corners — not a real diagram.
  assert.ok(lintDiagramPresent('Here is a │ — not really a diagram.'))
})

test('lint() short-circuits other rules when no diagram is present', () => {
  // ASCII corners + too-wide content would normally trigger unicode + width.
  // But since there are NO box-drawing chars, only the no-diagram rule fires.
  const prose = 'Sorry, I cannot generate that. Here is some text instead.'
  const errors = lint(prose)
  assert.equal(errors.length, 1)
  assert.equal(errors[0].rule, 'no-diagram')
})
