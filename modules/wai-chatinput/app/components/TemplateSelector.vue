<template>
  <transition name="slide-down">
    <div
      v-if="show"
      :class="`absolute bottom-full left-0 mb-2 ${width || 'w-80'} bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto`"
    >
      <div class="p-3 border-b border-gray-200">
        <div class="flex gap-2 mb-2">
          <button
            @click="$emit('update:selectedCategory', 'all')"
            :class="['px-3 py-1 text-sm rounded', selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
          >
            ทั้งหมด
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="$emit('update:selectedCategory', category)"
            :class="['px-3 py-1 text-sm rounded', selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700']"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="p-2">
        <div
          v-for="item in items"
          :key="item.id"
          @click="$emit('select', item)"
          class="p-2 hover:bg-gray-50 cursor-pointer rounded border-b border-gray-100 last:border-b-0"
        >
          <div class="font-medium text-sm">{{ item.label || item.name }}</div>
          <div class="text-xs text-gray-500 mt-1 truncate">{{ item.content || item.description }}</div>
          <div v-if="item.template" class="text-xs text-gray-500 mt-1 truncate bg-gray-100 p-1 rounded">{{ item.template }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean
  items: any[]
  categories: string[]
  selectedCategory: string
  width?: string
}>()

defineEmits<{
  select: [item: any]
  'update:selectedCategory': [category: string]
}>()
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
