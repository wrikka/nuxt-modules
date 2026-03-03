<script setup lang="ts">
import type { Category } from '~~/shared/types'

defineProps<{
  modelValue: boolean
  category: Category | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const closeModal = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-sm">
      <h3 class="text-lg font-semibold mb-4">ยืนยันการลบหมวดหมู่</h3>
      <p class="text-gray-600 mb-6">
        คุณต้องการลบหมวดหมู่ "{{ category?.name }}" ใช่หรือไม่?
        <br><br>
        <span class="text-red-600">
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </span>
      </p>
      <div class="flex justify-end space-x-2">
        <button
          @click="closeModal"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ยกเลิก
        </button>
        <button
          @click="confirm"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          ลบ
        </button>
      </div>
    </div>
  </div>
</template>
