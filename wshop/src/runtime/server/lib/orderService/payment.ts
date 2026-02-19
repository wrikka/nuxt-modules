import { eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"
import * as schema from "../../db/schemas"
import { carts } from "../../db/schemas/carts"
import { giftCards, giftCardTransactions } from "../../db/schemas/gift_cards"

export class OrderPaymentService {
	private db: NodePgDatabase<typeof schema>

	constructor(db: NodePgDatabase<typeof schema>) {
		this.db = db
	}

	public async processGiftCardPayment(cartId: string, giftCardAmount: number) {
		const cart = await this.db.query.carts.findFirst({
			where: eq(carts.id, cartId),
			with: { giftCard: true },
		})

		if (cart?.giftCard && giftCardAmount > 0) {
			// Update gift card balance
			await this.db
				.update(giftCards)
				.set({
					balance: Number(cart.giftCard.balance) - giftCardAmount,
				})
				.where(eq(giftCards.id, cart.giftCard.id))

			// Create gift card transaction record
			await this.db.insert(giftCardTransactions).values({
				giftCardId: cart.giftCard.id,
				amount: -giftCardAmount,
				type: "purchase",
				description: `Order payment for cart ${cartId}`,
			})
		}
	}

	public async validatePaymentAmount(paymentIntentAmount: number, expectedAmount: number) {
		const tolerance = 0.01 // Small tolerance for floating point math
		if (Math.abs(paymentIntentAmount - expectedAmount) > tolerance) {
			throw new Error(
				`Payment amount mismatch. Expected: ${expectedAmount}, Received: ${paymentIntentAmount}`,
			)
		}
	}
}
