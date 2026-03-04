<script setup lang="ts">
import { ref } from 'vue'

interface Column {
  id: string
  title: string
  items: Item[]
}

interface Item {
  id: string
  title: string
  description?: string
  tags?: string[]
  assignee?: { src?: string; name: string }
}

interface Props {
  columns: Column[]
  draggable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  draggable: true
})

const emit = defineEmits<{
  'moveItem': [itemId: string, fromColumn: string, toColumn: string]
  'addItem': [columnId: string]
  'editItem': [item: Item]
  'deleteItem': [itemId: string]
}>()

const draggedItem = ref<{ item: Item; columnId: string } | null>(null)

defineExpose({ columns: props.columns })
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <div
      v-for="column in columns"
      :key="column.id"
      class="w-72 shrink-0 rounded-lg bg-gray-100 p-3"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-semibold text-gray-700">{{ column.title }}</h3>
        <span class="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
          {{ column.items.length }}
        </span>
      </div>
      
      <div class="space-y-2">
        <div
          v-for="item in column.items"
          :key="item.id"
          class="cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          draggable="true"
          @dragstart="draggedItem = { item, columnId: column.id }"
          @dragover.prevent
          @drop="$emit('moveItem', draggedItem!.item.id, draggedItem!.columnId, column.id)"
          @click="$emit('editItem', item)"
        >
          <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
          <p v-if="item.description" class="mt-1 text-sm text-gray-500 line-clamp-2">
            {{ item.description }}
          </p>
          
          <div v-if="item.tags" class="mt-2 flex flex-wrap gap-1">
            <Badge
              v-for="tag in item.tags"
              :key="tag"
              size="sm"
              variant="secondary"
            >
              {{ tag }}
            </Badge>
          </div>
          
          <div v-if="item.assignee" class="mt-3 flex items-center gap-2">
            <Avatar
              :src="item.assignee.src"
              :alt="item.assignee.name"
              :fallback="item.assignee.name.charAt(0)"
              size="sm"
            />
            <span class="text-xs text-gray-500">{{ item.assignee.name }}</span>
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        class="mt-2 w-full justify-center text-gray-500"
        @click="$emit('addItem', column.id)"
      >
        <span class="i-lucide-plus mr-1" />
        Add item
      </Button>
    </div>
  </div>
</template>
