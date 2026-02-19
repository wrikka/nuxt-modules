export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, "id");
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid product ID"
    });
  }
  const query = getQuery(event);
  const limit = Math.min(20, Math.max(1, parseInt(query.limit) || 5));
  try {
    const products = await $fetch("/api/products");
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found"
      });
    }
    const relatedProducts = products.filter((p) => p.id !== productId).filter((p) => {
      const currentPrice = Number(currentProduct.price);
      const productPrice = Number(p.price);
      if (isNaN(currentPrice) || isNaN(productPrice)) return false;
      const priceDiff = Math.abs(productPrice - currentPrice);
      return priceDiff <= currentPrice * 0.5 || p.status === currentProduct.status;
    }).slice(0, limit);
    return relatedProducts;
  } catch (error) {
    console.error("Failed to get related products:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to get related products"
    });
  }
});
