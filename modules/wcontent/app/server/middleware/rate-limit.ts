import { createError, defineEventHandler } from "h3";
import type { H3Event } from "h3";
import { getRateLimiter } from "../utils/services/rate-limit";

export default defineEventHandler((event: H3Event) => {
	const identifier = event.node.req.headers["x-forwarded-for"] as string
		|| event.node.req.socket.remoteAddress
		|| "unknown";

	const rateLimiter = getRateLimiter();
	const result = rateLimiter.check(identifier);

	event.context.rateLimit = result;

	if (!result.allowed) {
		throw createError({
			statusCode: 429,
			statusMessage: "Too Many Requests",
			data: {
				remaining: result.remaining,
				resetAt: result.resetAt,
			},
		});
	}
});
