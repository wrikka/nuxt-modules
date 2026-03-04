import { createDatabase } from "../../../utils/database";
import type { H3Event } from "h3";

// GET /rss.xml
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const db = createDatabase(config.wcontent.database);
  await db.init();

  try {
    // Get all collections with published content
    const collections = ["blog", "news", "articles"]; // Configurable
    let allItems: Array<Record<string, any>> = [];

    for (const collection of collections) {
      try {
        const items = await db.find(collection, {
          where: { _draft: false },
          sort: [{ field: "createdAt", direction: "desc" }],
          limit: 20,
        });
        allItems.push(...items.map((item: Record<string, any>) => ({ ...item, _collection: collection })));
      } catch {
        // Collection might not exist
      }
    }

    // Sort by date
    allItems.sort((a, b) => {
      const dateA = new Date(b.createdAt || 0).getTime();
      const dateB = new Date(a.createdAt || 0).getTime();
      return dateA - dateB;
    });

    // Generate RSS XML
    const hostname = config.public.siteUrl || "https://example.com";
    const rssConfig = config.wcontent.rss || {};

    const items = allItems.slice(0, 20).map(item => `
      <item>
        <title>${escapeXml(item.title || "Untitled")}</title>
        <link>${hostname}${item._path}</link>
        <description>${escapeXml(item.description || "")}</description>
        <pubDate>${new Date(item.createdAt).toUTCString()}</pubDate>
        <guid>${hostname}${item._path}</guid>
      </item>
    `).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(rssConfig.title || "Site Feed")}</title>
    <link>${hostname}</link>
    <description>${escapeXml(rssConfig.description || "Latest content")}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${hostname}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

    setResponseHeader(event, "Content-Type", "application/xml");
    return rss;
  } finally {
    await db.close();
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
