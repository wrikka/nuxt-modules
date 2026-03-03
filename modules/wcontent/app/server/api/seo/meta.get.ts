import { createError, eventHandler, getQuery } from "h3";
import { getSEOOptimizer } from "../../../utils/seo";

export default eventHandler(async (event) => {
	const query = getQuery(event);
	const path = query.path as string || "/";

	const config = {
		siteUrl: "https://wrikka.com",
		siteName: "Wrikka",
		defaultTitle: "Wrikka - Your Content Platform",
		defaultDescription: "A powerful content management platform",
		defaultImage: "https://wrikka.com/og-image.png",
	};

	const seo = getSEOOptimizer(config);

	// Get content item (queryContent should be available globally or injected)
	const item = await (globalThis as any).queryContent(path).findOne();

	if (!item) {
		throw createError({
			statusCode: 404,
			message: "Content not found",
		});
	}

	// Generate meta tags
	const meta = seo.generateMetaTags(item);

	// Generate structured data
	const structuredData = seo.generateArticleStructuredData(item);

	return {
		meta,
		structuredData,
	};
});
