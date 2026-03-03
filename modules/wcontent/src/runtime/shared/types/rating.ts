export interface Rating {
	id: string;
	contentPath: string;
	userId: string;
	rating: number;
	comment?: string;
	createdAt: number;
	createdAtISO: string;
}

export interface RatingStats {
	average: number;
	count: number;
	distribution: Record<number, number>;
}
