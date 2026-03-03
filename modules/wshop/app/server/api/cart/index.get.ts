// d:/wshop/server/api/cart/index.get.ts

import { cartService } from "~~/server/services/cart.service"

export default defineEventHandler(async (event) => {
	let anonymousId = getCookie(event, "anonymous-cart-id") || crypto.randomUUID()
	setCookie(event, "anonymous-cart-id", anonymousId, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 })

	const customerId = event.context.customer?.id || null

	const cart = await cartService.getOrCreateCart(customerId, anonymousId)

	if (!cart || !cart.id) {
		throw createError({ statusCode: 500, statusMessage: "Could not get or create cart." })
	}
	return cartService.recalculateAndUpdateCart(cart.id)
})
