<script setup lang="ts">
import { ref } from 'vue'
import type { Habit } from '~/composables/useHabits'
import { useHabits } from '~/composables/useHabits'

interface Props {
  habit?: Habit
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [habit: Omit<Habit, 'id' | 'createdAt'>]
  cancel: []
}>()

const { habits } = useHabits()

const form = ref({
  name: props.habit?.name || '',
  color: props.habit?.color || '#6366f1',
  icon: props.habit?.icon || '💪',
  targetDays: props.habit?.targetDays || 30
})

const habitColors = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316'
]

const habitIcons = ['💪', '📚', '🏃', '💧', '🧘', '🎨', '🎵', '🌱', '😴', '🥗', '💻', '📝']

const handleSubmit = () => {
  if (!form.value.name.trim()) return

  emit('submit', {
    name: form.value.name,
    color: form.value.color,
    icon: form.value.icon,
    targetDays: form.value.targetDays
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold text-text-primary mb-6">
      {{ habit ? 'Edit Habit' : 'Add New Habit' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-text-primary mb-2">Habit Name</label>
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="e.g., Exercise, Read, Meditate"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-2">Icon</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="icon in habitIcons"
            :key="icon"
            type="button"
            @click="form.icon = icon"
            :class="[
              'w-12 h-12 rounded-lg text-2xl transition-all duration-200',
              form.icon === icon ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-gray-100'
            ]"
          >
            {{ icon }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-2">Color</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in habitColors"
            :key="color"
            type="button"
            @click="form.color = color"
            :class="[
              'w-12 h-12 rounded-lg transition-all duration-200',
              form.color === color ? 'ring-2 ring-primary ring-offset-2' : ''
            ]"
            :style="{ backgroundColor: color }"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-primary mb-2">Target Days</label>
        <input
          v-model.number="form.targetDays"
          type="number"
          class="input"
          min="1"
          max="365"
          required
        />
      </div>

      <div class="flex gap-3">
        <button
          type="submit"
          class="btn btn-primary grow"
        >
          {{ habit ? 'Update' : 'Add' }} Habit
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
