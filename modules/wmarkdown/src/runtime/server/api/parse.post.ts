import { defineEventHandler, readBody, getQuery } from 'h3'
import { parseMarkdown, tokensToHtml } from '../../utils/parser'
import { highlightCode } from '../../utils/shiki'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { content, highlight = true, theme = 'github-light' } = body

  if (!content) {
    return {
      error: 'Content is required'
    }
  }

  const tokens = parseMarkdown(content)

  let html: string
  if (highlight) {
    html = tokensToHtml(tokens, {
      highlight: async (code, lang) => {
        if (!lang) return code
        return await highlightCode(code, lang, theme)
      }
    })
  } else {
    html = tokensToHtml(tokens)
  }

  return {
    tokens,
    html
  }
})
