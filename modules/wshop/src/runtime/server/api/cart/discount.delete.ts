import { cartService } from "~~/server/services/cart.service"

export default defineEventHandler(async (event) => {
	let anonymousId = getCookie(event, "anonymous-cart-id")
	const customerId = event.context.customer?.id || null

	const cart = await cartService.findActiveCart(customerId, anonymousId!)

	if (!cart) {
		throw createError({ statusCode: 404, statusMessage: "Cart not found" })
	}

	return cartService.removeDiscount(cart.id)
})
