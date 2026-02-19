import type { Review } from "#shared/types";
export declare const useReviewsApi: () => {
    reviews: any;
    reviewStats: any;
    loading: any;
    processing: any;
    error: any;
    loadReviews: (productId: string) => Promise<void>;
    createReview: (reviewData: {
        productId: string;
        rating: number;
        title?: string;
        content: string;
        images?: string[];
    }) => Promise<any>;
    updateReview: (reviewId: string, updates: Partial<Review>) => Promise<any>;
    deleteReview: (reviewId: string) => Promise<void>;
};
//# sourceMappingURL=useReviewsApiRefactored.d.ts.map