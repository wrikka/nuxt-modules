import { pgEnum } from "drizzle-orm/pg-core";
export const productStatusEnum = pgEnum("product_status", ["draft", "active", "archived"]);
export const productTypeEnum = pgEnum("product_type", ["physical", "digital", "service"]);
export const optionDisplayTypeEnum = pgEnum("option_display_type", ["text", "color", "image"]);
export const pageStatusEnum = pgEnum("page_status", ["draft", "published"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const currencyEnum = pgEnum("currency", ["THB", "USD", "EUR"]);
