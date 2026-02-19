import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~~/server/db";
import { customers } from "~~/server/db/schemas";
const updateCustomerSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional()
});
export default defineEventHandler(async (event) => {
  const customerId = event.context.params?.id;
  if (!customerId) {
    throw createError({ statusCode: 400, statusMessage: "Customer ID is required" });
  }
  const body = await readBody(event);
  const validation = updateCustomerSchema.safeParse(body);
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid customer data",
      data: validation.error.flatten()
    });
  }
  try {
    const updatedCustomer = await db.update(customers).set({ ...validation.data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customers.id, customerId)).returning();
    if (updatedCustomer.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }
    return updatedCustomer[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error updating customer ${customerId}:`, error);
    if (errorMessage.includes("duplicate key value violates unique constraint")) {
      throw createError({
        statusCode: 409,
        statusMessage: "A customer with this email already exists."
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update customer: ${errorMessage}`
    });
  }
});
