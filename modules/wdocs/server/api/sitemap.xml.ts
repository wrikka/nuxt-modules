export default defineEventHandler(async (event) => {
  const { hostname = 'https://docs.example.com' } = useRuntimeConfig().public.wdocs || {}
  
  const docs = await queryCollection('content')
    .where('extension', '=', 'md')
    .all()

  const urls = docs.map(doc => ({
    loc: `${hostname}${doc.path}`,
    lastmod: doc.date || new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  }))

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return sitemap
})
