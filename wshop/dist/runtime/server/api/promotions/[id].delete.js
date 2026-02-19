export default defineEventHandler(async (event) => {
  const promotionId = parseInt(getRouterParam(event, "id"));
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
    const promotion = promotions[promotionIndex];
    if (!promotion) {
      throw createError({
        statusCode: 404,
        statusMessage: "Promotion not found"
      });
    }
    if (promotion.status === "active") {
      throw createError({
        statusCode: 400,
        statusMessage: "Cannot delete active promotion. Please deactivate it first."
      });
    }
    console.log("Deleted promotion:", promotions[promotionIndex]);
    return {
      success: true,
      message: "Promotion deleted successfully"
    };
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete promotion"
    });
  }
});
