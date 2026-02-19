import { z } from "zod";
export declare const ReviewSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    customerId: z.ZodString;
    rating: z.ZodNumber;
    title: z.ZodNullable<z.ZodString>;
    content: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<["pending", "approved", "rejected"]>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    customer: z.ZodObject<{
        name: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string | null;
    }, {
        name: string | null;
    }>;
    helpful: z.ZodDefault<z.ZodNumber>;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    userMarkedHelpful: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "approved" | "rejected";
    id: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
    rating: number;
    customerId: string;
    productId: string;
    customer: {
        name: string | null;
    };
    content: string | null;
    helpful: number;
    isVerified: boolean;
    userMarkedHelpful?: boolean | undefined;
}, {
    status: "pending" | "approved" | "rejected";
    id: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
    rating: number;
    customerId: string;
    productId: string;
    customer: {
        name: string | null;
    };
    content: string | null;
    helpful?: number | undefined;
    isVerified?: boolean | undefined;
    userMarkedHelpful?: boolean | undefined;
}>;
export type Review = z.infer<typeof ReviewSchema>;
export declare const ReviewStatsSchema: z.ZodObject<{
    averageRating: z.ZodNumber;
    totalReviews: z.ZodNumber;
    ratingDistribution: z.ZodObject<{
        "5": z.ZodNumber;
        "4": z.ZodNumber;
        "3": z.ZodNumber;
        "2": z.ZodNumber;
        "1": z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
    }, {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
    }>;
}, "strip", z.ZodTypeAny, {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
    };
}, {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
    };
}>;
export type ReviewStats = z.infer<typeof ReviewStatsSchema>;
//# sourceMappingURL=review.d.ts.map