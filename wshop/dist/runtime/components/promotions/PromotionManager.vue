<script setup>
import { ref, computed } from "vue";
import PromotionsStats from "./PromotionsStats.vue";
import PromotionsFilterBar from "./PromotionsFilterBar.vue";
import PromotionsTable from "./PromotionsTable.vue";
const usePromotions = () => ({
  promotions: ref([]),
  loading: ref(false),
  deletePromotion: async (id) => {
    console.log("delete", id);
  },
  togglePromotionStatus: async (id) => {
    console.log("toggle", id);
  },
  duplicatePromotion: async (id) => {
    console.log("duplicate", id);
  },
  searchPromotions: (query) => [],
  getPromotionStats: () => ({ total: 0, active: 0, scheduled: 0, totalUsage: 0 })
});
const {
  promotions,
  loading,
  deletePromotion,
  togglePromotionStatus,
  duplicatePromotion,
  searchPromotions,
  getPromotionStats
} = usePromotions();
const searchQuery = ref("");
const selectedStatus = ref("all");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingPromotion = ref(null);
const filteredPromotions = computed(() => {
  let filtered = promotions.value;
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter((p) => p.status === selectedStatus.value);
  }
  if (searchQuery.value.trim()) {
    filtered = searchPromotions(searchQuery.value);
  }
  return filtered;
});
const stats = computed(() => getPromotionStats());
const handleCreatePromotion = () => {
  showCreateModal.value = true;
};
const handleEditPromotion = (promotion) => {
  editingPromotion.value = promotion;
  showEditModal.value = true;
};
const handleDeletePromotion = async (promotion) => {
  if (!confirm(`\u0E04\u0E38\u0E13\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E42\u0E1B\u0E23\u0E42\u0E21\u0E0A\u0E31\u0E48\u0E19 "${promotion.name}" \u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?`)) return;
  try {
    await deletePromotion(String(promotion.id));
  } catch (error) {
    console.error("Error deleting promotion:", error);
  }
};
const handleToggleStatus = async (promotion) => {
  try {
    await togglePromotionStatus(String(promotion.id));
  } catch (error) {
    console.error("Error toggling promotion status:", error);
  }
};
const handleDuplicate = async (promotion) => {
  try {
    await duplicatePromotion(String(promotion.id));
  } catch (error) {
    console.error("Error duplicating promotion:", error);
  }
};
const handleModalClose = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingPromotion.value = null;
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการโปรโมชั่น</h1>
        <p class="text-gray-600">สร้างและจัดการโปรโมชั่นและส่วนลดต่างๆ</p>
      </div>
      <button @click="handleCreatePromotion" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
        <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
        สร้างโปรโมชั่นใหม่
      </button>
    </div>

    <!-- Statistics Cards -->
    <PromotionsStats :stats="stats" />

    <!-- Filters and Search -->
    <PromotionsFilterBar v-model:searchQuery="searchQuery" v-model:selectedStatus="selectedStatus" />

    <!-- Promotions List -->
    <PromotionsTable 
      :promotions="filteredPromotions" 
      :loading="loading" 
      @edit="handleEditPromotion"
      @toggle-status="handleToggleStatus"
      @duplicate="handleDuplicate"
      @delete="handleDeletePromotion"
    />

    <!-- Modals -->
    <PromotionModal
      v-if="showCreateModal"
      :show="showCreateModal"
      mode="create"
      @close="handleModalClose"
      @saved="handleModalClose"
    />

    <PromotionModal
      v-if="showEditModal && editingPromotion"
      :show="showEditModal"
      mode="edit"
      :promotion="editingPromotion"
      @close="handleModalClose"
      @saved="handleModalClose"
    />
  </div>
</template>
