export declare const useReviews: () => {
    reviews: import("vue").Ref<any, any>;
    reviewStats: any;
    loading: import("vue").Ref<boolean, boolean>;
    processing: import("vue").Ref<boolean, boolean>;
    loadReviews: (productId: number) => Promise<void>;
    loadReviewStats: (productId: number) => Promise<void>;
    createReview: (reviewData: any) => Promise<void>;
    markReviewHelpful: (reviewId: string) => Promise<void>;
    reportReview: (reviewId: string) => Promise<void>;
};
//# sourceMappingURL=useReviews.d.ts.map