import { eq } from "drizzle-orm";
import { orders } from "../../db/schemas/orders.js";
import { OrderServiceCore } from "./core.js";
import { OrderCreationService } from "./orderCreation.js";
import { OrderPaymentService } from "./payment.js";
export class OrderService {
  db;
  core;
  creation;
  payment;
  constructor(db) {
    this.db = db;
    this.core = new OrderServiceCore(db);
    this.creation = new OrderCreationService(db);
    this.payment = new OrderPaymentService(db);
  }
  async createOrderFromCart(cartId, paymentIntentId, paymentIntentAmount) {
    const orderData = await this.core.createOrderFromCart(
      cartId,
      paymentIntentId,
      paymentIntentAmount
    );
    await this.payment.validatePaymentAmount(paymentIntentAmount, orderData.total * 100);
    const order = await this.creation.createOrderRecord(
      cartId,
      orderData.customer.id,
      orderData.customer.email,
      orderData.cart.shippingAddress,
      orderData.preTaxTotal,
      orderData.taxAmount,
      orderData.total,
      paymentIntentId
    );
    if (orderData.cart.giftCardAmountApplied) {
      await this.payment.processGiftCardPayment(
        cartId,
        Number(orderData.cart.giftCardAmountApplied)
      );
    }
    await this.creation.updateCartStatus(cartId);
    return order;
  }
  async getOrder(orderId) {
    return await this.db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true,
        customer: true
      }
    });
  }
  async getOrdersByCustomer(customerId) {
    return await this.db.query.orders.findMany({
      where: eq(orders.customerId, customerId),
      with: {
        items: true
      },
      orderBy: (orders2, { desc }) => [desc(orders2.createdAt)]
    });
  }
}
