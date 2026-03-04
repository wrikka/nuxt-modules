<script setup lang="ts">
interface TreeNode {
  id: string | number
  label: string
  children?: TreeNode[]
  disabled?: boolean
  icon?: string
}

interface Props {
  node: TreeNode
  selectedId?: string | number | null
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  selectedId: null,
  level: 0
})

const emit = defineEmits<{
  select: [node: TreeNode]
}>()

const isExpanded = ref(false)
const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

const isSelected = computed(() => props.selectedId === props.node.id)

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const handleSelect = () => {
  emit('select', props.node)
}
</script>

<template>
  <div>
    <div
      class="flex cursor-pointer items-center gap-1 px-2 py-1.5 hover:bg-gray-100"
      :class="{
        'bg-blue-50 text-blue-600': isSelected,
        'opacity-50': node.disabled
      }"
      :style="{ paddingLeft: `${8 + level * 20}px` }"
      @click="handleSelect"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="p-0.5 hover:bg-gray-200 rounded"
        @click.stop="toggleExpand"
      >
        <span
          class="i-lucide-chevron-right size-4 transition-transform"
          :class="{ 'rotate-90': isExpanded }"
        />
      </button>
      <span v-else class="w-6" />

      <span v-if="node.icon" :class="node.icon" />
      <span class="text-sm">{{ node.label }}</span>
    </div>

    <div v-if="hasChildren && isExpanded">
      <TreeSelectNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected-id="selectedId"
        :level="level + 1"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
