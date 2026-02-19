import type { Review } from "#shared/types";
export declare const useReviewsApi: () => {
    reviews: any;
    reviewStats: any;
    loading: any;
    processing: any;
    error: any;
    loadReviews: (productId: string) => Promise<void>;
    loadReviewStats: (productId: string) => Promise<void>;
    createReview: (reviewData: {
        productId: string;
        rating: number;
        title?: string;
        content: string;
        images?: string[];
    }) => Promise<any>;
    updateReview: (reviewId: string, updates: Partial<Review>) => Promise<any>;
    deleteReview: (reviewId: string) => Promise<void>;
    markReviewHelpful: (reviewId: string) => Promise<void>;
    reportReview: (reviewId: string) => Promise<void>;
    approveReview: (reviewId: string) => Promise<void>;
    rejectReview: (reviewId: string) => Promise<void>;
    getReviewsByCustomer: (customerId: string) => Promise<any>;
    getPendingReviews: () => Promise<any>;
    exportReviews: (productId?: string, format?: "csv" | "json") => Promise<void>;
};
//# sourceMappingURL=useReviewsApi.d.ts.map