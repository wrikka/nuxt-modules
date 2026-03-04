<script setup lang="ts">
import type { Customer } from '~~/shared/types'

const newCustomer = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const emit = defineEmits<{
  (e: 'save', customer: Omit<Customer, 'id' | 'username' | 'password' | 'role' | 'permissions' | 'isActive' | 'lastLogin' | 'createdAt' | 'updatedAt' | 'avatar'>): void
  (e: 'cancel'): void
}>()

const saveCustomer = () => {
  emit('save', newCustomer.value)
}

const cancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <h4 class="font-medium mb-3">เพิ่มลูกค้าใหม่</h4>
    <form @submit.prevent="saveCustomer">
      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
          <AtomsInput
            v-model="newCustomer.firstName"
            type="text"
            required
            placeholder="ชื่อ"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
          <AtomsInput
            v-model="newCustomer.lastName"
            type="text"
            required
            placeholder="นามสกุล"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
          <AtomsInput
            v-model="newCustomer.email"
            type="email"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
          <AtomsInput
            v-model="newCustomer.phone"
            type="tel"
            placeholder="0XX-XXX-XXXX"
          />
        </div>
      </div>
      <div class="flex space-x-2 mt-3">
        <AtomsButton
          variant="ghost"
          class="flex-1"
          @click="cancel"
        >
          ยกเลิก
        </AtomsButton>
        <AtomsButton
          variant="default"
          class="flex-1"
          @click="saveCustomer"
        >
          เพิ่ม
        </AtomsButton>
      </div>
    </form>
  </div>
</template>
