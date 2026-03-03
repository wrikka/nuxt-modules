import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "../../db/schemas"
import { carts } from "../../db/schemas/carts"
import { customers } from "../../db/schemas/customers"
import type { DbAddress } from "../../db/types"

export class OrderServiceCore {
	private db: NodePgDatabase<typeof schema>

	constructor(db: NodePgDatabase<typeof schema>) {
		this.db = db
	}

	public async createOrderFromCart(
		cartId: string,
		paymentIntentId: string,
		paymentIntentAmount: number,
	) {
		const newOrder = await this.db.transaction(async (tx) => {
			// 1. Fetch the cart and its items
			const cart = await tx.query.carts.findFirst({
				where: and(eq(carts.id, cartId), eq(carts.status, "active")),
				with: { items: true, discount: true, giftCard: true },
			})

			if (!cart || cart.items.length === 0) {
				throw new Error("Cart is empty or not found.")
			}

			const email = cart.customerEmail
			const shippingAddress = cart.shippingAddress as unknown as DbAddress
			if (!email || !shippingAddress) {
				throw new Error("Cart is missing customer email or shipping address.")
			}

			// 2. Find or create a customer
			let customer = await tx.query.customers.findFirst({ where: eq(customers.email, email) })
			if (!customer) {
				const [newCustomer] = await tx.insert(customers).values({ email, name: "New Customer" })
					.returning()
				customer = newCustomer
			}

			if (!customer) {
				throw new Error("Failed to find or create customer.")
			}

			// 3. Create the order
			const shippingCost = 0 // Placeholder
			const preTaxTotal = (Number(cart.subtotal) - Number(cart.discountAmount || 0)
				- Number(cart.giftCardAmountApplied || 0)) + shippingCost
			const taxAmount = (paymentIntentAmount / 100) - preTaxTotal
			const total = preTaxTotal + taxAmount

			return {
				cart,
				customer,
				shippingCost,
				preTaxTotal,
				taxAmount,
				total,
			}
		})

		return newOrder
	}
}
