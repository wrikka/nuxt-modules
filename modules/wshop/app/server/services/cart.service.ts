import { eq } from "drizzle-orm"
import { db } from "../db"
import { cartItems, carts } from "../db/schemas"

export const cartService = {
	async getCart(cartId: string) {
		const cart = await db.query.carts.findFirst({
			where: eq(carts.id, cartId),
			with: {
				items: true,
			},
		})
		return cart
	},

	async findActiveCart(customerId: string | null, anonymousId: string) {
		const cart = await db.query.carts.findFirst({
			where: (cart) => {
				if (customerId) {
					return eq(cart.customerId, customerId)
				}
				return eq(cart.id, anonymousId)
			},
			with: {
				items: true,
			},
		})
		return cart
	},

	async getOrCreateCart(customerId: string | null, anonymousId: string) {
		const cart = await this.findActiveCart(customerId, anonymousId)
		if (cart) return cart
		return this.createCart({ customerId, anonymousId })
	},

	async createCart(data: any) {
		const [cart] = await db.insert(carts).values(data).returning()
		return cart
	},

	async updateCart(cartId: string, data: any) {
		const [cart] = await db
			.update(carts)
			.set(data)
			.where(eq(carts.id, cartId))
			.returning()
		return cart
	},

	async deleteCart(cartId: string) {
		await db.delete(carts).where(eq(carts.id, cartId))
	},

	async clearCart(cartId: string) {
		await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
		return this.updateCart(cartId, {
			subtotal: "0",
			discountAmount: "0",
			taxAmount: "0",
			total: "0",
		})
	},

	async addItem(
		cartId: string,
		productId: string,
		variantId: string,
		quantity: number,
		price: string,
	) {
		const [cartItem] = await db.insert(cartItems).values({
			cartId,
			productId,
			variantId,
			quantity,
			price,
		}).returning()
		return cartItem
	},

	async removeItem(cartItemId: string) {
		await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
	},

	async updateItem(itemId: string, data: any) {
		const [cartItem] = await db
			.update(cartItems)
			.set(data)
			.where(eq(cartItems.id, itemId))
			.returning()
		return cartItem
	},

	async deleteItem(itemId: string) {
		await db.delete(cartItems).where(eq(cartItems.id, itemId))
	},

	async applyDiscount(cartId: string, code: string) {
		const cart = await this.getCart(cartId)
		if (!cart) throw new Error("Cart not found")
		return this.updateCart(cartId, { discountCode: code })
	},

	async removeDiscount(cartId: string) {
		return this.updateCart(cartId, { discountCode: null })
	},

	async applyGiftCard(cartId: string, code: string) {
		const cart = await this.getCart(cartId)
		if (!cart) throw new Error("Cart not found")
		return this.updateCart(cartId, { giftCardCode: code })
	},

	async removeGiftCard(cartId: string) {
		return this.updateCart(cartId, { giftCardCode: null })
	},

	async recalculateAndUpdateCart(cartId: string) {
		const cart = await this.getCart(cartId)
		if (!cart) throw new Error("Cart not found")
		const subtotal = cart.items.reduce(
			(sum, item) => sum + Number(item.price || 0) * item.quantity,
			0,
		)
		return this.updateCart(cartId, { subtotal: subtotal.toString() })
	},
}
