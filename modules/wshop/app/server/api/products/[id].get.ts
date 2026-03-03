import { getProductById } from "~~/server/services/product.service"

export default defineEventHandler(async (event) => {
	const productId = event.context.params?.id as string

	if (!productId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID is required" })
	}

	try {
		const product = await getProductById(productId)

		if (!product) {
			throw createError({ statusCode: 404, statusMessage: "Product not found" })
		}

		return product
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error(`Error fetching product ${productId}:`, error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to fetch product: ${errorMessage}`,
		})
	}
})
