import { describe, it, expect } from 'vitest'
import { highlightCode, initHighlighter } from '../../src/runtime/utils/shiki'

describe('Shiki Highlighter', () => {
  it('should initialize highlighter', async () => {
    const highlighter = await initHighlighter()
    expect(highlighter).toBeDefined()
  })

  it('should highlight TypeScript code', async () => {
    const code = 'const x: number = 42'
    const result = await highlightCode(code, 'typescript')
    expect(result).toContain('<pre')
    expect(result).toContain('<code')
  })

  it('should highlight with custom theme', async () => {
    const code = 'console.log("hello")'
    const result = await highlightCode(code, 'javascript', 'github-dark')
    expect(result).toContain('github-dark')
  })
})
