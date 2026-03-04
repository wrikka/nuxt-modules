import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { url } = query

  if (!url || typeof url !== 'string') {
    return {
      error: 'URL is required'
    }
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WMarkdown/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const title = titleMatch?.[1]?.trim()

    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"|<meta[^>]*content="([^"]*)"[^>]*name="description"/i)
    const description = descriptionMatch?.[1] || descriptionMatch?.[2]

    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"|<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i)
    let image = ogImageMatch?.[1] || ogImageMatch?.[2]

    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url)
      image = image.startsWith('/')
        ? `${baseUrl.origin}${image}`
        : `${baseUrl.origin}/${image}`
    }

    const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"|<meta[^>]*content="([^"]*)"[^>]*name="twitter:image"/i)
    if (!image) {
      image = twitterImageMatch?.[1] || twitterImageMatch?.[2]
    }

    return {
      url,
      title: title || 'No title',
      description: description || '',
      image
    }
  } catch (error) {
    return {
      url,
      error: error instanceof Error ? error.message : 'Failed to fetch preview'
    }
  }
})
