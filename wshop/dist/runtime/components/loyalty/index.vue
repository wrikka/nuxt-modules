<script setup>
import LoyaltyStats from "./LoyaltyStats.vue";
import LoyaltyTiers from "./LoyaltyTiers.vue";
import LoyaltyMemberList from "./LoyaltyMemberList.vue";
import LoyaltyMemberForm from "./LoyaltyMemberForm.vue";
import LoyaltyPointsAdjustment from "./LoyaltyPointsAdjustment.vue";
import { useLoyaltyManagement } from "~/composables/loyalty/useLoyaltyManagement";
const {
  members,
  loyaltyTiers,
  programStats,
  loading,
  processing,
  searchQuery,
  filterTier,
  filterStatus,
  showMemberForm,
  showPointsForm,
  editingMember,
  selectedMember,
  filteredMembers,
  getTierBadgeClass,
  getTierName,
  getStatusClass,
  getStatusText,
  loadMembers,
  loadLoyaltyTiers,
  openAddMemberForm,
  openEditMemberForm,
  openAdjustPointsForm,
  viewMember,
  suspendMember,
  deleteMember,
  saveMember,
  savePointsAdjustment
} = useLoyaltyManagement();
onMounted(async () => {
  await Promise.all([loadMembers(), loadLoyaltyTiers()]);
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">โปรแกรมสมาชิก</h2>
      <button
        @click="openAddMemberForm"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Icon name="mdi:plus" class="w-4 h-4 inline mr-2" />
        เพิ่มสมาชิกใหม่
      </button>
    </div>

    <LoyaltyStats :stats="programStats" class="mb-6" />

    <LoyaltyTiers :tiers="loyaltyTiers" class="mb-6" />

    <div class="flex flex-wrap items-center gap-4 mb-6">
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสมาชิก..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <select
        v-model="filterTier"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">ทุกระดับ</option>
        <option v-for="tier in loyaltyTiers" :key="tier.id" :value="tier.id">
          {{ tier.name }}
        </option>
      </select>
      
      <select
        v-model="filterStatus"
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">ทุกสถานะ</option>
        <option value="active">ใช้งานอยู่</option>
        <option value="inactive">ไม่ใช้งาน</option>
        <option value="suspended">ระงับ</option>
      </select>
    </div>

    <LoyaltyMemberList
      :members="filteredMembers"
      :get-tier-badge-class="getTierBadgeClass"
      :get-tier-name="getTierName"
      :get-status-class="getStatusClass"
      :get-status-text="getStatusText"
      @view="viewMember"
      @adjust-points="openAdjustPointsForm"
      @suspend="suspendMember"
      @delete="deleteMember"
      @add="openAddMemberForm"
    />

    <LoyaltyMemberForm
      v-model="showMemberForm"
      :member="editingMember"
      :tiers="loyaltyTiers"
      :processing="processing"
      @save="saveMember"
    />

    <LoyaltyPointsAdjustment
      v-model="showPointsForm"
      :member="selectedMember"
      :processing="processing"
      @save="savePointsAdjustment"
    />
  </div>
</template>
