import { and, eq } from "drizzle-orm";
import { db } from "~~/server/db/index";
import { digitalProductFiles, orderItems, orders } from "~~/server/db/schemas";
export default defineEventHandler(async (event) => {
  const productId = event.context.params?.productId;
  const fileId = event.context.params?.fileId;
  if (!productId || !fileId) {
    throw createError({ statusCode: 400, statusMessage: "Product ID and File ID are required" });
  }
  const customerId = event.context.customer?.id;
  if (!customerId) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  const hasPurchased = await db.query.orders.findFirst({
    where: and(
      eq(orders.paymentStatus, "paid"),
      eq(orders.customerId, customerId)
    ),
    with: {
      items: {
        where: eq(orderItems.productId, productId)
      }
    }
  });
  if (!hasPurchased || hasPurchased.items.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "You do not have permission to download this file."
    });
  }
  const file = await db.query.digitalProductFiles.findFirst({
    where: and(
      eq(digitalProductFiles.id, fileId),
      eq(digitalProductFiles.productId, productId)
    )
  });
  if (!file) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }
  return { downloadUrl: file.fileUrl };
});
