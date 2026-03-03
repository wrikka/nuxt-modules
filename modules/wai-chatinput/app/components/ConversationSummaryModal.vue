<template>
  <Modal :modelValue="show" title="สรุปการสนทนา" @update:modelValue="_handleClose">
    <template #body>
      <div v-if="loading" class="text-center">
        <Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
      </div>
      <div v-else>
        {{ summary }}
      </div>
    </template>
    <template #footer>
      <button @click="$emit('close')" class="bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors rounded-md py-2 px-4">
        ปิด
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">

defineProps<{
  show: boolean
  summary: string
  loading: boolean
}>()

const emit = defineEmits<{
  'close': []
}>()

const _handleClose = () => {
  emit('close')
}
</script>
