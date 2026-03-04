<script setup lang="ts">
interface FilterOption {
  id: string
  label: string
  checked: boolean
}

interface Props {
  categories: FilterOption[]
  algorithms: FilterOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [filters: { categories: string[]; algorithms: string[] }]
  reset: []
}>()

const selectedCategories = computed(() =>
  props.categories.filter(c => c.checked).map(c => c.id)
)

const selectedAlgorithms = computed(() =>
  props.algorithms.filter(a => a.checked).map(a => a.id)
)

const toggleCategory = (id: string) => {
  const category = props.categories.find(c => c.id === id)
  if (category) {
    category.checked = !category.checked
    emitUpdate()
  }
}

const toggleAlgorithm = (id: string) => {
  const algorithm = props.algorithms.find(a => a.id === id)
  if (algorithm) {
    algorithm.checked = !algorithm.checked
    emitUpdate()
  }
}

const emitUpdate = () => {
  emit('update', {
    categories: selectedCategories.value,
    algorithms: selectedAlgorithms.value
  })
}

const resetFilters = () => {
  props.categories.forEach(c => c.checked = false)
  props.algorithms.forEach(a => a.checked = false)
  emit('reset')
}

const hasActiveFilters = computed(() =>
  selectedCategories.value.length > 0 || selectedAlgorithms.value.length > 0
)
</script>

<template>
  <aside class="w-64 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Filters
      </h2>
      <button
        v-if="hasActiveFilters"
        class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Categories
        </h3>
        <div class="space-y-2">
          <label
            v-for="category in categories"
            :key="category.id"
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              :checked="category.checked"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              @change="toggleCategory(category.id)"
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ category.label }}
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Algorithms
        </h3>
        <div class="space-y-2">
          <label
            v-for="algorithm in algorithms"
            :key="algorithm.id"
            class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
          >
            <input
              type="checkbox"
              :checked="algorithm.checked"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              @change="toggleAlgorithm(algorithm.id)"
            >
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ algorithm.label }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </aside>
</template>
