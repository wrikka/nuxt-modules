import { eq } from "drizzle-orm";
import { carts } from "../../db/schemas/carts.js";
import { orderItems, orders } from "../../db/schemas/orders.js";
export class OrderCreationService {
  db;
  constructor(db) {
    this.db = db;
  }
  async createOrderRecord(cartId, customerId, email, shippingAddress, preTaxTotal, taxAmount, total, paymentIntentId) {
    const [order] = await this.db.insert(orders).values({
      customerId,
      email,
      shippingAddress,
      subtotal: preTaxTotal,
      tax: taxAmount,
      total,
      paymentIntentId,
      status: "pending"
    }).returning();
    const cartItems = await this.db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: { items: true }
    });
    if (cartItems?.items) {
      await this.db.insert(orderItems).values(
        cartItems.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }))
      );
    }
    return order;
  }
  async updateCartStatus(cartId) {
    await this.db.update(carts).set({ status: "completed" }).where(eq(carts.id, cartId));
  }
}
