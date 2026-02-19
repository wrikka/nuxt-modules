import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { cartItems, carts } from "../db/schemas/index.js";
export const cartService = {
  async getCart(cartId) {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
      with: {
        items: true
      }
    });
    return cart;
  },
  async findActiveCart(customerId, anonymousId) {
    const cart = await db.query.carts.findFirst({
      where: (cart2) => {
        if (customerId) {
          return eq(cart2.customerId, customerId);
        }
        return eq(cart2.id, anonymousId);
      },
      with: {
        items: true
      }
    });
    return cart;
  },
  async getOrCreateCart(customerId, anonymousId) {
    const cart = await this.findActiveCart(customerId, anonymousId);
    if (cart) return cart;
    return this.createCart({ customerId, anonymousId });
  },
  async createCart(data) {
    const [cart] = await db.insert(carts).values(data).returning();
    return cart;
  },
  async updateCart(cartId, data) {
    const [cart] = await db.update(carts).set(data).where(eq(carts.id, cartId)).returning();
    return cart;
  },
  async deleteCart(cartId) {
    await db.delete(carts).where(eq(carts.id, cartId));
  },
  async clearCart(cartId) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return this.updateCart(cartId, {
      subtotal: "0",
      discountAmount: "0",
      taxAmount: "0",
      total: "0"
    });
  },
  async addItem(cartId, productId, variantId, quantity, price) {
    const [cartItem] = await db.insert(cartItems).values({
      cartId,
      productId,
      variantId,
      quantity,
      price
    }).returning();
    return cartItem;
  },
  async removeItem(cartItemId) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  },
  async updateItem(itemId, data) {
    const [cartItem] = await db.update(cartItems).set(data).where(eq(cartItems.id, itemId)).returning();
    return cartItem;
  },
  async deleteItem(itemId) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  },
  async applyDiscount(cartId, code) {
    const cart = await this.getCart(cartId);
    if (!cart) throw new Error("Cart not found");
    return this.updateCart(cartId, { discountCode: code });
  },
  async removeDiscount(cartId) {
    return this.updateCart(cartId, { discountCode: null });
  },
  async applyGiftCard(cartId, code) {
    const cart = await this.getCart(cartId);
    if (!cart) throw new Error("Cart not found");
    return this.updateCart(cartId, { giftCardCode: code });
  },
  async removeGiftCard(cartId) {
    return this.updateCart(cartId, { giftCardCode: null });
  },
  async recalculateAndUpdateCart(cartId) {
    const cart = await this.getCart(cartId);
    if (!cart) throw new Error("Cart not found");
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * item.quantity,
      0
    );
    return this.updateCart(cartId, { subtotal: subtotal.toString() });
  }
};
