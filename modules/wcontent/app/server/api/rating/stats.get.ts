import { createError, defineEventHandler, getQuery } from "h3";
import type { RatingStats } from "../../../shared/types/rating";
import { getRatingManager } from "../../utils/services/rating";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const contentPath = query.path as string;

	if (!contentPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path is required",
		});
	}

	const ratingManager = getRatingManager();
	const stats = ratingManager.getRatingStats(contentPath);

	return stats as RatingStats;
});
