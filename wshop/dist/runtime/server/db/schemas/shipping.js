import { relations } from "drizzle-orm";
import { jsonb, numeric, pgTable, text } from "drizzle-orm/pg-core";
export const shippingZones = pgTable("shipping_zones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  countries: jsonb("countries").$type(),
  rateType: text("rate_type").notNull(),
  // 'flat' | 'weight' | 'price'
  baseRate: numeric("base_rate").notNull()
});
export const shippingRates = pgTable("shipping_rates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  zoneId: text("zone_id").references(() => shippingZones.id).notNull(),
  name: text("name").notNull(),
  minWeight: numeric("min_weight"),
  maxWeight: numeric("max_weight"),
  minPrice: numeric("min_price"),
  maxPrice: numeric("max_price"),
  price: numeric("price").notNull()
});
export const shippingZonesRelations = relations(shippingZones, ({ many }) => ({
  rates: many(shippingRates)
}));
export const shippingRatesRelations = relations(shippingRates, ({ one }) => ({
  zone: one(shippingZones, {
    fields: [shippingRates.zoneId],
    references: [shippingZones.id]
  })
}));
