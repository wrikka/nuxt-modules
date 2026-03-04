import { ref } from 'vue'

interface ClipResult {
  url: string
  title: string
  content: string
  markdown: string
  excerpt: string
  author?: string
  publishedAt?: string
  tags: string[]
  images: string[]
}

interface WebClipperOptions {
  proxy?: string
  maxLength?: number
  includeImages?: boolean
  includeMetadata?: boolean
}

export function useWebClipper(options: WebClipperOptions = {}) {
  const isClipping = ref(false)
  const error = ref<string | null>(null)
  const lastResult = ref<ClipResult | null>(null)

  const clip = async (url: string): Promise<ClipResult | null> => {
    isClipping.value = true
    error.value = null

    try {
      // Fetch the page
      const proxyUrl = options.proxy ? `${options.proxy}?url=${encodeURIComponent(url)}` : url
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')

      // Extract title
      const title = doc.querySelector('title')?.textContent ||
                   doc.querySelector('h1')?.textContent ||
                   'Untitled'

      // Extract metadata
      const author = doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
                    doc.querySelector('meta[property="article:author"]')?.getAttribute('content')

      const publishedAt = doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content')

      // Extract main content (simple heuristic)
      let content = ''
      const article = doc.querySelector('article') ||
                     doc.querySelector('[role="main"]') ||
                     doc.querySelector('.content') ||
                     doc.querySelector('main') ||
                     doc.body

      if (article) {
        // Remove script and style elements
        const clone = article.cloneNode(true) as HTMLElement
        clone.querySelectorAll('script, style, nav, header, footer, aside').forEach(el => el.remove())
        content = clone.textContent || ''
      }

      // Extract images
      const images: string[] = []
      if (options.includeImages !== false) {
        doc.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('src')
          if (src && !src.startsWith('data:')) {
            const fullUrl = new URL(src, url).href
            images.push(fullUrl)
          }
        })
      }

      // Convert to markdown
      const markdown = htmlToMarkdown(article || doc.body, url)

      // Create excerpt
      const excerpt = content.slice(0, 200).replace(/\s+/g, ' ').trim() + '...'

      // Extract tags from meta keywords
      const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content')
      const tags = keywords ? keywords.split(',').map(t => t.trim()) : []

      const result: ClipResult = {
        url,
        title: title.slice(0, 100),
        content: content.slice(0, options.maxLength || 10000),
        markdown,
        excerpt,
        author,
        publishedAt,
        tags,
        images: images.slice(0, 5)
      }

      lastResult.value = result
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clip page'
      return null
    } finally {
      isClipping.value = false
    }
  }

  const htmlToMarkdown = (element: HTMLElement, baseUrl: string): string => {
    let markdown = ''

    const traverse = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        markdown += node.textContent || ''
        return
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return

      const el = node as HTMLElement
      const tagName = el.tagName.toLowerCase()

      switch (tagName) {
        case 'h1':
          markdown += `# ${el.textContent}\n\n`
          break
        case 'h2':
          markdown += `## ${el.textContent}\n\n`
          break
        case 'h3':
          markdown += `### ${el.textContent}\n\n`
          break
        case 'p':
          markdown += `${el.textContent}\n\n`
          break
        case 'a':
          const href = el.getAttribute('href')
          if (href) {
            const fullUrl = new URL(href, baseUrl).href
            markdown += `[${el.textContent}](${fullUrl})`
          } else {
            markdown += el.textContent
          }
          break
        case 'img':
          const src = el.getAttribute('src')
          const alt = el.getAttribute('alt') || ''
          if (src) {
            const fullUrl = new URL(src, baseUrl).href
            markdown += `![${alt}](${fullUrl})\n\n`
          }
          break
        case 'ul':
        case 'ol':
          el.querySelectorAll('li').forEach(li => {
            const prefix = tagName === 'ol' ? '1.' : '-'
            markdown += `${prefix} ${li.textContent}\n`
          })
          markdown += '\n'
          break
        case 'blockquote':
          markdown += `> ${el.textContent}\n\n`
          break
        case 'pre':
        case 'code':
          if (tagName === 'pre') {
            markdown += `\`\`\`\n${el.textContent}\n\`\`\`\n\n`
          }
          break
        default:
          // Traverse children
          el.childNodes.forEach(traverse)
      }
    }

    element.childNodes.forEach(traverse)
    return markdown.trim()
  }

  const getClipMarkdown = (result: ClipResult): string => {
    return `---
title: "${result.title}"
source: "${result.url}"
author: "${result.author || 'Unknown'}"
date: "${result.publishedAt || new Date().toISOString()}"
tags: [${result.tags.map(t => `"${t}"`).join(', ')}]
---

# ${result.title}

> ${result.excerpt}

${result.markdown}

## Source

- URL: [${result.url}](${result.url})
- Clipped: ${new Date().toLocaleString()}
`
  }

  return {
    isClipping,
    error,
    lastResult,
    clip,
    getClipMarkdown
  }
}
