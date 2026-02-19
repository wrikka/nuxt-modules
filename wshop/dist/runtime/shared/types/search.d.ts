import { z } from "zod";
export declare const SearchFiltersSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    priceMin: z.ZodOptional<z.ZodNumber>;
    priceMax: z.ZodOptional<z.ZodNumber>;
    minRating: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sortBy: z.ZodOptional<z.ZodEnum<["relevance", "priceAsc", "priceDesc", "newest"]>>;
}, "strip", z.ZodTypeAny, {
    query?: string | undefined;
    sortBy?: "relevance" | "priceAsc" | "priceDesc" | "newest" | undefined;
    category?: string[] | undefined;
    tags?: string[] | undefined;
    priceMin?: number | undefined;
    priceMax?: number | undefined;
    minRating?: number | undefined;
}, {
    query?: string | undefined;
    sortBy?: "relevance" | "priceAsc" | "priceDesc" | "newest" | undefined;
    category?: string[] | undefined;
    tags?: string[] | undefined;
    priceMin?: number | undefined;
    priceMax?: number | undefined;
    minRating?: number | undefined;
}>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export declare const SearchResultSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    imageUrl: z.ZodString;
    rating: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    price: number;
    rating: number;
    imageUrl: string;
}, {
    id: string;
    name: string;
    price: number;
    rating: number;
    imageUrl: string;
}>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export declare const ProductFiltersSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodString>;
    maxPrice: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodString>;
    stockStatus: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    minPrice?: string | undefined;
    maxPrice?: string | undefined;
    categoryId?: string | undefined;
    stockStatus?: string | undefined;
}, {
    status?: string | undefined;
    minPrice?: string | undefined;
    maxPrice?: string | undefined;
    categoryId?: string | undefined;
    stockStatus?: string | undefined;
}>;
export type ProductFilters = z.infer<typeof ProductFiltersSchema>;
export declare const SearchOptionsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    filters: z.ZodOptional<z.ZodObject<{
        categoryId: z.ZodOptional<z.ZodString>;
        minPrice: z.ZodOptional<z.ZodString>;
        maxPrice: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
        stockStatus: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        categoryId?: string | undefined;
        stockStatus?: string | undefined;
    }, {
        status?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        categoryId?: string | undefined;
        stockStatus?: string | undefined;
    }>>;
    sortBy: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query?: string | undefined;
    filters?: {
        status?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        categoryId?: string | undefined;
        stockStatus?: string | undefined;
    } | undefined;
    sortBy?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}, {
    query?: string | undefined;
    filters?: {
        status?: string | undefined;
        minPrice?: string | undefined;
        maxPrice?: string | undefined;
        categoryId?: string | undefined;
        stockStatus?: string | undefined;
    } | undefined;
    sortBy?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type SearchOptions = z.infer<typeof SearchOptionsSchema>;
//# sourceMappingURL=search.d.ts.map