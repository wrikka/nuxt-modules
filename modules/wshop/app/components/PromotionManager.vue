<script setup lang="ts">
import { ref, computed, onMounted } from '#imports';
import { usePromotions } from '~/composables/promotions/usePromotions';
import { usePromotionForm } from '~/composables/promotions/usePromotionForm';
import type { Promotion } from '~~/shared/types';
import PromotionFilters from '~/components/promotions/PromotionFilters.vue';
import PromotionList from '~/components/promotions/PromotionList.vue';
import PromotionForm from '~/components/promotions/PromotionForm.vue';

const {
  promotions,
  loading,
  processing,
  loadPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion: deletePromotionApi,
  togglePromotionStatus: toggleStatus,
  duplicatePromotion: duplicatePromotionApi,
} = usePromotions();

const { 
  showPromotionForm, 
  editingPromotion, 
  promotionForm, 
  editPromotion, 
  savePromotion, 
  closePromotionForm 
} = usePromotionForm(createPromotion, updatePromotion);

const filterStatus = ref('');
const filterType = ref('');
const searchQuery = ref('');

const filteredPromotions = computed(() => {
  let filtered = promotions.value;

  if (filterStatus.value) {
    filtered = filtered.filter(promo => promo.status === filterStatus.value);
  }

  if (filterType.value) {
    filtered = filtered.filter(promo => promo.type === filterType.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      promo =>
        promo.name.toLowerCase().includes(query) ||
        (promo.description && promo.description.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const handleSavePromotion = async () => {
  await savePromotion();
  await loadPromotions();
};

const handleDeletePromotion = async (promotion: Promotion) => {
  if (confirm(`คุณต้องการลบโปรโมชั่น "${promotion.name}" ใช่หรือไม่?`)) {
    await deletePromotionApi(promotion.id);
    await loadPromotions();
  }
};

const handleDuplicatePromotion = async (promotion: Promotion) => {
  await duplicatePromotionApi(promotion.id);
  await loadPromotions();
};

const handleToggleStatus = async (promotion: Promotion) => {
  await toggleStatus(promotion.id);
  await loadPromotions();
};

onMounted(loadPromotions);
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">จัดการส่วนลดและโปรโมชั่น</h2>
      <button
        @click="showPromotionForm = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Icon name="mdi:plus" class="w-4 h-4 inline mr-2" />
        สร้างโปรโมชั่นใหม่
      </button>
    </div>

    <PromotionFilters
      v-model:status="filterStatus"
      v-model:type="filterType"
      v-model:search="searchQuery"
    />

    <PromotionList
      :promotions="filteredPromotions"
      @edit="editPromotion"
      @duplicate="handleDuplicatePromotion"
      @toggleStatus="handleToggleStatus"
      @delete="handleDeletePromotion"
      @create="showPromotionForm = true"
    />

    <PromotionForm
      v-if="showPromotionForm"
      v-model:form="promotionForm"
      v-model:processing="processing"
      :editing="!!editingPromotion"
      @save="handleSavePromotion"
      @close="closePromotionForm"
    />
  </div>
</template>
