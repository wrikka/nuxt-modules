<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: string | number
  [key: string]: unknown
}

interface Props {
  modelValue: Item[]
  itemKey?: string
  handle?: string
  ghostClass?: string
  chosenClass?: string
  dragClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  itemKey: 'id',
  handle: undefined,
  ghostClass: 'opacity-50',
  chosenClass: 'bg-blue-50',
  dragClass: 'cursor-grabbing'
})

const emit = defineEmits<{
  'update:modelValue': [value: Item[]]
  start: [item: Item, index: number]
  end: [item: Item, newIndex: number, oldIndex: number]
}>()

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onDragStart = (e: DragEvent, item: Item, index: number) => {
  dragIndex.value = index
  e.dataTransfer?.setData('text/plain', String(index))
  e.dataTransfer!.effectAllowed = 'move'
  emit('start', item, index)
  ;(e.target as HTMLElement).classList.add(dragClass)
}

const onDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const onDrop = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (dragIndex.value === null || dragIndex.value === index) return
  
  const newList = [...props.modelValue]
  const [moved] = newList.splice(dragIndex.value, 1)
  newList.splice(index, 0, moved)
  
  emit('update:modelValue', newList)
  emit('end', moved, index, dragIndex.value)
  
  dragIndex.value = null
  dragOverIndex.value = null
}

const onDragEnd = (e: DragEvent) => {
  ;(e.target as HTMLElement).classList.remove(dragClass)
  dragIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="space-y-1">
    <div
      v-for="(item, index) in modelValue"
      :key="item[itemKey]"
      class="relative transition-colors"
      :class="[
        dragOverIndex === index && dragIndex !== index ? chosenClass : '',
        dragIndex === index ? ghostClass : ''
      ]"
      draggable="true"
      @dragstart="onDragStart($event, item, index)"
      @dragover="onDragOver($event, index)"
      @drop="onDrop($event, index)"
      @dragend="onDragEnd"
    >
      <slot :item="item" :index="index" :is-dragging="dragIndex === index">
        <div class="flex items-center gap-2 rounded border p-2">
          <span class="i-lucide-grip-vertical cursor-grab text-gray-400" />
          {{ item[itemKey] }}
        </div>
      </slot>
    </div>
  </div>
</template>
