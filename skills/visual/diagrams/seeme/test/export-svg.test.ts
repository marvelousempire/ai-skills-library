import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { renderSvg, writeSvg } from '../src/export-svg.ts'

const tinyDiagram = '┌───┐\n│ A │\n└───┘'

test('renderSvg produces a valid <svg> element with one <text> per line', () => {
  const svg = renderSvg(tinyDiagram)
  assert.ok(svg.startsWith('<?xml'), 'should start with XML declaration')
  assert.ok(svg.includes('<svg xmlns='), 'should include svg element')
  // Three text rows for three lines.
  const textCount = (svg.match(/<text /g) ?? []).length
  assert.equal(textCount, 3, `expected 3 <text> rows, got ${textCount}`)
  // Box-drawing chars survive.
  assert.ok(svg.includes('┌'), 'should include the top-left corner')
  assert.ok(svg.includes('└'), 'should include the bottom-left corner')
})

test('renderSvg escapes XML metacharacters in text labels', () => {
  const diagram = '┌─────┐\n│ <A> │\n└─────┘'
  const svg = renderSvg(diagram)
  assert.ok(svg.includes('&lt;A&gt;'), 'angle brackets should be escaped')
  assert.ok(!svg.includes('<A>'), 'raw angle brackets should not appear')
})

test('writeSvg writes to disk with .svg extension', () => {
  const dir = mkdtempSync(join(tmpdir(), 'seeme-svg-'))
  try {
    const out = join(dir, 'd.svg')
    writeSvg(tinyDiagram, out)
    const got = readFileSync(out, 'utf-8')
    assert.ok(got.startsWith('<?xml'))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('writeSvg writes raw text when path ends in .txt', () => {
  const dir = mkdtempSync(join(tmpdir(), 'seeme-txt-'))
  try {
    const out = join(dir, 'd.txt')
    writeSvg(tinyDiagram, out)
    const got = readFileSync(out, 'utf-8')
    assert.equal(got, tinyDiagram + '\n')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
