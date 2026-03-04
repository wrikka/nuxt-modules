import { ref } from 'vue'

interface RSSItem {
  title: string
  description: string
  link: string
  guid?: string
  pubDate: Date
  author?: string
  categories?: string[]
  content?: string
}

interface RSSChannel {
  title: string
  description: string
  link: string
  language?: string
  copyright?: string
  managingEditor?: string
  webMaster?: string
  pubDate?: Date
  lastBuildDate?: Date
  generator?: string
  image?: {
    url: string
    title: string
    link: string
  }
}

interface RSSOptions {
  format?: 'rss' | 'atom' | 'json'
  maxItems?: number
}

export function useRSSGenerator() {
  const generateRSS = (channel: RSSChannel, items: RSSItem[], options: RSSOptions = {}): string => {
    const { format = 'rss', maxItems = 50 } = options
    const limitedItems = items.slice(0, maxItems)

    if (format === 'atom') {
      return generateAtom(channel, limitedItems)
    } else if (format === 'json') {
      return generateJSON(channel, limitedItems)
    }

    return generateRSS2(channel, limitedItems)
  }

  const generateRSS2 = (channel: RSSChannel, items: RSSItem[]): string => {
    const escapeXml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    }

    const formatDate = (date: Date): string => {
      return date.toUTCString()
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <description>${escapeXml(channel.description)}</description>
    <link>${escapeXml(channel.link)}</link>
    <language>${channel.language || 'en'}</language>
    <generator>${channel.generator || 'WMarkdown RSS Generator'}</generator>
    <lastBuildDate>${formatDate(channel.lastBuildDate || new Date())}</lastBuildDate>
`

    if (channel.copyright) {
      xml += `    <copyright>${escapeXml(channel.copyright)}</copyright>\n`
    }

    if (channel.image) {
      xml += `    <image>
      <url>${escapeXml(channel.image.url)}</url>
      <title>${escapeXml(channel.image.title)}</title>
      <link>${escapeXml(channel.image.link)}</link>
    </image>
`
    }

    items.forEach(item => {
      xml += `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${formatDate(item.pubDate)}</pubDate>
`

      if (item.guid) {
        xml += `      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>\n`
      } else {
        xml += `      <guid>${escapeXml(item.link)}</guid>\n`
      }

      if (item.author) {
        xml += `      <author>${escapeXml(item.author)}</author>\n`
      }

      item.categories?.forEach(cat => {
        xml += `      <category>${escapeXml(cat)}</category>\n`
      })

      if (item.content) {
        xml += `      <content:encoded><![CDATA[${item.content}]]></content:encoded>\n`
      }

      xml += `    </item>
`
    })

    xml += `  </channel>
</rss>`

    return xml
  }

  const generateAtom = (channel: RSSChannel, items: RSSItem[]): string => {
    const escapeXml = (str: string): string => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    }

    const formatDate = (date: Date): string => {
      return date.toISOString()
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(channel.title)}</title>
  <subtitle>${escapeXml(channel.description)}</subtitle>
  <link href="${escapeXml(channel.link)}" rel="self" type="application/atom+xml"/>
  <link href="${escapeXml(channel.link)}"/>
  <id>${escapeXml(channel.link)}</id>
  <updated>${formatDate(channel.lastBuildDate || new Date())}</updated>
  <generator>${channel.generator || 'WMarkdown RSS Generator'}</generator>
`

    items.forEach(item => {
      xml += `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${escapeXml(item.link)}"/>
    <id>${escapeXml(item.guid || item.link)}</id>
    <updated>${formatDate(item.pubDate)}</updated>
    <summary>${escapeXml(item.description)}</summary>
`

      if (item.content) {
        xml += `    <content type="html"><![CDATA[${item.content}]]></content>\n`
      }

      if (item.author) {
        xml += `    <author>
      <name>${escapeXml(item.author)}</name>
    </author>
`
      }

      item.categories?.forEach(cat => {
        xml += `    <category term="${escapeXml(cat)}"/>\n`
      })

      xml += `  </entry>
`
    })

    xml += `</feed>`

    return xml
  }

  const generateJSON = (channel: RSSChannel, items: RSSItem[]): string => {
    const feed = {
      version: 'https://jsonfeed.org/version/1.1',
      title: channel.title,
      description: channel.description,
      home_page_url: channel.link,
      feed_url: `${channel.link}/feed.json`,
      language: channel.language || 'en',
      items: items.map(item => ({
        id: item.guid || item.link,
        url: item.link,
        title: item.title,
        content_html: item.content || item.description,
        summary: item.description,
        date_published: item.pubDate.toISOString(),
        authors: item.author ? [{ name: item.author }] : undefined,
        tags: item.categories
      }))
    }

    return JSON.stringify(feed, null, 2)
  }

  const parseMarkdownToItems = (markdown: string, baseUrl: string): RSSItem[] => {
    const items: RSSItem[] = []
    const lines = markdown.split('\n')

    let currentItem: Partial<RSSItem> = {}
    let contentBuffer: string[] = []
    let inFrontMatter = false

    const flushItem = () => {
      if (currentItem.title && contentBuffer.length > 0) {
        items.push({
          title: currentItem.title,
          description: contentBuffer.join('\n').slice(0, 500) + '...',
          link: `${baseUrl}/${currentItem.guid || slugify(currentItem.title!)}`,
          guid: currentItem.guid || slugify(currentItem.title!),
          pubDate: currentItem.pubDate || new Date(),
          author: currentItem.author,
          categories: currentItem.categories,
          content: contentBuffer.join('\n')
        })
      }
      currentItem = {}
      contentBuffer = []
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Front matter
      if (line === '---') {
        inFrontMatter = !inFrontMatter
        continue
      }

      if (inFrontMatter) {
        const match = line.match(/^(\w+):\s*(.+)$/)
        if (match) {
          const [, key, value] = match
          switch (key) {
            case 'title':
              currentItem.title = value.replace(/^["']|["']$/g, '')
              break
            case 'date':
            case 'pubDate':
              currentItem.pubDate = new Date(value)
              break
            case 'author':
              currentItem.author = value
              break
            case 'tags':
            case 'categories':
              currentItem.categories = value.split(',').map(t => t.trim())
              break
          }
        }
        continue
      }

      // Heading starts new item
      const headingMatch = line.match(/^#\s+(.+)$/)
      if (headingMatch) {
        flushItem()
        currentItem.title = headingMatch[1]
        currentItem.pubDate = new Date()
        continue
      }

      // Content
      if (currentItem.title) {
        contentBuffer.push(line)
      }
    }

    flushItem()
    return items
  }

  return {
    generateRSS,
    generateRSS2,
    generateAtom,
    generateJSON,
    parseMarkdownToItems
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100)
}
