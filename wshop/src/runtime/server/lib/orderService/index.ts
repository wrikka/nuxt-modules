import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "../../db/schemas"
import { orders } from "../../db/schemas/orders"
import { OrderServiceCore } from "./core"
import { OrderCreationService } from "./orderCreation"
import { OrderPaymentService } from "./payment"

export class OrderService {
	private db: NodePgDatabase<typeof schema>
	private core: OrderServiceCore
	private creation: OrderCreationService
	private payment: OrderPaymentService

	constructor(db: NodePgDatabase<typeof schema>) {
		this.db = db
		this.core = new OrderServiceCore(db)
		this.creation = new OrderCreationService(db)
		this.payment = new OrderPaymentService(db)
	}

	public async createOrderFromCart(
		cartId: string,
		paymentIntentId: string,
		paymentIntentAmount: number,
	) {
		const orderData = await this.core.createOrderFromCart(
			cartId,
			paymentIntentId,
			paymentIntentAmount,
		)

		// Validate payment amount
		await this.payment.validatePaymentAmount(paymentIntentAmount, orderData.total * 100)

		// Create the order record
		const order = await this.creation.createOrderRecord(
			cartId,
			orderData.customer.id,
			orderData.customer.email,
			orderData.cart.shippingAddress as unknown,
			orderData.preTaxTotal,
			orderData.taxAmount,
			orderData.total,
			paymentIntentId,
		)

		// Process gift card payment if applicable
		if (orderData.cart.giftCardAmountApplied) {
			await this.payment.processGiftCardPayment(
				cartId,
				Number(orderData.cart.giftCardAmountApplied),
			)
		}

		// Update cart status
		await this.creation.updateCartStatus(cartId)

		return order
	}

	public async getOrder(orderId: string) {
		return await this.db.query.orders.findFirst({
			where: eq(orders.id, orderId),
			with: {
				items: true,
				customer: true,
			},
		})
	}

	public async getOrdersByCustomer(customerId: string) {
		return await this.db.query.orders.findMany({
			where: eq(orders.customerId, customerId),
			with: {
				items: true,
			},
			orderBy: (orders, { desc }) => [desc(orders.createdAt)],
		})
	}
}
