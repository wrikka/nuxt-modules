import { pgEnum } from "drizzle-orm/pg-core"

export const booleanEnum = pgEnum("boolean", ["true", "false"])

export const productStatusEnum = pgEnum("product_status", ["active", "draft", "archived"])
export const orderStatusEnum = pgEnum("order_status", [
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
])
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"])
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"])
export const giftCardTransactionTypeEnum = pgEnum("gift_card_transaction_type", [
	"issue",
	"redeem",
	"expire",
	"deactivate",
])
export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed_amount"])
export const pageStatusEnum = pgEnum("page_status", ["draft", "published"])
export const cartStatusEnum = pgEnum("cart_status", ["active", "abandoned", "converted"])
export const productTypeEnum = pgEnum("product_type", ["physical", "digital"])
export const optionDisplayTypeEnum = pgEnum("option_display_type", ["button", "dropdown", "swatch"])
export const pluginStatusEnum = pgEnum("plugin_status", [
	"active",
	"inactive",
	"pending_approval",
	"rejected",
])
export const posSessionStatusEnum = pgEnum("pos_session_status", [
	"active",
	"completed",
	"cancelled",
])
