<script setup lang="ts">
interface Props {
  modelValue?: boolean
  display?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  display: 'Click to edit',
  closable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  close: []
}>()

const isEditing = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (value) {
      emit('open')
    } else {
      emit('close')
    }
  }
})

const openEdit = () => {
  isEditing.value = true
}

const closeEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="inline-flex items-center">
    <div
      v-if="!isEditing"
      class="group flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
      @click="openEdit"
    >
      <span class="text-gray-700">{{ display }}</span>
      <span class="i-lucide-pencil size-4 text-gray-400 opacity-0 group-hover:opacity-100" />
    </div>
    
    <div v-else class="flex items-center gap-2">
      <slot />
      <button
        v-if="closable"
        type="button"
        class="rounded p-1 hover:bg-gray-100"
        @click="closeEdit"
      >
        <span class="i-lucide-x size-4 text-gray-500" />
      </button>
    </div>
  </div>
</template>
