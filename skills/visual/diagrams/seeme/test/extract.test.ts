import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { extractFencedTextBlock } from '../src/lint/extract.ts'

test('extracts a ```text fenced block', () => {
  const raw = 'preamble\n\n```text\n┌──┐\n└──┘\n```\n\ntrailing chatter'
  assert.equal(extractFencedTextBlock(raw), '┌──┐\n└──┘')
})

test('falls back to the largest fenced block of any language', () => {
  const raw = '```\nshort\n```\n\n```js\nconst x = 1\nconst y = 2\nconst z = 3\n```'
  assert.equal(extractFencedTextBlock(raw), 'const x = 1\nconst y = 2\nconst z = 3')
})

test('falls back to raw trimmed text when no fences present', () => {
  const raw = '\n\n┌──┐\n└──┘\n\n'
  assert.equal(extractFencedTextBlock(raw), '┌──┐\n└──┘')
})

test('prefers ```text over other fences even when smaller', () => {
  const raw =
    '```js\nthis is a much longer block of unrelated code that should be ignored\n```\n\n```text\n┌──┐\n└──┘\n```'
  assert.equal(extractFencedTextBlock(raw), '┌──┐\n└──┘')
})
