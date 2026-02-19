export function useProductApi() {
  const fetchProducts = async () => {
    return await $fetch("/api/products");
  };
  const deleteProduct = async (id) => {
    return await $fetch(`/api/products/${id}`, { method: "GET" });
  };
  const fetchProductById = async (id) => {
    return await $fetch(`/api/products/${id}`);
  };
  return {
    fetchProducts,
    deleteProduct,
    fetchProductById
  };
}
