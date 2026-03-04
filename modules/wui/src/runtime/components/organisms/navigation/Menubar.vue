<script setup lang="ts">
interface MenuItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
  children?: MenuItem[]
  action?: () => void
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  itemClick: [item: MenuItem]
}>()

const activeMenu = ref<string | null>(null)
const menubarRef = ref<HTMLDivElement>()

const handleItemClick = (item: MenuItem) => {
  if (item.disabled) return
  item.action?.()
  emit('itemClick', item)
  if (!item.children?.length) {
    activeMenu.value = null
  }
}

const toggleMenu = (id: string) => {
  activeMenu.value = activeMenu.value === id ? null : id
}

onClickOutside(menubarRef, () => {
  activeMenu.value = null
})
</script>

<template>
  <div
    ref="menubarRef"
    class="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="relative"
    >
      <button
        type="button"
        class="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors"
        :class="{
          'bg-blue-50 text-blue-600': activeMenu === item.id,
          'hover:bg-gray-100': activeMenu !== item.id,
          'opacity-50': item.disabled
        }"
        :disabled="item.disabled"
        @click="item.children?.length ? toggleMenu(item.id) : handleItemClick(item)"
        @mouseenter="activeMenu && item.children?.length && (activeMenu = item.id)"
      >
        <span v-if="item.icon" :class="item.icon" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.children?.length"
          class="i-lucide-chevron-down size-4 transition-transform"
          :class="{ 'rotate-180': activeMenu === item.id }"
        />
      </button>

      <div
        v-if="item.children && activeMenu === item.id"
        class="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      >
        <button
          v-for="child in item.children"
          :key="child.id"
          type="button"
          class="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
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
