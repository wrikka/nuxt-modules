<script setup>
import LoyaltyMemberListItem from "./LoyaltyMemberListItem.vue";
defineProps({
  members: { type: Array, required: true },
  getTierBadgeClass: { type: Function, required: true },
  getTierName: { type: Function, required: true },
  getStatusClass: { type: Function, required: true },
  getStatusText: { type: Function, required: true }
});
const emit = defineEmits(["view", "adjustPoints", "suspend", "delete", "add"]);
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
