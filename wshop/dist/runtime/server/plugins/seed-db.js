import { seedCategories } from "~~/server/db/seed/categories";
import { seedInventory } from "~~/server/db/seed/inventory";
import { seedLoyalty } from "~~/server/db/seed/loyalty";
import { seedPaymentMethods } from "~~/server/db/seed/payment";
export default defineNitroPlugin(async () => {
  if (process.env.NODE_ENV === "development") {
    await seedCategories();
    await seedInventory();
    await seedLoyalty();
    await seedPaymentMethods();
  }
});
