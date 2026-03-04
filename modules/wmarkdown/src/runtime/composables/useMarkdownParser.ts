import { parseMarkdown, tokensToHtml, type Token } from '../utils/parser'
import { highlightCode } from '../utils/shiki'

export interface ParseOptions {
  highlight?: boolean
  theme?: string
}

export function useMarkdownParser() {
  const parse = async (input: string, options: ParseOptions = {}): Promise<{ tokens: Token[]; html: string }> => {
    const tokens = parseMarkdown(input)

    let html: string
    if (options.highlight) {
      html = tokensToHtml(tokens, {
        highlight: async (code, lang) => {
          if (!lang) return code
          return await highlightCode(code, lang, options.theme || 'github-light')
        }
      })
    } else {
      html = tokensToHtml(tokens)
    }

    return { tokens, html }
  }

  const parseSync = (input: string): { tokens: Token[]; html: string } => {
    const tokens = parseMarkdown(input)
    const html = tokensToHtml(tokens)
    return { tokens, html }
  }

  return {
    parse,
    parseSync
  }
}
