<template>
  <div class="relative">
    <button
      @click="showHelp = !showHelp"
      class="p-2 hover:bg-gray-100 rounded-lg"
      title="แสดงปุ่มลัด"
    >
      <Icon name="mdi:keyboard" class="w-5 h-5" />
    </button>

    <div
      v-if="showHelp"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showHelp = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">ปุ่มลัดคีย์บอร์ด</h3>
          <button @click="showHelp = false" class="p-1 hover:bg-gray-100 rounded">
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="shortcut in shortcuts"
            :key="shortcut.key"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <span class="text-sm">{{ shortcut.description }}</span>
            <kbd class="px-2 py-1 bg-white border rounded text-xs font-mono">
              {{ formatShortcut(shortcut) }}
            </kbd>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t text-xs text-gray-500">
          <p>กด <kbd class="px-1 bg-gray-100 rounded">?</kbd> เพื่อเปิด/ปิดหน้าต่างนี้</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useKeyboardShortcuts } from '../../../../wcomposables/packages/composables/src/chat/useKeyboardShortcuts'

const showHelp = ref(false)
const { getCommonShortcuts } = useKeyboardShortcuts()
const shortcuts = getCommonShortcuts()

const formatShortcut = (shortcut: { key: string; modifiers: string[] }) => {
  const modMap: Record<string, string> = {
    ctrl: 'Ctrl',
    shift: 'Shift',
    alt: 'Alt',
    meta: '⌘'
  }
  const mods = shortcut.modifiers.map(m => modMap[m] || m)
  return [...mods, shortcut.key].join(' + ')
}
</script>
