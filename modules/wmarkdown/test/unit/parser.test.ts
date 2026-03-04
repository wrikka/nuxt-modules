import { describe, it, expect } from 'vitest'
import { parseMarkdown, tokensToHtml } from '../src/runtime/utils/parser'

describe('Parser', () => {
  it('should parse headings', () => {
    const result = parseMarkdown('# Hello World')
    expect(result[0].type).toBe('heading')
    expect(result[0].content).toBe('Hello World')
    expect(result[0].props?.level).toBe(1)
  })

  it('should parse paragraphs', () => {
    const result = parseMarkdown('This is a paragraph.')
    expect(result[0].type).toBe('paragraph')
    expect(result[0].content).toBe('This is a paragraph.')
  })

  it('should parse code blocks', () => {
    const result = parseMarkdown('```typescript\nconst x = 1\n```')
    expect(result[0].type).toBe('codeblock')
    expect(result[0].props?.lang).toBe('typescript')
  })

  it('should parse lists', () => {
    const result = parseMarkdown('- Item 1\n- Item 2')
    expect(result[0].type).toBe('list')
    expect(result[0].children).toHaveLength(2)
  })

  it('should parse links', () => {
    const result = parseMarkdown('[Link](https://example.com)')
    const inline = result[0].children
    expect(inline?.[0].type).toBe('link')
  })

  it('should convert to HTML', () => {
    const tokens = parseMarkdown('# Hello')
    const html = tokensToHtml(tokens)
    expect(html).toContain('<h1 id="hello">Hello</h1>')
  })
})
