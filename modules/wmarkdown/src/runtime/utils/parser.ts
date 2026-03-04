import { getEmoji } from './emoji'

export interface Token {
  type: TokenType
  content: string
  raw: string
  children?: Token[]
  props?: Record<string, unknown>
}

export type TokenType =
  | 'heading'
  | 'paragraph'
  | 'code'
  | 'codeblock'
  | 'blockquote'
  | 'list'
  | 'listItem'
  | 'link'
  | 'image'
  | 'strong'
  | 'em'
  | 'del'
  | 'inlineCode'
  | 'table'
  | 'tableRow'
  | 'tableCell'
  | 'hr'
  | 'break'
  | 'text'
  | 'html'
  | 'math'
  | 'mathBlock'
  | 'mention'
  | 'taskList'
  | 'taskListItem'
  | 'details'
  | 'summary'
  | 'mark'
  | 'sup'
  | 'sub'
  | 'footnote'
  | 'footnoteRef'
  | 'yaml'
  | 'toml'
  | 'emoji'
  | 'autolink'
  | 'callout'
  | 'embed'
  | 'diff'
  | 'comment'
  | 'sandpack'
  | 'slashCommand'

export interface ParserOptions {
  gfm?: boolean
  tables?: boolean
  tasklists?: boolean
  footnotes?: boolean
  strikethrough?: boolean
  smartypants?: boolean
  highlight?: (code: string, lang?: string) => string
}

const defaultOptions: ParserOptions = {
  gfm: true,
  tables: true,
  tasklists: true,
  footnotes: true,
  strikethrough: true,
  smartypants: false
}

class Lexer {
  private input: string
  private pos: number
  private tokens: Token[] = []

  constructor(input: string) {
    this.input = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    this.pos = 0
  }

  tokenize(): Token[] {
    while (this.pos < this.input.length) {
      const start = this.pos

      if (this.matchFrontMatter()) continue
      if (this.matchCodeBlock()) continue
      if (this.matchHeading()) continue
      if (this.matchHorizontalRule()) continue
      if (this.matchBlockquote()) continue
      if (this.matchList()) continue
      if (this.matchTable()) continue
      if (this.matchDetails()) continue
      if (this.matchParagraph()) continue

      this.pos++
    }

    return this.tokens
  }

  private matchFrontMatter(): boolean {
    const frontMatterRegex = /^(---|\\+\\+)\\n([\\s\\S]*?)\\n\\1\\n/
    const match = this.input.slice(this.pos).match(frontMatterRegex)
    if (!match) return false

    const type = match[1] === '---' ? 'yaml' : 'toml'
    this.tokens.push({
      type,
      content: match[2].trim(),
      raw: match[0],
      props: { format: type }
    })
    this.pos += match[0].length
    return true
  }

  private matchCodeBlock(): boolean {
    const codeBlockRegex = /^```([^\\n]*)\\n([\\s\\S]*?)```\\n?/
    const match = this.input.slice(this.pos).match(codeBlockRegex)
    if (!match) {
      const indentedRegex = /^(    |\\t)(.*(?:\\n(?:    |\\t).*)*)/
      const indentedMatch = this.input.slice(this.pos).match(indentedRegex)
      if (indentedMatch) {
        const content = indentedMatch[2].replace(/^    |\\t/gm, '')
        this.tokens.push({
          type: 'codeblock',
          content: content.trim(),
          raw: indentedMatch[0],
          props: { lang: '' }
        })
        this.pos += indentedMatch[0].length
        return true
      }
      return false
    }

    this.tokens.push({
      type: 'codeblock',
      content: match[2].trimEnd(),
      raw: match[0],
      props: { lang: match[1].trim() }
    })
    this.pos += match[0].length
    return true
  }

  private matchHeading(): boolean {
    const headingRegex = /^(#{1,6})\\s+(.*?)(?:\\s+#*)?\\n/
    const match = this.input.slice(this.pos).match(headingRegex)
    if (!match) {
      const underlineRegex = /^(.*?)\\n(=+|-+)\\n/
      const underlineMatch = this.input.slice(this.pos).match(underlineRegex)
      if (underlineMatch) {
        const level = underlineMatch[2][0] === '=' ? 1 : 2
        this.tokens.push({
          type: 'heading',
          content: underlineMatch[1].trim(),
          raw: underlineMatch[0],
          props: { level },
          children: this.tokenizeInline(underlineMatch[1].trim())
        })
        this.pos += underlineMatch[0].length
        return true
      }
      return false
    }

    const level = match[1].length
    this.tokens.push({
      type: 'heading',
      content: match[2].trim(),
      raw: match[0],
      props: { level },
      children: this.tokenizeInline(match[2].trim())
    })
    this.pos += match[0].length
    return true
  }

  private matchHorizontalRule(): boolean {
    const hrRegex = /^(?:\\*{3,}|-{3,}|_{3,})\\s*\\n/
    const match = this.input.slice(this.pos).match(hrRegex)
    if (!match) return false

    this.tokens.push({
      type: 'hr',
      content: '',
      raw: match[0]
    })
    this.pos += match[0].length
    return true
  }

  private matchBlockquote(): boolean {
    const blockquoteRegex = /^(>(?:>|\\s|\\S.*?\\n?)+)\\n?/
    const match = this.input.slice(this.pos).match(blockquoteRegex)
    if (!match) return false

    const lines = match[1].split('\\n')
    const content = lines.map(line => line.replace(/^>\\s?/, '')).join('\\n')

    this.tokens.push({
      type: 'blockquote',
      content: content.trim(),
      raw: match[0],
      children: this.tokenizeBlock(content.trim())
    })
    this.pos += match[0].length
    return true
  }

  private matchList(): boolean {
    const listRegex = /^(?:(?:-\\s+|\\*\\s+|\\+\\s+|\\d+\\.\\s+)(?:\\[([ xX])\\]\\s+)?.*(?:\\n|$))+(?:\\n?)/
    const match = this.input.slice(this.pos).match(listRegex)
    if (!match) return false

    const lines = match[0].split('\\n').filter(Boolean)
    const isOrdered = /^\\d+\\./.test(lines[0])
    const isTask = lines.some(line => /^[-*+]\\s+\\[[ xX]\\]/.test(line))

    const items: Token[] = []
    let currentItem = ''
    let currentIndent = 0

    for (const line of lines) {
      const indent = line.match(/^(\\s*)/)?.[0].length || 0
      const isNewItem = /^\\s*(?:-\\s+|\\*\\s+|\\+\\s+|\\d+\\.\\s+)/.test(line)

      if (isNewItem && indent <= currentIndent) {
        if (currentItem) {
          items.push(this.createListItem(currentItem.trim(), isTask))
        }
        currentItem = line.replace(/^\\s*(?:-\\s+|\\*\\s+|\\+\\s+|\\d+\\.\\s+)(?:\\[([ xX])\\]\\s+)?/, '')
        currentIndent = indent
      } else {
        currentItem += '\\n' + line.trim()
      }
    }

    if (currentItem) {
      items.push(this.createListItem(currentItem.trim(), isTask))
    }

    this.tokens.push({
      type: isTask ? 'taskList' : 'list',
      content: match[0].trim(),
      raw: match[0],
      props: { ordered: isOrdered },
      children: items
    })
    this.pos += match[0].length
    return true
  }

  private createListItem(content: string, isTask: boolean): Token {
    const taskMatch = content.match(/^\\[([ xX])\\]\\s+(.*)/)
    if (isTask && taskMatch) {
      return {
        type: 'taskListItem',
        content: taskMatch[2],
        raw: content,
        props: { checked: taskMatch[1].toLowerCase() === 'x' },
        children: this.tokenizeInline(taskMatch[2])
      }
    }

    return {
      type: 'listItem',
      content,
      raw: content,
      children: this.tokenizeInline(content)
    }
  }

  private matchTable(): boolean {
    const tableRegex = /^\\|(.+)\\|\\n\\|([\\s\\-:|]+)\\|\\n((?:\\|.*\\|\\n?)*)/
    const match = this.input.slice(this.pos).match(tableRegex)
    if (!match) return false

    const headers = match[1].split('\\|').map(h => h.trim()).filter(Boolean)
    const alignments = match[2].split('\\|').map(cell => {
      const trimmed = cell.trim()
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center'
      if (trimmed.endsWith(':')) return 'right'
      if (trimmed.startsWith(':')) return 'left'
      return null
    }).filter((_, i) => i < headers.length)

    const rows = match[3].trim().split('\\n').map(row => {
      const cells = row.split('\\|').map(c => c.trim()).filter((_, i) => i > 0 && i <= headers.length)
      return {
        type: 'tableRow' as const,
        content: row,
        raw: row,
        children: cells.map((cell, i) => ({
          type: 'tableCell' as const,
          content: cell,
          raw: cell,
          props: { align: alignments[i] || null },
          children: this.tokenizeInline(cell)
        }))
      }
    })

    this.tokens.push({
      type: 'table',
      content: match[0].trim(),
      raw: match[0],
      props: { headers, alignments },
      children: rows
    })
    this.pos += match[0].length
    return true
  }

  private matchDetails(): boolean {
    const detailsRegex = /^<details>(?:\\s*<summary>(.*?)<\\/summary>)?([\\s\\S]*?)<\\/details>/
    const match = this.input.slice(this.pos).match(detailsRegex)
    if (!match) return false

    this.tokens.push({
      type: 'details',
      content: match[2].trim(),
      raw: match[0],
      props: { summary: match[1] || 'Details' },
      children: this.tokenizeBlock(match[2].trim())
    })
    this.pos += match[0].length
    return true
  }

  private matchParagraph(): boolean {
    const paraRegex = /^(.*?)(?:\\n{2,}|\\n*$)/
    const match = this.input.slice(this.pos).match(paraRegex)
    if (!match || !match[1].trim()) {
      this.pos++
      return false
    }

    const content = match[1].trim()
    this.tokens.push({
      type: 'paragraph',
      content,
      raw: match[0],
      children: this.tokenizeInline(content)
    })
    this.pos += match[0].length
    return true
  }

  private tokenizeInline(text: string): Token[] {
    const tokens: Token[] = []
    let pos = 0

    while (pos < text.length) {
      const remaining = text.slice(pos)

      const patterns: Array<{ regex: RegExp; type: TokenType; handler?: (m: RegExpMatchArray) => Partial<Token> }> = [
        { regex: /^\!\[([^\]]*)\]\(([^)]+)\)/, type: 'image', handler: m => ({ props: { alt: m[1], src: m[2] } }) },
        { regex: /^\[([^\]]+)\]\(([^)]+)\)/, type: 'link', handler: m => ({ props: { text: m[1], href: m[2] } }) },
        { regex: /^\[([^\]]+)\]\[([^\]]*)\]/, type: 'link', handler: m => ({ props: { text: m[1], ref: m[2] || m[1] } }) },
        { regex: /^`{3}([^\n]*)\n([\s\S]*?)`{3}/, type: 'code' },
        { regex: /^`([^`]+)`/, type: 'inlineCode' },
        { regex: /^\*\*(.+?)\*\*/, type: 'strong' },
        { regex: /^__(.+?)__/, type: 'strong' },
        { regex: /^\*(.+?)\*/, type: 'em' },
        { regex: /^_(.+?)_/, type: 'em' },
        { regex: /^~~(.+?)~~/, type: 'del' },
        { regex: /^==(.+?)==/, type: 'mark' },
        { regex: /^\^\((.+?)\)/, type: 'sup' },
        { regex: /^~\((.+?)\)/, type: 'sub' },
        { regex: /^\$\$([\s\S]*?)\$\$/, type: 'mathBlock' },
        { regex: /^\$([^\$\s]+)\$/, type: 'math' },
        { regex: /^:(\w+):/, type: 'emoji', handler: m => ({ props: { emoji: m[1] } }) },
        { regex: /^@(\w+)/, type: 'mention', handler: m => ({ props: { username: m[1] } }) },
        { regex: /^\[\^([^\]]+)\]/, type: 'footnoteRef', handler: m => ({ props: { id: m[1] } }) },
        { regex: /^(https?:\/\/[^\s\)\]]+)/, type: 'autolink', handler: m => ({ props: { href: m[1] } }) },
        { regex: /^<\/br>/i, type: 'break' },
        { regex: /^\n{2,}/, type: 'text', handler: () => ({ content: '\n\n' }) }
      ]

      let matched = false
      for (const { regex, type, handler } of patterns) {
        const match = remaining.match(regex)
        if (match) {
          const base: Token = {
            type,
            content: match[1] || match[0],
            raw: match[0],
            ...handler?.(match)
          }

          if (type === 'strong' || type === 'em' || type === 'del' || type === 'mark') {
            base.children = this.tokenizeInline(match[1])
          }

          tokens.push(base)
          pos += match[0].length
          matched = true
          break
        }
      }

      if (!matched) {
        const textEnd = pos + 1
        while (textEnd < text.length && !patterns.some(p => p.regex.test(text.slice(textEnd)))) {
          // Continue scanning
        }
        const textContent = text.slice(pos, textEnd) || text[pos]
        if (tokens.length > 0 && tokens[tokens.length - 1].type === 'text') {
          tokens[tokens.length - 1].content += textContent
          tokens[tokens.length - 1].raw += textContent
        } else {
          tokens.push({ type: 'text', content: textContent, raw: textContent })
        }
        pos += textContent.length
      }
    }

    return tokens
  }

  private tokenizeBlock(content: string): Token[] {
    const lexer = new Lexer(content)
    return lexer.tokenize()
  }
}

export function parseMarkdown(input: string): Token[] {
  const lexer = new Lexer(input)
  return lexer.tokenize()
}

export function tokensToHtml(tokens: Token[], options: ParserOptions = {}): string {
  const opts = { ...defaultOptions, ...options }

  return tokens.map(token => renderToken(token, opts)).join('')
}

function renderToken(token: Token, options: ParserOptions): string {
  const { type, content, children, props } = token

  switch (type) {
    case 'heading': {
      const level = (props?.level as number) || 1
      const id = slugify(content)
      return `<h${level} id="${id}">${children ? tokensToHtml(children, options) : escapeHtml(content)}</h${level}>`
    }

    case 'paragraph':
      return `<p>${children ? tokensToHtml(children, options) : escapeHtml(content)}</p>`

    case 'codeblock': {
      const lang = (props?.lang as string) || ''
      const highlighted = options.highlight
        ? options.highlight(content, lang)
        : escapeHtml(content)
      return `<pre${lang ? ` class="language-${lang}"` : ''}><code>${highlighted}</code></pre>`
    }

    case 'code':
    case 'inlineCode':
      return `<code>${escapeHtml(content)}</code>`

    case 'blockquote':
      return `<blockquote>${children ? tokensToHtml(children, options) : escapeHtml(content)}</blockquote>`

    case 'list': {
      const ordered = props?.ordered as boolean
      const tag = ordered ? 'ol' : 'ul'
      return `<${tag}>${children ? tokensToHtml(children, options) : ''}</${tag}>`
    }

    case 'listItem':
      return `<li>${children ? tokensToHtml(children, options) : escapeHtml(content)}</li>`

    case 'taskList':
      return `<ul class="task-list">${children ? tokensToHtml(children, options) : ''}</ul>`

    case 'taskListItem': {
      const checked = props?.checked as boolean
      return `<li class="task-list-item"><input type="checkbox"${checked ? ' checked' : ''} disabled> ${children ? tokensToHtml(children, options) : escapeHtml(content)}</li>`
    }

    case 'link': {
      const href = escapeHtml((props?.href as string) || '')
      const text = escapeHtml((props?.text as string) || content)
      return `<a href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`
    }

    case 'image': {
      const src = escapeHtml((props?.src as string) || '')
      const alt = escapeHtml((props?.alt as string) || '')
      return `<img src="${src}" alt="${alt}" loading="lazy">`
    }

    case 'strong':
      return `<strong>${children ? tokensToHtml(children, options) : escapeHtml(content)}</strong>`

    case 'em':
      return `<em>${children ? tokensToHtml(children, options) : escapeHtml(content)}</em>`

    case 'del':
      return options.strikethrough
        ? `<del>${children ? tokensToHtml(children, options) : escapeHtml(content)}</del>`
        : children ? tokensToHtml(children, options) : escapeHtml(content)

    case 'mark':
      return `<mark>${children ? tokensToHtml(children, options) : escapeHtml(content)}</mark>`

    case 'sup':
      return `<sup>${children ? tokensToHtml(children, options) : escapeHtml(content)}</sup>`

    case 'sub':
      return `<sub>${children ? tokensToHtml(children, options) : escapeHtml(content)}</sub>`

    case 'table': {
      const headers = (props?.headers as string[]) || []
      const alignments = (props?.alignments as (string | null)[]) || []

      let html = '<table><thead><tr>'
      headers.forEach((header, i) => {
        const align = alignments[i]
        const style = align ? ` style="text-align: ${align}"` : ''
        html += `<th${style}>${escapeHtml(header)}</th>`
      })
      html += '</tr></thead><tbody>'

      if (children) {
        html += tokensToHtml(children, options)
      }

      html += '</tbody></table>'
      return html
    }

    case 'tableRow':
      return `<tr>${children ? tokensToHtml(children, options) : ''}</tr>`

    case 'tableCell': {
      const align = props?.align as string | null
      const style = align ? ` style="text-align: ${align}"` : ''
      return `<td${style}>${children ? tokensToHtml(children, options) : escapeHtml(content)}</td>`
    }

    case 'hr':
      return '<hr>'

    case 'break':
      return '<br>'

    case 'text':
      return escapeHtml(content)

    case 'math':
      return `<span class="math">${escapeHtml(content)}</span>`

    case 'mathBlock':
      return `<div class="math-block">${escapeHtml(content)}</div>`

    case 'mention':
      return `<a href="/user/${props?.username}" class="mention">@${props?.username}</a>`

    case 'footnoteRef':
      return `<sup><a href="#fn-${props?.id}" id="fnref-${props?.id}">${props?.id}</a></sup>`

    case 'details':
      return `<details><summary>${props?.summary}</summary>${children ? tokensToHtml(children, options) : escapeHtml(content)}</details>`

    case 'emoji':
      return `<span class="emoji">${getEmoji(props?.emoji as string)}</span>`

    case 'autolink': {
      const href = escapeHtml((props?.href as string) || '')
      return `<a href="${href}" target="_blank" rel="noopener">${href}</a>`
    }

    case 'yaml':
    case 'toml':
      return ''

    default:
      return escapeHtml(content)
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
