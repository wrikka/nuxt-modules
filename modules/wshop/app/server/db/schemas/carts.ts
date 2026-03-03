// d:/wshop/server/db/schemas/carts.ts

import { relations } from "drizzle-orm"
import { decimal, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { cartStatusEnum } from "../enums"
import type { DbAddress } from "../types"
import { customers } from "./customers"
import { discounts } from "./discounts"
import { giftCards } from "./gift_cards"
import { orders } from "./orders"
import { products, productVariants } from "./products"

// Carts Table
export const carts = pgTable("carts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
	anonymousId: text("anonymous_id"), // For guest carts
	customerEmail: text("customer_email"),
	shippingAddress: jsonb("shipping_address").$type<DbAddress>(),
	status: cartStatusEnum("status").notNull().default("active"),
	subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0.00"),
	discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
	discountId: text("discount_id").references(() => discounts.id, { onDelete: "set null" }),
	giftCardId: text("gift_card_id").references(() => giftCards.id, { onDelete: "set null" }), // FIX: Added missing giftCardId
	giftCardAmountApplied: decimal("gift_card_amount_applied", { precision: 10, scale: 2 }).notNull()
		.default("0.00"), // FIX: Added missing giftCardAmountApplied
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
	abandonedAt: timestamp("abandoned_at"), // Timestamp for when the cart was marked as abandoned
	recoveryEmailSentAt: timestamp("recovery_email_sent_at"), // Timestamp for when the recovery email was sent
	orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
})

// Cart Items Table
export const cartItems = pgTable("cart_items", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
	productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
	variantId: text("variant_id").notNull().references(() => productVariants.id, {
		onDelete: "cascade",
	}),
	quantity: integer("quantity").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price per item at time of adding to cart
})

// --- RELATIONS ---

export const cartsRelations = relations(carts, ({ one, many }) => ({
	customer: one(customers, {
		fields: [carts.customerId],
		references: [customers.id],
	}),
	items: many(cartItems),
	discount: one(discounts, {
		fields: [carts.discountId],
		references: [discounts.id],
	}),
	giftCard: one(giftCards, {
		fields: [carts.giftCardId],
		references: [giftCards.id],
	}),
	order: one(orders, {
		fields: [carts.orderId],
		references: [orders.id],
	}),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, {
		fields: [cartItems.cartId],
		references: [carts.id],
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id],
	}),
	variant: one(productVariants, {
		fields: [cartItems.variantId],
		references: [productVariants.id],
	}),
}))
