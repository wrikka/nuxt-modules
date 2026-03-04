<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TreeNode } from './Tree.vue'

interface Props {
  node: TreeNode
  level: number
  class?: string
}

const _props = defineProps<Props>()

const tree = inject<{
  multiple: boolean
  checkable: boolean
  lineable: boolean
  isExpanded: (node: TreeNode) => boolean
  isSelected: (node: TreeNode) => boolean
  isChecked: (node: TreeNode) => boolean
  toggleExpand: (node: TreeNode) => void
  toggleSelect: (node: TreeNode) => void
  toggleCheck: (node: TreeNode) => void
}>('tree', {
  multiple: false,
  checkable: false,
  lineable: true,
  isExpanded: () => false,
  isSelected: () => false,
  isChecked: () => false,
  toggleExpand: () => {},
  toggleSelect: () => {},
  toggleCheck: () => {}
})

const _hasChildren = computed(() => {
  return !!(_props.node.children && _props.node.children.length > 0)
})

const _isExpanded = computed(() => tree.isExpanded(_props.node))
const _isSelected = computed(() => tree.isSelected(_props.node))
const _isChecked = computed(() => tree.isChecked(_props.node))

const _indentStyle = computed(() => ({
  paddingLeft: `${_props.level * 1.5}rem`
}))
</script>

<template>
  <li :class="[_props.class]" role="treeitem">
    <div
      class="group flex items-center gap-1 rounded-md py-1.5 pr-2 transition-colors hover:bg-accent"
      :class="[_isSelected && 'bg-accent']"
      :style="_indentStyle"
      @click="tree.toggleSelect(node)"
    >
      <button
        v-if="_hasChildren"
        type="button"
        class="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-accent-foreground/10"
        @click.stop="tree.toggleExpand(node)"
      >
        <span
          :class="[
            'h-3 w-3 transition-transform',
            _isExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'
          ]"
        />
      </button>
      <span v-else class="h-4 w-4 shrink-0" />
      
      <input
        v-if="tree.checkable"
        type="checkbox"
        :checked="_isChecked"
        :disabled="node.disabled"
        class="h-4 w-4 rounded border border-primary"
        @click.stop="tree.toggleCheck(node)"
      />
      
      <span v-if="node.icon" :class="[node.icon, 'h-4 w-4 shrink-0 text-muted-foreground']" />
      
      <span
        class="min-w-0 flex-1 truncate text-sm"
        :class="[node.disabled && 'opacity-50']"
      >
        {{ node.label }}
      </span>
    </div>
    
    <ul
      v-if="_hasChildren && _isExpanded"
      class="space-y-1"
    >
      <WTreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
      />
    </ul>
  </li>
</template>
