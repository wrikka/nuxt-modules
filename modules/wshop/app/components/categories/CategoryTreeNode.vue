<script setup lang="ts">
import type { CategoryTree } from '~~/shared/types'

const props = defineProps<{
  category: CategoryTree
  level: number
}>()

const emit = defineEmits<{
  (e: 'edit', category: CategoryTree): void
  (e: 'delete', category: CategoryTree): void
  (e: 'toggle', category: CategoryTree): void
  (e: 'add-child', category: CategoryTree): void
}>()

const isOpen = ref(true)

const handleEdit = () => {
  emit('edit', props.category)
}

const handleDelete = () => {
  emit('delete', props.category)
}

const handleToggle = () => {
  emit('toggle', props.category)
}

const handleAddChild = () => {
  emit('add-child', props.category)
}
</script>

<template>
  <div :style="{ marginLeft: `${level * 20}px` }">
    <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100">
      <div class="flex items-center">
        <button v-if="category.children.length > 0" @click="isOpen = !isOpen" class="mr-2">
          <Icon :name="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'" class="w-5 h-5" />
        </button>
        <div v-else class="w-5 h-5 mr-2"></div>
        <span>{{ category.name }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="handleToggle" class="p-1">
          <Icon :name="category.isActive ? 'mdi:toggle-switch-outline' : 'mdi:toggle-switch-off-outline'" class="w-5 h-5" :class="category.isActive ? 'text-green-500' : 'text-gray-400'" />
        </button>
        <button @click="handleAddChild" class="p-1 text-gray-500 hover:text-blue-600">
          <Icon name="mdi:plus" class="w-5 h-5" />
        </button>
        <button @click="handleEdit" class="p-1 text-gray-500 hover:text-indigo-600">
          <Icon name="mdi:pencil" class="w-5 h-5" />
        </button>
        <button @click="handleDelete" class="p-1 text-gray-500 hover:text-red-600">
          <Icon name="mdi:trash-can-outline" class="w-5 h-5" />
        </button>
      </div>
    </div>
    <div v-if="isOpen && category.children.length > 0" class="mt-1">
      <CategoryTreeNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :level="level + 1"
        @edit="(cat) => emit('edit', cat)"
        @delete="(cat) => emit('delete', cat)"
        @toggle="(cat) => emit('toggle', cat)"
        @add-child="(cat) => emit('add-child', cat)"
      />
    </div>
  </div>
</template>
