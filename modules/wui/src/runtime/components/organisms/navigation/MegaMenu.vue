<script setup lang="ts">
interface MenuColumn {
  title: string
  items: {
    id: string
    label: string
    icon?: string
    description?: string
    badge?: string
    action?: () => void
  }[]
}

interface Props {
  columns: MenuColumn[]
  triggerLabel: string
  triggerIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  triggerIcon: 'i-lucide-menu'
})

const emit = defineEmits<{
  itemClick: [item: { id: string; label: string }]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLDivElement>()

const handleItemClick = (item: { id: string; label: string }) => {
  item.action?.()
  emit('itemClick', item)
  isOpen.value = false
}

onClickOutside(containerRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg px-4 py-2 font-medium hover:bg-gray-100"
      @click="isOpen = !isOpen"
    >
      <span :class="triggerIcon" />
      <span>{{ triggerLabel }}</span>
      <span
        class="i-lucide-chevron-down size-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute left-0 top-full z-50 mt-2 min-w-[600px] rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
    >
      <div class="grid gap-6" :style="{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }">
        <div v-for="column in columns" :key="column.title">
          <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            {{ column.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="item in column.items" :key="item.id">
              <button
                type="button"
                class="group flex w-full items-start gap-3 rounded-lg p-2 hover:bg-gray-50"
                @click="handleItemClick(item)"
              >
                <span
                  v-if="item.icon"
                  :class="item.icon"
                  class="mt-0.5 text-gray-400 group-hover:text-blue-600"
                />
                <div class="flex-1 text-left">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ item.label }}</span>
                    <span
                      v-if="item.badge"
                      class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {{ item.badge }}
                    </span>
                  </div>
                  <p v-if="item.description" class="mt-0.5 text-sm text-gray-500">
                    {{ item.description }}
                  </p>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
