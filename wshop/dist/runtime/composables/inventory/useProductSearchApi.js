export function useProductSearchApi() {
  const searchProducts = async (options) => {
    return await $fetch("/api/products/search", {
      method: "GET",
      query: options
    });
  };
  const fetchCategories = async () => {
    return await $fetch("/api/categories");
  };
  const getProductSuggestions = async (query) => {
    return await $fetch("/api/products/suggestions", {
      method: "GET",
      query: { q: query, limit: 10 }
    });
  };
  const getPopularProducts = async (limit = 10) => {
    return await $fetch("/api/products/popular", {
      method: "GET",
      query: { limit }
    });
  };
  const getRelatedProducts = async (productId, limit = 5) => {
    return await $fetch(`/api/products/${productId}/related`, {
      method: "GET",
      query: { limit }
    });
  };
  return {
    searchProducts,
    fetchCategories,
    getProductSuggestions,
    getPopularProducts,
    getRelatedProducts
  };
}
