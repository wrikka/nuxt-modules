import { computed, onMounted, ref } from "vue";
import { useCategoryApi } from "./useCategoryApi.js";
import { useCategoryUtils } from "./useCategoryUtils.js";
export function useCategories() {
  const categories = ref([]);
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const {
    fetchCategories,
    createCategory: apiCreateCategory,
    updateCategory: apiUpdateCategory,
    deleteCategory: apiDeleteCategory,
    bulkUpdateCategories: apiBulkUpdateCategories,
    reorderCategories: apiReorderCategories,
    exportCategories: apiExportCategories,
    importCategories: apiImportCategories,
    getProductCount: apiGetProductCount
  } = useCategoryApi();
  const {
    getCategoryById: utilsGetCategoryById,
    getCategoryPath: utilsGetCategoryPath,
    getChildCategories: utilsGetChildCategories,
    getDescendantCategories: utilsGetDescendantCategories,
    buildCategoryTree: utilsBuildCategoryTree,
    searchCategories: utilsSearchCategories,
    canDeleteCategory: utilsCanDeleteCategory,
    getCategoryStats: utilsGetCategoryStats
  } = useCategoryUtils();
  const activeCategories = computed(() => categories.value.filter((cat) => cat.isActive));
  const rootCategories = computed(() => categories.value.filter((cat) => !cat.parentId));
  const categoryTree = computed(() => utilsBuildCategoryTree(categories.value));
  const loadCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      categories.value = await fetchCategories();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load categories";
    } finally {
      loading.value = false;
    }
  };
  const createCategory = async (categoryData) => {
    processing.value = true;
    error.value = null;
    try {
      const newCategory = await apiCreateCategory(categoryData);
      categories.value.push(newCategory);
      return newCategory;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create category";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const updateCategory = async (id, updates) => {
    processing.value = true;
    error.value = null;
    try {
      const updatedCategory = await apiUpdateCategory(id, updates);
      const index = categories.value.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }
      return updatedCategory;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update category";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const deleteCategory = async (id) => {
    processing.value = true;
    error.value = null;
    try {
      await apiDeleteCategory(id);
      categories.value = categories.value.filter((cat) => cat.id !== id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete category";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const bulkUpdateCategories = async (updates) => {
    processing.value = true;
    error.value = null;
    try {
      await apiBulkUpdateCategories(updates);
      await loadCategories();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to bulk update categories";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const reorderCategories = async (categoryIds) => {
    processing.value = true;
    error.value = null;
    try {
      await apiReorderCategories(categoryIds);
      await loadCategories();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to reorder categories";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const exportCategories = async (format = "csv") => {
    try {
      const response = await apiExportCategories(format);
      const blob = new Blob([response], {
        type: format === "csv" ? "text/csv" : "application/json"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `categories.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to export categories";
      throw err;
    }
  };
  const importCategories = async (file) => {
    processing.value = true;
    error.value = null;
    try {
      const newCategories = await apiImportCategories(file);
      categories.value.push(...newCategories);
      return newCategories;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to import categories";
      throw err;
    } finally {
      processing.value = false;
    }
  };
  const getCategoryById = (id) => utilsGetCategoryById(categories.value, id);
  const getCategoryPath = (categoryId) => utilsGetCategoryPath(categories.value, categoryId);
  const getChildCategories = (parentId) => utilsGetChildCategories(categories.value, parentId);
  const getDescendantCategories = (parentId) => utilsGetDescendantCategories(categories.value, parentId);
  const getProductCount = async (categoryId) => {
    return await apiGetProductCount(categoryId);
  };
  const canDeleteCategory = (categoryId) => utilsCanDeleteCategory(categories.value, categoryId);
  const searchCategories = (query) => utilsSearchCategories(categories.value, query);
  const getCategoryStats = () => utilsGetCategoryStats(categories.value);
  onMounted(loadCategories);
  return {
    categories,
    loading,
    processing,
    error,
    activeCategories,
    rootCategories,
    categoryTree,
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkUpdateCategories,
    reorderCategories,
    exportCategories,
    importCategories,
    getCategoryById,
    getCategoryPath,
    getChildCategories,
    getDescendantCategories,
    getProductCount,
    canDeleteCategory,
    searchCategories,
    getCategoryStats
  };
}
