export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.productId || !body.type || !body.quantity || !body.reason) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields"
    });
  }
  const stockMovement = {
    id: `movement_${Date.now()}`,
    productId: body.productId,
    type: body.type,
    quantity: body.quantity,
    reason: body.reason,
    reference: body.reference,
    userId: "user_001",
    // In real app, get from auth
    createdAt: /* @__PURE__ */ new Date()
  };
  if (process.env.NODE_ENV === "development") {
    console.log("Stock movement created:", stockMovement);
  }
  return {
    success: true,
    data: stockMovement
  };
});
