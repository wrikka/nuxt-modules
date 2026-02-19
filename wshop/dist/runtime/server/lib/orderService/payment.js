import { eq } from "drizzle-orm";
import { carts } from "../../db/schemas/carts.js";
import { giftCards, giftCardTransactions } from "../../db/schemas/gift_cards.js";
export class OrderPaymentService {
  db;
  constructor(db) {
    this.db = db;
  }
  async processGiftCardPayment(cartId, giftCardAmount) {
    const cart = await this.db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: { giftCard: true }
    });
    if (cart?.giftCard && giftCardAmount > 0) {
      await this.db.update(giftCards).set({
        balance: Number(cart.giftCard.balance) - giftCardAmount
      }).where(eq(giftCards.id, cart.giftCard.id));
      await this.db.insert(giftCardTransactions).values({
        giftCardId: cart.giftCard.id,
        amount: -giftCardAmount,
        type: "purchase",
        description: `Order payment for cart ${cartId}`
      });
    }
  }
  async validatePaymentAmount(paymentIntentAmount, expectedAmount) {
    const tolerance = 0.01;
    if (Math.abs(paymentIntentAmount - expectedAmount) > tolerance) {
      throw new Error(
        `Payment amount mismatch. Expected: ${expectedAmount}, Received: ${paymentIntentAmount}`
      );
    }
  }
}
