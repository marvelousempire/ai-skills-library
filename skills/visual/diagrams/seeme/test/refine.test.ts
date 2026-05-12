import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { refinePrompt } from '../src/prompt/refine.ts'

test('refinePrompt embeds the previous diagram and instruction', () => {
  const prev = '┌──┐\n│ A │\n└──┘'
  const instruction = 'Add a database box on the right'
  const out = refinePrompt(prev, instruction)

  assert.ok(out.includes(prev), 'should include the previous diagram')
  assert.ok(out.includes(instruction), 'should include the instruction')
  assert.ok(out.includes('```text'), 'should fence the previous diagram')
  assert.ok(out.includes('Output ONLY the updated diagram'), 'should tell the model to output only the diagram')
})

test('refinePrompt preserves multiline diagrams verbatim', () => {
  const prev = '┌──────────┐    ┌──────────┐\n│  Client  │───►│   API    │\n└──────────┘    └──────────┘'
  const out = refinePrompt(prev, 'add database')
  assert.ok(out.includes(prev), 'multiline diagram should survive unchanged')
})
