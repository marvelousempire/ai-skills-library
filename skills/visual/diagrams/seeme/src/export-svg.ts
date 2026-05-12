// Render a monospace box-and-arrow diagram as a self-contained SVG.
// No native dependencies — pure string assembly. The result opens in any
// browser; convert to PNG via `rsvg-convert` or your tool of choice.

import { writeFileSync } from 'node:fs'

interface RenderOpts {
  /** Pixels per character horizontally. Default 9 (good for 12px monospace). */
  cellWidth?: number
  /** Pixels per character vertically. Default 18. */
  cellHeight?: number
  /** Font size in pixels. Default 14. */
  fontSize?: number
  /** Padding around the diagram. Default 20. */
  padding?: number
  /** Text color. Default '#0a0a0a' (near-black). */
  color?: string
  /** Background. Default 'white'. */
  background?: string
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const renderSvg = (diagram: string, opts: RenderOpts = {}): string => {
  const cellW = opts.cellWidth ?? 9
  const cellH = opts.cellHeight ?? 18
  const fontSize = opts.fontSize ?? 14
  const pad = opts.padding ?? 20
  const color = opts.color ?? '#0a0a0a'
  const bg = opts.background ?? 'white'

  const lines = diagram.split('\n')
  const maxCols = lines.reduce(
    (n, l) => Math.max(n, Array.from(l).length),
    0,
  )
  const width = maxCols * cellW + pad * 2
  const height = lines.length * cellH + pad * 2

  // Use <text> per line with `xml:space="preserve"` so leading spaces survive.
  // Font stack mirrors common monospace defaults — picks SF Mono / Menlo on
  // macOS, Cascadia / Consolas on Windows, DejaVu on Linux.
  const fontFamily =
    "'SF Mono', Menlo, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace"

  const textRows = lines
    .map((line, i) => {
      const y = pad + (i + 1) * cellH - cellH * 0.25 // baseline offset
      return `  <text x="${pad}" y="${y}" xml:space="preserve">${escape(line)}</text>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <g font-family="${fontFamily}" font-size="${fontSize}" fill="${color}">
${textRows}
  </g>
</svg>
`
}

export const writeSvg = (diagram: string, path: string, opts?: RenderOpts): void => {
  // If the path ends with .txt, write raw text instead (handy convenience).
  if (path.endsWith('.txt')) {
    writeFileSync(path, diagram + '\n', 'utf-8')
    return
  }
  writeFileSync(path, renderSvg(diagram, opts), 'utf-8')
}
