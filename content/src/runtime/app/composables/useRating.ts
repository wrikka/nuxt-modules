import type { Rating, RatingStats } from "../../shared/types/rating";

export function useRating() {
	const rate = async (
		contentPath: string,
		userId: string,
		rating: number,
		comment?: string,
	): Promise<Rating> => {
		const response = await $fetch("/api/rating/rate", {
			method: "POST",
			body: { contentPath, userId, rating, comment },
		});
		return response as Rating;
	};

	const getStats = async (contentPath: string): Promise<RatingStats> => {
		const response = await $fetch("/api/rating/stats", {
			method: "GET",
			query: { path: contentPath },
		});
		return response as RatingStats;
	};

	return {
		rate,
		getStats,
	};
}
