import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import { productStatusEnum } from "../../db/enums"
import { products } from "../../db/schemas/products"

const searchQuerySchema = z.object({
	search: z.string().optional(),
	minPrice: z.coerce.number().optional(),
	maxPrice: z.coerce.number().optional(),
	status: z.enum(productStatusEnum.enumValues).optional(),
	sort: z.string().optional().default("name_asc"),
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().optional().default(20),
})

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, (q) => searchQuerySchema.safeParse(q))

	if (!query.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid query parameters",
			data: query.error.flatten(),
		})
	}

	const { search, minPrice, maxPrice, status, sort } = query.data
	const page = query.data.page as number
	const limit = query.data.limit as number

	const whereConditions = and(
		search ? ilike(products.name, `%${search}%`) : undefined,
		minPrice ? gte(products.price, String(minPrice)) : undefined,
		maxPrice ? lte(products.price, String(maxPrice)) : undefined,
		status ? eq(products.status, status) : undefined,
	)

	const orderBy = (() => {
		switch (sort) {
			case "name_desc":
				return desc(products.name)
			case "price_asc":
				return asc(products.price)
			case "price_desc":
				return desc(products.price)
			case "created_at":
				return desc(products.createdAt)
			default:
				return asc(products.name)
		}
	})()

	try {
		const [totalRecords] = await db.select({ count: count() }).from(products).where(whereConditions)
		const total = totalRecords?.count ?? 0

		const searchResults = await db.query.products.findMany({
			where: whereConditions,
			orderBy,
			limit: limit,
			offset: (page - 1) * limit,
			with: {
				images: true,
				variants: true,
				options: true,
			},
		})

		return {
			data: searchResults,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	} catch (error) {
		console.error("Failed to search products:", error)
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to search products",
		})
	}
})
