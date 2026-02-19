<script setup lang="ts">
import type { LoyaltyTier, LoyaltyMember } from '~~/shared/types'

const props = defineProps<{
  modelValue: boolean
  member: Partial<LoyaltyMember> | null
  tiers: LoyaltyTier[]
  processing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', member: Partial<LoyaltyMember>): void
}>()

const localMember = ref<Partial<LoyaltyMember>>({})

watch(() => props.member, (newVal) => {
  localMember.value = { ...newVal }
}, { immediate: true, deep: true })

const isEditing = computed(() => !!localMember.value.id)

const closeModal = () => {
  emit('update:modelValue', false)
}

const save = () => {
  emit('save', localMember.value)
}
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEditing ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิกใหม่' }}
      </h3>
      
      <form @submit.prevent="save">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
            <input
              v-model="localMember.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล *</label>
            <input
              v-model="localMember.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input
              v-model="localMember.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ระดับสมาชิก</label>
            <select
              v-model="localMember.tierId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="tier in tiers" :key="tier.id" :value="tier.id">
                {{ tier.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ processing ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
