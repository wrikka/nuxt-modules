<script setup lang="ts">
import type { LoyaltyMember } from '~~/shared/types'
import LoyaltyMemberListItem from './LoyaltyMemberListItem.vue'

defineProps<{
  members: LoyaltyMember[]
  getTierBadgeClass: (tierId: number) => string
  getTierName: (tierId: number) => string
  getStatusClass: (status: string) => string
  getStatusText: (status: string) => string
}>()

const emit = defineEmits<{
  (e: 'view', member: LoyaltyMember): void
  (e: 'adjustPoints', member: LoyaltyMember): void
  (e: 'suspend', member: LoyaltyMember): void
  (e: 'delete', member: LoyaltyMember): void
  (e: 'add'): void
}>()
</script>

<template>
  <div class="space-y-4">
    <LoyaltyMemberListItem
      v-for="member in members"
      :key="member.id"
      :member="member"
      :get-tier-badge-class="getTierBadgeClass"
      :get-tier-name="getTierName"
      :get-status-class="getStatusClass"
      :get-status-text="getStatusText"
      @view="$emit('view', $event)"
      @adjust-points="$emit('adjustPoints', $event)"
      @suspend="$emit('suspend', $event)"
      @delete="$emit('delete', $event)"
    />

    <div v-if="members.length === 0" class="text-center py-12">
      <Icon name="mdi:account-group" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-gray-500">ไม่พบสมาชิก</p>
      <button
        @click="$emit('add')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        เพิ่มสมาชิกแรก
      </button>
    </div>
  </div>
</template>
