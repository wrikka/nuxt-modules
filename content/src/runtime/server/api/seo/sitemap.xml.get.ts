import { eventHandler, setHeader } from "h3";

export default eventHandler(async (event) => {
	// Generate sitemap
	const sitemap =
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n</urlset>";

	setHeader(event, "Content-Type", "application/xml");
	return sitemap;
});
