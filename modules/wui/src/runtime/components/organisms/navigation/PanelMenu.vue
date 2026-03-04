<script setup lang="ts">
interface MenuItem {
  id: string
  label: string
  icon?: string
  description?: string
  disabled?: boolean
  children?: MenuItem[]
  action?: () => void
}

interface Props {
  items: MenuItem[]
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical'
})

const emit = defineEmits<{
  itemClick: [item: MenuItem]
}>()

const expandedItems = ref<Set<string>>(new Set())

const toggleItem = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
}

const handleItemClick = (item: MenuItem) => {
  if (item.disabled) return
  if (item.children?.length) {
    toggleItem(item.id)
  } else {
    item.action?.()
    emit('itemClick', item)
  }
}

const isExpanded = (id: string) => expandedItems.value.has(id)
</script>

<template>
  <div
    class="rounded-lg border border-gray-200 bg-white"
    :class="orientation === 'horizontal' ? 'flex' : 'flex-col'"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="border-b border-gray-100 last:border-0"
      :class="orientation === 'horizontal' ? 'border-r border-b-0' : ''"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
        :class="{ 'opacity-50': item.disabled }"
        :disabled="item.disabled"
        @click="handleItemClick(item)"
      >
        <div class="flex items-center gap-3">
          <span v-if="item.icon" :class="item.icon" />
          <div>
            <div class="font-medium">{{ item.label }}</div>
            <div v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</div>
          </div>
        </div>
        <span
          v-if="item.children?.length"
          class="i-lucide-chevron-right size-4 text-gray-400 transition-transform"
          :class="{ 'rotate-90': isExpanded(item.id) }"
        />
      </button>

      <div
        v-if="item.children && isExpanded(item.id)"
        class="border-t border-gray-100 bg-gray-50"
      >
        <button
          v-for="child in item.children"
          :key="child.id"
          type="button"
          class="flex w-full items-center gap-2 px-4 py-2 pl-12 text-left text-sm hover:bg-gray-100"
          :class="{ 'opacity-50': child.disabled }"
          :disabled="child.disabled"
          @click="handleItemClick(child)"
        >
          <span v-if="child.icon" :class="child.icon" />
          <span>{{ child.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
