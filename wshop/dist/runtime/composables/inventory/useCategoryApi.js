export function useCategoryApi() {
  const handleApiError = (err, defaultMessage) => {
    const error = err;
    const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage);
    console.error(defaultMessage, err);
    return message;
  };
  const fetchCategories = async () => {
    try {
      return await $fetch("/api/categories");
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to load categories"));
    }
  };
  const createCategory = async (categoryData) => {
    try {
      return await $fetch("/api/categories", {
        method: "post",
        body: categoryData
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to create category"));
    }
  };
  const updateCategory = async (id, updates) => {
    try {
      return await $fetch(`/api/categories/${id}`, {
        method: "put",
        body: updates
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to update category"));
    }
  };
  const deleteCategory = async (id) => {
    try {
      await $fetch(`/api/categories/${id}`, { method: "delete" });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to delete category"));
    }
  };
  const bulkUpdateCategories = async (updates) => {
    try {
      return await $fetch("/api/categories/bulk-update", {
        method: "put",
        body: { updates }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to bulk update categories"));
    }
  };
  const reorderCategories = async (categoryIds) => {
    try {
      return await $fetch("/api/categories/reorder", {
        method: "put",
        body: { categoryIds }
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to reorder categories"));
    }
  };
  const exportCategories = async (format = "csv") => {
    try {
      return await $fetch(`/api/categories/export?format=${format}`);
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to export categories"));
    }
  };
  const importCategories = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      return await $fetch("/api/categories/import", {
        method: "post",
        body: formData
      });
    } catch (err) {
      throw new Error(handleApiError(err, "Failed to import categories"));
    }
  };
  const getProductCount = async (categoryId) => {
    try {
      const response = await $fetch(
        `/api/categories/${categoryId}/products/count`
      );
      return response.count;
    } catch (err) {
      console.error("Failed to get product count:", err);
      return 0;
    }
  };
  return {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
    reorderCategories,
    exportCategories,
    importCategories,
    getProductCount
  };
}
