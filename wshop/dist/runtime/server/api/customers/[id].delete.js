import { eq } from "drizzle-orm";
import { db } from "~~/server/db";
import { customers } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const customerId = event.context.params?.id;
  if (!customerId) {
    throw createError({ statusCode: 400, statusMessage: "Customer ID is required" });
  }
  try {
    const deletedCustomer = await db.delete(customers).where(eq(customers.id, customerId)).returning();
    if (deletedCustomer.length === 0) {
      throw createError({ statusCode: 404, statusMessage: "Customer not found" });
    }
    return { success: true, message: `Customer ${customerId} deleted` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error deleting customer ${customerId}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to delete customer: ${errorMessage}`
    });
  }
});
