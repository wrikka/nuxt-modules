export declare function useReviews(): {
    reviews: import("vue").Ref<any, any>;
    reviewStats: any;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    averageRating: import("vue").ComputedRef<any>;
    totalReviews: import("vue").ComputedRef<any>;
    ratingDistribution: import("vue").ComputedRef<any>;
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
//# sourceMappingURL=useReviews.d.ts.map