<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ icon: string; label: string }>()

const open = ref(false)
</script>

<template>
  <div class="relative">
    <button
      class="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
      :class="{ 'bg-blue-50 text-blue-600 ring-1 ring-blue-200': open }"
      type="button"
      :title="props.label"
      @click="open = !open"
      @blur="open = false"
    >
      <Icon :name="props.icon" class="w-6 h-6" />
    </button>

    <div
      v-if="open"
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white/90 rounded-xl shadow-lg border border-gray-200 p-1"
    >
      <slot />
    </div>
  </div>
</template>
