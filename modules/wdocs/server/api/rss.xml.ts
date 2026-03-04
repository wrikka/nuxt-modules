import { Feed } from 'feed'

export default defineEventHandler(async (event) => {
  const { hostname, title = 'WDocs', description = 'Documentation' } = useRuntimeConfig().public.wdocs || {}
  
  const feed = new Feed({
    title,
    description,
    id: hostname || 'https://docs.example.com',
    link: hostname || 'https://docs.example.com',
    language: 'en',
    favicon: `${hostname}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    updated: new Date(),
    generator: 'WDocs'
  })

  const docs = await queryCollection('content')
    .where('extension', '=', 'md')
    .all()

  for (const doc of docs) {
    feed.addItem({
      title: doc.title || 'Untitled',
      id: `${hostname}${doc.path}`,
      link: `${hostname}${doc.path}`,
      description: doc.description || '',
      date: new Date(doc.date || Date.now()),
      content: doc.body
    })
  }

  setResponseHeader(event, 'content-type', 'application/xml')
  return feed.rss2()
})
