import { z } from "zod"

export const SearchFiltersSchema = z.object({
	query: z.string().optional(),
	category: z.array(z.string()).optional(),
	priceMin: z.number().optional(),
	priceMax: z.number().optional(),
	minRating: z.number().optional(),
	tags: z.array(z.string()).optional(),
	sortBy: z.enum(["relevance", "priceAsc", "priceDesc", "newest"]).optional(),
})
export type SearchFilters = z.infer<typeof SearchFiltersSchema>

export const SearchResultSchema = z.object({
	id: z.string(),
	name: z.string(),
	price: z.number(),
	imageUrl: z.string(),
	rating: z.number(),
})
export type SearchResult = z.infer<typeof SearchResultSchema>

export const ProductFiltersSchema = z.object({
	categoryId: z.string().optional(),
	minPrice: z.string().optional(),
	maxPrice: z.string().optional(),
	status: z.string().optional(),
	stockStatus: z.string().optional(),
})
export type ProductFilters = z.infer<typeof ProductFiltersSchema>

export const SearchOptionsSchema = z.object({
	query: z.string().optional(),
	filters: ProductFiltersSchema.optional(),
	sortBy: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
})
export type SearchOptions = z.infer<typeof SearchOptionsSchema>
