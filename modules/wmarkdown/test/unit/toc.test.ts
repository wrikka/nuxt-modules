import { describe, it, expect } from 'vitest'
import { useToc } from '../../src/runtime/composables/useToc'
import type { Token } from '../../src/runtime/types'

describe('useToc', () => {
  it('should generate TOC from tokens', () => {
    const tokens: Token[] = [
      { type: 'heading', content: 'Heading 1', raw: '# Heading 1', props: { level: 1 } },
      { type: 'heading', content: 'Heading 2', raw: '## Heading 2', props: { level: 2 } },
      { type: 'paragraph', content: 'Some text', raw: 'Some text' }
    ]

    const toc = useToc()
    const result = toc.generateToc(tokens)

    expect(result).toHaveLength(2)
    expect(result[0].text).toBe('Heading 1')
    expect(result[0].level).toBe(1)
    expect(result[1].text).toBe('Heading 2')
    expect(result[1].level).toBe(2)
  })

  it('should generate correct IDs', () => {
    const tokens: Token[] = [
      { type: 'heading', content: 'Hello World', raw: '# Hello World', props: { level: 1 } }
    ]

    const toc = useToc()
    const result = toc.generateToc(tokens)

    expect(result[0].id).toBe('hello-world')
  })
})
