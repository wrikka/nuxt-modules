import type { Review } from "#shared/types";
export declare function useReviewsUtils(reviews: any, averageRating: any, totalReviews: any, ratingDistribution: any): {
    getReviewById: (reviewId: string) => any;
    getReviewsByRating: (rating: number) => any;
    getVerifiedReviews: () => any;
    getRecentReviews: (limit?: number) => any;
    getTopRatedReviews: (limit?: number) => any;
    getMostHelpfulReviews: (limit?: number) => any;
    calculateAverageRating: (reviewList: Review[]) => number;
    getRatingDistribution: (reviewList: Review[]) => {
        "5": number;
        "4": number;
        "3": number;
        "2": number;
        "1": number;
    };
    searchReviews: (query: string) => any;
    getReviewSummary: () => {
        averageRating: any;
        totalReviews: any;
        ratingDistribution: any;
        verifiedCount: any;
        pendingCount: any;
    };
};
//# sourceMappingURL=useReviewsUtils.d.ts.map