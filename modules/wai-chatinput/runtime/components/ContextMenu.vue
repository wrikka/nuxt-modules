<template>
  <transition name="fade">
    <div v-if="show" ref="_menuRef" class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden" :style="{ top: position.top, left: position.left, width: '500px', height: '240px' }">
      <div class="flex h-full">
        <!-- List -->
        <div class="w-1/2 border-r border-gray-200">
          <div class="max-h-full overflow-y-auto">
            <div
              v-for="(item, index) in items"
              :key="item.id"
              @click="_handleSelect(item)"
              @mouseover="_handleMouseOver(index)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-blue-50': index === selectedIndex }"
            >
              <div class="w-6 h-6 mr-3 flex items-center justify-center">
                <Icon v-if="item.icon === 'question'" name="mdi:help-circle" class="w-5 h-5 text-gray-500" />
                <Icon v-else-if="item.icon === 'trash'" name="mdi:delete" class="w-5 h-5 text-gray-500" />
                <Icon v-else-if="item.icon === 'settings'" name="mdi:cog" class="w-5 h-5 text-gray-500" />
                <Icon v-else name="mdi:account" class="w-5 h-5 text-gray-500" />
              </div>
              <span class="text-sm">{{ item.label }}</span>
            </div>
          </div>
        </div>
        <!-- Preview -->
        <div class="w-1/2 p-4 bg-gray-50">
          <div v-if="selectedIndex >= 0 && selectedIndex < items.length">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 mr-3 flex items-center justify-center bg-white rounded-full border">
                <Icon v-if="items[selectedIndex]?.icon === 'question'" name="mdi:help-circle" class="w-5 h-5 text-gray-500" />
                <Icon v-else-if="items[selectedIndex]?.icon === 'trash'" name="mdi:delete" class="w-5 h-5 text-gray-500" />
                <Icon v-else-if="items[selectedIndex]?.icon === 'settings'" name="mdi:cog" class="w-5 h-5 text-gray-500" />
                <Icon v-else name="mdi:account" class="w-5 h-5 text-gray-500" />
              </div>
              <h4 class="font-medium text-gray-900">{{ items[selectedIndex]?.label }}</h4>
            </div>
            <p class="text-sm text-gray-600">{{ items[selectedIndex]?.preview }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  id: string
  label: string
  icon?: string
  preview?: string
  value: string
}

const props = defineProps<{
  show: boolean
  items: readonly MenuItem[]
  selectedIndex: number
  position: { top: string; left: string }
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
  'update:selectedIndex': [index: number]
}>()

const _menuRef = ref<HTMLElement>()

const _handleSelect = (item: MenuItem) => {
  emit('select', item)
}

const _handleMouseOver = (index: number) => {
  emit('update:selectedIndex', index)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
