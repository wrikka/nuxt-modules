import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "../../db/schemas"
import { carts } from "../../db/schemas/carts"
import { orderItems, orders } from "../../db/schemas/orders"
import type { DbAddress } from "../../db/types"

export class OrderCreationService {
	private db: NodePgDatabase<typeof schema>

	constructor(db: NodePgDatabase<typeof schema>) {
		this.db = db
	}

	public async createOrderRecord(
		cartId: string,
		customerId: string,
		email: string,
		shippingAddress: DbAddress,
		preTaxTotal: number,
		taxAmount: number,
		total: number,
		paymentIntentId: string,
	) {
		const [order] = await this.db.insert(orders).values({
			customerId,
			email,
			shippingAddress,
			subtotal: preTaxTotal,
			tax: taxAmount,
			total,
			paymentIntentId,
			status: "pending",
		}).returning()

		// Create order items from cart items
		const cartItems = await this.db.query.carts.findFirst({
			where: eq(carts.id, cartId),
			with: { items: true },
		})

		if (cartItems?.items) {
			await this.db.insert(orderItems).values(
				cartItems.items.map(item => ({
					orderId: order.id,
					productId: item.productId,
					quantity: item.quantity,
					price: item.price,
					total: item.total,
				})),
			)
		}

		return order
	}

	public async updateCartStatus(cartId: string) {
		await this.db
			.update(carts)
			.set({ status: "completed" })
			.where(eq(carts.id, cartId))
	}
}
