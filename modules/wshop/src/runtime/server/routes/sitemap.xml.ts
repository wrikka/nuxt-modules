// d:/wshop/server/routes/sitemap.xml.ts

import { eq } from "drizzle-orm"
import { SitemapStream, streamToPromise } from "sitemap"
import { db } from "~~/server/db"
import { pages, products } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const sitemap = new SitemapStream({ hostname: "http://localhost:3000" }) // Replace with your actual domain

	// Add static routes
	sitemap.write({ url: "/", changefreq: "daily", priority: 1 })
	sitemap.write({ url: "/products", changefreq: "daily", priority: 0.8 })

	// Add dynamic product routes
	const allProducts = await db.query.products.findMany({
		where: eq(products.status, "active"),
		columns: {
			handle: true,
			updatedAt: true,
		},
	})

	for (const product of allProducts) {
		sitemap.write({
			url: `/products/${product.handle}`,
			changefreq: "weekly",
			lastmod: product.updatedAt,
		})
	}

	// Add dynamic page routes
	const allPages = await db.query.pages.findMany({
		where: eq(pages.status, "published"),
	})

	for (const page of allPages) {
		sitemap.write({
			url: `/${page.slug}`,
			changefreq: "monthly",
			lastmod: page.updatedAt,
		})
	}

	sitemap.end()

	setHeader(event, "content-type", "application/xml")
	return streamToPromise(sitemap)
})
