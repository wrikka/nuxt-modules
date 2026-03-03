<script setup lang="ts">
interface Props {
  habitId: string
  date: string
  completed: boolean
  color: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [habitId: string, date: string]
}>()

const handleClick = () => {
  emit('toggle', props.habitId, props.date)
}
</script>

<template>
  <button
    :class="[
      'w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center',
      completed ? 'text-white' : 'text-gray-300 hover:bg-gray-100'
    ]"
    :style="completed ? { backgroundColor: color } : {}"
    @click="handleClick"
  >
    <svg v-if="completed" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </button>
</template>
