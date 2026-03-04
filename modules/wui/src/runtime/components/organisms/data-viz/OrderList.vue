<script setup lang="ts">
interface Item {
  id: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: Item[]
  drag?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  drag: true
})

const emit = defineEmits<{
  'update:modelValue': [items: Item[]]
  reorder: [items: Item[]]
}>()

const items = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const moveUp = (index: number) => {
  if (index <= 0) return
  const newItems = [...items.value]
  const temp = newItems[index]
  newItems[index] = newItems[index - 1]
  newItems[index - 1] = temp
  items.value = newItems
  emit('reorder', newItems)
}

const moveDown = (index: number) => {
  if (index >= items.value.length - 1) return
  const newItems = [...items.value]
  const temp = newItems[index]
  newItems[index] = newItems[index + 1]
  newItems[index + 1] = temp
  items.value = newItems
  emit('reorder', newItems)
}

const moveToTop = (index: number) => {
  if (index <= 0) return
  const newItems = [...items.value]
  const [item] = newItems.splice(index, 1)
  newItems.unshift(item)
  items.value = newItems
  emit('reorder', newItems)
}

const moveToBottom = (index: number) => {
  if (index >= items.value.length - 1) return
  const newItems = [...items.value]
  const [item] = newItems.splice(index, 1)
  newItems.push(item)
  items.value = newItems
  emit('reorder', newItems)
}

const onDragStart = (index: number) => {
  draggingIndex.value = index
}

const onDragOver = (index: number) => {
  dragOverIndex.value = index
}

const onDrop = (targetIndex: number) => {
  if (draggingIndex.value === null || draggingIndex.value === targetIndex) {
    draggingIndex.value = null
    dragOverIndex.value = null
    return
  }

  const newItems = [...items.value]
  const [item] = newItems.splice(draggingIndex.value, 1)
  newItems.splice(targetIndex, 0, item)
  items.value = newItems
  emit('reorder', newItems)

  draggingIndex.value = null
  dragOverIndex.value = null
}

const onDragEnd = () => {
  draggingIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="flex items-center gap-2 border-b border-gray-100 px-4 py-2 last:border-0"
      :class="{
        'bg-blue-50': dragOverIndex === index && draggingIndex !== index,
        'opacity-50': draggingIndex === index
      }"
      :draggable="drag && !item.disabled"
      @dragstart="onDragStart(index)"
      @dragover.prevent="onDragOver(index)"
      @drop.prevent="onDrop(index)"
      @dragend="onDragEnd"
    >
      <button
        v-if="drag"
        type="button"
        class="cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
      >
        <span class="i-lucide-grip-vertical size-4" />
      </button>

      <span class="flex-1" :class="{ 'opacity-50': item.disabled }">{{ item.label }}</span>

      <div class="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          :disabled="index === 0 || item.disabled"
          @click="moveToTop(index)"
        >
          <span class="i-lucide-chevrons-up size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="index === 0 || item.disabled"
          @click="moveUp(index)"
        >
          <span class="i-lucide-chevron-up size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="index === items.length - 1 || item.disabled"
          @click="moveDown(index)"
        >
          <span class="i-lucide-chevron-down size-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          :disabled="index === items.length - 1 || item.disabled"
          @click="moveToBottom(index)"
        >
          <span class="i-lucide-chevrons-down size-4" />
        </Button>
      </div>
    </div>

    <div v-if="items.length === 0" class="p-4 text-center text-gray-500">
      No items
    </div>
  </div>
</template>
