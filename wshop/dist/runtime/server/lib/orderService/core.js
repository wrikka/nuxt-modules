import { and, eq } from "drizzle-orm";
import { carts } from "../../db/schemas/carts.js";
import { customers } from "../../db/schemas/customers.js";
export class OrderServiceCore {
  db;
  constructor(db) {
    this.db = db;
  }
  async createOrderFromCart(cartId, paymentIntentId, paymentIntentAmount) {
    const newOrder = await this.db.transaction(async (tx) => {
      const cart = await tx.query.carts.findFirst({
        where: and(eq(carts.id, cartId), eq(carts.status, "active")),
        with: { items: true, discount: true, giftCard: true }
      });
      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty or not found.");
      }
      const email = cart.customerEmail;
      const shippingAddress = cart.shippingAddress;
      if (!email || !shippingAddress) {
        throw new Error("Cart is missing customer email or shipping address.");
      }
      let customer = await tx.query.customers.findFirst({ where: eq(customers.email, email) });
      if (!customer) {
        const [newCustomer] = await tx.insert(customers).values({ email, name: "New Customer" }).returning();
        customer = newCustomer;
      }
      if (!customer) {
        throw new Error("Failed to find or create customer.");
      }
      const shippingCost = 0;
      const preTaxTotal = Number(cart.subtotal) - Number(cart.discountAmount || 0) - Number(cart.giftCardAmountApplied || 0) + shippingCost;
      const taxAmount = paymentIntentAmount / 100 - preTaxTotal;
      const total = preTaxTotal + taxAmount;
      return {
        cart,
        customer,
        shippingCost,
        preTaxTotal,
        taxAmount,
        total
      };
    });
    return newOrder;
  }
}
