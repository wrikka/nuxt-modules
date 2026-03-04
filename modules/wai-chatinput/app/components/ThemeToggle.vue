<template>
  <button
    @click="toggleDarkMode"
    class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    :title="isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'"
  >
    <Icon :name="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'" class="w-5 h-5" />
    <span class="text-sm">{{ isDark ? 'โหมดสว่าง' : 'โหมดมืด' }}</span>
  </button>

  <div class="relative group">
    <button class="p-2 hover:bg-gray-100 rounded-lg">
      <Icon name="mdi:palette" class="w-5 h-5" />
    </button>

    <div class="absolute top-full right-0 mt-1 bg-white border rounded-lg shadow-lg p-3 w-56 hidden group-hover:block z-50">
      <h4 class="text-sm font-medium mb-2">ธีมสี</h4>
      <div class="space-y-1">
        <button
          v-for="theme in allThemes"
          :key="theme.id"
          @click="setTheme(theme.id)"
          :class="['w-full flex items-center gap-3 p-2 rounded-lg text-left', currentThemeId === theme.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50']"
        >
          <div
            class="w-6 h-6 rounded-full border"
            :style="{ backgroundColor: theme.colors.primary }"
          />
          <span class="text-sm">{{ theme.name }}</span>
          <Icon v-if="currentThemeId === theme.id" name="mdi:check" class="w-4 h-4 text-blue-500 ml-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomTheme } from '../../../../wcomposables/packages/composables/src/chat/useCustomTheme'

const { currentThemeId, allThemes, isDark, setTheme, toggleDarkMode } = useCustomTheme()
</script>
