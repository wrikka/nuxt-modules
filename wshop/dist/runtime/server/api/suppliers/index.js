import { z } from "zod";
import { db } from "~~/server/db";
import { suppliers } from "~~/server/db/schemas/dropshipping";
const createSupplierSchema = z.object({
  name: z.string(),
  type: z.string(),
  enabled: z.boolean().default(true),
  config: z.record(z.any()).optional()
});
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method === "GET") {
    try {
      const allSuppliers = await db.query.suppliers.findMany({
        orderBy: (suppliers2, { desc }) => [desc(suppliers2.createdAt)]
      });
      return allSuppliers;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching suppliers:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch suppliers: ${errorMessage}`
      });
    }
  }
  if (method === "POST") {
    const body = await readBody(event);
    const validation = createSupplierSchema.safeParse(body);
    if (!validation.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid supplier data",
        data: validation.error.flatten()
      });
    }
    try {
      const newSupplier = await db.insert(suppliers).values(validation.data).returning();
      return newSupplier[0];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error creating supplier:", error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create supplier: ${errorMessage}`
      });
    }
  }
  throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
});
