export default defineEventHandler(async (event) => {
  const promotionId = parseInt(getRouterParam(event, "id"));
  const body = await readBody(event);
  if (isNaN(promotionId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid promotion ID"
    });
  }
  try {
    const promotions = await $fetch("/api/promotions");
    const promotionIndex = promotions.findIndex((p) => p.id === promotionId);
    if (promotionIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion not found"
      });
    }
    const existingPromotion = promotions[promotionIndex];
    if (!existingPromotion) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion not found"
      });
    }
    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      if (start >= end) {
        throw createError({
          statusCode: 400,
          statusMessage: "End date must be after start date"
        });
      }
    }
    if (body.discountValue !== void 0) {
      if (body.type === "percentage" && (body.discountValue > 100 || body.discountValue < 0)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Percentage discount must be between 0 and 100"
        });
      }
      if (body.type === "fixed" && body.discountValue < 0) {
        throw createError({
          statusCode: 400,
          statusMessage: "Fixed discount must be non-negative"
        });
      }
    }
    const updatedPromotion = {
      ...existingPromotion,
      ...body,
      id: promotionId,
      // Ensure ID doesn't change
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (body.startDate || body.endDate) {
      const now = /* @__PURE__ */ new Date();
      const start = new Date(body.startDate || existingPromotion.startDate);
      const end = new Date(body.endDate || existingPromotion.endDate);
      if (now >= start && now <= end) {
        updatedPromotion.status = "active";
      } else if (now < start) {
        updatedPromotion.status = "scheduled";
      } else {
        updatedPromotion.status = "inactive";
      }
    }
    console.log("Updated promotion:", updatedPromotion);
    return updatedPromotion;
  } catch (error) {
    console.error("Failed to update promotion:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update promotion"
    });
  }
});
