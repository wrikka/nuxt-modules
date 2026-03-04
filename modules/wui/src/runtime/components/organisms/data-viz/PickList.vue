<script setup lang="ts">
interface Item {
  id: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: Item[]
  options: Item[]
  sourceHeader?: string
  targetHeader?: string
  filter?: boolean
  filterPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  sourceHeader: 'Available',
  targetHeader: 'Selected',
  filter: true,
  filterPlaceholder: 'Search...'
})

const emit = defineEmits<{
  'update:modelValue': [items: Item[]]
}>()

const selected = ref<Set<string | number>>(new Set())
const sourceFilter = ref('')
const targetFilter = ref('')

const selectedItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const sourceItems = computed(() => {
  const selectedIds = new Set(selectedItems.value.map(i => i.id))
  return props.options.filter(item => !selectedIds.has(item.id))
})

const filteredSourceItems = computed(() => {
  if (!sourceFilter.value) return sourceItems.value
  return sourceItems.value.filter(item =>
    item.label.toLowerCase().includes(sourceFilter.value.toLowerCase())
  )
})

const filteredTargetItems = computed(() => {
  if (!targetFilter.value) return selectedItems.value
  return selectedItems.value.filter(item =>
    item.label.toLowerCase().includes(targetFilter.value.toLowerCase())
  )
})

const moveToTarget = () => {
  const itemsToMove = sourceItems.value.filter(item => selected.value.has(item.id))
  selectedItems.value = [...selectedItems.value, ...itemsToMove]
  selected.value = new Set()
}

const moveToSource = () => {
  selectedItems.value = selectedItems.value.filter(item => !selected.value.has(item.id))
  selected.value = new Set()
}

const moveAllToTarget = () => {
  selectedItems.value = [...props.options]
}

const moveAllToSource = () => {
  selectedItems.value = []
  selected.value = new Set()
}

const toggleSelection = (id: string | number) => {
  if (selected.value.has(id)) {
    selected.value.delete(id)
  } else {
    selected.value.add(id)
  }
}

const moveUp = () => {
  const indices = selectedItems.value
    .map((item, index) => selected.value.has(item.id) ? index : -1)
    .filter(i => i > 0)
  
  indices.forEach(index => {
    const temp = selectedItems.value[index]
    selectedItems.value[index] = selectedItems.value[index - 1]
    selectedItems.value[index - 1] = temp
  })
}

const moveDown = () => {
  const indices = selectedItems.value
    .map((item, index) => selected.value.has(item.id) ? index : -1)
    .filter(i => i >= 0 && i < selectedItems.value.length - 1)
    .reverse()
  
  indices.forEach(index => {
    const temp = selectedItems.value[index]
    selectedItems.value[index] = selectedItems.value[index + 1]
    selectedItems.value[index + 1] = temp
  })
}
</script>

<template>
  <div class="flex items-stretch gap-2">
    <div class="flex-1 rounded-lg border border-gray-200 bg-white">
      <div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <h3 class="font-medium">{{ sourceHeader }}</h3>
      </div>
      <div v-if="filter" class="p-2">
        <Input
          v-model="sourceFilter"
          :placeholder="filterPlaceholder"
          size="sm"
        />
      </div>
      <div class="max-h-60 overflow-auto">
        <div
          v-for="item in filteredSourceItems"
          :key="item.id"
          class="cursor-pointer px-4 py-2 hover:bg-gray-100"
          :class="{ 'bg-blue-50': selected.has(item.id), 'opacity-50': item.disabled }"
          @click="!item.disabled && toggleSelection(item.id)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center gap-2">
      <Button size="sm" @click="moveAllToTarget">
        <span class="i-lucide-chevrons-right size-4" />
      </Button>
      <Button size="sm" @click="moveToTarget">
        <span class="i-lucide-chevron-right size-4" />
      </Button>
      <Button size="sm" @click="moveToSource">
        <span class="i-lucide-chevron-left size-4" />
      </Button>
      <Button size="sm" @click="moveAllToSource">
        <span class="i-lucide-chevrons-left size-4" />
      </Button>
    </div>

    <div class="flex-1 rounded-lg border border-gray-200 bg-white">
      <div class="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <h3 class="font-medium">{{ targetHeader }}</h3>
      </div>
      <div v-if="filter" class="p-2">
        <Input
          v-model="targetFilter"
          :placeholder="filterPlaceholder"
          size="sm"
        />
      </div>
      <div class="max-h-60 overflow-auto">
        <div
          v-for="item in filteredTargetItems"
          :key="item.id"
          class="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
          :class="{ 'bg-blue-50': selected.has(item.id) }"
          @click="toggleSelection(item.id)"
        >
          {{ item.label }}
          <span
            v-if="selected.has(item.id)"
            class="i-lucide-grip-vertical size-4 text-gray-400"
          />
        </div>
      </div>
      <div class="flex justify-center gap-1 border-t border-gray-100 p-2">
        <Button size="sm" variant="ghost" @click="moveUp">
          <span class="i-lucide-arrow-up size-4" />
        </Button>
        <Button size="sm" variant="ghost" @click="moveDown">
          <span class="i-lucide-arrow-down size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
