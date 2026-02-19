<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotificationCategories } from '../composables/useNotificationCategories';

const {
  getCategories,
  addCategory,
  deleteCategory,
} = useNotificationCategories();

const categories = computed(() => getCategories());
const showAddDialog = ref(false);
const newCategoryName = ref('');
const newCategoryIcon = ref('');
const newCategoryColor = ref('blue');

const handleAddCategory = () => {
  if (newCategoryName.value.trim()) {
    addCategory({
      id: `cat-${Date.now()}`,
      name: newCategoryName.value.trim(),
      icon: newCategoryIcon.value || 'i-heroicons-bell',
      color: newCategoryColor.value,
      description: 'Custom category',
    });
    newCategoryName.value = '';
    newCategoryIcon.value = '';
    newCategoryColor.value = 'blue';
    showAddDialog.value = false;
  }
};

const handleDeleteCategory = (id: string) => {
  deleteCategory(id);
};
</script>

<template>
  <div class="space-y-6 p-6">
    <h2 class="text-2xl font-bold">Notification Categories</h2>

    <!-- Categories List -->
    <div class="space-y-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
      >
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full"
          :class="{
            'bg-red-100 text-red-600 dark:bg-red-900/30': category.color === 'red',
            'bg-blue-100 text-blue-600 dark:bg-blue-900/30': category.color === 'blue',
            'bg-green-100 text-green-600 dark:bg-green-900/30': category.color === 'green',
            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30': category.color === 'yellow',
            'bg-purple-100 text-purple-600 dark:bg-purple-900/30': category.color === 'purple',
            'bg-gray-100 text-gray-600 dark:bg-gray-800': !category.color || category.color === 'gray',
          }"
        >
          <div v-if="category.icon" :class="category.icon" class="h-6 w-6" />
          <div v-else class="i-heroicons-bell h-6 w-6" />
        </div>

        <div class="flex-1">
          <div class="font-semibold">{{ category.name }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ category.description || 'No description' }}
          </div>
          <div v-if="category.types" class="mt-1 flex gap-1">
            <span
              v-for="type in category.types"
              :key="type"
              class="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800"
            >
              {{ type }}
            </span>
          </div>
        </div>

        <button
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          @click="handleDeleteCategory(category.id)"
        >
          <div class="i-heroicons-trash h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Add Category Button -->
    <button
      class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-gray-600 hover:border-blue-500 hover:text-blue-500 dark:border-gray-700 dark:text-gray-400"
      @click="showAddDialog = true"
    >
      <div class="i-heroicons-plus h-5 w-5" />
      Add Category
    </button>

    <!-- Add Category Dialog -->
    <Transition name="fade">
      <div
        v-if="showAddDialog"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click="showAddDialog = false"
      >
        <div
          class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          @click.stop
        >
          <h3 class="mb-4 text-lg font-semibold">Add Category</h3>

          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Name</label>
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="Category name"
                class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Icon</label>
              <input
                v-model="newCategoryIcon"
                type="text"
                placeholder="i-heroicons-bell"
                class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium">Color</label>
              <select
                v-model="newCategoryColor"
                class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
                <option value="gray">Gray</option>
              </select>
            </div>
          </div>

          <div class="mt-6 flex gap-2">
            <button
              class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              @click="showAddDialog = false"
            >
              Cancel
            </button>
            <button
              class="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              @click="handleAddCategory"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
