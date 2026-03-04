<script setup lang="ts">
import { computed, ref, provide } from 'vue'

export interface TreeNode {
  id: string
  label: string
  icon?: string
  children?: TreeNode[]
  expanded?: boolean
  selected?: boolean
  disabled?: boolean
}

interface Props {
  nodes: TreeNode[]
  multiple?: boolean
  checkable?: boolean
  lineable?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  multiple: false,
  checkable: false,
  lineable: true
})

const emit = defineEmits<{
  'select': [node: TreeNode]
  'expand': [node: TreeNode]
  'check': [nodes: TreeNode[]]
}>()

const _expandedKeys = ref<Set<string>>(new Set())
const _selectedKeys = ref<Set<string>>(new Set())
const _checkedKeys = ref<Set<string>>(new Set())

const _isExpanded = (node: TreeNode): boolean => {
  return _expandedKeys.value.has(node.id) || node.expanded === true
}

const _isSelected = (node: TreeNode): boolean => {
  return _selectedKeys.value.has(node.id) || node.selected === true
}

const _isChecked = (node: TreeNode): boolean => {
  return _checkedKeys.value.has(node.id)
}

const _toggleExpand = (node: TreeNode) => {
  if (_expandedKeys.value.has(node.id)) {
    _expandedKeys.value.delete(node.id)
  }
  else {
    _expandedKeys.value.add(node.id)
  }
  emit('expand', node)
}

const _toggleSelect = (node: TreeNode) => {
  if (node.disabled) return
  
  if (!_props.multiple) {
    _selectedKeys.value.clear()
  }
  
  if (_selectedKeys.value.has(node.id)) {
    _selectedKeys.value.delete(node.id)
  }
  else {
    _selectedKeys.value.add(node.id)
  }
  
  emit('select', node)
}

const _toggleCheck = (node: TreeNode) => {
  if (node.disabled) return
  
  if (_checkedKeys.value.has(node.id)) {
    _checkedKeys.value.delete(node.id)
  }
  else {
    _checkedKeys.value.add(node.id)
  }
  
  const checkedNodes: TreeNode[] = []
  const traverse = (nodes: TreeNode[]) => {
    nodes.forEach(n => {
      if (_checkedKeys.value.has(n.id)) {
        checkedNodes.push(n)
      }
      if (n.children) {
        traverse(n.children)
      }
    })
  }
  traverse(_props.nodes)
  
  emit('check', checkedNodes)
}

provide('tree', {
  multiple: _props.multiple,
  checkable: _props.checkable,
  lineable: _props.lineable,
  isExpanded: _isExpanded,
  isSelected: _isSelected,
  isChecked: _isChecked,
  toggleExpand: _toggleExpand,
  toggleSelect: _toggleSelect,
  toggleCheck: _toggleCheck
})
</script>

<template>
  <ul :class="['space-y-1', _props.class]" role="tree">
    <WTreeItem
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :level="0"
    />
  </ul>
</template>
