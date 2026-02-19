<script setup>
import CategoryTreeNode from "./CategoryTreeNode.vue";
import CategoryForm from "./CategoryForm.vue";
import CategoryDeleteConfirm from "./CategoryDeleteConfirm.vue";
import CategoryList from "./CategoryList.vue";
import { useCategories } from "~/composables/inventory/useCategories";
const {
  categories,
  loading,
  processing,
  loadCategories,
  createCategory,
  updateCategory,
  deleteCategory: removeCategory,
  getCategoryTree,
  getProductCount
} = useCategories();
const searchQuery = ref("");
const viewMode = ref("tree");
const showCategoryForm = ref(false);
const showDeleteConfirm = ref(false);
const editingCategory = ref(null);
const deletingCategory = ref(null);
const categoryFormData = ref({});
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(
    (category) => category.name.toLowerCase().includes(query) || category.description && category.description.toLowerCase().includes(query)
  );
});
const filteredCategoriesTree = computed(() => {
  if (!searchQuery.value) return getCategoryTree();
  const query = searchQuery.value.toLowerCase();
  const filterTree = (categories2) => {
    return categories2.reduce((acc, category) => {
      const matchesSearch = category.name.toLowerCase().includes(query) || category.description && category.description.toLowerCase().includes(query);
      const filteredChildren = filterTree(category.children);
      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({ ...category, children: filteredChildren });
      }
      return acc;
    }, []);
  };
  return filterTree(getCategoryTree());
});
const parentCategories = computed(() => {
  return categories.value.filter(
    (cat) => !editingCategory.value || cat.id !== editingCategory.value.id
  );
});
const getParentCategoryName = (parentId) => {
  if (!parentId) return "-";
  const parent = categories.value.find((cat) => cat.id === parentId);
  return parent?.name || "\u0E44\u0E21\u0E48\u0E1E\u0E1A";
};
const openAddCategoryForm = () => {
  editingCategory.value = null;
  categoryFormData.value = {
    name: "",
    description: "",
    parentId: null,
    image: "",
    isActive: true
  };
  showCategoryForm.value = true;
};
const openEditCategoryForm = (category) => {
  editingCategory.value = category;
  categoryFormData.value = { ...category };
  showCategoryForm.value = true;
};
const openDeleteConfirm = (category) => {
  deletingCategory.value = category;
  showDeleteConfirm.value = true;
};
const confirmDelete = async () => {
  if (deletingCategory.value) {
    await removeCategory(deletingCategory.value.id);
    showDeleteConfirm.value = false;
    deletingCategory.value = null;
  }
};
const addChildCategory = (parentCategory) => {
  editingCategory.value = null;
  categoryFormData.value = {
    name: "",
    description: "",
    parentId: parentCategory.id,
    image: "",
    isActive: true
  };
  showCategoryForm.value = true;
};
const toggleCategory = async (category) => {
  await updateCategory(category.id, {
    isActive: !category.isActive
  });
};
const saveCategory = async (categoryData) => {
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, categoryData);
    } else {
      await createCategory(categoryData);
    }
    showCategoryForm.value = false;
  } catch (_error) {
  }
};
onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">จัดการหมวดหมู่สินค้า</h2>
      <button
        @click="openAddCategoryForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Icon name="mdi:plus" class="w-4 h-4 inline mr-2" />
        เพิ่มหมวดหมู่
      </button>
    </div>

    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="viewMode = 'tree'"
          :class="['px-3 py-2 rounded-lg text-sm font-medium', viewMode === 'tree' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
        >
          <Icon name="mdi:tree-outline" class="w-4 h-4 inline mr-1" />
          แบบต้นไม้
        </button>
        <button
          @click="viewMode = 'list'"
          :class="['px-3 py-2 rounded-lg text-sm font-medium', viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
        >
          <Icon name="mdi:format-list-bulleted" class="w-4 h-4 inline mr-1" />
          แบบรายการ
        </button>
      </div>
    </div>

    <div class="mb-6">
      <div class="relative">
        <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาหมวดหมู่..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div v-if="viewMode === 'tree'" class="space-y-2">
      <CategoryTreeNode
        v-for="category in filteredCategoriesTree"
        :key="category.id"
        :category="category"
        :level="0"
        @edit="openEditCategoryForm"
        @delete="openDeleteConfirm"
        @toggle="toggleCategory"
        @add-child="addChildCategory"
      />
    </div>

    <CategoryList
      v-else
      :categories="filteredCategories"
      :get-product-count="getProductCount"
      :get-parent-category-name="getParentCategoryName"
      @edit="openEditCategoryForm"
      @delete="openDeleteConfirm"
    />

    <CategoryForm
      v-model="showCategoryForm"
      :category="categoryFormData"
      :parent-categories="parentCategories"
      :processing="processing"
      @save="saveCategory"
    />

    <CategoryDeleteConfirm
      v-model="showDeleteConfirm"
      :category="deletingCategory"
      @confirm="confirmDelete"
    />
  </div>
</template>
