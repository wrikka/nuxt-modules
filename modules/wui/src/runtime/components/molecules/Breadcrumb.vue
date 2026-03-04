<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  label: string
  href?: string
  disabled?: boolean
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
  maxItems?: number
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  separator: '/',
  maxItems: 5
})

const emit = defineEmits<{
  'item-click': [item: BreadcrumbItem, index: number]
}>()

const _displayItems = computed(() => {
  if (_props.items.length <= _props.maxItems) {
    return _props.items
  }

  const items = [..._props.items]
  const lastItem = items.pop()!
  
  return [
    items[0]!,
    { label: '...', disabled: true },
    lastItem
  ]
})

const _onItemClick = (item: BreadcrumbItem, index: number) => {
  if (!item.disabled) {
    emit('item-click', item, index)
  }
}

const _classes = computed(() => [
  'flex items-center space-x-2 text-sm',
  _props.class
])
</script>

<template>
  <nav :class="_classes" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li
        v-for="(item, index) in _displayItems"
        :key="index"
        class="flex items-center"
      >
        <component
          :is="item.href && !item.disabled ? 'a' : 'span'"
          :href="item.href"
          :class="[
            'transition-colors',
            item.disabled
              ? 'text-muted-foreground cursor-not-allowed'
              : item.href
              ? 'text-primary hover:underline'
              : 'text-foreground'
          ]"
          @click="_onItemClick(item, index)"
        >
          {{ item.label }}
        </component>
        
        <span
          v-if="index < _displayItems.length - 1"
          class="mx-2 text-muted-foreground"
        >
          {{ separator }}
        </span>
      </li>
    </ol>
  </nav>
</template>
