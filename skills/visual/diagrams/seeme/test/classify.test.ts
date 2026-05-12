import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { lintDiagramPresent } from '../src/lint/diagram-present.ts'

test('classifies refusal as refused', () => {
  const err = lintDiagramPresent("I'm sorry, I cannot generate that for you.")
  assert.ok(err)
  assert.ok(err!.problem.includes('refused'))
})

test('classifies JSON-only output as wrong-format', () => {
  const err = lintDiagramPresent('{"nodes": ["A", "B"], "edges": [["A","B"]]}')
  assert.ok(err)
  assert.ok(err!.problem.includes('JSON'))
})

test('classifies markdown table as wrong-format', () => {
  const err = lintDiagramPresent('| Client | API |\n|--------|-----|\n| sends  | receives |')
  assert.ok(err)
  assert.ok(err!.problem.includes('markdown table'))
})

test('classifies numbered list as wrong-format', () => {
  const err = lintDiagramPresent(
    '1. The client sends a request\n2. The API processes it\n3. The database stores the result',
  )
  assert.ok(err)
  assert.ok(err!.problem.includes('numbered list'))
})

test('falls back to generic for plain prose', () => {
  const err = lintDiagramPresent('Once upon a time there was a client and an API.')
  assert.ok(err)
  assert.ok(err!.problem.includes('no diagram detected'))
})
