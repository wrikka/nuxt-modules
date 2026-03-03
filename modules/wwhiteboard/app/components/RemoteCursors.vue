<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { Camera, RemoteCursor } from '../../shared/types/whiteboard'
import { worldToScreen } from '../utils/whiteboard/geometry'

const props = defineProps<{
  cursors: Record<string, RemoteCursor>
  camera: Camera
}>()

const screenCursors = computed(() => {
  return Object.values(props.cursors).map((cursor) => {
    const screenPos = worldToScreen(cursor, props.camera)
    return {
      ...cursor,
      ...screenPos,
    }
  })
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none">
    <div
      v-for="cursor in screenCursors"
      :key="cursor.id"
      class="absolute transition-transform duration-100 ease-linear"
      :style="{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }"
    >
      <Icon name="mdi:cursor-default" class="w-6 h-6 -translate-y-1 -translate-x-1" :style="{ color: cursor.color }" />
      <div
        class="px-2 py-1 text-xs text-white rounded-lg whitespace-nowrap -translate-y-1 translate-x-4"
        :style="{ backgroundColor: cursor.color }"
      >
        {{ cursor.name }}
      </div>
    </div>
  </div>
</template>
