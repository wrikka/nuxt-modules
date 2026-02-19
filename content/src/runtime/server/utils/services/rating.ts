import type { Rating, RatingStats } from "../../../shared/types/rating";

export class RatingManager {
	private ratings: Map<string, Rating[]> = new Map();

	async addRating(
		contentPath: string,
		userId: string,
		rating: number,
		comment?: string,
	): Promise<Rating> {
		const existingRating = this.getUserRating(contentPath, userId);
		if (existingRating) {
			existingRating.rating = rating;
			existingRating.comment = comment;
			existingRating.createdAt = Date.now();
			existingRating.createdAtISO = new Date().toISOString();
			return existingRating;
		}

		const newRating: Rating = {
			id: `rating-${Date.now()}-${Math.random().toString(36).substring(2)}`,
			contentPath,
			userId,
			rating,
			comment,
			createdAt: Date.now(),
			createdAtISO: new Date().toISOString(),
		};

		const pathRatings = this.ratings.get(contentPath) || [];
		pathRatings.push(newRating);
		this.ratings.set(contentPath, pathRatings);

		return newRating;
	}

	getUserRating(contentPath: string, userId: string): Rating | null {
		const pathRatings = this.ratings.get(contentPath) || [];
		return pathRatings.find(r => r.userId === userId) || null;
	}

	getRatingStats(contentPath: string): RatingStats {
		const pathRatings = this.ratings.get(contentPath) || [];

		if (pathRatings.length === 0) {
			return {
				average: 0,
				count: 0,
				distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
			};
		}

		const sum = pathRatings.reduce((acc, r) => acc + r.rating, 0);
		const average = sum / pathRatings.length;

		const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		for (const rating of pathRatings) {
			distribution[rating.rating]++;
		}

		return {
			average,
			count: pathRatings.length,
			distribution,
		};
	}
}

let instance: RatingManager | null = null;

export function getRatingManager(): RatingManager {
	if (!instance) {
		instance = new RatingManager();
	}
	return instance;
}
