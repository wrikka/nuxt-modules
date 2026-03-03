import { createError, defineEventHandler, readBody } from "h3";
import type { Rating } from "../../../shared/types/rating";
import { getRatingManager } from "../../utils/services/rating";

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { contentPath, userId, rating, comment } = body;

	if (!contentPath || !userId || !rating) {
		throw createError({
			statusCode: 400,
			statusMessage: "Content path, user ID, and rating are required",
		});
	}

	if (rating < 1 || rating > 5) {
		throw createError({
			statusCode: 400,
			statusMessage: "Rating must be between 1 and 5",
		});
	}

	const ratingManager = getRatingManager();
	const result = await ratingManager.addRating(contentPath, userId, rating, comment);

	return result as Rating;
});
