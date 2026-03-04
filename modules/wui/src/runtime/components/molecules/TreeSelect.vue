<script setup lang="ts">
interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
  icon?: string
}

interface Props {
  modelValue?: string | number | null
  options: TreeNode[]
  placeholder?: string
  clearable?: boolean
  filter?: boolean
  filterPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select...',
  clearable: true,
  filter: true,
  filterPlaceholder: 'Search...'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [node: TreeNode | null]
}>()

const isOpen = ref(false)
const filterText = ref('')
const containerRef = ref<HTMLDivElement>()

const selectedNode = computed(() => {
  const findNode = (nodes: TreeNode[], id: string | number): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }
  return props.modelValue ? findNode(props.options, props.modelValue) : null
})

const filteredOptions = computed(() => {
  if (!filterText.value) return props.options

  const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.reduce((acc: TreeNode[], node) => {
      const matches = node.label.toLowerCase().includes(filterText.value.toLowerCase())
      const filteredChildren = node.children ? filterNodes(node.children) : []

      if (matches || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : undefined
        })
      }
      return acc
    }, [])
  }

  return filterNodes(props.options)
})

const selectNode = (node: TreeNode) => {
  if (node.disabled) return
  emit('update:modelValue', node.id)
  emit('change', node)
  isOpen.value = false
  filterText.value = ''
}

const clearSelection = () => {
  emit('update:modelValue', null)
  emit('change', null)
}

onClickOutside(containerRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-left hover:bg-gray-50"
      @click="isOpen = !isOpen"
    >
      <span :class="{ 'text-gray-400': !selectedNode }">
        {{ selectedNode?.label || placeholder }}
      </span>
      <div class="flex items-center gap-2">
        <button
          v-if="clearable && selectedNode"
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click.stop="clearSelection"
        >
          <span class="i-lucide-x size-4" />
        </button>
        <span class="i-lucide-chevron-down size-4 text-gray-400" :class="{ 'rotate-180': isOpen }" />
      </div>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      <div v-if="filter" class="border-b border-gray-100 p-2">
        <Input
          v-model="filterText"
          :placeholder="filterPlaceholder"
          size="sm"
        />
      </div>

      <div class="max-h-60 overflow-auto py-1">
        <TreeSelectNode
          v-for="node in filteredOptions"
          :key="node.id"
          :node="node"
          :selected-id="modelValue"
          @select="selectNode"
        />

        <div v-if="filteredOptions.length === 0" class="px-4 py-2 text-sm text-gray-500">
          No results found
        </div>
      </div>
    </div>
  </div>
</template>
