import { eventHandler, setHeader } from "h3";

export default eventHandler(async (event) => {
	// Generate robots.txt
	const robots = "User-agent: *\nDisallow: /api/\nAllow: /";

	setHeader(event, "Content-Type", "text/plain");
	return robots;
});
